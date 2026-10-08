const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg-static');

const videoPath = path.resolve('public/mobile vid/MovileVideo.mp4');
const tempDir = path.resolve('public/temp_frames');
const destDir = path.resolve('public/mobile frames');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
} else {
  fs.readdirSync(tempDir).forEach((f) => fs.unlinkSync(path.join(tempDir, f)));
}

console.log('Source video path:', videoPath);
console.log('FFmpeg binary:', ffmpeg);

// Target 300 frames: 10.041667 seconds duration (FPS: 300 / 10.041667)
const fps = '300/10.041667';
// Use high-quality native 720x1224 extraction with subtle unsharp enhancement
const filter = `fps=${fps},scale=720:1224:flags=lanczos,unsharp=3:3:0.4:3:3:0.0`;
const outPattern = path.join(tempDir, 'ezgif-frame-%03d.jpg');

const cmd = `"${ffmpeg}" -i "${videoPath}" -vf "${filter}" -q:v 2 "${outPattern}" -y`;
console.log('Executing:', cmd);
execSync(cmd, { stdio: 'inherit' });

let files = fs.readdirSync(tempDir).filter((f) => f.endsWith('.jpg')).sort();
console.log(`Extracted count: ${files.length}`);

// Normalize to exactly 300 frames
if (files.length > 300) {
  for (let i = 300; i < files.length; i++) {
    fs.unlinkSync(path.join(tempDir, files[i]));
  }
} else if (files.length < 300 && files.length > 0) {
  const lastFile = files[files.length - 1];
  for (let i = files.length + 1; i <= 300; i++) {
    const pad = i.toString().padStart(3, '0');
    fs.copyFileSync(
      path.join(tempDir, lastFile),
      path.join(tempDir, `ezgif-frame-${pad}.jpg`)
    );
  }
}

files = fs.readdirSync(tempDir).filter((f) => f.endsWith('.jpg')).sort();
console.log(`Normalized count: ${files.length}`);
console.log('First 3:', files.slice(0, 3));
console.log('Last 3:', files.slice(-3));

// Copy over to public/mobile frames
console.log(`Replacing all frames in ${destDir}...`);
files.forEach((f) => {
  fs.copyFileSync(path.join(tempDir, f), path.join(destDir, f));
});
console.log('Successfully replaced all 300 frames in public/mobile frames!');

// Clean up temp
files.forEach((f) => fs.unlinkSync(path.join(tempDir, f)));
fs.rmdirSync(tempDir);
console.log('Cleaned up temp directory.');
