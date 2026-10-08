import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Lenis from "lenis";
import { LockKeyhole, Sparkles, Mic, Utensils, Pencil, X, BookHeart } from "lucide-react";
import "@/App.css";

const PASSWORD = "JD008";
const GUESTS = ["mahee", "devi", "afra", "vana", "vino", "siva", "arun", "krithick", "sharmila", "menis", "abi", "vaisu", "tiger", "sam", "chandru", "vasanth", "vibi", "ranish", "vetri", "sankar", "maya", "ajmal", "jeya", "rishika", "divya", "jaishree", "koshiba", "madhu", "ashmitha", "mari", "sharmitha"];
const COLORS = ["coral", "mint", "yellow", "blue", "pink", "orange"];
const WISHES = ["Happy birthday!", "Hip hip hooray!", "We love you, JD!", "Best day ever!", "Make a wish!", "Cake time!", "Party forever!", "You glow, girl!"];
const EASE_OUT = [0.16, 1, 0.3, 1];
function loadWishes() { try { return JSON.parse(localStorage.getItem("jd-wishes")) || {}; } catch { return {}; } }

function GuestBookCard({ guests, wishes, onClose, onClear }) {
  return <motion.div className="wishes-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.div className="guestbook-card" initial={{ y: 40, scale: 0.95, rotate: -1.5 }} animate={{ y: 0, scale: 1, rotate: -1.5 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} data-testid="guestbook-card">
      <button className="wishes-close no-print" onClick={onClose} data-testid="close-guestbook-button" aria-label="Close guest book"><X size={16} /></button>
      <div className="card-deco" aria-hidden="true">✦ ✧ ✦</div>
      <p className="eyebrow">Jayadurga’s guest book</p>
      <h2>Thank you for<br />celebrating me!</h2>
      <div className="card-list" data-lenis-prevent>
        {guests.map((name, i) => <div className="card-wish" key={`${name}-${i}`} data-testid={`guestbook-entry-${i + 1}`}><b>{name}</b><span>“{wishes[i]?.trim() || WISHES[i % WISHES.length]}”</span></div>)}
      </div>
      <p className="card-sign">with love, <b>Jayadurga</b> ✦</p>
      <div className="card-actions no-print">
        <button className="text-button" onClick={onClear} data-testid="clear-guestbook-button">reset all to defaults</button>
        <button className="pixel-button small" onClick={() => window.print()} data-testid="print-card-button">Print / Save card</button>
      </div>
    </motion.div>
  </motion.div>;
}

function WishesPanel({ guests, wishes, onSave, onClose }) {
  const [draft, setDraft] = useState({ ...wishes });
  return <motion.div className="wishes-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-testid="wishes-panel">
    <motion.div className="wishes-card" initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
      <div className="wishes-head">
        <div><p className="eyebrow">Secret messages</p><h2>What does each friend shout?</h2></div>
        <button className="wishes-close" onClick={() => onSave(draft)} data-testid="close-wishes-button" aria-label="Save and close wishes editor"><X size={16} /></button>
      </div>
      <div className="wishes-list" data-lenis-prevent>
        {guests.map((name, i) => (
          <label className="wish-row" key={`${name}-${i}`}>
            <span>{name}</span>
            <input className={draft[i]?.trim() ? "filled" : ""} data-testid={`wish-input-${i + 1}`} value={draft[i] ?? ""} placeholder={`default: ${WISHES[i % WISHES.length]}`} maxLength={40} onChange={(e) => setDraft((d) => ({ ...d, [i]: e.target.value }))} />
          </label>
        ))}
      </div>
      <div className="wishes-actions">
        <button className="pixel-button small" onClick={() => onSave(draft)} data-testid="save-wishes-button">Save wishes</button>
      </div>
    </motion.div>
  </motion.div>;
}

function MaskedLine({ children, delay = 0 }) {
  return <span className="mask-line"><motion.span initial={{ y: "115%" }} animate={{ y: 0 }} transition={{ delay, duration: 0.75, ease: EASE_OUT }}>{children}</motion.span></span>;
}

