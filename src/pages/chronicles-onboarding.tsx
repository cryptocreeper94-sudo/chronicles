/* ====== Chronicles Onboarding — Parallel Self Quiz ====== */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = ['Identity', 'Values', 'Instincts', 'Pressure']
const QUESTIONS = [
    { step: 0, q: 'You find a wallet on the street with $500 cash. What do you do?', opts: ['Turn it in to the police', 'Try to find the owner myself', 'Keep the cash, leave the wallet', 'Take only what I need'] },
    { step: 1, q: 'A friend asks you to lie for them. The lie protects them but hurts someone else.', opts: ['Lie without hesitation — loyalty first', 'Refuse — honesty matters more', 'Negotiate a middle ground', 'It depends on who gets hurt'] },
    { step: 2, q: 'You witness an injustice. No one else seems to care.', opts: ['Speak up loudly, consequences be damned', 'Document evidence and plan carefully', 'Look for allies before acting', 'Walk away — not my problem'] },
    { step: 3, q: 'Under extreme pressure, you tend to...', opts: ['Fight — face the threat head-on', 'Analyze — find the optimal path', 'Connect — seek support and allies', 'Adapt — bend but never break'] },
]

export default function ChroniclesOnboarding() {
    const navigate = useNavigate()
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<number[]>([])

    const handleAnswer = (optIdx: number) => {
        const next = [...answers, optIdx]
        setAnswers(next)
        if (step < STEPS.length - 1) {
            setStep(s => s + 1)
        } else {
            navigate('/chronicles/hub')
        }
    }

    const q = QUESTIONS[step]

    return (
        <div className="chrono-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ maxWidth: 550, width: '100%', padding: '40px 24px' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
                    {STEPS.map((s, i) => (
                        <div key={s} style={{
                            flex: 1, height: 3, borderRadius: 2,
                            background: i <= step ? 'var(--accent)' : 'var(--border)',
                            transition: 'background 0.3s',
                        }} />
                    ))}
                </div>
                <p style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                    {STEPS[step]} — Step {step + 1} of {STEPS.length}
                </p>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, lineHeight: 1.4 }}>{q.q}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {q.opts.map((opt, i) => (
                        <button key={i} className="holo-card" style={{ textAlign: 'left', cursor: 'pointer', padding: 16 }}
                            onClick={() => handleAnswer(i)} data-testid={`option-${i}`}>
                            <span style={{ color: 'var(--text-primary)', fontSize: 14 }}>{opt}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
