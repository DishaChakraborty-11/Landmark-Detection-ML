import tensorflow as tf
import numpy as np
import cv2
import sys

model = tf.keras.models.load_model('models/landmark_model.h5')
img_path = sys.argv[1]

img = cv2.imread(img_path)
img_resized = cv2.resize(img, (150,150))
img_array = np.expand_dims(img_resized/255.0, axis=0)

pred = model.predict(img_array)
pred_class = np.argmax(pred, axis=1)

print(f"🏛️ Predicted class index: {pred_class[0]}")
