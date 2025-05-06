const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9],
  [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]
  ];

function ballkneading2hands (selector) {
  return p => {
    let ballkneading;
    let numFrames = 0;
    let isPlaying = true;
    let currentFrame = 0;

    const playPauseBtn = document.createElement('button');
    playPauseBtn.className = 'play-pause-btn';
    playPauseBtn.innerHTML = '⏸️';
    document.querySelector('.hand-model-container').appendChild(playPauseBtn);

    playPauseBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playPauseBtn.innerHTML = isPlaying ? '⏸️' : '▶️';
      if (!isPlaying) {
        currentFrame = p.floor((p.frameCount % numFrames) / 3);
      }
    });

    p.preload = () => {
      ballkneading = p.loadJSON('../3dhands/ballkneading2hands.json');
    };

    p.setup = () => {
      const eltSize = getCanvasSize(selector);
      p.createCanvas(eltSize.width, eltSize.height, p.WEBGL).parent('hand-sketch-placeholder');

      for (const key in ballkneading) {
        const landmarks = ballkneading[key];
        numFrames += 1;

        let cx = 0, cy = 0, cz = 0, count = 0

        for (const hand of landmarks.hands) {
          for (const landmark of hand) {
            cx += landmark.x;
            cy += landmark.y;
            cz += landmark.z;
            count += 1;
          }
        }

        // Compute the centroid.
        cx /= count;
        cy /= count;
        cz /= count;

        landmarks.centroid = { x: cx, y: cy, z: cz };
      }

      p.frameRate(30);
    };

    p.draw = () => {
      p.background(p.color('#407DFF'));

      drawAxes(100);
      p.orbitControl();

      if (isPlaying) {
        currentFrame = p.floor((p.frameCount % numFrames) / 3);
      }
      drawHandLandmarks(ballkneading[currentFrame]);
    };

    const drawAxes = (sc = 1) => {
      p.stroke(255, 0, 0);
      p.line(0, 0, 0, sc, 0, 0);

      p.stroke(0, 255, 0);
      p.line(0, 0, 0, 0, sc, 0);

      p.stroke(0, 0, 255);
      p.line(0, 0, 0, 0, 0, sc);
    };

    const drawHandLandmarks = landmarks => {
      p.push();
      p.scale(2000);
      p.translate(-landmarks.centroid.x, -landmarks.centroid.y, -landmarks.centroid.z);

      // Enhanced lighting setup for shiny material
      p.directionalLight(255, 255, 255, 0, 1, -1);
      p.pointLight(255, 255, 255, 0, 0, 50);
      p.ambientLight(100, 100, 100); // Brighter ambient light

      landmarks.hands.forEach((hand, index) => {
        // More saturated colors for shiny material
        const handColor = index === 0 ? 
          p.color('#F5D0FF') :  // Brighter pink for left hand
          p.color('FFE090');   // Brighter orange for right hand
        
        // Draw connections first
        p.stroke(handColor);
        p.strokeWeight(4);
        for (const connection of HAND_CONNECTIONS) {
          const pt0 = hand[connection[0]];
          const pt1 = hand[connection[1]];
          p.line(pt0.x, pt0.y, pt0.z, pt1.x, pt1.y, pt1.z);
        }
        
        // Draw spheres with shiny material
        p.noStroke();
        p.specularMaterial(handColor);
        p.shininess(50); // Higher shininess for more reflective look
        
        for (const landmark of hand) {
          p.push();
          p.translate(landmark.x, landmark.y, landmark.z);
          p.sphere(0.003);
          p.pop();
        }
      });
      
      p.pop();
    };

    // Resize the sketch if the window changes size.
    p.windowResized = () => {
      const eltSize = getCanvasSize(selector);
      p.resizeCanvas(eltSize.width, eltSize.height);
    };
  }
}

function getHostElement (selector=".hand-model-container") {
  return document.querySelector(selector);
}

function getCanvasSize (selector=".hand-model-container") {
  const host = getHostElement(selector);
  if (!host) {
    return { width: 800, height: 400 };
  }
  const rect = host.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}


class Sketch {
  constructor (selector, sketch) {
    this.selector = selector;
    this.sketch = sketch.bind(this);
  }
}

function createSketch (selector, createSketchFun) {
  const host = getHostElement(selector);
  new p5(createSketchFun(selector), host);
}

function onReady () {
  createSketch('#hand-sketch-placeholder', ballkneading2hands);

  // Can add more sketches to the same page like this:
  // createSketch('#sketch2', ballkneading2hands);
}

if (document.readyState === 'complete') {
  onReady();
} else {
  document.addEventListener("DOMContentLoaded", onReady);
}
