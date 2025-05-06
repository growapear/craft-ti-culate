const implementedGestures = [
  'spongerefinement',
  'thumbopening', 
  'throwclayonwheel',
  'ribshapingout',
  'ribshapingin',
  'pullingwalls',
  'pinching',
  'palmrolling',
  'centeringpress',
  'coneuppull',
  'ballkneading'
];

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid-container');
  console.log('Grid container styles:', window.getComputedStyle(grid));
  console.log('Is display:grid?', window.getComputedStyle(grid).display === 'grid');
  
  // First load the categories.csv data
  fetch('categories.csv')
    .then(response => response.text())
    .then(categoriesData => {
      window.categoriesData = categoriesData;
      console.log('Categories data loaded');
      
      // Map category names to icon filenames
      const categoryMapping = {
        'Stage': 'stage',
        'Hand Use': 'handuse',
        'Technique': 'technique',
        'Application': 'application',
        'Cultural': 'cultural'
      };

      // Add category icons at the top with click handlers
      const categoryIcons = [
        { x: 2, y: 1, svg: 'technique', label: 'Technique' },
        { x: 3, y: 1, svg: 'handuse', label: 'Hand Use' },
        { x: 4, y: 1, svg: 'stage', label: 'Stage' },
        { x: 5, y: 1, svg: 'application', label: 'Application' },
        { x: 6, y: 1, svg: 'cultural', label: 'Context' },
        { x: 7, y: 1, svg: 'reset', label: 'Reset' }
      ];

      // Create category icons with click handlers
      categoryIcons.forEach(icon => {
        const categoryTile = document.createElement('div');
        categoryTile.className = 'category-tile';
        
        // Use absolute positioning for categories
        categoryTile.style.position = 'absolute';
        categoryTile.style.left = `${(icon.x - 1) * 120 + 20}px`; // Same horizontal spacing as tiles
        
        // Keep categories high up
        categoryTile.style.top = `-30px`; // Negative value to move them up
        
        const svgWrapper = document.createElement('div');
        svgWrapper.className = 'category-svg';
        
        const img = document.createElement('img');
        img.src = `assets/svgs/icons/${icon.svg}.svg`;
        img.alt = icon.label;
        
        // Add click handler for filtering
        categoryTile.addEventListener('click', () => {
          // First, show all tiles regardless of which category was clicked
          document.querySelectorAll('.gesture-link').forEach(link => {
            link.style.display = 'block';
          });
          
          if (icon.svg === 'reset') {
            // Remove any existing subcategory buttons
            document.querySelectorAll('.subcategory-btn').forEach(btn => {
              btn.remove();
            });
          } else {
            // Remove any existing subcategory buttons
            document.querySelectorAll('.subcategory-btn').forEach(btn => {
              btn.remove();
            });
            
            // Show subcategory buttons for this category
            if (icon.label === 'Technique') {
              showTechniqueSubcategories();
            } else if (icon.label === 'Hand Use') {
              showHandUseSubcategories();
            } else if (icon.label === 'Stage') {
              showStageSubcategories();
            } else if (icon.label === 'Application') {
              showApplicationSubcategories();
            } else if (icon.label === 'Context') {
              showContextSubcategories();
            }
          }
        });
        
        svgWrapper.appendChild(img);
        categoryTile.appendChild(svgWrapper);
        grid.appendChild(categoryTile);
      });

      // Function to show Technique subcategories
      function showTechniqueSubcategories() {
        const subcategories = ['Wheel Throwing', 'Handbuilding'];
        
        // Find the technique category tile to position buttons relative to it
        const techniqueTile = document.querySelector('.category-tile img[alt="Technique"]').closest('.category-tile');
        const techniqueRect = techniqueTile.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        
        // Calculate position relative to the grid
        const relativeTop = techniqueRect.bottom - gridRect.top + 10; // 10px below the technique category
        const relativeLeft = techniqueRect.left - gridRect.left;
        
        // Calculate button width and spacing
        const buttonWidth = 112;
        const buttonSpacing = 8; // Space between buttons
        const totalFirstRowWidth = (buttonWidth * 3) + (buttonSpacing * 2);
        const firstRowStartLeft = relativeLeft - (totalFirstRowWidth / 2) + (buttonWidth / 2);
        
        // Calculate second row positioning (centered under first row)
        const totalSecondRowWidth = (buttonWidth * 2) + buttonSpacing;
        const secondRowStartLeft = relativeLeft - (totalSecondRowWidth / 2) + (buttonWidth / 2);
        
        // Create buttons for each subcategory in a 2-row layout (3 in first row, 2 in second)
        subcategories.forEach((subcategory, index) => {
          const btn = document.createElement('button');
          btn.textContent = subcategory;
          btn.className = 'subcategory-btn technique-subcategory-btn';
          
          // Set position properties via inline styles
          btn.style.position = 'absolute';
          
          if (index < 3) {
            // First row (3 buttons)
            btn.style.left = `${firstRowStartLeft + (index * (buttonWidth + buttonSpacing))}px`;
            btn.style.top = `${relativeTop}px`;
          } else {
            // Second row (2 buttons)
            btn.style.left = `${secondRowStartLeft + ((index - 3) * (buttonWidth + buttonSpacing))}px`;
            btn.style.top = `${relativeTop + 30}px`; // 30px below first row
          }
          
          // Force the styling directly in the JavaScript with yellow background for Technique
          btn.style.width = `${buttonWidth}px`;
          btn.style.height = '23px';
          btn.style.borderRadius = '15px';
          btn.style.border = '1px solid #DCDCDC';
          btn.style.backgroundColor = '#FFE090'; // Yellow background for Technique
          btn.style.color = '#1C1A2C';
          btn.style.textAlign = 'center';
          btn.style.fontFamily = 'Karla, sans-serif';
          btn.style.fontSize = '13px';
          btn.style.cursor = 'pointer';
          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'center';
          
          // Add click handler for filtering
          btn.addEventListener('click', () => {
            filterByTechnique(subcategory);
            
            // Highlight selected button
            document.querySelectorAll('.technique-subcategory-btn').forEach(b => {
              b.classList.remove('selected');
              // Reset background color for non-selected buttons
              b.style.backgroundColor = '#FFE090';
            });
            btn.classList.add('selected');
            // Slightly darker yellow for selected button
            btn.style.backgroundColor = '#FFC85C';
          });
          
          grid.appendChild(btn);
        });
      }

      // Function to filter tiles by technique
      function filterByTechnique(technique) {
        // Hide all tiles first
        document.querySelectorAll('.gesture-link').forEach(link => {
          link.style.display = 'none';
        });
        
        // Then show only matching tiles
        const rows = window.categoriesData.split('\n').map(row => row.split(','));
        const headers = rows[0];
        
        // Find the index of the Technique column
        const techniqueIndex = headers.findIndex(h => h === 'Technique');
        if (techniqueIndex === -1) return;
        
        // Filter gestures that match the technique
        const matchingGestures = rows.slice(1).filter(row => {
          if (row.length <= techniqueIndex) return false;
          
          // Get the technique value from the CSV
          const cellValue = row[techniqueIndex];
          if (!cellValue) return false;
          
          // If the technique is "All", include this gesture for any technique
          if (cellValue.trim() === 'All') {
            return true;
          }
          
          // Split by comma and check if any value matches
          const techniques = cellValue.split(',').map(tech => tech.trim());
          return techniques.includes(technique);
        });
        
        // Show matching tiles
        matchingGestures.forEach(gesture => {
          const gestureName = gesture[0].trim().toLowerCase().replace(/[\s()-]+/g, '');
          const tile = document.querySelector(`.gesture-tile[data-svg-name="${gestureName}"]`);
          
          if (tile) {
            const link = tile.closest('.gesture-link');
            if (link) {
              link.style.display = 'block';
            }
          }
        });
      }

      // Function to show Hand Use subcategories
      function showHandUseSubcategories() {
        const subcategories = ['Double-Hand', 'Single-Hand'];
        
        // Find the Hand Use category tile to position buttons relative to it
        const handUseTile = document.querySelector('.category-tile img[alt="Hand Use"]').closest('.category-tile');
        const handUseRect = handUseTile.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        
        // Calculate position relative to the grid
        const relativeTop = handUseRect.bottom - gridRect.top + 10; // 10px below the hand use category
        const relativeLeft = handUseRect.left - gridRect.left;
        
        // Calculate button width and spacing
        const buttonWidth = 112;
        const buttonSpacing = 8; // Space between buttons
        const totalFirstRowWidth = (buttonWidth * 3) + (buttonSpacing * 2);
        const firstRowStartLeft = relativeLeft - (totalFirstRowWidth / 2) + (buttonWidth / 2);
        
        // Calculate second row positioning (centered under first row)
        const totalSecondRowWidth = (buttonWidth * 2) + buttonSpacing;
        const secondRowStartLeft = relativeLeft - (totalSecondRowWidth / 2) + (buttonWidth / 2);
        
        // Create buttons for each subcategory in a 2-row layout (3 in first row, 2 in second)
        subcategories.forEach((subcategory, index) => {
          const btn = document.createElement('button');
          btn.textContent = subcategory;
          btn.className = 'subcategory-btn handuse-subcategory-btn';
          
          // Set position properties via inline styles
          btn.style.position = 'absolute';
          
          if (index < 3) {
            // First row (3 buttons)
            btn.style.left = `${firstRowStartLeft + (index * (buttonWidth + buttonSpacing))}px`;
            btn.style.top = `${relativeTop}px`;
          } else {
            // Second row (2 buttons)
            btn.style.left = `${secondRowStartLeft + ((index - 3) * (buttonWidth + buttonSpacing))}px`;
            btn.style.top = `${relativeTop + 30}px`; // 30px below first row
          }
          
          // Force the styling directly in the JavaScript with green background for Hand Use
          btn.style.width = `${buttonWidth}px`;
          btn.style.height = '23px';
          btn.style.borderRadius = '15px';
          btn.style.border = '1px solid #DCDCDC';
          btn.style.backgroundColor = '#BAF298'; // Green background for Hand Use
          btn.style.color = '#1C1A2C';
          btn.style.textAlign = 'center';
          btn.style.fontFamily = 'Karla, sans-serif';
          btn.style.fontSize = '13px';
          btn.style.cursor = 'pointer';
          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'center';
          
          // Add click handler for filtering
          btn.addEventListener('click', () => {
            filterByHandUse(subcategory);
            
            // Highlight selected button
            document.querySelectorAll('.handuse-subcategory-btn').forEach(b => {
              b.classList.remove('selected');
              // Reset background color for non-selected buttons
              b.style.backgroundColor = '#BAF298';
            });
            btn.classList.add('selected');
            // Slightly darker green for selected button
            btn.style.backgroundColor = '#A2E57A';
          });
          
          grid.appendChild(btn);
        });
      }

      // Function to filter tiles by hand use
      function filterByHandUse(handUse) {
        // Hide all tiles first
        document.querySelectorAll('.gesture-link').forEach(link => {
          link.style.display = 'none';
        });
        
        // Then show only matching tiles
        const rows = window.categoriesData.split('\n').map(row => row.split(','));
        const headers = rows[0];
        
        // Find the index of the Hand Use column
        const handUseIndex = headers.findIndex(h => h === 'Hand Use');
        if (handUseIndex === -1) return;
        
        // Filter gestures that match the hand use
        const matchingGestures = rows.slice(1).filter(row => {
          if (row.length <= handUseIndex) return false;
          
          // Get the hand use value from the CSV
          const cellValue = row[handUseIndex];
          if (!cellValue) return false;
          
          // If the hand use is "All", include this gesture for any hand use
          if (cellValue.trim() === 'All') {
            return true;
          }
          
          // Split by comma and check if any value matches
          const handUses = cellValue.split(',').map(use => use.trim());
          return handUses.includes(handUse);
        });
        
        // Show matching tiles
        matchingGestures.forEach(gesture => {
          const gestureName = gesture[0].trim().toLowerCase().replace(/[\s()-]+/g, '');
          const tile = document.querySelector(`.gesture-tile[data-svg-name="${gestureName}"]`);
          
          if (tile) {
            const link = tile.closest('.gesture-link');
            if (link) {
              link.style.display = 'block';
            }
          }
        });
      }

      // Function to show Stage subcategories
      function showStageSubcategories() {
        const subcategories = ['Shaping', 'Finishing', 'Preparation', 'Joining', 'Decorating'];
        
        // Find the Stage category tile to position buttons relative to it
        const stageTile = document.querySelector('.category-tile img[alt="Stage"]').closest('.category-tile');
        const stageRect = stageTile.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        
        // Calculate position relative to the grid
        const relativeTop = stageRect.bottom - gridRect.top + 10; // 10px below the stage category
        const relativeLeft = stageRect.left - gridRect.left;
        
        // Calculate button width and spacing
        const buttonWidth = 112;
        const buttonSpacing = 8; // Space between buttons
        const totalFirstRowWidth = (buttonWidth * 3) + (buttonSpacing * 2);
        const firstRowStartLeft = relativeLeft - (totalFirstRowWidth / 2) + (buttonWidth / 2);
        
        // Calculate second row positioning (centered under first row)
        const totalSecondRowWidth = (buttonWidth * 2) + buttonSpacing;
        const secondRowStartLeft = relativeLeft - (totalSecondRowWidth / 2) + (buttonWidth / 2);
        
        // Create buttons for each subcategory in a 2-row layout (3 in first row, 2 in second)
        subcategories.forEach((subcategory, index) => {
          const btn = document.createElement('button');
          btn.textContent = subcategory;
          btn.className = 'subcategory-btn stage-subcategory-btn';
          
          // Set position properties via inline styles
          btn.style.position = 'absolute';
          
          if (index < 3) {
            // First row (3 buttons)
            btn.style.left = `${firstRowStartLeft + (index * (buttonWidth + buttonSpacing))}px`;
            btn.style.top = `${relativeTop}px`;
          } else {
            // Second row (2 buttons)
            btn.style.left = `${secondRowStartLeft + ((index - 3) * (buttonWidth + buttonSpacing))}px`;
            btn.style.top = `${relativeTop + 30}px`; // 30px below first row
          }
          
          // Force the styling directly in the JavaScript with purple background for Stage
          btn.style.width = `${buttonWidth}px`;
          btn.style.height = '23px';
          btn.style.borderRadius = '15px';
          btn.style.border = '1px solid #DCDCDC';
          btn.style.backgroundColor = '#E3A2F4'; // Purple background for Stage
          btn.style.color = '#1C1A2C';
          btn.style.textAlign = 'center';
          btn.style.fontFamily = 'Karla, sans-serif';
          btn.style.fontSize = '13px';
          btn.style.cursor = 'pointer';
          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'center';
          
          // Add click handler for filtering
          btn.addEventListener('click', () => {
            filterByStage(subcategory);
            
            // Highlight selected button
            document.querySelectorAll('.stage-subcategory-btn').forEach(b => {
              b.classList.remove('selected');
              // Reset background color for non-selected buttons
              b.style.backgroundColor = '#E3A2F4';
            });
            btn.classList.add('selected');
            // Slightly darker purple for selected button
            btn.style.backgroundColor = '#D07EF2';
          });
          
          grid.appendChild(btn);
        });
      }

      // Function to filter tiles by stage
      function filterByStage(stage) {
        const rows = window.categoriesData.split('\n').map(row => row.split(','));
        const headers = rows[0];
        
        // Find the index of the Stage column
        const stageIndex = headers.findIndex(h => h === 'Stage');
        if (stageIndex === -1) return;
        
        // Hide all tiles first
        document.querySelectorAll('.gesture-link').forEach(link => {
          link.style.display = 'none';
        });
        
        // Filter gestures that match the stage
        const matchingGestures = rows.slice(1).filter(row => {
          if (row.length <= stageIndex) return false;
          
          // Check if the stage matches
          const cellValue = row[stageIndex];
          if (!cellValue) return false;
          
          return cellValue.trim() === stage;
        });
        
        // Show matching tiles
        matchingGestures.forEach(gesture => {
          const gestureName = gesture[0].trim().toLowerCase().replace(/[\s()-]+/g, '');
          const tile = document.querySelector(`.gesture-tile[data-svg-name="${gestureName}"]`);
          
          if (tile) {
            const link = tile.closest('.gesture-link');
            if (link) {
              link.style.display = 'block';
            }
          }
        });
      }

      // Function to show Application subcategories
      function showApplicationSubcategories() {
        const subcategories = ['Vase', 'Bowl', 'Mug', 'Jar', 'Cup', 'Pot', 'Slab', 'Dish', 'Plate', 'Beads', 'Coils', 'Tile'];
        
        // Find the Application category tile to position buttons relative to it
        const applicationTile = document.querySelector('.category-tile img[alt="Application"]').closest('.category-tile');
        const applicationRect = applicationTile.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        
        // Calculate position relative to the grid
        const relativeTop = applicationRect.bottom - gridRect.top + 10; // 10px below the application category
        const relativeLeft = applicationRect.left - gridRect.left;
        
        // Create buttons for each subcategory in a grid layout (4 columns, 3 rows)
        subcategories.forEach((subcategory, index) => {
          const btn = document.createElement('button');
          btn.textContent = subcategory;
          btn.className = 'subcategory-btn application-subcategory-btn';
          
          // Set position properties via inline styles
          btn.style.position = 'absolute';
          
          // Calculate row and column for grid layout
          const column = index % 4; // 4 columns (0, 1, 2, 3)
          const row = Math.floor(index / 4); // 3 rows (0, 1, 2)
          
          // Position based on row and column
          btn.style.left = `${relativeLeft + (column * 120)}px`; // 120px horizontal spacing
          btn.style.top = `${relativeTop + (row * 30)}px`; // 30px vertical spacing
          
          // Force the styling directly in the JavaScript with blue background for Application
          btn.style.width = '112px';
          btn.style.height = '23px';
          btn.style.borderRadius = '15px';
          btn.style.border = '1px solid #DCDCDC';
          btn.style.backgroundColor = '#0052FF'; // Blue background for Application
          btn.style.color = '#FFFFFF'; // White text for better contrast on dark blue
          btn.style.textAlign = 'center';
          btn.style.fontFamily = 'Karla, sans-serif';
          btn.style.fontSize = '13px';
          btn.style.cursor = 'pointer';
          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'center';
          
          // Add click handler for filtering
          btn.addEventListener('click', () => {
            // Highlight selected button
            document.querySelectorAll('.application-subcategory-btn').forEach(b => {
              b.classList.remove('selected');
              // Reset background color for non-selected buttons
              b.style.backgroundColor = '#0052FF';
            });
            btn.classList.add('selected');
            // Slightly darker blue for selected button
            btn.style.backgroundColor = '#0042CC';
            
            // If it's the Bowl button, navigate to recipe.html
            if (subcategory === 'Bowl') {
              // Store the selected application in localStorage to use on the recipe page
              localStorage.setItem('selectedApplication', subcategory);
              
              // Navigate to the recipe page
              window.location.href = 'recipe.html';
            } else {
              // For other applications, just filter as before
              filterByApplication(subcategory);
            }
          });
          
          grid.appendChild(btn);
        });
      }

      // Function to filter tiles by application and load specific CSV for timeline sequence
      function filterByApplication(application) {
        console.log(`Filtering by application: ${application}`);
        
        // Hide all tiles first
        document.querySelectorAll('.gesture-link').forEach(link => {
          link.style.display = 'none';
        });
        
        // Format the application name for the CSV filename
        const formattedApplication = application.toLowerCase().replace(/\s+/g, '_');
        const csvPath = `subcat/${formattedApplication}_gestures.csv`;
        
        console.log(`Loading application-specific CSV: ${csvPath}`);
        
        // Load the specific CSV file for this application
        fetch(csvPath)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load ${csvPath}`);
            }
            return response.text();
          })
          .then(csvData => {
            console.log(`Successfully loaded ${csvPath}`);
            
            // Parse the CSV data
            const rows = csvData.split('\n').map(row => row.split(','));
            
            // Find the header row
            const headers = rows[0];
            
            // Find the index of the timeline_index column
            const timelineIndexCol = headers.findIndex(h => h.trim().toLowerCase() === 'timeline_index');
            const nameCol = headers.findIndex(h => h.trim().toLowerCase() === 'name' || h.trim().toLowerCase() === 'gesture name');
            const filenameCol = headers.findIndex(h => h.trim().toLowerCase() === 'filename');
            
            if (timelineIndexCol === -1 || nameCol === -1) {
              console.error('Required columns not found in CSV. Need "timeline_index" and "name" columns.');
              return;
            }
            
            // Create an array to track the order of gestures
            let orderedGestures = [];
            
            // Process each row in the CSV (skip header)
            rows.slice(1).forEach(row => {
              if (row.length > Math.max(timelineIndexCol, nameCol) && row[nameCol].trim()) {
                const gestureName = row[nameCol].trim();
                const filename = filenameCol !== -1 && row[filenameCol] ? row[filenameCol].trim() : null;
                const timelineIndex = parseInt(row[timelineIndexCol].trim(), 10);
                
                if (!isNaN(timelineIndex)) {
                  console.log(`Adding gesture to timeline: ${gestureName} (position ${timelineIndex})`);
                  orderedGestures.push({
                    name: gestureName,
                    filename: filename,
                    index: timelineIndex
                  });
                }
              }
            });
            
            // Sort gestures by timeline index
            orderedGestures.sort((a, b) => a.index - b.index);
            
            console.log('Ordered gestures:', orderedGestures);
            
            // Display the gestures in a timeline
            displayTimelineGestures(orderedGestures);
          })
          .catch(error => {
            console.error(`Error loading application-specific CSV: ${error}`);
            
            // Fallback to filtering from the main categories.csv if specific file fails to load
            console.log('Falling back to main categories.csv filtering');
            filterByApplicationFallback(application);
          });
      }

      // Function to display gestures in a timeline
      function displayTimelineGestures(orderedGestures) {
        // Get the grid container
        const grid = document.querySelector('.grid');
        
        // Save original state if not already saved
        if (!window.originalGridState) {
          window.originalGridState = {
            html: grid.innerHTML,
            style: grid.getAttribute('style') || ''
          };
        }
        
        // Clear the grid
        grid.innerHTML = '';
        
        // Set up the grid as a horizontal timeline
        grid.style.display = 'flex';
        grid.style.flexDirection = 'row';
        grid.style.alignItems = 'center';
        grid.style.justifyContent = 'flex-start';
        grid.style.overflowX = 'auto';
        grid.style.padding = '20px';
        grid.style.gap = '10px';
        
        // Create a timeline container
        const timelineContainer = document.createElement('div');
        timelineContainer.style.display = 'flex';
        timelineContainer.style.flexDirection = 'row';
        timelineContainer.style.alignItems = 'center';
        timelineContainer.style.position = 'relative';
        timelineContainer.style.width = 'fit-content';
        timelineContainer.style.minWidth = '100%';
        
        // Add a horizontal line
        const timelineLine = document.createElement('div');
        timelineLine.style.position = 'absolute';
        timelineLine.style.height = '3px';
        timelineLine.style.backgroundColor = '#0052FF';
        timelineLine.style.width = '100%';
        timelineLine.style.top = '50%';
        timelineLine.style.zIndex = '1';
        
        timelineContainer.appendChild(timelineLine);
        
        // Get all available gesture tiles
        const allGestureTiles = {};
        document.querySelectorAll('.gesture-tile').forEach(tile => {
          const svgName = tile.getAttribute('data-svg-name');
          if (svgName) {
            allGestureTiles[svgName.toLowerCase()] = tile.closest('.gesture-link');
          }
        });
        
        console.log('Available gesture tiles:', Object.keys(allGestureTiles));
        
        // Add each gesture to the timeline
        orderedGestures.forEach(gesture => {
          // Create a container for this gesture
          const gestureContainer = document.createElement('div');
          gestureContainer.style.display = 'flex';
          gestureContainer.style.flexDirection = 'column';
          gestureContainer.style.alignItems = 'center';
          gestureContainer.style.margin = '0 15px';
          gestureContainer.style.position = 'relative';
          gestureContainer.style.zIndex = '2';
          
          // Create the number indicator
          const numberIndicator = document.createElement('div');
          numberIndicator.textContent = gesture.index;
          numberIndicator.style.width = '30px';
          numberIndicator.style.height = '30px';
          numberIndicator.style.borderRadius = '50%';
          numberIndicator.style.backgroundColor = '#0052FF';
          numberIndicator.style.color = 'white';
          numberIndicator.style.display = 'flex';
          numberIndicator.style.alignItems = 'center';
          numberIndicator.style.justifyContent = 'center';
          numberIndicator.style.fontWeight = 'bold';
          numberIndicator.style.marginBottom = '10px';
          
          // Try to find the matching gesture tile
          let gestureTile = null;
          
          // Try by filename first
          if (gesture.filename && allGestureTiles[gesture.filename.toLowerCase()]) {
            gestureTile = allGestureTiles[gesture.filename.toLowerCase()];
          }
          
          // Try by normalized name
          if (!gestureTile) {
            const normalizedName = gesture.name.toLowerCase().replace(/[\s()-]+/g, '');
            if (allGestureTiles[normalizedName]) {
              gestureTile = allGestureTiles[normalizedName];
            }
          }
          
          // If we found a tile, clone it and add to the timeline
          if (gestureTile) {
            const clonedTile = gestureTile.cloneNode(true);
            clonedTile.style.display = 'block';
            clonedTile.style.backgroundColor = 'white';
            clonedTile.style.borderRadius = '10px';
            clonedTile.style.padding = '5px';
            clonedTile.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            
            // Add the gesture name below
            const gestureLabel = document.createElement('div');
            gestureLabel.textContent = gesture.name;
            gestureLabel.style.marginTop = '10px';
            gestureLabel.style.textAlign = 'center';
            gestureLabel.style.fontSize = '12px';
            gestureLabel.style.fontWeight = 'bold';
            gestureLabel.style.maxWidth = '100px';
            
            gestureContainer.appendChild(numberIndicator);
            gestureContainer.appendChild(clonedTile);
            gestureContainer.appendChild(gestureLabel);
            
            timelineContainer.appendChild(gestureContainer);
          } else {
            console.warn(`Could not find tile for gesture: ${gesture.name}`);
          }
        });
        
        grid.appendChild(timelineContainer);
        
        // Add a reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Return to Grid View';
        resetButton.style.position = 'fixed';
        resetButton.style.bottom = '20px';
        resetButton.style.right = '20px';
        resetButton.style.padding = '10px 15px';
        resetButton.style.backgroundColor = '#333';
        resetButton.style.color = 'white';
        resetButton.style.border = 'none';
        resetButton.style.borderRadius = '5px';
        resetButton.style.cursor = 'pointer';
        resetButton.style.zIndex = '1000';
        
        resetButton.addEventListener('click', () => {
          // Restore original grid
          grid.innerHTML = window.originalGridState.html;
          if (window.originalGridState.style) {
            grid.setAttribute('style', window.originalGridState.style);
          } else {
            grid.removeAttribute('style');
          }
          
          // Remove the reset button
          resetButton.remove();
        });
        
        document.body.appendChild(resetButton);
      }

      // Fallback function to use the main categories.csv if specific file fails to load
      function filterByApplicationFallback(application) {
        const rows = window.categoriesData.split('\n').map(row => row.split(','));
        const headers = rows[0];
        
        // Find the index of the Application column
        const applicationIndex = headers.findIndex(h => h === 'Application');
        if (applicationIndex === -1) return;
        
        // Filter gestures that match the application
        const matchingGestures = rows.slice(1).filter(row => {
          if (row.length <= applicationIndex) return false;
          
          // Get the application value from the CSV
          const cellValue = row[applicationIndex];
          if (!cellValue) return false;
          
          // If the application is "All", include this gesture for any application
          if (cellValue.trim() === 'All') {
            return true;
          }
          
          // Split by comma and check if any value matches
          const applications = cellValue.split(',').map(app => app.trim());
          return applications.includes(application);
        });
        
        // Show matching tiles
        matchingGestures.forEach(gesture => {
          const gestureName = gesture[0].trim().toLowerCase().replace(/[\s()-]+/g, '');
          const tile = document.querySelector(`.gesture-tile[data-svg-name="${gestureName}"]`);
          
          if (tile) {
            const link = tile.closest('.gesture-link');
            if (link) {
              link.style.display = 'block';
            }
          }
        });
      }

      // Function to show Context subcategories (which maps to Cultural in the CSV)
      function showContextSubcategories() {
        const subcategories = ['Contemporary', 'Universal', 'Traditional', 'Indigenous'];
        
        // Find the Context category tile to position buttons relative to it
        const contextTile = document.querySelector('.category-tile img[alt="Context"]').closest('.category-tile');
        const contextRect = contextTile.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        
        // Calculate position relative to the grid
        const relativeTop = contextRect.bottom - gridRect.top + 10; // 10px below the context category
        const relativeLeft = contextRect.left - gridRect.left;
        
        // Calculate button width and spacing
        const buttonWidth = 112;
        const buttonSpacing = 8; // Space between buttons
        const totalFirstRowWidth = (buttonWidth * 2) + buttonSpacing;
        const firstRowStartLeft = relativeLeft - (totalFirstRowWidth / 2) + (buttonWidth / 2);
        
        // Calculate second row positioning (centered under first row)
        const totalSecondRowWidth = (buttonWidth * 2) + buttonSpacing;
        const secondRowStartLeft = relativeLeft - (totalSecondRowWidth / 2) + (buttonWidth / 2);
        
        // Create buttons for each subcategory in a 2-row layout (2 in first row, 2 in second)
        subcategories.forEach((subcategory, index) => {
          const btn = document.createElement('button');
          btn.textContent = subcategory;
          btn.className = 'subcategory-btn context-subcategory-btn';
          
          // Set position properties via inline styles
          btn.style.position = 'absolute';
          
          if (index < 2) {
            // First row (2 buttons)
            btn.style.left = `${firstRowStartLeft + (index * (buttonWidth + buttonSpacing))}px`;
            btn.style.top = `${relativeTop}px`;
          } else {
            // Second row (2 buttons)
            btn.style.left = `${secondRowStartLeft + ((index - 2) * (buttonWidth + buttonSpacing))}px`;
            btn.style.top = `${relativeTop + 30}px`; // 30px below first row
          }
          
          // Force the styling directly in the JavaScript with green background for Context
          btn.style.width = `${buttonWidth}px`;
          btn.style.height = '23px';
          btn.style.borderRadius = '15px';
          btn.style.border = '1px solid #DCDCDC';
          btn.style.backgroundColor = '#11A858'; // Green background for Context
          btn.style.color = '#FFFFFF'; // White text for better contrast on dark green
          btn.style.textAlign = 'center';
          btn.style.fontFamily = 'Karla, sans-serif';
          btn.style.fontSize = '13px';
          btn.style.cursor = 'pointer';
          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'center';
          
          // Add click handler for filtering
          btn.addEventListener('click', () => {
            filterByContext(subcategory);
            
            // Highlight selected button
            document.querySelectorAll('.context-subcategory-btn').forEach(b => {
              b.classList.remove('selected');
              // Reset background color for non-selected buttons
              b.style.backgroundColor = '#11A858';
            });
            btn.classList.add('selected');
            // Slightly darker green for selected button
            btn.style.backgroundColor = '#0E8A47';
          });
          
          grid.appendChild(btn);
        });
      }

      // Function to filter tiles by context (which maps to Cultural in the CSV)
      function filterByContext(context) {
        // Hide all tiles first
        document.querySelectorAll('.gesture-link').forEach(link => {
          link.style.display = 'none';
        });
        
        // Then show only matching tiles
        const rows = window.categoriesData.split('\n').map(row => {
          // Handle potential quoted values with commas inside (like "Bowl, Cup")
          const processedRow = [];
          let inQuotes = false;
          let currentValue = '';
          
          for (let i = 0; i < row.length; i++) {
            const char = row[i];
            
            if (char === '"' && row[i-1] !== '\\') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              processedRow.push(currentValue);
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          
          // Add the last value
          if (currentValue) {
            processedRow.push(currentValue);
          }
          
          return processedRow.length > 0 ? processedRow : row.split(',');
        });
        
        const headers = rows[0];
        
        // Find the index of the Cultural column (which corresponds to Context in the UI)
        const culturalIndex = headers.findIndex(h => h === 'Cultural');
        if (culturalIndex === -1) {
          console.error('Cultural column not found in CSV');
          return;
        }
        
        console.log('Filtering for context:', context);
        console.log('Cultural index:', culturalIndex);
        
        // Filter gestures that match the context
        const matchingGestures = rows.slice(1).filter(row => {
          if (row.length <= culturalIndex) {
            console.log('Row too short:', row);
            return false;
          }
          
          // Get the cultural value from the CSV
          const cellValue = row[culturalIndex];
          if (!cellValue) {
            console.log('Empty cell value for row:', row);
            return false;
          }
          
          console.log(`Checking row: ${row[0]}, Cultural value: ${cellValue}`);
          
          // If the cultural is "All", include this gesture for any context
          if (cellValue.trim() === 'All') {
            console.log(`Row ${row[0]} matches because of All`);
            return true;
          }
          
          // Remove any quotes from the cell value
          const cleanValue = cellValue.replace(/"/g, '').trim();
          
          // Split by comma and check if any value matches
          const culturalContexts = cleanValue.split(',').map(ctx => ctx.trim());
          const matches = culturalContexts.includes(context);
          
          if (matches) {
            console.log(`Row ${row[0]} matches for ${context}`);
          }
          
          return matches;
        });
        
        console.log('Matching gestures:', matchingGestures.map(g => g[0]));
        
        // Show matching tiles
        matchingGestures.forEach(gesture => {
          const gestureName = gesture[0].trim().toLowerCase().replace(/[\s()-]+/g, '');
          console.log('Looking for gesture tile:', gestureName);
          
          const tile = document.querySelector(`.gesture-tile[data-svg-name="${gestureName}"]`);
          
          if (tile) {
            console.log('Found tile for:', gestureName);
            const link = tile.closest('.gesture-link');
            if (link) {
              link.style.display = 'block';
            }
          } else {
            console.log('Tile not found for:', gestureName);
          }
        });
      }

      // First fetch the CSV data
      fetch('filteredgestures.csv')
        .then(response => response.text())
        .then(data => {
          console.log('CSV Data:', data); // Debug: Check CSV data

          const rows = data.split('\n').map(row => row.split(','));
          const headers = rows[0];
          const gestureData = rows.slice(1);
          
          // Create a map of filename to metadata
          const gestureMetadata = new Map();
          gestureData.forEach(gesture => {
            const [filename, category, name, description] = gesture;
            gestureMetadata.set(filename, { category, name, description });
          });

          console.log('Metadata Map:', gestureMetadata); // Debug: Check metadata map

          const tilePositions = [
            // Column 1 (4 vertical tiles)
            { x: 1, y: 2, svg: 'pullingwalls' },
            { x: 1, y: 3, svg: 'spongerefinement' },
            { x: 1, y: 4, svg: 'centeringpress' },
            { x: 1, y: 5, svg: 'handonwheelplacement' },

           
            // Column 2 (4 vertical tiles)
            { x: 2, y: 1, svg: 'ballkneading' },
            { x: 2, y: 2, svg: 'balltap' },
            { x: 2, y: 3, svg: 'throwclayonwheel' },
            { x: 2, y: 4, svg: 'palmhug' },

            // Column 3 (3 vertical tiles)
            { x: 3, y: 1, svg: 'pinching' },
            { x: 3, y: 2, svg: 'coiling' },
            { x: 3, y: 3, svg: 'palmrolling' },

            // Column 4 (4 vertical tiles)
            { x: 4, y: 1, svg: 'beveling' },
            { x: 4, y: 2, svg: 'smoothing' },
            { x: 4, y: 3, svg: 'pressing' },
            { x: 4, y: 4, svg: 'ribshapingout' },

            // Column 5 (4 vertical tiles)
            { x: 5, y: 1, svg: 'scoring' },
            { x: 5, y: 2, svg: 'rolling' },
            { x: 5, y: 3, svg: 'joining' },
            { x: 5, y: 4, svg: 'ribshapingin' },

            // Column 6 (3 vertical tiles)
            { x: 6, y: 1, svg: 'wedging' },
            { x: 6, y: 2, svg: 'slabpressing' },
            { x: 6, y: 3, svg: 'blendingcoil' },

            // Column 7 (4 vertical tiles)
            { x: 7, y: 1, svg: 'palmdomepress' },
            { x: 7, y: 2, svg: 'sidewallpress' },
            { x: 7, y: 3, svg: 'thumbopening' },
            { x: 7, y: 4, svg: 'coneuppull' },

            // Column 8 (2 vertical tiles)
            { x: 8, y: 2, svg: 'stamping' },
            { x: 8, y: 3, svg: 'incising' },
          ];

          // Create tiles
          tilePositions.forEach(pos => {
            // Create link wrapper
            const link = document.createElement('a');
            link.href = `gestures/${pos.svg}.html`;
            link.className = 'gesture-link';
            
            // Create tile
            const tile = document.createElement('div');
            tile.className = 'tile gesture-tile';
            tile.dataset.svgName = pos.svg;
            
            // Position tile
            tile.style.position = 'absolute';
            tile.style.left = `${(pos.x - 1) * 130 + 40}px`;
            tile.style.top = `${(pos.y - 1) * 115 + 50}px`;
            
            // Create SVG wrapper and image
            const svgWrapper = document.createElement('div');
            svgWrapper.className = 'gesture-svg';
            
            const img = document.createElement('img');
            img.src = `assets/svgs/icons/${pos.svg}.svg`;
            img.alt = pos.svg;
            
            // Add metadata from CSV if available
            const metadata = gestureMetadata.get(pos.svg);
            
            if (metadata) {
              img.dataset.category = metadata.category;
              img.dataset.name = metadata.name;
              
              // Add gesture name element
              const gestureName = document.createElement('div');
              gestureName.className = 'gesture-name';
              gestureName.textContent = metadata.name || pos.svg;
              tile.appendChild(gestureName);
            } else {
              // If no metadata, at least show the SVG filename
              const gestureName = document.createElement('div');
              gestureName.className = 'gesture-name';
              gestureName.textContent = pos.svg;
              tile.appendChild(gestureName);
            }
            
            // Assemble the elements
            svgWrapper.appendChild(img);
            tile.appendChild(svgWrapper);
            link.appendChild(tile);
            grid.appendChild(link);
          });
        })
        .catch(error => {
          console.error('Error loading CSV:', error);
        });
    })
    .catch(error => {
      console.error('Error loading categories CSV:', error);
    });
});
