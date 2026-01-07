import tensorflow as tf
import json

MODEL_PATH = "model/landmark_model.h5"
LABELS_PATH = "model/labels.json"

model = tf.keras.models.load_model(MODEL_PATH)

with open(LABELS_PATH, "r") as f:
    class_indices = json.load(f)

# Reverse mapping
labels = {v: k for k, v in class_indices.items()}
