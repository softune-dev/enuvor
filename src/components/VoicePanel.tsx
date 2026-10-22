import { Mic, MicOff, PhoneOff } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { cx } from '@/components/ui'
import { BarVisualizer } from './elevenlabs/bar-visualizer'
import Strands from '@/components/bits/Strands'

// Receptionist: browser speech recognition (caller) + speech synthesis (receptionist).
// Visual: React Bits Strands, tinted with the ENUVOR palette and driven by the live audio level. Replies are scripted; swap `agentReply` for a model call later.


const EASE = [0.16, 1, 0.3, 1] as const
const STRAND_COLORS = ['#f59a23', '#ffb84d', '#d9650f', '#4fa3ff', '#2a6bff']

type Phase = 'idle' | 'connecting' | 'speaking' | 'listening' | 'thinking' | 'muted' | 'unavailable'
type Line = { id: number; who: 'you' | 'enuvor'; text: string; final: boolean }

type RecognitionResult = { isFinal: boolean; 0: { transcript: string } }
type RecognitionEvent = { resultIndex: number; results: ArrayLike<RecognitionResult> }
type Recognition = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  abort: () => void
  onresult: ((e: RecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: ((e: { error: string }) => void) | null
}

const getRecognition = () => {
  const w = window as unknown as Record<string, (new () => Recognition) | undefined>
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

const greeting = 'Hello, this is the ENUVOR receptionist. Tell me what you are building, and I will point you in the right direction.'

function agentReply(prompt: string) {
  const q = prompt.toLowerCase()
  if (q.includes('plan') || q.includes('product') || q.includes('idea'))
    return 'Great. Who is it for, and what should the first release let them do? With that I can outline an MVP and a launch plan.'
  if (q.includes('service') || q.includes('fit') || q.includes('help'))
    return 'Tell me what exists today and what you want to add. Then I can say whether you need custom software, an app, AI automation or integrations.'
  if (q.includes('estimate') || q.includes('cost') || q.includes('price') || q.includes('budget'))
    return 'Most focused builds start from a few thousand dollars and ship in four to eight weeks. Describe the main workflow and I will narrow that down.'
  if (q.includes('work') || q.includes('case') || q.includes('example'))
    return 'We have shipped fintech dashboards, headless stores and AI support agents. Which of those is closest to your project?'
  return 'Got it. What outcome matters most, and is there a deadline? I can turn that into a clear next step, or connect you with the team.'
}


const statusText: Record<Phase, string> = {
  idle: 'Ready',
  connecting: 'Connecting',
  speaking: 'Speaking',
  listening: 'Listening',
  thinking: 'Thinking',
  muted: 'Mic off',
  unavailable: 'Mic unavailable',
}

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function VoicePanel({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [lines, setLines] = useState<Line[]>([])
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [micStream, setMicStream] = useState<MediaStream | null>(null)

  const phaseRef = useRef<Phase>('idle')
  const mutedRef = useRef(false)
  const closed = useRef(false)
  const recog = useRef<Recognition | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const audio = useRef<{ stream: MediaStream; ctx: AudioContext } | null>(null)
  const wordPulse = useRef(0)
  const inputVol = useRef(0)
  const outputVol = useRef(0)
  const level = useRef(0)
  const scroller = useRef<HTMLDivElement>(null)

  const go = (p: Phase) => {
    phaseRef.current = p
    setPhase(p)
  }

  const say = (who: Line['who'], text: string, final = true) =>
    setLines((ls) => {
      const last = ls[ls.length - 1]
      // Live transcript: keep updating your current line until it is final
      if (who === 'you' && last?.who === 'you' && !last.final) return [...ls.slice(0, -1), { ...last, text, final }]
      return [...ls, { id: Date.now() + Math.random(), who, text, final }].slice(-8)
    })

  const stopListening = () => {
    recog.current?.abort()
    recog.current = null
  }

  const speakRef = useRef<(text: string) => void>(() => {})

  const respond = useCallback((text: string) => {
    say('you', text)
    go('thinking')
    window.setTimeout(() => !closed.current && speakRef.current(agentReply(text)), 750)
  }, [])

  const listen = useCallback(() => {
    if (closed.current) return
    if (mutedRef.current) return go('muted')
    const Ctor = getRecognition()
    if (!Ctor) return go('unavailable')
    stopListening()
    const r = new Ctor()
    r.lang = 'en-US'
    r.interimResults = true
    r.continuous = false
    let finalText = ''
    r.onresult = (e) => {
      let text = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript
        if (e.results[i].isFinal) finalText = text
      }
      say('you', text, false)
    }
    r.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        recog.current = null
        go('unavailable')
      }
    }
    r.onend = () => {
      if (recog.current !== r || closed.current) return
      recog.current = null
      if (finalText.trim()) respond(finalText.trim())
      else if (phaseRef.current === 'listening' && !mutedRef.current) listen() // silence: keep listening
    }
    recog.current = r
    try {
      r.start()
      go('listening')
    } catch {
      go('unavailable')
    }
  }, [respond])

  const speak = useCallback(
    (text: string) => {
      if (closed.current) return
      stopListening()
      say('enuvor', text)
      go('speaking')
      let finished = false
      const done = () => {
        if (finished || closed.current) return
        finished = true
        listen()
      }
      // Some browsers never fire onend; move on after a generous estimate of the speaking time
      window.setTimeout(done, 2000 + text.split(' ').length * 520)
      const synth = window.speechSynthesis
      if (!synth) return
      synth.cancel()
      const u = new SpeechSynthesisUtterance(text)
      const voices = synth.getVoices()
      u.voice =
        voices.find((v) => /Google UK English Female|Samantha|Aria|Jenny/i.test(v.name)) ??
        voices.find((v) => v.lang.startsWith('en')) ??
        null
      u.rate = 1.03
      u.onboundary = () => (wordPulse.current = 1)
      u.onend = done
      u.onerror = done
      synth.speak(u)
    },
    [listen],
  )

  useEffect(() => {
    speakRef.current = speak
  }, [speak])

  const start = async () => {
    if (started !== null) return
    closed.current = false
    go('connecting')
    setStarted(Date.now())
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (closed.current) return stream.getTracks().forEach((t) => t.stop())
      const ctx = new AudioContext()
      const node = ctx.createAnalyser()
      node.fftSize = 512
      ctx.createMediaStreamSource(stream).connect(node)
      analyser.current = node
      audio.current = { stream, ctx }
      setMicStream(stream)
    } catch {
      // No mic: ENUVOR still speaks; input falls back to quick prompts.
    }
    speak(greeting)
  }

  // Tear everything down when the panel closes
  useEffect(
    () => () => {
      closed.current = true
      window.speechSynthesis?.cancel()
      recog.current?.abort()
      audio.current?.stream.getTracks().forEach((t) => t.stop())
      void audio.current?.ctx.close()
    },
    [],
  )

  // Call timer
  useEffect(() => {
    if (started === null) return
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 500)
    return () => window.clearInterval(id)
  }, [started])

  // Feed the strands: mic level while you talk, speech rhythm while ENUVOR talks
  useEffect(() => {
    const buf = new Uint8Array(256)
    let raf = 0
    const tick = (t: number) => {
      const p = phaseRef.current
      let mic = 0
      if (p === 'listening' && analyser.current) {
        analyser.current.getByteTimeDomainData(buf)
        let sum = 0
        for (const b of buf) sum += ((b - 128) / 128) ** 2
        mic = Math.min(1, Math.sqrt(sum / buf.length) * 5)
      }
      wordPulse.current *= 0.92
      const out = p === 'speaking' ? 0.35 + 0.2 * Math.abs(Math.sin(t / 120)) + 0.35 * wordPulse.current : 0
      inputVol.current += (mic - inputVol.current) * 0.25
      outputVol.current += (out - outputVol.current) * 0.2
      level.current = Math.max(inputVol.current, outputVol.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  const toggleMute = () => {
    const next = !mutedRef.current
    mutedRef.current = next
    setMuted(next)
    if (next) {
      stopListening()
      if (phaseRef.current === 'listening') go('muted')
    } else if (phaseRef.current === 'muted') listen()
  }

  const end = () => {
    closed.current = true
    window.speechSynthesis?.cancel()
    stopListening()
    onClose()
  }

  const live = started !== null
  // Neutral grey until the call starts; then amber while the receptionist talks, blue while the caller does
  const talking = live && (phase === 'speaking' || phase === 'listening')
  const timerColor = !talking ? 'text-fg' : phase === 'listening' ? 'text-volt-2' : 'text-amber'

  return (
    <motion.aside
      aria-label="ENUVOR receptionist"
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }}
      transition={{ duration: 0.35, ease: EASE }}
      style={{ transformOrigin: '100% 100%' }}
      className="fixed inset-x-3 bottom-[80px] z-[70] flex max-h-[calc(100svh-100px)] flex-col rounded-[22px] border border-line-2 bg-ink-2 sm:inset-x-auto sm:bottom-[100px] sm:right-6 sm:w-[340px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="label text-[10px]! text-mute">Receptionist</span>
        <span className="flex items-center gap-1.5 text-[11.5px] text-fg-2">
          <span
            className={cx(
              'size-1.5 rounded-full',
              phase === 'listening' ? 'bg-volt-2' : phase === 'speaking' ? 'bg-amber' : live ? 'bg-fg-2' : 'bg-dim',
            )}
          />
          {statusText[phase]}
        </span>
      </div>

      {/* Strands */}
      <div className="mx-auto mt-2 size-[176px] shrink-0">
        <Strands colors={STRAND_COLORS} levelRef={level} energy={0.2} interactive={false} clickPulse={false} />
      </div>

      {/* Transcript */}
      <div ref={scroller} data-lenis-prevent className="mx-5 mt-1 max-h-[150px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {lines.length === 0 ? (
          <div className="flex flex-col items-center text-center">
            <p className="font-display text-[20px] leading-tight font-[500] text-fg">How can I help?</p>
            <p className="mt-1.5 max-w-[28ch] text-[13px] leading-relaxed text-mute">
              Ask about a project, our services or a rough budget. I will guide you from there.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {lines.map((l) => (
              <motion.p
                key={l.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="text-[13.5px] leading-relaxed text-fg-2"
              >
                <span className={cx('mr-1.5 font-medium', l.who === 'you' ? 'text-volt-2' : 'text-amber')}>
                  {l.who === 'you' ? 'You' : 'Receptionist'}
                </span>
                {l.text}
              </motion.p>
            ))}
          </div>
        )}
      </div>

      {/* Audio visualiser: only while the call is talking */}
      {talking && (
        <div className="mx-5 mt-3 h-12" style={{ '--bar-color': phase === 'listening' ? '#4fa3ff' : '#f59a23' } as CSSProperties}>
          <BarVisualizer
            state={phase === 'listening' ? 'listening' : 'speaking'}
            mediaStream={phase === 'listening' ? micStream : null}
            demo={phase !== 'listening'}
            barCount={22}
            minHeight={22}
            maxHeight={100}
            centerAlign
            className="h-full gap-[3px]"
          />
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 border-t border-line px-5 py-4">
        <AnimatePresence mode="wait" initial={false}>
          {live ? (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex items-center justify-between gap-3"
            >
              <span className={cx('label tabular-nums text-[12px]! transition-colors duration-300', timerColor)}>{fmt(elapsed)}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  disabled={phase === 'unavailable'}
                  aria-label={muted ? 'Turn microphone on' : 'Turn microphone off'}
                  aria-pressed={muted}
                  className={cx(
                    'grid size-10 place-items-center rounded-full border transition-colors disabled:opacity-40',
                    muted ? 'border-fg bg-fg text-ink' : 'border-line-2 bg-surface-2 text-fg hover:bg-surface-3',
                  )}
                >
                  {muted ? <MicOff className="size-[17px]" strokeWidth={1.8} /> : <Mic className="size-[17px]" strokeWidth={1.8} />}
                </button>
                <button
                  type="button"
                  onClick={end}
                  aria-label="End voice session"
                  className="flex h-10 items-center gap-2 rounded-full bg-[#e5484d] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#d93d42]"
                >
                  <PhoneOff className="size-[15px]" strokeWidth={2} />
                  End
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex justify-center"
            >
              <button
                type="button"
                onClick={start}
                className="flex h-10 items-center gap-2 whitespace-nowrap rounded-full bg-fg px-6 text-[13px] font-medium text-ink transition-colors hover:bg-white"
              >
                <Mic className="size-[15px]" strokeWidth={2} />
                Start talking
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}
