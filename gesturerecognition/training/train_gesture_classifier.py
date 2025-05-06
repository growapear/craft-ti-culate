# training/train_gesture_classifier.py

import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt
import pickle
import os

# ================== ✅ SYSTEM CHECK =======================
def check_system():
    print("\n=== System Check ===")
    print(f"🔵 TensorFlow version: {tf.__version__}")

    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        print("✅ GPU available:")
        for gpu in gpus:
            print(f"   • {gpu}")
        try:
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
            print("✅ GPU memory growth enabled")
        except RuntimeError as e:
            print(f"⚠️  GPU memory config error: {e}")
    else:
        print("⚠️ No GPU - running on CPU")

# ================== ✅ DATA LOADING =======================
def load_data(csv_path):
    print("\n📂 Loading gesture dataset...")
    data = pd.read_csv(csv_path)
    X = data.drop('label', axis=1).values
    y = data['label'].values
    print(f"📊 Loaded {len(X)} samples with {X.shape[1]} features each.")
    return X, y

# ================== ✅ PREPROCESSING =======================
def preprocess_data(X, y):
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    y_categorical = to_categorical(y_encoded)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_categorical, test_size=0.2, random_state=42
    )
    print(f"✅ Train samples: {X_train.shape[0]}, Test samples: {X_test.shape[0]}")
    return X_train, X_test, y_train, y_test, label_encoder

# ================== ✅ MODEL BUILDING =======================
def build_model(input_dim, num_classes):
    model = Sequential([
        Dense(256, activation='relu', input_shape=(input_dim,)),
        Dropout(0.4),
        Dense(128, activation='relu'),
        Dropout(0.3),
        Dense(64, activation='relu'),
        Dropout(0.2),
        Dense(num_classes, activation='softmax')
    ])
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    print("✅ Model built.")
    return model

# ================== ✅ PLOT TRAINING METRICS =======================
def plot_metrics(history):
    plt.figure(figsize=(12, 4))
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'], label='Train Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.title('Accuracy')
    plt.legend()

    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'], label='Train Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Loss')
    plt.legend()

    plt.show()

# ================== ✅ MAIN =======================
if __name__ == "__main__":
    try:
        check_system()

        # Path to the combined CSV
        csv_file = 'dataset/gesture_dataset.csv'

        X, y = load_data(csv_file)
        X_train, X_test, y_train, y_test, label_encoder = preprocess_data(X, y)

        model = build_model(input_dim=X.shape[1], num_classes=y_train.shape[1])

        print("\n🚀 Starting Training...")
        history = model.fit(X_train, y_train, epochs=50, batch_size=16, validation_data=(X_test, y_test))

        loss, accuracy = model.evaluate(X_test, y_test)
        print(f"\n🎉 Final Test Accuracy: {accuracy * 100:.2f}%")

        plot_metrics(history)

        # Save model and encoder
        os.makedirs('models', exist_ok=True)
        model.save('models/gesture_model.h5')
        with open('models/gesture_label_encoder.pkl', 'wb') as f:
            pickle.dump(label_encoder, f)
        
        print("💾 Model and encoder saved in 'models/' folder!")

    except Exception as e:
        print(f"❌ Error: {e}")
