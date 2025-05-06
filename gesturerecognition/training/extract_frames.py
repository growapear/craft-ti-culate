# training/extract_frames.py

import cv2
import mediapipe as mp
import json
import os

# Configuration
video_folder = 'dataset'
output_folder = 'dataset'
frame_skip = 5  # 👈 Extract every 5 frames

# Video-to-label mapping
video_label_map = {
    'pinch.mp4': 'pinch',
    'neutral.mp4': 'neutral',
    'kneading.mp4': 'kneading'
}

# MediaPipe Hands initialization
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Start extraction
for video_file, label in video_label_map.items():
    print(f"🎥 Processing {video_file} as {label}...")

    cap = cv2.VideoCapture(os.path.join(video_folder, video_file))
    frame_id = 0
    all_landmarks = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        if frame_id % frame_skip == 0:  # Only every Nth frame
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(frame_rgb)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    landmarks = [{'x': lm.x, 'y': lm.y, 'z': lm.z} for lm in hand_landmarks.landmark]
                    all_landmarks.append({
                        'gesture': label,
                        'landmarks': landmarks
                    })
        
        frame_id += 1

    cap.release()

    # Save to JSON
    output_path = os.path.join(output_folder, f"{label}.json")
    with open(output_path, 'w') as f:
        json.dump(all_landmarks, f, indent=4)

    print(f"✅ Saved {len(all_landmarks)} frames for {label} to {output_path}")

hands.close()
