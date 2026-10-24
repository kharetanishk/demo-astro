/* Tiny synthesized UI sounds (Web Audio, no audio files), after the clicks
   in the portfolio's src/lib/sound.ts. Browsers keep audio locked until the
   first tap on the page, so a swipe before any tap stays silent. */

type Layer =
  | { kind: "noise"; at?: number; freq: number; q: number; decay: number; peak: number }
  | { kind: "tone"; at?: number; freq: number; decay: number; peak: number };

const SOUNDS = {
  // A chain link settling on its hook: a bright strike, a second link
  // rattling against it, and a short inharmonic metal ring.
  chain: [
    { kind: "noise", freq: 3200, q: 6, decay: 0.03, peak: 0.12 },
    { kind: "noise", at: 0.028, freq: 4800, q: 8, decay: 0.02, peak: 0.07 },
    { kind: "tone", freq: 2093, decay: 0.09, peak: 0.02 },
    { kind: "tone", freq: 3170, decay: 0.07, peak: 0.014 },
    { kind: "tone", at: 0.028, freq: 4560, decay: 0.05, peak: 0.01 },
  ],
} satisfies Record<string, Layer[]>;

let ctx: AudioContext | null = null;

export function playSound(name: keyof typeof SOUNDS) {
  if (typeof window === "undefined" || !window.AudioContext) return;
  ctx ??= new AudioContext();
  const ac = ctx;
  const play = () => {
    const master = ac.createGain();
    master.gain.value = 0.4;
    master.connect(ac.destination);
    for (const layer of SOUNDS[name] as Layer[]) {
      const t = ac.currentTime + (layer.at ?? 0);
      const env = ac.createGain();
      env.gain.setValueAtTime(1e-4, t);
      env.gain.exponentialRampToValueAtTime(layer.peak, t + 0.001);
      env.gain.exponentialRampToValueAtTime(1e-4, t + 0.001 + layer.decay);
      env.connect(master);
      const end = t + layer.decay + 0.05;
      if (layer.kind === "tone") {
        const osc = ac.createOscillator();
        osc.frequency.value = layer.freq;
        osc.connect(env);
        osc.start(t);
        osc.stop(end);
      } else {
        const buf = ac.createBuffer(1, Math.ceil((layer.decay + 0.05) * ac.sampleRate), ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const src = ac.createBufferSource();
        src.buffer = buf;
        const filter = ac.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = layer.freq;
        filter.Q.value = layer.q;
        src.connect(filter).connect(env);
        src.start(t);
        src.stop(end);
      }
    }
  };
  if (ac.state === "running") play();
  else ac.resume().then(play).catch(() => {});
}
