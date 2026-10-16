// Original, deterministic 120 BPM instrumental; no samples or external audio.
const fs = require('node:fs');
const path = require('node:path');
const rate = 48000;
const duration = 40;
const samples = rate * duration;
const left = new Float64Array(samples);
const right = new Float64Array(samples);
const tau = Math.PI * 2;
const hz = midi => 440 * 2 ** ((midi - 69) / 12);
let seed = 729;
const noise = () => {seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2147483648 - 1;};
function add(start, length, pan, voice) {
  const offset = Math.round(start * rate);
  for (let n = 0; n < Math.round(length * rate) && offset + n < samples; n++) {
    const value = voice(n / rate, n);
    left[offset + n] += value * Math.sqrt((1 - pan) / 2);
    right[offset + n] += value * Math.sqrt((1 + pan) / 2);
  }
}
const chords = [[50, 57, 62, 66, 69], [47, 54, 59, 62, 66], [43, 50, 55, 59, 62], [45, 52, 57, 61, 64]];
for (let bar = 0; bar < 20; bar++) {
  const chord = chords[bar % 4];
  for (let j = 0; j < chord.length; j++) {
    const f = hz(chord[j] + 12);
    add(bar * 2, 2.6, (j - 2) * .25, t => .036 * Math.min(1, t / .25) * Math.max(0, 1 - t / 2.6) * (Math.sin(tau * f * t) + .2 * Math.sin(tau * f * 2.002 * t)));
  }
  for (let step = 0; step < 8; step++) {
    const start = bar * 2 + step * .25;
    const f = hz(chord[[2, 3, 4, 3, 2, 4, 3, 1][step]] + 12);
    add(start, .65, step % 2 ? .32 : -.32, t => .065 * Math.min(1, t / .008) * Math.exp(-t * 8) * (Math.sin(tau * f * t) + .22 * Math.sin(tau * f * 2 * t)));
    if (start >= 4 && start < 35) add(start, .045, .15, t => noise() * .018 * Math.exp(-t * 75));
  }
  for (let beat = 0; beat < 4; beat++) {
    const start = bar * 2 + beat * .5;
    if (start >= 4 && start < 35) {
      add(start, .22, 0, t => .15 * Math.sin(tau * (49 * t + 2.2 * (1 - Math.exp(-t * 30)))) * Math.exp(-t * 20));
      if (beat % 2) add(start, .11, -.1, t => noise() * .032 * Math.exp(-t * 36));
    }
  }
}
const revised = process.argv.includes('--revised');
const timing = require('../src/revised-timing.json');
const cues = revised ? [timing.openingHoldUntil, ...[1.3, 2.8, 5, 9.25, 12.3, 15.9, 22.5, 26.5, 28.5, 29.5, 31.5, 34.05, 35.55, 37.5].map(time=>time+timing.introOffset)] : [4, 7, 9.5, 11.5, 13.5, 16, 18, 20, 22, 28, 31, 35];
for (const time of cues) {
  add(time, .28, 0, t => .022 * noise() * Math.sin(Math.PI * t / .28) ** 2);
  add(time + .04, .45, .1, t => .055 * Math.sin(tau * 880 * t) * Math.exp(-t * 15));
}
if (revised) {
  const keypresses = require('../src/revised-keypresses.json');
  // Reuse this exact waveform for every key; visual and audio share the event times.
  const click = Float64Array.from({length: rate * .085}, (_, n) => {
    const t = n / rate;
    return .18 * Math.min(1, t / .001) * Math.exp(-t * 65) *
      (.55 * noise() + .45 * Math.sin(tau * 1100 * t));
  });
  for (const time of [...keypresses.summon, ...keypresses.search, ...keypresses.preview, ...keypresses.paste]) {
    add(time+timing.introOffset, click.length / rate, 0, (_, n) => click[n]);
  }
}
const wav = Buffer.alloc(44 + samples * 4);
wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 4, 28); wav.writeUInt16LE(4, 32);
wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(samples * 4, 40);
let peak = 0;
for (let n = 0; n < samples; n++) peak = Math.max(peak, Math.abs(left[n]), Math.abs(right[n]));
for (let n = 0; n < samples; n++) {
  const t = n / rate;
  const fade = Math.min(1, t / .25, Math.max(0, (duration - t) / 1.6));
  wav.writeInt16LE(Math.round(left[n] / peak * .65 * fade * 32767), 44 + n * 4);
  wav.writeInt16LE(Math.round(right[n] / peak * .65 * fade * 32767), 46 + n * 4);
}
const output = path.resolve(__dirname, revised ? '../public/promo/soundtrack-revised.wav' : '../public/promo/soundtrack.wav');
fs.mkdirSync(path.dirname(output), {recursive: true});
fs.writeFileSync(output, wav);
console.log('Wrote 40-second original stereo soundtrack at 48 kHz.');