function Login({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    if (value.trim().toUpperCase() === PASSWORD) onUnlock();
    else setError(true);
  };
  return <main className="login-screen" data-testid="login-screen">
    <div className="pixel-stars" aria-hidden="true">✦　·　✧　·　✦　·　⋆　·　✧</div>
    <motion.section className="login-card" initial={{ opacity: 0, y: 46, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 120, damping: 16 }}>
      <motion.div className="login-crown" initial={{ y: -130, opacity: 0, rotate: -16 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ delay: 0.35, type: "spring", stiffness: 210, damping: 12 }}>♛</motion.div>
      <p className="eyebrow">A tiny secret party for</p>
      <h1><MaskedLine delay={0.55}>Jayadurga<span>!</span></MaskedLine></h1>
      <p className="login-copy">The door is locked, the cake is waiting,<br />and 31 friends are hiding inside.</p>
      <form onSubmit={submit} className="password-form">
        <label htmlFor="party-password">Enter the party password</label>
        <div className="input-wrap"><LockKeyhole size={16} /><input id="party-password" data-testid="password-input" autoFocus value={value} onChange={(e) => { setValue(e.target.value); setError(false); }} placeholder="type it here..." type="password" /></div>
        <button className="pixel-button primary" data-testid="unlock-party-button" type="submit">Open the party <span>→</span></button>
        {error && <p className="error-message" data-testid="password-error">Nope! That password is hiding in the cake 🍰</p>}
      </form>
      <p className="login-foot">hint: two letters + three numbers</p>
    </motion.section>
  </main>;
}

function PixelPerson({ name, index, cheering, wish, onCheer }) {
  const color = COLORS[index % COLORS.length];
  const female = index >= 14;
  return <div className={`guest guest-${color} ${female ? "guest-female" : ""} ${cheering ? "guest-cheering" : ""}`} style={{ "--i": index }} data-testid={`guest-${index + 1}`} role="button" tabIndex="-1" onClick={onCheer} aria-label={`Cheer with ${name}`}>
    <div className="guest-inner">
      <div className="guest-bob">
        {cheering && <div className="cheer-bubble" data-testid={`cheer-bubble-${index + 1}`}>{wish}</div>}
        <div className="name-tag" data-testid={`guest-name-${index + 1}`}>{name}</div>
        <div className="guest-sprite" aria-label={`${name}, party guest`}>
          <div className="guest-hair" />
          <div className="guest-face"><i /><i /></div>
          <div className="guest-body" />
          <div className="guest-arm left" /><div className="guest-arm right" />
          <div className="guest-feet" />
        </div>
      </div>
    </div>
  </div>;
}

function Confetti() {
  return <div className="confetti-layer" aria-hidden="true">{Array.from({ length: 54 }, (_, i) => <i key={i} style={{ "--i": i }} />)}</div>;
}

function Cake({ taps, onTap, candlesOut }) {
  return <button className={`cake-button cake-taps-${taps} ${candlesOut ? "cake-out" : ""}`} onClick={onTap} data-testid="birthday-cake-button" aria-label="Tap the birthday cake">
    <span className="cake-plate" /><span className="cake-base"><i /><i /><i /></span><span className="cake-icing">⌁⌁⌁</span>
    <span className="candles">{[0, 1, 2].map((i) => <b className={candlesOut ? "extinguished" : ""} key={i}><em>✦</em><small /></b>)}</span>
    <span className="cake-sparkle">✦</span>
  </button>;
}

function Princess({ celebrating, bursts, onWand }) {
  return <div className="birthday-girl" data-testid="birthday-girl">
    <div className="princess-sparkles" aria-hidden="true"><i>✦</i><i>✧</i><i>✦</i></div>
    <div className={`girl-wand ${celebrating ? "wand-live" : ""}`} onClick={onWand} data-testid="princess-wand" role={celebrating ? "button" : undefined} aria-label="Tap the wand for sparkles"><i>✦</i></div>
    {bursts.map((b) => <span className="wand-burst" key={b.id} aria-hidden="true">{b.sparks.map((s, k) => <i key={k} style={{ "--dx": `${s.x}px`, "--dy": `${s.y}px`, "--d": `${s.d}ms` }}>✦</i>)}</span>)}
    <div className="tiara" aria-hidden="true"><i /><i /><i /></div>
    <div className="girl-hair" />
    <div className="girl-face"><i /><i /></div>
    <div className="girl-sleeves" />
    <div className="girl-gown"><b /><b /><b /></div>
    <div className="girl-shoes" />
    <span className="girl-name">✦ JAYADURGA ✦</span>
  </div>;
}

function Marquee() {
  const chunk = <>HAPPY BIRTHDAY <b>JAYADURGA</b> ✦ MAKE A WISH ✦ 31 TINY FRIENDS ✦ CAKE O’CLOCK ✦ HOLDING HANDS ✦ </>;
  return <div className="marquee" aria-hidden="true" data-testid="birthday-marquee">
    <div className="marquee-track">{[0, 1].map((k) => <span key={k}>{chunk}{chunk}{chunk}</span>)}</div>
  </div>;
}

