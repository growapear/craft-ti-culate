# webcam_inference/run_webcam_inference.py

import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
import pickle

# Load model and encoder
model = tf.keras.models.load_model('models/gesture_model.h5')
with open('models/gesture_label_encoder.pkl', 'rb') as f:
    label_encoder = pickle.load(f)

# MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7)
mp_drawing = mp.solutions.drawing_utils

# Webcam
cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb_frame)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            landmarks = []
            for lm in hand_landmarks.landmark:
                landmarks.extend([lm.x, lm.y, lm.z])

            input_data = np.array(landmarks).reshape(1, -1)
            input_data = (input_data - np.min(input_data)) / (np.max(input_data) - np.min(input_data))

            prediction = model.predict(input_data)
            confidence = np.max(prediction)
            predicted_label = label_encoder.inverse_transform([np.argmax(prediction)])[0]

            if confidence > 0.7:
                cv2.putText(frame, f'{predicted_label} ({confidence:.1%})', (10, 40),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            else:
                cv2.putText(frame, 'Gesture: Unknown', (10, 40),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    cv2.imshow('Gesture Recognition', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
