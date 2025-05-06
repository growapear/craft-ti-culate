const tileSize = 95;

const tiles = [
  // Left vertical
  { name: 'c', col: 3, row: 0 },
  { name: 'r', col: 3, row: 1 },
  { name: 'a', col: 3, row: 2 },
  { name: 'f', col: 3, row: 3 },
  { name: 'pink', col: 4, row: 3 },

  // Base line - adjusted positions to prevent overlap
  { name: 'green', col: 2, row: 4 },
  { name: 't', col: 3, row: 4 },
  { name: 'i', col: 4, row: 4 },
  { name: 'cs', col: 5, row: 4 },
  { name: 'u', col: 6, row: 4 },
  { name: 'l', col: 7, row: 4 },
  { name: 'a', col: 8, row: 4 },
  { name: 't', col: 9, row: 4 },
  { name: 'e', col: 10, row: 4 },
  { name: 'blue', col: 10, row: 3 },

  // Red square base
  { name: 'red', col: 3, row: 5 },
  { name: 'lightgreen', col: 10, row: 5 }
];

let clickCount = 0;

function handleClick() {
  clickCount++;
  if (clickCount === 1) {
    // First click - shuffle and fade out ICSUL
    shuffleAndFadeOut();
  } else if (clickCount === 2) {
    // Second click - add archive and gesture
    addNewTiles();
  } else if (clickCount === 3) {
    // Third click - horizontal arrangement
    horizontalArrangement();
    document.removeEventListener('click', handleClick);
  }
}

function shuffleAndFadeOut() {
  const tileElements = document.querySelectorAll('.tile');
  
  tileElements.forEach(el => {
    const name = el.querySelector('img').alt;
    const col = parseInt(el.style.left) / tileSize;
    
    el.style.zIndex = '100';
    el.classList.add('shuffling');
    
    // Random position during shuffle
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 200;
    const randomRotate = Math.random() * 180 - 90;
    el.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
    
    // Return to original position or fade out
    setTimeout(() => {
      if ((name === 'i' && col === 4) || 
          (name === 'cs' && col === 5) ||
          (name === 'u' && col === 6) || 
          (name === 'l' && col === 7)) {
        el.classList.add('fade-out');
        setTimeout(() => el.remove(), 500);
      } else {
        el.style.transform = 'none';
      }
    }, 500);
  });
}

function addNewTiles() {
  const wrapper = document.getElementById('tileWrapper');
  
  // Create and add archive.svg
  const archiveTile = document.createElement('div');
  archiveTile.className = 'tile new-tile';
  archiveTile.style.left = `${4 * tileSize}px`; // col 4, next to t.svg
  archiveTile.style.top = `${4 * tileSize}px`;  // row 4, below pink.svg
  archiveTile.style.width = `${2 * tileSize}px`; // Width of 2 tiles

  const archiveImg = document.createElement('img');
  archiveImg.src = 'assets/svgs/archive.svg';
  archiveImg.alt = 'archive';

  archiveTile.appendChild(archiveImg);
  wrapper.appendChild(archiveTile);

  // Create and add gesture.svg
  const gestureTile = document.createElement('div');
  gestureTile.className = 'tile new-tile';
  gestureTile.style.left = `${6.2 * tileSize}px`; // Moved slightly right to create gap
  gestureTile.style.top = `${4 * tileSize}px`;  // same row as archive.svg
  gestureTile.style.width = `${1.5 * tileSize}px`; // Reduced width to prevent overlap

  const gestureImg = document.createElement('img');
  gestureImg.src = 'assets/svgs/gesture.svg';
  gestureImg.alt = 'gesture';

  gestureTile.appendChild(gestureImg);
  wrapper.appendChild(gestureTile);

  // Fade in both tiles simultaneously
  setTimeout(() => {
    archiveTile.classList.remove('new-tile');
    gestureTile.classList.remove('new-tile');
  }, 100);

  // Add the text at the bottom
  const textDiv = document.createElement('div');
  textDiv.className = 'info-text new-tile';
  textDiv.style.position = 'absolute';
  textDiv.style.left = '50%';
  textDiv.style.bottom = '100px';
  textDiv.style.transform = 'translateX(-50%)';
  textDiv.style.fontFamily = 'Karla, sans-serif';
  textDiv.style.fontSize = '12pt';
  textDiv.style.textAlign = 'center';
  textDiv.style.opacity = '0';
  textDiv.style.zIndex = '1000';
  textDiv.innerHTML = `This archive recognizes gestures through your webcam.<br>
                      All data stays local — no video is stored or sent.`;

  document.body.appendChild(textDiv);
}

