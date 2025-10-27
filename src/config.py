"""
config.py
Configuration file for the Landmark Detection project.
Stores file paths, model parameters, and training settings.
"""

# Dataset paths
TRAIN_DIR = 'data/train'
VAL_DIR = 'data/validation'
TEST_DIR = 'data/test'

# Model save path
MODEL_PATH = 'models/landmark_model.h5'

# Image settings
IMG_HEIGHT = 150
IMG_WIDTH = 150
CHANNELS = 3

# Training parameters
BATCH_SIZE = 32
EPOCHS = 10
LEARNING_RATE = 0.001

# Class mode for ImageDataGenerator
CLASS_MODE = 'categorical'
