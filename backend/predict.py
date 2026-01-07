import numpy as np
from PIL import Image
from model_loader import model, labels

IMG_SIZE = 224

def preprocess_image(image: Image.Image):
    image = image.resize((IMG_SIZE, IMG_SIZE))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

def predict_landmark(image: Image.Image):
    processed = preprocess_image(image)
    preds = model.predict(processed)[0]
    
    class_id = int(np.argmax(preds))
    confidence = float(np.max(preds))
    
    return {
        "landmark": labels[class_id],
        "confidence": round(confidence, 4)
    }