function horizontalArrangement() {
  const wrapper = document.getElementById('tileWrapper');
  const tileElements = document.querySelectorAll('.tile');
  
  // Calculate center position
  const totalTiles = 12; // Total number of tiles in final arrangement
  const totalWidth = totalTiles * tileSize; // Total width of all tiles
  const startX = (wrapper.offsetWidth - totalWidth) / 2; // Starting X position to center
  
  // First arrange existing tiles
  const keepTiles = [
    { name: 'c', col: 0 },
    { name: 'r', col: 1 },
    { name: 'pink', col: 2 },
    { name: 'f', col: 3 },
    { name: 't', col: 4 },
    { name: 'green', col: 5 }
  ];

  // Handle existing tiles first
  tileElements.forEach(el => {
    const name = el.querySelector('img').alt;
    const shouldKeep = keepTiles.some(tile => tile.name === name);
    
    if (!shouldKeep) {
      el.classList.add('fade-out');
      setTimeout(() => el.remove(), 500);
      return;
    }
    
    el.style.zIndex = '100';
    el.classList.add('shuffling');
    
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 200;
    const randomRotate = Math.random() * 180 - 90;
    el.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
    
    setTimeout(() => {
      const targetTile = keepTiles.find(t => t.name === name);
      el.style.transform = 'none';
      el.style.left = `${startX + (targetTile.col * tileSize)}px`;
      el.style.top = `${3 * tileSize}px`;
    }, 500);
  });

  // Add back the CULT tiles after a delay
  setTimeout(() => {
    const cultTiles = [
      { name: 'cs', col: 6 },
      { name: 'u', col: 7 },
      { name: 'l', col: 8 },
      { name: 't', col: 10 }
    ];

    cultTiles.forEach((tile, index) => {
      const el = document.createElement('div');
      el.className = 'tile new-tile';
      el.style.left = `${startX + (tile.col * tileSize)}px`;
      el.style.top = `${3 * tileSize}px`;

      const img = document.createElement('img');
      img.src = `assets/svgs/${tile.name}.svg`;
      img.alt = tile.name;

      el.appendChild(img);
      wrapper.appendChild(el);

      setTimeout(() => el.classList.remove('new-tile'), index * 150);
    });

    // Add the final tiles
    const finalTiles = [
      { name: 'a', col: 9 },
      { name: 'blue', col: 11 }
    ];

    finalTiles.forEach((tile, index) => {
      const el = document.createElement('div');
      el.className = 'tile new-tile';
      el.style.left = `${startX + (tile.col * tileSize)}px`;
      el.style.top = `${3 * tileSize}px`;

      const img = document.createElement('img');
      img.src = `assets/svgs/${tile.name}.svg`;
      img.alt = tile.name;

      el.appendChild(img);
      wrapper.appendChild(el);

      setTimeout(() => el.classList.remove('new-tile'), (index + 4) * 150);
    });

    // Add enter.svg in the middle below horizontal line
    const enterLink = document.createElement('a');
    enterLink.href = './gestures.html'; // Link to gestures.html instead of .js file
    enterLink.style.textDecoration = 'none';
    enterLink.style.cursor = 'pointer';
    enterLink.style.position = 'absolute';
    enterLink.style.left = `${startX + (4.5 * tileSize)}px`;
    enterLink.style.top = `${5 * tileSize}px`;
    enterLink.style.zIndex = '500';

    // Create an onclick handler to prevent default behavior
    enterLink.onclick = (e) => {
      e.preventDefault();
      window.location.href = './gestures.html';
    };

    const enterTile = document.createElement('div');
    enterTile.className = 'tile new-tile';
    enterTile.style.width = '307px';
    enterTile.style.height = '61px';
    enterTile.style.borderRadius = '33px';
    enterTile.style.transition = 'transform 0.2s ease'; // Add hover transition

    const enterImg = document.createElement('img');
    enterImg.src = 'assets/svgs/enter.svg';
    enterImg.alt = 'enter';
    enterImg.style.width = '100%';
    enterImg.style.height = '100%';
    enterImg.style.objectFit = 'fill';
    enterImg.style.borderRadius = '33px';

    enterTile.appendChild(enterImg);
    enterLink.appendChild(enterTile);
    wrapper.appendChild(enterLink);

    // Add the text at the bottom
    const textDiv = document.createElement('div');
    textDiv.className = 'info-text new-tile';
    textDiv.style.position = 'absolute';
    textDiv.style.left = '50%';
    textDiv.style.bottom = '100px';
    textDiv.style.transform = 'translateX(-50%)';
    textDiv.style.fontFamily = 'Karla, sans-serif';
    textDiv.style.fontSize = '12pt';
    textDiv.style.textAlign = 'center';
    textDiv.style.opacity = '0';
    textDiv.style.zIndex = '1000';
    textDiv.innerHTML = `This archive recognizes gestures through your webcam.<br>
                        All data stays local — no video is stored or sent.`;

    document.body.appendChild(textDiv);

    // Fade in both elements
    setTimeout(() => {
      enterTile.classList.remove('new-tile');
      textDiv.style.opacity = '1';
      textDiv.style.transition = 'opacity 0.3s ease';
    }, 150);
  }, 1000);
}

function loadTiles() {
  const wrapper = document.getElementById('tileWrapper');

  tiles.forEach(tile => {
    const el = document.createElement('div');
    el.className = 'tile';
    el.style.left = `${tile.col * tileSize}px`;
    el.style.top = `${tile.row * tileSize}px`;

    const img = document.createElement('img');
    img.src = `assets/svgs/${tile.name}.svg`;
    img.alt = tile.name;

    el.appendChild(img);
    wrapper.appendChild(el);
  });

  // Add click handler for both animations
  document.addEventListener('click', handleClick);
}

loadTiles();
