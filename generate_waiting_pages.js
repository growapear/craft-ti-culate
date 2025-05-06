const fs = require('fs');
const path = require('path');
const unimplementedGestures = [
    'handonwheelplacement',
    'balltap',
    'palmhug',
    'coiling',
    'beveling',
    'smoothing',
    'pressing',
    'scoring',
    'rolling',
    'joining',
    'wedging',
    'slabpressing',
    'blendingcoil',
    'palmdomepress',
    'sidewallpress',
    'stamping',
    'incising'
  ];
// Read the template file
const template = fs.readFileSync('gestures/waiting_template.html', 'utf8');

// Create waiting pages for each gesture
unimplementedGestures.forEach(gesture => {
  // Format the gesture name for display
  const displayName = gesture
    .replace(/([A-Z])/g, ' $1')
    .split(/[_-\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Create the new file content
  const newFileContent = template
    .replace('[GESTURE_NAME]', displayName)
    .replace('Record Gesture', displayName);

  // Write the new file
  const filePath = path.join('gestures', `${gesture}.html`);
  fs.writeFileSync(filePath, newFileContent);
  console.log(`Created ${filePath}`);
}); 