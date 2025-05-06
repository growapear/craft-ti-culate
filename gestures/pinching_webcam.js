const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('output-canvas');
const canvasCtx = canvasElement.getContext('2d');
const instructionElement = document.getElementById('instruction');

// Configure canvas size to match video
const container = document.querySelector('.webcam-container');
const rect = container.getBoundingClientRect();
canvasElement.width = rect.width;
canvasElement.height = rect.height;

// Initialize hands module
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
  }
});

// Configure hands module
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.7
});

// Set up callback for hand detection results
hands.onResults(onResults);

// Initialize camera
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: rect.width,
  height: rect.height
});

// Start camera
camera.start()
  .then(() => {
    console.log('Camera started successfully');
  })
  .catch(error => {
    console.error('Error starting camera:', error);
    // Show error message to user
    instructionElement.innerHTML = `
      <h2>Camera Error</h2>
      <p>Please make sure you've allowed camera access<br>and refresh the page</p>
    `;
  });

// Handle detection results
async function onResults(results) {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.save();

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    // Hand detected, show match
    let labelDiv = document.querySelector('.gesture-label');
    if (!labelDiv) {
      labelDiv = document.createElement('div');
      labelDiv.className = 'gesture-label';
      document.querySelector('.webcam-container').appendChild(labelDiv);
    }

    // Show matched message
    labelDiv.innerHTML = `
      <div style="color: #E3A2F4; font-size: 28px;">Matched!</div>
      <div style="color: white; font-size: 20px;">Pinching</div>
    `;
    labelDiv.style.background = 'rgba(255, 255, 255, 0.9)';

    // Draw hand landmarks in green
    drawConnectors(canvasCtx, results.multiHandLandmarks[0], HAND_CONNECTIONS, {
      color: '#00FF00',
      lineWidth: 3
    });
    
    drawLandmarks(canvasCtx, results.multiHandLandmarks[0], {
      color: '#FFFFFF',
      lineWidth: 2,
      radius: 4,
      fillColor: '#00FF00'
    });

    // Hide instruction box
    instructionElement.style.opacity = '0';
    setTimeout(() => instructionElement.style.display = 'none', 300);
  } else {
    // Remove match label when no hand detected
    const labelDiv = document.querySelector('.gesture-label');
    if (labelDiv) labelDiv.remove();
    
    // Show instruction box
    instructionElement.style.display = 'block';
    instructionElement.style.opacity = '1';
  }
  canvasCtx.restore();
}

// Handle window resize
window.addEventListener('resize', () => {
  const rect = container.getBoundingClientRect();
  canvasElement.width = rect.width;
  canvasElement.height = rect.height;
});

// Initialize everything
window.addEventListener('load', async () => {
    console.log("Page loaded, starting initialization...");
    
    if (typeof loadGestureModel === 'undefined') {
        console.error("loadGestureModel not found! Check if live_prediction.js is loaded");
        return;
    }

    console.log("Loading model...");
    const modelLoaded = await loadGestureModel();
    console.log("Model load result:", modelLoaded);
    
    if (modelLoaded) {
        console.log("Starting camera...");
        camera.start();
    } else {
        console.error("Failed to load gesture model");
        instructionElement.innerHTML = `
            <h2>Model Error</h2>
            <p>Failed to load gesture recognition model.<br>Please refresh the page.</p>
        `;
    }
}); 