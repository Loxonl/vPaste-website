// Three original rhythmic scores. No music samples, copied tracks, or random UI.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const revision3 = process.argv.includes('--revision3');
const {variants} = require(revision3 ? '../design/revision3.json' : '../design/variants.json');
const rate = 48000;
const total = rate * 40;
const tau = Math.PI * 2;
const hz = midi => 440 * 2 ** ((midi - 69) / 12);
const ranges = {search: [0, 3.35], preview: [.1, 3.5], queue: [1.95, 8.4], drag: [.1, 3.15], local: [.1, 2.7]};
const actions = {search: [.12, .6, 1.1], preview: [.5, .65], queue: [2.7, 3.25, 4.6, 5.95, 7.3, 7.9], drag: [.75, 2.2, 2.25], local: [.3, 1.1, 2.4]};
for (const variant of variants) {
  const left = new Float64Array(total);
  const right = new Float64Array(total);
  const {style, bpm, key, hatVariant, bassVariant} = variant.music;
  const beat = 60 / bpm;
  const rhythm = [];
  let random = crypto.createHash('sha256').update(Buffer.from(variant.seed, 'hex')).update('audio-noise').digest().readUInt32LE(0);
  const noise = () => {random = (Math.imul(random, 1664525) + 1013904223) >>> 0; return random / 2147483648 - 1;};
  const add = (start, length, gain, pan, voice) => {
    const offset = Math.round(start * rate);
    if (offset < 0) return;
    for (let i = 0; i < Math.round(length * rate) && offset + i < total; i++) {
      const value = voice(i / rate, i) * gain;
      left[offset + i] += value * Math.sqrt((1 - pan) / 2);
      right[offset + i] += value * Math.sqrt((1 + pan) / 2);
    }
  };
  const kick = (at, strength = 1) => add(at, .36, .86 * strength, 0, t => {
    const freq = style === 'pulse' ? 47 : style === 'breaks' ? 54 : 43;
    const phase = tau * (freq * t + 3.4 * (1 - Math.exp(-t * 39)));
    return Math.sin(phase) * Math.exp(-t * 13) + noise() * .065 * Math.exp(-t * 230);
  });
  const snare = (at, strength = 1) => add(at, .22, .36 * strength, -.09, t => {
    const body = Math.sin(tau * (style === 'breaks' ? 183 : 235) * t) * Math.exp(-t * 36);
    const clap = style === 'pulse' ? .5 + .5 * Math.sin(tau * 85 * t) ** 2 : 1;
    return .42 * body + noise() * .72 * Math.exp(-t * (style === 'breaks' ? 21 : 32)) * clap;
  });
  const hat = (at, open, strength = 1) => {
    let previous = 0;
    add(at, open ? .2 : .06, (open ? .095 : .064) * strength, open ? .42 : -.35, t => {
      const n = noise(); const high = n - previous; previous = n;
      return high * Math.exp(-t * (open ? 24 : 85));
    });
  };
  const bass = (at, note, length, strength = 1) => add(at, length, .19 * strength, 0, t => {
    const frequency = hz(note);
    const envelope = Math.min(1, t / .007) * Math.max(0, 1 - t / length) ** .6;
    const tone = Math.sin(tau * frequency * t) + .35 * Math.sin(tau * 2 * frequency * t) + (style === 'electro' ? .2 : .09) * Math.sin(tau * 3 * frequency * t);
    return Math.tanh(tone * 1.5) * envelope;
  });
  const quarters = Math.ceil(40 / beat);
  for (let q = 0; q < quarters; q++) {
    const at = q * beat;
    const bar = Math.floor(q / 4);
    const pos = q % 4;
    const active = at >= beat * 2 && at < 38;
    if (style === 'pulse') {
      if (active || pos === 0) kick(at, active ? 1 : .65);
      if (active && pos % 2) snare(at, .85);
      if (active) {hat(at + beat * .5, true); hat(at + beat * .75, false, .4);}
    } else if (style === 'breaks') {
      if (pos === 0 || pos === 2) kick(at, pos === 0 ? 1 : .85);
      if (active && pos % 2) snare(at);
      if (active && pos === 2 && bar % 2 === 0) kick(at + beat * .75, .55);
      if (active) {hat(at, false, .8); hat(at + beat * .57, false, .5);}
    } else {
      if (pos === 0 || (active && pos === 3)) kick(at, pos === 0 ? 1 : .7);
      if (active && pos === 2) snare(at, 1.15);
      if (active) {hat(at, false); hat(at + beat * .5, false, .6); if ((bar + hatVariant) % 3 === 1) hat(at + beat * .75, false, .4);}
    }
    const transpose = [0, 0, -2, -5][bar % 4];
    if (active && ((pos + bassVariant) % 2 === 0 || style === 'pulse')) {
      bass(at + beat * (style === 'pulse' ? .5 : .08), key + transpose, beat * .58, .9);
      if (style === 'electro' && pos === 3) bass(at + beat * .65, key + 12, beat * .3, .55);
    }
    // Low, restrained texture; no light arpeggio or bell melody.
    if (pos === 0) [0, 7, 12].forEach((interval, i) => {
      const f = hz(key + interval + 12);
      add(at, beat * 4.2, style === 'breaks' ? .018 : .026, (i - 1) * .65, t => Math.sin(tau * f * t) * Math.min(1, t / .12) * Math.max(0, 1 - t / (beat * 4.2)));
    });
  }
  for (const shot of variant.shots) {
    const start = shot.from / 30;
    rhythm.push({time: start, event: 'shot-cut', shot: shot.kind});
    kick(start, .5);
    add(start, .1, .12, 0, t => noise() * Math.exp(-t * 43));
    if (start > .3) add(start - .24, .24, .045, .25, t => noise() * (t / .24) ** 2);
    const moments = shot.kind === 'desktop' ? [1, 3.2, 3.48, ...(variant.strategy==='kinetic'?[]:[(shot.to-shot.from)/30-1.45])].map(t=>start+t) : shot.kind === 'types' ? [0, 1, 2, 3, 4].map(i => start + i * (shot.to - shot.from) / 30 / 5) : (actions[shot.kind] ?? []).map(sourceTime => {
      const [lo, hi] = ranges[shot.kind];
      return start + (sourceTime - lo) / (hi - lo) * (shot.to - shot.from - 1) / 30;
    });
    moments.forEach((at, i) => {
      rhythm.push({time: Number(at.toFixed(4)), event: 'native-operation', shot: shot.kind});
      const f = style === 'breaks' ? 240 : style === 'pulse' ? 390 : 530;
      add(at, .085, .15, i % 2 ? .15 : -.15, t => (Math.sin(tau * f * t) + noise() * .3) * Math.exp(-t * 58));
    });
  }
  let peak = 0;
  for (let i = 0; i < total; i++) {
    const fade = Math.min(1, i / rate / .03, (40 - i / rate) / .65);
    left[i] = Math.tanh(left[i] * 1.55) * fade;
    right[i] = Math.tanh(right[i] * 1.55) * fade;
    peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
  }
  const wav = Buffer.alloc(44 + total * 4);
  wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(2, 22);
  wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 4, 28); wav.writeUInt16LE(4, 32);
  wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(total * 4, 40);
  for (let i = 0; i < total; i++) {
    wav.writeInt16LE(Math.round(left[i] / peak * .82 * 32767), 44 + i * 4);
    wav.writeInt16LE(Math.round(right[i] / peak * .82 * 32767), 46 + i * 4);
  }
  const out = path.resolve(__dirname, `../public/${revision3 ? 'revision3/audio' : 'variants'}/${variant.id}`);
  fs.mkdirSync(out, {recursive: true});
  fs.writeFileSync(path.join(out, 'soundtrack.wav'), wav);
  fs.writeFileSync(path.join(out, 'cue-sheet.json'), JSON.stringify({bpm, style, duration: 40, cues: rhythm.sort((a, b) => a.time - b.time)}, null, 2));
  console.log(`${variant.id}: ${style}, ${bpm} BPM, ${rhythm.length} synchronized cues.`);
}
