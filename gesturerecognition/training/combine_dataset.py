# training/combine_dataset.py

import json
import pandas as pd
import os

# Configuration
dataset_folder = 'dataset'
output_csv_path = 'dataset/gesture_dataset.csv'

# List of your extracted JSON files
json_files = ['pinch.json', 'neutral.json', 'kneading.json']

all_data = []

for json_file in json_files:
    with open(os.path.join(dataset_folder, json_file), 'r') as f:
        landmarks_list = json.load(f)

    for item in landmarks_list:
        flat_landmarks = []
        for lm in item['landmarks']:
            flat_landmarks.extend([lm['x'], lm['y'], lm['z']])
        
        flat_landmarks.append(item['gesture'])  # Add label at the end
        all_data.append(flat_landmarks)

# Build column names
columns = []
for i in range(21):
    columns += [f'x_{i}', f'y_{i}', f'z_{i}']
columns.append('label')

# Save to CSV
df = pd.DataFrame(all_data, columns=columns)
df.to_csv(output_csv_path, index=False)

print(f"✅ Combined data saved to {output_csv_path}")
