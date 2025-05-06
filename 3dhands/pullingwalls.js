const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9],
  [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]
];

function pullingwalls(selector) {
  return p => {
    let pullingwalls;
    let pullingwalls2;
    let numFrames = 0;
    let isPlaying = true;
    let currentFrame = 0;
    let currentAnimation = 2; // Start with animation 2

    // Add label element
    const animationLabel = document.createElement('div');
    animationLabel.className = 'animation-label';
    animationLabel.innerHTML = 'Pulling Walls 2'; // Start with animation 2 label
    document.querySelector('.hand-model-container').appendChild(animationLabel);

    const playPauseBtn = document.createElement('button');
    playPauseBtn.className = 'play-pause-btn';
    playPauseBtn.innerHTML = '⏸️';
    document.querySelector('.hand-model-container').appendChild(playPauseBtn);

    const switchBtn = document.createElement('button');
    switchBtn.className = 'switch-btn';
    switchBtn.innerHTML = '🔄';
    document.querySelector('.hand-model-container').appendChild(switchBtn);

    playPauseBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playPauseBtn.innerHTML = isPlaying ? '⏸️' : '▶️';
      if (!isPlaying) {
        currentFrame = p.floor((p.frameCount % numFrames) / 3);
      }
    });

    switchBtn.addEventListener('click', () => {
      currentAnimation = currentAnimation === 2 ? 1 : 2; // Switch from 2->1 or 1->2
      animationLabel.innerHTML = `Pulling Walls ${currentAnimation}`;
      currentFrame = 0;
    });

    p.preload = () => {
      pullingwalls2 = p.loadJSON('../3dhands/pullingwalls2.json'); // Load 2 first
      pullingwalls = p.loadJSON('../3dhands/pullingwalls.json');
    };

    p.setup = () => {
      const eltSize = getCanvasSize(selector);
      p.createCanvas(eltSize.width, eltSize.height, p.WEBGL).parent('hand-sketch-placeholder');

      // Process both animations
      processAnimation(pullingwalls2); // Process 2 first
      processAnimation(pullingwalls);

      p.frameRate(30);
    };

    const processAnimation = (data) => {
      for (const key in data) {
        const landmarks = data[key];
        numFrames += 1;

        let cx = 0, cy = 0, cz = 0, count = 0;
        for (const hand of landmarks.hands) {
          for (const landmark of hand) {
            cx += landmark.x;
            cy += landmark.y;
            cz += landmark.z;
            count += 1;
          }
        }

        landmarks.centroid = {
          x: cx / count,
          y: cy / count,
          z: cz / count
        };
      }
    };

    p.draw = () => {
      p.background(p.color('#407DFF'));
      drawAxes(100);
      p.orbitControl();

      if (isPlaying) {
        currentFrame = p.floor((p.frameCount % numFrames) / 3);
      }

      const currentData = currentAnimation === 2 ? pullingwalls2 : pullingwalls; // Use 2 first
      drawHandLandmarks(currentData[currentFrame]);
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
      p.scale(700);
      p.translate(-landmarks.centroid.x, -landmarks.centroid.y, -landmarks.centroid.z);

      // Enhanced lighting setup for shiny material
      p.directionalLight(255, 255, 255, 0, 1, -1);
      p.pointLight(255, 255, 255, 0, 0, 50);
      p.ambientLight(100, 100, 100);

      landmarks.hands.forEach((hand, index) => {
        const handColor = index === 0 ? 
          p.color('#F5D0FF') :  // Left hand
          p.color('#FFE090');   // Right hand
        
        // Draw connections
        p.stroke(handColor);
        p.strokeWeight(4);
        for (const connection of HAND_CONNECTIONS) {
          const pt0 = hand[connection[0]];
          const pt1 = hand[connection[1]];
          p.line(pt0.x, pt0.y, pt0.z, pt1.x, pt1.y, pt1.z);
        }
        
        // Draw spheres
        p.noStroke();
        p.specularMaterial(handColor);
        p.shininess(50);
        
        for (const landmark of hand) {
          p.push();
          p.translate(landmark.x, landmark.y, landmark.z);
          p.sphere(0.008);
          p.pop();
        }
      });
      
      p.pop();
    };

    // Resize handling
    p.windowResized = () => {
      const eltSize = getCanvasSize(selector);
      p.resizeCanvas(eltSize.width, eltSize.height);
    };
  }
}

// Utility functions
function getHostElement(selector="#sketch") {
  return document.querySelector(selector);
}

function getCanvasSize(selector="#sketch") {
  const host = getHostElement(selector);
  if (!host) {
    return { width: 800, height: 400 };
  }
  const rect = host.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

function createSketch(selector, createSketchFun) {
  const host = getHostElement(selector);
  new p5(createSketchFun(selector), host);
}

// Initialize on page load
function onReady() {
  createSketch('#hand-sketch-placeholder', pullingwalls);
}

// Add CSS for the switch button
const style = document.createElement('style');
style.textContent = `
  .animation-label {
    position: absolute;
    top: 20px;
    left: 20px;
    color: white;
    font-family: 'Karla', sans-serif;
    font-size: 16px;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    z-index: 1000;
  }

  .switch-btn {
    position: absolute;
    bottom: 20px;
    right: 70px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    transition: background-color 0.3s ease;
  }

  .switch-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .switch-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  }
`;
document.head.appendChild(style);

if (document.readyState === 'complete') {
  onReady();
} else {
  document.addEventListener("DOMContentLoaded", onReady);
} 