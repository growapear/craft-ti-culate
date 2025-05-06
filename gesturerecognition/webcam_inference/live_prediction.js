let gestureModel;
const gestureLabels = ["Pinching", "Ball Kneading"]; // Your trained gestures

// Load model
async function loadGestureModel() {
    try {
        console.log("Starting model load...");
        // Try absolute path from root
        const modelPath = '/gesturerecognition/webcam_inference/model.json';
        console.log("Loading model from:", modelPath);
        
        gestureModel = await tf.loadLayersModel(modelPath);
        console.log('Model loaded successfully:', gestureModel);
        return true;
    } catch (error) {
        console.error('Error loading model:', error);
        console.error('Current path:', window.location.pathname);
        return false;
    }
}

// Process landmarks and predict if pinching
async function predictGesture(landmarks) {
    if (!gestureModel) {
        console.error("Model not loaded!");
        return null;
    }
    if (!landmarks) {
        console.error("No landmarks provided!");
        return null;
    }

    try {
        console.log("Processing landmarks:", landmarks);
        // Normalize landmarks
        const normalizedLandmarks = landmarks.map(point => ({
            x: point.x,
            y: point.y,
            z: point.z || 0
        }));

        // Flatten landmarks
        const flatLandmarks = normalizedLandmarks.reduce((arr, point) => {
            arr.push(point.x, point.y, point.z);
            return arr;
        }, []);

        // Get prediction
        const inputTensor = tf.tensor2d([flatLandmarks]);
        const prediction = await gestureModel.predict(inputTensor);
        const probabilities = await prediction.data();
        
        // Get highest probability and its gesture
        const maxProbability = Math.max(...probabilities);
        const gestureIndex = probabilities.indexOf(maxProbability);
        
        // Cleanup
        inputTensor.dispose();
        prediction.dispose();

        return {
            gesture: gestureLabels[gestureIndex],
            probability: (maxProbability * 100).toFixed(0), // Round to whole number
            isMatched: maxProbability > 0.8 // Consider it matched if > 80%
        };
    } catch (error) {
        console.error('Prediction error:', error);
        return null;
    }
} 