function Party() {
  const [taps, setTaps] = useState(0);
  const [blown, setBlown] = useState(false);
  const [fed, setFed] = useState(false);
  const [micStatus, setMicStatus] = useState("ready");
  const [cheer, setCheer] = useState(null);
  const [bursts, setBursts] = useState([]);
  const [wishes, setWishes] = useState(loadWishes);
  const [showWishes, setShowWishes] = useState(false);
  const [notes, setNotes] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const cheerTimer = useRef(null);
  const audioRef = useRef(null);
  const sceneRef = useRef(null);
  const guests = useMemo(() => GUESTS, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 16 });
  const sy = useSpring(my, { stiffness: 55, damping: 16 });
  const orb1x = useTransform(sx, (v) => v * 30);
  const orb1y = useTransform(sy, (v) => v * 22);
  const orb2x = useTransform(sx, (v) => v * -24);
  const orb2y = useTransform(sy, (v) => v * -18);
  const moonX = useTransform(sx, (v) => v * 46);
  const moonY = useTransform(sy, (v) => v * 30);

  useEffect(() => { sceneRef.current?.focus(); }, []);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const tryPlay = () => audio.play().catch(() => {});
    tryPlay();
    const onTap = () => { tryPlay(); if (!audio.paused) window.removeEventListener("pointerdown", onTap); };
    window.addEventListener("pointerdown", onTap);
    return () => window.removeEventListener("pointerdown", onTap);
  }, []);
  const fetchWishes = () => { setWishes(loadWishes()); };
  useEffect(() => { fetchWishes(); }, []);
  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const tapCake = () => setTaps((n) => Math.min(n + 1, 3));
  const cheerGuest = (index) => {
    clearTimeout(cheerTimer.current);
    const wish = wishes[index]?.trim() || WISHES[index % WISHES.length];
    setCheer({ index, wish });
    setNotes((prev) => [...prev.filter((n) => n.index !== index), { index, name: GUESTS[index], wish }].slice(-12));
    cheerTimer.current = setTimeout(() => setCheer(null), 2100);
  };
  const feedGirl = () => { setFed(true); setNotes([]); };
  const clearCard = () => { saveWishes({}); };
  const saveWishes = (draft) => {
    const clean = {};
    Object.entries(draft).forEach(([k, v]) => { if (v.trim()) clean[k] = v.trim(); });
    setWishes(clean);
    setShowWishes(false);
    try { localStorage.setItem("jd-wishes", JSON.stringify(clean)); } catch {}
  };
  const wandTap = () => {
    if (!blown) return;
    const id = Date.now() + Math.random();
    const sparks = Array.from({ length: 12 }, () => { const a = Math.random() * Math.PI * 2; const r = 40 + Math.random() * 60; return { x: Math.cos(a) * r, y: Math.sin(a) * r, d: Math.round(Math.random() * 120) }; });
    setBursts((b) => [...b.slice(-3), { id, sparks }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1150);
  };
  const simulateBlow = () => { setBlown(true); setMicStatus("blown"); };
  const tryMic = async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setMicStatus("unsupported"); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audio = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audio.createAnalyser(); analyser.fftSize = 512;
      const source = audio.createMediaStreamSource(stream); source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount); setMicStatus("listening");
      const listen = () => { analyser.getByteTimeDomainData(data); const loud = data.reduce((sum, n) => sum + Math.abs(n - 128), 0) / data.length; if (loud > 13) { stream.getTracks().forEach((track) => track.stop()); setBlown(true); setMicStatus("blown"); } else if (!blown) requestAnimationFrame(listen); };
      listen();
    } catch { setMicStatus("unsupported"); }
  };
  return <main className={`party-page ${blown ? "is-celebrating" : ""}`} ref={sceneRef} tabIndex="-1" data-testid="birthday-party" onMouseMove={onMouseMove}>
    <div className="scene-wipe" aria-hidden="true" />
    <audio ref={audioRef} loop src={`${process.env.PUBLIC_URL}/birthday-song.mp3`} data-testid="birthday-audio" />
    {blown && <Confetti />}
    <div className="wish-notes" aria-hidden="true" data-testid="wish-notes">{notes.map((n, k) => <div className={`wish-note ${k % 2 ? "right" : "left"}`} style={{ "--row": Math.floor(k / 2) }} key={n.index} data-testid={`wish-note-${n.index + 1}`}><b>{n.name}</b><span>{n.wish}</span></div>)}</div>
    <header className="party-header">
      <div>
        <p className="eyebrow">Jayadurga’s pixel party · 31 guests assembled</p>
        <h1><MaskedLine delay={0.55}>Happy Birthday<span>!</span></MaskedLine></h1>
      </div>
      <div className="music-control">
        <div className="control-row">
          <button className="music-button" data-testid="edit-wishes-button" onClick={() => { fetchWishes(); setShowWishes(true); }}><Pencil size={16} /> Wishes</button>
          <button className="music-button" data-testid="guestbook-button" onClick={() => { fetchWishes(); setShowCard(true); }}><BookHeart size={16} /> Card</button>
        </div>
      </div>
    </header>
    <div className="party-status" data-testid="party-status">{blown ? "The birthday blast is ON! 🎉" : taps === 0 ? "Tap the cake to start the mischief" : taps < 3 ? `${3 - taps} more tap${taps === 2 ? "" : "s"} until cake chaos...` : "Make a wish, birthday legend! Blow the candles!"}</div>
    {micStatus !== "ready" && <div className="mic-feedback" data-testid="mic-feedback">{micStatus === "listening" ? "🎙 Listening for your best birthday whoosh..." : micStatus === "blown" ? "💨 Candles blown out — party blast activated!" : "🎙 Mic unavailable — use the candle button below."}</div>}
    <section className="scene" data-testid="celebration-scene">
      <motion.div className="orb-wrap orb-wrap-one" style={{ x: orb1x, y: orb1y }}><div className="orb orb-one" /></motion.div>
      <motion.div className="orb-wrap orb-wrap-two" style={{ x: orb2x, y: orb2y }}><div className="orb orb-two" /></motion.div>
      <motion.div className="moon-wrap" style={{ x: moonX, y: moonY }}><div className="moon">✦</div></motion.div>
      <div className={`guest-ring ${blown ? "spinning" : ""}`} data-testid="guest-ring">{guests.map((name, index) => <PixelPerson name={name} index={index} key={`${name}-${index}`} cheering={cheer?.index === index} wish={cheer?.wish} onCheer={() => cheerGuest(index)} />)}</div>
      <Princess celebrating={blown} bursts={bursts} onWand={wandTap} />
      <div className="cake-zone">
        <Cake taps={taps} onTap={tapCake} candlesOut={blown} />
        <AnimatePresence>
          {taps >= 3 && !blown && <motion.div className="blow-prompt" data-testid="blow-prompt" initial={{ scale: 0.6, opacity: 0, y: 14 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ type: "spring", stiffness: 280, damping: 19 }}><span>Make a wish!</span><button className="pixel-button small" onClick={tryMic} data-testid="blow-microphone-button"><Mic size={14} /> Blow into mic</button><button className="text-button" onClick={simulateBlow} data-testid="simulate-blow-button">or tap to blow candles</button>{micStatus === "unsupported" && <small data-testid="mic-status">Mic unavailable — use the button above!</small>}{micStatus === "listening" && <small className="listening-status" data-testid="mic-status">Listening... give the candles a big whoosh!</small>}</motion.div>}
        </AnimatePresence>
        <AnimatePresence>
          {blown && !fed && <motion.div className="feed-panel" data-testid="feed-panel" initial={{ scale: 0.7, opacity: 0, y: 18 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.35 }}><div className="slice">🍰</div><div><p className="eyebrow">Cake acquired</p><h2>One bite for the birthday boss?</h2><button className="pixel-button primary" onClick={feedGirl} data-testid="feed-birthday-girl-button"><Utensils size={15} /> Feed Jayadurga</button></div></motion.div>}
        </AnimatePresence>
        <AnimatePresence>
          {fed && <motion.div className="happy-message" data-testid="happy-birthday-message" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}><span className="message-sparkle">✦</span><p>Yummy! 🎂</p><h2>Happy Birthday,<br /><strong>Jayadurga!</strong></h2><span className="message-sparkle">✦</span></motion.div>}
          {fed && <button className="text-button card-link" data-testid="open-card-link" onClick={() => setShowCard(true)}>open Jayadurga’s thank-you card ✦</button>}
        </AnimatePresence>
      </div>
    </section>
    <Marquee />
    <AnimatePresence>{showWishes && <WishesPanel guests={guests} wishes={wishes} onSave={saveWishes} onClose={() => setShowWishes(false)} />}</AnimatePresence>
    <AnimatePresence>{showCard && <GuestBookCard guests={guests} wishes={wishes} onClose={() => setShowCard(false)} onClear={clearCard} />}</AnimatePresence>
    <footer className="party-footer"><span><Sparkles size={14} /> 31 tiny pixel friends are cheering</span><span>made with extra frosting &amp; mischief</span></footer>
  </main>;
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
  return unlocked ? <Party /> : <Login onUnlock={() => setUnlocked(true)} />;
}
