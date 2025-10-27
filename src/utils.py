"""
utils.py
Utility functions for the Landmark Detection project.
Includes helper functions for visualization, model saving, and loading.
"""

import matplotlib.pyplot as plt
import tensorflow as tf
import os

def plot_training_history(history):
    """Plot model accuracy and loss graphs after training."""
    acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']
    loss = history.history['loss']
    val_loss = history.history['val_loss']

    epochs_range = range(len(acc))

    plt.figure(figsize=(10, 4))
    plt.subplot(1, 2, 1)
    plt.plot(epochs_range, acc, label='Training Accuracy')
    plt.plot(epochs_range, val_acc, label='Validation Accuracy')
    plt.legend(loc='lower right')
    plt.title('Training and Validation Accuracy')

    plt.subplot(1, 2, 2)
    plt.plot(epochs_range, loss, label='Training Loss')
    plt.plot(epochs_range, val_loss, label='Validation Loss')
    plt.legend(loc='upper right')
    plt.title('Training and Validation Loss')

    plt.tight_layout()
    plt.show()

def load_trained_model(model_path):
    """Load a previously trained model."""
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"❌ Model not found at {model_path}")
    print(f"✅ Loading model from {model_path} ...")
    model = tf.keras.models.load_model(model_path)
    return model

def summarize_model(model):
    """Print a summary of the CNN architecture."""
    print("\n📘 Model Summary:")
    model.summary()
