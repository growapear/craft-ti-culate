const categoryStructure = {
    'gesture-type': {
      name: 'Hand Use',
      subcategories: ['Single-Hand', 'Double-Hand'],
      color: 'purple'
    },
    'technique': {
      name: 'Technique',
      subcategories: ['Wheel Throwing'],
      color: 'green'
    },
    'function': {
      name: 'Stage',
      subcategories: ['Shaping', 'Trimming', 'Finishing'],
      color: 'red'
    },
    'application': {
      name: 'Application',
      subcategories: ['Vase', 'Bowl', 'Mug'],
      color: 'pink'
    },
    'cultural': {
      name: 'Cultural Context',
      subcategories: ['Contemporary'],
      color: 'yellow'
    }
  };
  
  fetch('pottery_gesture.csv')
    .then(res => res.text())
    .then(csv => {
      const gestures = Papa.parse(csv, { header: true }).data;
      showAllGestures(gestures);
      setupEventListeners(gestures);
    });
  
  function showAllGestures(gestures) {
    const container = document.getElementById('tiles-container');
    container.innerHTML = '';
    const shuffled = [...gestures].sort(() => Math.random() - 0.5);
  
    shuffled.forEach((gesture, i) => {
      const tile = document.createElement('div');
      const image = document.createElement('img');
      const defaultIcon = `assets/icons/${gesture.icon_default}`;
      const hoverIcon = `assets/icons/${gesture.icon_hover}`;
  
      tile.className = `w-24 h-24 m-2 rounded-lg shadow-md cursor-pointer overflow-hidden flex justify-center items-center relative group bg-white`;
  
      image.src = defaultIcon;
      image.alt = gesture['Gesture Name'];
      image.className = 'w-full h-full object-contain p-2';
      image.onmouseenter = () => image.src = hoverIcon;
      image.onmouseleave = () => image.src = defaultIcon;
  
      tile.onclick = () => showGestureDetails(gesture);
  
      tile.appendChild(image);
      container.appendChild(tile);
    });
  }
  
  function showGestureDetails(gesture) {
    document.getElementById('gesture-title').textContent = gesture['Gesture Name'];
    document.getElementById('gesture-category').textContent = gesture['Stage'];
    document.getElementById('gesture-subcategory').textContent = gesture['Hand Use'];
    document.getElementById('gesture-description').textContent = gesture['Description'];
    document.getElementById('popup').classList.remove('hidden');
    document.getElementById('popup').classList.add('flex');
  }
  
  document.getElementById('close-btn').onclick = () => {
    document.getElementById('popup').classList.add('hidden');
    document.getElementById('popup').classList.remove('flex');
  };
  
  document.getElementById('reset-btn').onclick = () => {
    document.getElementById('subcategories').classList.add('hidden');
    document.getElementById('subcategories').innerHTML = '';
    showAllGestures(window.cachedGestures);
  };
  
  function setupEventListeners(gestures) {
    window.cachedGestures = gestures;
  
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.onclick = () => {
        const category = btn.getAttribute('data-category');
        showSubcategories(category, gestures);
        filterAndShowGestures(gestures, category, 'all');
      };
    });
  }
  
  function showSubcategories(category, gestures) {
    const subCatBox = document.getElementById('subcategories');
    subCatBox.classList.remove('hidden');
    subCatBox.innerHTML = '';
  
    categoryStructure[category].subcategories.forEach(sub => {
      const btn = document.createElement('button');
      btn.className = `px-3 py-1 rounded-lg bg-${categoryStructure[category].color}-200 hover:bg-${categoryStructure[category].color}-300`;
      btn.textContent = sub;
      btn.onclick = () => filterAndShowGestures(gestures, category, sub);
      subCatBox.appendChild(btn);
    });
  }
  
  function filterAndShowGestures(gestures, category, subcategory) {
    const map = {
      'gesture-type': 'Hand Use',
      'technique': 'Technique',
      'function': 'Stage',
      'application': 'Application',
      'cultural': 'Cultural'
    };
  
    const col = map[category];
    const filtered = (subcategory === 'all') ? gestures : gestures.filter(g => g[col] && g[col].includes(subcategory));
    showAllGestures(filtered);
  }
  