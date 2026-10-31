import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const GOOD = [
  ['✈️', 10],
  ['🥥', 5],
  ['🩴', 5],
  ['🛂', 15],
  ['🍹', 25],
]

const BAD = [
  ['📧', -10],
  ['⏰', -10],
  ['👔', -20],
  ['😬', -15],
]

const W = 420
const H = 560

export default function EscapeMondayGame() {
  const canvasRef = useRef(null)
  const rootRef = useRef(null)
  const animRef = useRef(null)

  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [gameState, setGameState] = useState('start') // 'start' | 'playing' | 'end'
  const [endResult, setEndResult] = useState({
    emoji: '🏖️',
    title: '',
    message: '',
    code: 'ESCAPE10',
    score: 0,
  })

  // Game loop mutable references (avoid re-renders during high-frequency 60fps loop)
  const gameRef = useRef({
    items: [],
    px: W / 2,
    score: 0,
    time: 30,
    run: false,
    last: 0,
    spawn: 0,
    shake: 0,
    pop: [],
  })

  const drawScene = useCallback(() => {
    const cv = canvasRef.current
    if (!cv) return
    const x = cv.getContext('2d')
    if (!x) return

    const { px, items, pop, shake } = gameRef.current

    x.clearRect(0, 0, W, H)
    x.save()

    if (shake > 0) {
      x.translate((Math.random() - 0.5) * 10, 0)
    }

    x.font = '34px serif'
    x.textAlign = 'center'
    x.textBaseline = 'middle'

    // Background scenery emojis
    x.fillText('☀️', W - 50, 50)
    x.fillText('🌴', 50, H - 130)
    x.fillText('🌴', W - 40, H - 120)

    // Falling travel & work items
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      x.fillText(it.e, it.x, it.y)
    }

    // Suitcase player
    x.font = '54px serif'
    x.fillText('🧳', px, H - 70)

    // Floating floating +/- score points
    x.font = 'bold 22px sans-serif'
    for (let p = 0; p < pop.length; p++) {
      const pt = pop[p]
      x.fillStyle = pt.c
      x.fillText(pt.t, pt.x, pt.y)
    }

    x.restore()
  }, [])

  const finishGame = useCallback(() => {
    const finalScore = gameRef.current.score
    let t = ''
    let m = ''
    let e = ''
    let c = 'ESCAPE10'

    if (finalScore >= 150) {
      t = 'Legend. Boss left on read.'
      m = 'Too fabulous for meetings.'
      e = '🏝️'
      c = 'ESCAPE30'
    } else if (finalScore >= 80) {
      t = 'Almost free.'
      m = 'You escaped, but your laptop came along.'
      e = '🍹'
      c = 'ESCAPE20'
    } else if (finalScore >= 0) {
      t = 'Stuck on “quick sync”.'
      m = 'Slow start. Members get a head start on holidays.'
      e = '😅'
      c = 'ESCAPE10'
    } else {
      t = 'You got promoted. Sorry.'
      m = 'Emails won. A membership can still rescue you.'
      e = '😭'
      c = 'ESCAPE10'
    }

    setEndResult({
      emoji: e,
      title: `${t} (${finalScore} pts)`,
      message: m,
      code: c,
      score: finalScore,
    })
    setGameState('end')
  }, [])

  const loop = useCallback(
    (n) => {
      const g = gameRef.current
      if (!g.run) return

      const dt = Math.min(0.04, (n - g.last) / 1000)
      g.last = n

      g.time -= dt
      g.spawn -= dt

      if (g.spawn <= 0) {
        const isBad = Math.random() < 0.4
        const pool = isBad ? BAD : GOOD
        const picked = pool[Math.floor(Math.random() * pool.length)]

        g.items.push({
          e: picked[0],
          v: picked[1],
          x: 30 + Math.random() * (W - 60),
          y: -30,
          s: 150 + Math.random() * 130 + (30 - g.time) * 5,
        })
        g.spawn = 0.45 - (30 - g.time) * 0.006
      }

      // Check suitcase collisions
      for (let i = 0; i < g.items.length; i++) {
        const item = g.items[i]
        item.y += item.s * dt

        if (
          item.y > H - 95 &&
          item.y < H - 40 &&
          Math.abs(item.x - g.px) < 42 &&
          !item.d
        ) {
          item.d = 1
          g.score += item.v
          g.shake = item.v < 0 ? 0.25 : 0
          g.pop.push({
            t: (item.v > 0 ? '+' : '') + item.v,
            x: item.x,
            y: item.y,
            l: 0.8,
            c: item.v > 0 ? '#0a8a5a' : '#d62a1c',
          })
        }
      }

      g.items = g.items.filter((i) => !i.d && i.y < H + 30)

      for (let p = 0; p < g.pop.length; p++) {
        g.pop[p].y -= 50 * dt
        g.pop[p].l -= dt
      }
      g.pop = g.pop.filter((p) => p.l > 0)
      g.shake = Math.max(0, g.shake - dt)

      setScore(g.score)
      setTimeRemaining(Math.max(0, Math.ceil(g.time)))

      drawScene()

      if (g.time <= 0) {
        g.run = false
        finishGame()
      } else {
        animRef.current = requestAnimationFrame(loop)
      }
    },
    [drawScene, finishGame]
  )

  const startGame = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current)
    }

    const g = gameRef.current
    g.items = []
    g.px = W / 2
    g.score = 0
    g.time = 30
    g.spawn = 0
    g.shake = 0
    g.pop = []
    g.run = true
    g.last = performance.now()

    setScore(0)
    setTimeRemaining(30)
    setGameState('playing')

    animRef.current = requestAnimationFrame(loop)
  }, [loop])

  // Pointer movement handling
  const handlePointerMove = (clientX) => {
    const cv = canvasRef.current
    if (!cv) return
    const rect = cv.getBoundingClientRect()
    const nextPx = Math.max(34, Math.min(W - 34, ((clientX - rect.left) / rect.width) * W))
    gameRef.current.px = nextPx
    if (gameState !== 'playing') {
      drawScene()
    }
  }

  // Keyboard navigation support
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        gameRef.current.px = Math.max(34, gameRef.current.px - 40)
        drawScene()
      } else if (e.key === 'ArrowRight') {
        gameRef.current.px = Math.min(W - 34, gameRef.current.px + 40)
        drawScene()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [drawScene])

  // Initial draw
  useEffect(() => {
    drawScene()
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current)
      }
    }
  }, [drawScene])

  return (
    <section id="em-game" aria-labelledby="em-title" ref={rootRef}>
      <style>{`
        #em-game {
          --ink: #1d2b3a;
          --coral: #ff5a4d;
          --sea: #0fa3a3;
          max-width: 560px;
          margin: 48px auto 0;
          padding: 0 16px;
          text-align: center;
          font-family: inherit;
          box-sizing: border-box;
        }
        #em-game * {
          box-sizing: border-box;
        }
        #em-game h2 {
          font-size: clamp(28px, 7vw, 40px);
          line-height: 1.1;
          margin: 0 0 8px;
          font-family: 'Rader', sans-serif;
          font-weight: 700;
          color: var(--ink);
        }
        #em-game h2 span {
          color: var(--coral);
          text-decoration: line-through wavy var(--sea);
        }
        #em-game p {
          line-height: 1.45;
          margin: 6px 0;
          color: #334155;
        }
        #em-game .em-hud {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          font-size: 18px;
          margin: 10px 2px;
          color: var(--ink);
        }
        #em-game .em-stage {
          position: relative;
          border: 4px solid var(--ink);
          border-radius: 20px;
          overflow: hidden;
          background: linear-gradient(#7fd8e6, #fff4d6 70%, #ffc23d 70%);
          touch-action: none;
          box-shadow: 0 16px 36px -10px rgba(0,0,0,0.2);
        }
        #em-game canvas {
          display: block;
          width: 100%;
          height: auto;
          cursor: grab;
        }
        #em-game canvas:active {
          cursor: grabbing;
        }
        #em-game .em-ov {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 18px;
          background: rgba(255, 244, 214, 0.96);
          color: var(--ink);
          backdrop-filter: blur(4px);
        }
        #em-game .em-ov[hidden] {
          display: none;
        }
        #em-game .em-ov h3 {
          font-size: 24px;
          font-weight: 800;
          margin: 0;
          color: var(--ink);
        }
        #em-game .em-btn {
          font: inherit;
          font-weight: 700;
          font-size: 17px;
          background: var(--coral);
          color: #fff;
          border: 3px solid var(--ink);
          border-radius: 14px;
          padding: 12px 22px;
          cursor: pointer;
          box-shadow: 4px 4px 0 var(--ink);
          text-decoration: none;
          display: inline-block;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        #em-game .em-btn:active {
          transform: translate(3px, 3px);
          box-shadow: 1px 1px 0 var(--ink);
        }
        #em-game .em-btn:focus-visible {
          outline: 3px solid var(--sea);
          outline-offset: 3px;
        }
        #em-game .em-alt {
          background: #fff;
          color: var(--ink);
          font-size: 15px;
          padding: 8px 16px;
        }
        #em-game .em-code {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: 0.05em;
          border: 3px dashed var(--coral);
          padding: 4px 16px;
          border-radius: 10px;
          background: #fff;
          color: #b91c1c;
        }
        #em-game .em-tip {
          font-size: 13.5px;
          opacity: 0.8;
          margin-top: 10px;
        }
      `}</style>

      <h2 id="em-title">
        Escape <span>Monday</span>
      </h2>
      <p>Bored of work? Play 30 seconds and unlock a membership discount.</p>

      <div className="em-hud">
        <span>
          Score: <b id="em-sc">{score}</b>
        </span>
        <span>
          Time: <b id="em-tm">{timeRemaining}</b>s
        </span>
      </div>

      <div className="em-stage">
        <canvas
          ref={canvasRef}
          id="em-c"
          width={W}
          height={H}
          aria-label="Game area"
          onPointerMove={(e) => handlePointerMove(e.clientX)}
          onPointerDown={(e) => handlePointerMove(e.clientX)}
        />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="em-ov" id="em-start">
            <h3>Your boss is chasing you.</h3>
            <p>
              Catch ✈️ 🥥 🩴 🛂 and the bonus 🍹.
              <br />
              Avoid 📧 ⏰ 👔 and “quick sync?” 😬
            </p>
            <button className="em-btn" id="em-go" type="button" onClick={startGame}>
              Play now
            </button>
          </div>
        )}

        {/* Game End / Win Overlay */}
        {gameState === 'end' && (
          <div className="em-ov" id="em-end">
            <div style={{ fontSize: '56px' }} id="em-em">
              {endResult.emoji}
            </div>
            <h3 id="em-ti">{endResult.title}</h3>
            <p id="em-ms">{endResult.message}</p>
            <p>
              Members get up to <b>30% off</b> on every trip.
            </p>
            <div className="em-code" id="em-cd">
              {endResult.code}
            </div>
            <Link
              to={`/contact?subject=${encodeURIComponent(
                'Membership Plan - Escape Monday Game'
              )}&code=${encodeURIComponent(endResult.code)}`}
              className="em-btn"
              id="em-join"
            >
              Claim membership
            </Link>
            <button className="em-btn em-alt" id="em-again" type="button" onClick={startGame}>
              Play again
            </button>
          </div>
        )}
      </div>

      <p className="em-tip">
        Slide your finger or mouse to move the suitcase. Beat 150 points for the full 30%.
      </p>
    </section>
  )
}
