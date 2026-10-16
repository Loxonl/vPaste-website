const path=require('node:path');
const fs=require('node:fs');
const sharp=require('../../node_modules/sharp');
const dir=path.resolve(__dirname,'../public/revision3');
async function main(){
  // Crop the real captured window to 16:9; exclude the unrelated OS input toolbar.
  for(const state of ['before','after']) await sharp(path.join(dir,`notepad-${state}.png`)).extract({left:0,top:0,width:2048,height:1152}).png().toFile(path.join(dir,`note-${state}.png`));
  fs.copyFileSync('C:/Windows/Web/Wallpaper/Windows/img0.jpg',path.join(dir,'windows-wallpaper.jpg'));
  console.log('Prepared Windows wallpaper and genuine Notepad window captures.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
