const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const sharp = require('../../node_modules/sharp');
const revision3 = process.argv.includes('--revision3');
const {variants} = require(revision3 ? '../design/revision3.json' : '../design/variants.json');
const out = path.resolve(__dirname, revision3 ? '../out/revision3' : '../out');
const ffmpeg = args => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], {stdio: 'pipe'});
async function main() {
  const results = [];
  for (const variant of variants) {
    const dir = path.join(out, `variant-${variant.id}`);
    const file = path.join(dir, `vpaste-40s-${variant.id}.mp4`);
    const metadata = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size:stream=codec_type,codec_name,width,height,nb_frames,r_frame_rate,duration,channels,sample_rate', '-of', 'json', file], {encoding: 'utf8'}));
    const video = metadata.streams.find(s => s.codec_type === 'video');
    const audio = metadata.streams.find(s => s.codec_type === 'audio');
    assert.equal(video.width, 1920); assert.equal(video.height, 1080);
    assert.equal(video.r_frame_rate, '30/1'); assert.equal(video.nb_frames, '1200'); assert.equal(Number(video.duration), 40);
    assert.equal(audio.codec_name, 'aac'); assert.equal(audio.channels, 2);
    assert.equal(variant.seed.length, 282); assert.equal(BigInt('0x' + variant.seed).toString(2).length, 1128);
    ffmpeg(['-i', file, '-f', 'null', process.platform === 'win32' ? 'NUL' : '/dev/null']);
    ffmpeg(['-i', file, '-vf', 'scale=960:540', '-c:v', 'libx264', '-preset', 'fast', '-crf', '24', '-c:a', 'copy', '-movflags', '+faststart', path.join(dir, `vpaste-40s-${variant.id}-preview.mp4`)]);
    const posterShot = variant.shots.find(s => s.kind === 'search');
    ffmpeg(['-ss', String((posterShot.from + (posterShot.to - posterShot.from) * .66) / 30), '-i', file, '-frames:v', '1', path.join(dir, 'poster.jpg')]);
    const frames = [];
    for (const [index, shot] of variant.shots.entries()) {
      const framePath = path.join(dir, 'frames', `final-${shot.kind}.png`);
      ffmpeg(['-ss', String((shot.from + (shot.to - shot.from) * .66) / 30), '-i', file, '-frames:v', '1', framePath]);
      frames.push({input: await sharp(framePath).resize(480, 270).png().toBuffer(), left: index % 3 * 480, top: Math.floor(index / 3) * 282});
    }
    await sharp({create: {width: 1440, height: Math.ceil(variant.shots.length / 3) * 282, channels: 3, background: '#e4e9ed'}}).composite(frames).jpeg({quality: 90}).toFile(path.join(dir, 'small-player-check.jpg'));
    results.push({id: variant.id, name: variant.name, metadata, decode: 'passed', smallPlayerWidth: 480, seedBits: 1128});
    console.log(`Validated ${variant.id}: 40 seconds, 1080p/30, stereo; preview and 480px inspection sheet ready.`);
  }
  assert.equal(new Set(variants.map(v => v.seed)).size, 3);
  assert.equal(new Set(variants.map(v => revision3 ? v.strategy : v.layout)).size, 3);
  assert.equal(new Set(variants.map(v => v.music.style)).size, 3);
  fs.writeFileSync(path.join(out, 'variants-validation.json'), JSON.stringify(results, null, 2));
  const descriptions = revision3
    ? {A: '蓝白长镜头 · 从桌面拉近细节 · 96 BPM 切分鼓点', B: '暖白节拍广告 · 左右交替与快速裁切 · 144 BPM 电子节奏', C: '薄荷绿分镜 · 操作与标语左右并置 · 120 BPM 稳定律动'}
    : {A: '聚焦式镜头 · 大字置顶 · 108 BPM 切分鼓点', B: '横向快切 · 居中标语 · 150 BPM 电子节奏', C: '纵向滚动 · 左对齐大字 · 132 BPM 稳定律动'};
  const panels = variants.map(v => `<article><h2>${v.id} · ${v.name}</h2><p>${descriptions[v.id]}</p><video controls playsinline preload="metadata" poster="variant-${v.id}/poster.jpg" src="variant-${v.id}/vpaste-40s-${v.id}-preview.mp4"></video><a href="variant-${v.id}/vpaste-40s-${v.id}.mp4" download>下载 1080p 成片</a></article>`).join('');
  fs.writeFileSync(path.join(out, 'compare.html'), `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>vPaste · 三版宣传视频</title><style>*{box-sizing:border-box}body{margin:0;padding:48px 28px;background:#f7f9fc;color:#172c49;font-family:"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1552px;margin:auto}h1{font-size:30px;margin:0 0 12px}header p{color:#586b83;line-height:1.6;margin:0 0 36px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}article{min-width:0}h2{font-size:21px}article p{font-size:14px;color:#586b83;min-height:44px}video{display:block;width:100%;aspect-ratio:16/9;background:white;border-radius:10px;box-shadow:0 12px 35px #1b365315}a{display:inline-block;margin-top:20px;color:#075be8;text-underline-offset:4px}@media(max-width:950px){.grid{grid-template-columns:1fr}article{max-width:480px}body{padding:28px 20px}}</style><main><header><h1>vPaste · 三版宣传视频</h1><p>均为 40 秒、16:9。此页按小窗口尺寸播放；播放其中一版会暂停其他版本，便于比较节奏和音乐。</p></header><section class="grid">${panels}</section></main><script>const players=[...document.querySelectorAll('video')];players.forEach(player=>player.addEventListener('play',()=>players.forEach(other=>{if(other!==player)other.pause()})));</script></html>`);
}
main().catch(error => {console.error(error); process.exitCode = 1;});
