export function playClick(volume = 0.08) {
  if (typeof window === "undefined") return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = 420;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
  osc.stop(ctx.currentTime + 0.07);
  osc.onended = () => void ctx.close();
}

type EngineHandles = {
  ctx: AudioContext;
  master: GainNode;
  analyser: AnalyserNode;
  nodes: AudioNode[];
  intervals: number[];
  sources: OscillatorNode[];
};

export class PhonkEngine {
  private handles: EngineHandles | null = null;
  playing = false;

  get analyser() {
    return this.handles?.analyser ?? null;
  }

  async start(volume: number) {
    if (this.playing) return;
    const ctx = new AudioContext();
    if (ctx.state === "suspended") await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = volume;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    master.connect(analyser);
    analyser.connect(ctx.destination);

    const nodes: AudioNode[] = [master, analyser];
    const sources: OscillatorNode[] = [];
    const intervals: number[] = [];

    const drone = ctx.createOscillator();
    drone.type = "sawtooth";
    drone.frequency.value = 55;
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.value = 180;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.12;
    drone.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(master);
    drone.start();
    sources.push(drone);
    nodes.push(droneFilter, droneGain);

    const pad = ctx.createOscillator();
    pad.type = "triangle";
    pad.frequency.value = 110;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.05;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.18;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 18;
    lfo.connect(lfoGain);
    lfoGain.connect(pad.frequency);
    pad.connect(padGain);
    padGain.connect(master);
    pad.start();
    lfo.start();
    sources.push(pad, lfo);
    nodes.push(padGain, lfoGain);

    const bpm = 134;
    const step = 60_000 / bpm / 4;
    let tick = 0;

    const kick = () => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(140, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(42, ctx.currentTime + 0.12);
      g.gain.setValueAtTime(0.55, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      o.connect(g);
      g.connect(master);
      o.start();
      o.stop(ctx.currentTime + 0.24);
    };

    const hat = (accent: boolean) => {
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 7000;
      const g = ctx.createGain();
      g.gain.value = accent ? 0.07 : 0.03;
      noise.connect(hp);
      hp.connect(g);
      g.connect(master);
      noise.start();
    };

    const cowbell = () => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = 845;
      g.gain.setValueAtTime(0.04, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      o.connect(g);
      g.connect(master);
      o.start();
      o.stop(ctx.currentTime + 0.1);
    };

    const id = window.setInterval(() => {
      if (tick % 4 === 0) kick();
      if (tick % 2 === 0) hat(tick % 4 === 0);
      else hat(false);
      if (tick % 8 === 4) cowbell();
      tick += 1;
    }, step);

    intervals.push(id);
    this.handles = { ctx, master, analyser, nodes, intervals, sources };
    this.playing = true;
  }

  setVolume(value: number) {
    if (this.handles) this.handles.master.gain.value = value;
  }

  stop() {
    if (!this.handles) return;
    this.handles.intervals.forEach((id) => window.clearInterval(id));
    this.handles.sources.forEach((s) => {
      try {
        s.stop();
      } catch {
        /* already stopped */
      }
    });
    void this.handles.ctx.close();
    this.handles = null;
    this.playing = false;
  }
}
