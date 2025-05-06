/*  live_prediction.js
    minimal webcam ➜ MediaPipe ➜ TF-JS gesture-classifier demo
    © 2025 – plug-and-play for your simple_demo.html page
*/

const VIDEO_W = 640;
const VIDEO_H = 480;
const THRESHOLD  = 0.70;          // confidence to show a label
const MODEL_URL  = './web_model/gesture_model/model.json';

/* ────────────────────────────────────────────────────────── helpers ── */

function drawHand(ctx, keypoints) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
  ctx.fillStyle   = 'red';

  // draw connections
  const fingers = [
    [0, 5, 6, 7, 8],      // index
    [0, 9,10,11,12],      // middle
    [0,13,14,15,16],      // ring
    [0,17,18,19,20],      // pinky
    [0,1,2,3,4]           // thumb
  ];
  fingers.forEach(ids => {
    ctx.beginPath();
    ids.forEach((id, i) => {
      const [x,y] = keypoints[id];
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();
  });

  // draw joints
  keypoints.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x,y,3,0,2*Math.PI);
    ctx.fill();
  });
}

/* ───────────────────────────────────────────────── setup ── */

const video      = document.getElementById('webcam');
const canvas     = document.getElementById('outputCanvas');
const ctx        = canvas.getContext('2d');
const statusBox  = document.getElementById('gestureText');
const instrBox   = document.getElementById('instruction');

let detector;      // MediaPipe hand-pose detector
let classifier;    // tf.layers model
let labels;        // gesture names in order of training data

async function loadModel() {
  statusBox.style.display = 'block';
  statusBox.style.color   = 'yellow';
  statusBox.textContent   = 'Loading model…';

  classifier = await tf.loadLayersModel(MODEL_URL);

  // label order was saved in training script – simplest way is hard-code:
  labels = ['pinch', 'neutral', 'kneading'];

  statusBox.style.color = 'lime';
  statusBox.textContent = 'Model ready';
}

/* Hand-pose-detection wrapper initialisation */
async function loadDetector() {
  const mp = handPoseDetection.SupportedModels.MediaPipeHands;
  detector = await handPoseDetection.createDetector(mp, {
      runtime : 'tfjs',
      modelType: 'lite',
      maxHands : 1
  });
}

/* get camera */
async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video:{ width:VIDEO_W, height:VIDEO_H },
    audio:false
  });
  return new Promise(resolve=>{
     video.onloadedmetadata = () => resolve();
     video.srcObject = stream;
  });
}

/* ───────────────────────────────────────────── main loop ── */

async function analyseFrame() {
  const hands = await detector.estimateHands(video, {flipHorizontal:true});

  // draw original image
  ctx.drawImage(video,0,0,VIDEO_W,VIDEO_H);

  if (hands.length) {
      instrBox.style.display = 'none';

      const kp = hands[0].keypoints;                // 21 landmarks
      const xy = kp.map(p => [p.x, p.y]);           // for drawing
      drawHand(ctx, xy);

      // create [63] feature vector: (x,y,z) per landmark
      const flat = kp.flatMap(p => [p.x/VIDEO_W, p.y/VIDEO_H, p.z]);
      const inp  = tf.tensor2d([flat]);

      const probs = classifier.predict(inp);
      const data  = await probs.data();
      inp.dispose();  probs.dispose();

      const bestIdx = data.indexOf(Math.max(...data));
      const conf    = data[bestIdx];

      if (conf > THRESHOLD) {
        statusBox.textContent =
            `${labels[bestIdx]}   (${(conf*100).toFixed(1)}%)`;
        statusBox.style.color = 'lime';
      } else {
        statusBox.textContent = '…';
      }
  }
  requestAnimationFrame(analyseFrame);
}

/* ───────────────────────────────────────────── bootstrap ── */
async function main() {
  try {
      await Promise.all([loadModel(), loadDetector(), setupCamera()]);
      video.play();
      requestAnimationFrame(analyseFrame);
  } catch(err) {
      statusBox.style.color='red';
      statusBox.textContent = 'Error: ' + err.message;
      console.error(err);
  }
}
main();
