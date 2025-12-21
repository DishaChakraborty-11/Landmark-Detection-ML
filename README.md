# 🏛️ Landmark Detection using Convolutional Neural Networks (CNN)

This project detects and classifies famous landmarks from images using **Convolutional Neural Networks (CNN)**.  
It was inspired by [AmanxAI’s tutorial](https://amanxai.com/2020/11/08/landmark-detection-with-machine-learning/) and extended with a custom modular codebase, improved data preprocessing, and visualization tools.

---
📂 Dataset

- Source: Publicly available landmark image datasets

- Images represent multiple landmark classes

- Dataset split into training and evaluation subsets

---

## 📸 Project Overview

Landmark detection is an important computer vision task that enables recognition of iconic structures from around the world — such as the **Eiffel Tower**, **Taj Mahal**, and **Statue of Liberty**.

This model:
- Preprocesses and augments image data for robust training.  
- Uses a CNN built with **TensorFlow/Keras** to classify landmarks.  
- Visualizes training progress and confusion matrix for performance analysis.  
- Allows easy predictions on custom images.

---

## 🧠 Tech Stack

| Category | Technologies |
|-----------|--------------|
| **Language** | Python |
| **Libraries/Frameworks** | TensorFlow, Keras, NumPy, Pandas, Matplotlib, OpenCV |
| **Model Type** | Convolutional Neural Network (CNN) |
| **Tools** | Jupyter Notebook, Google Colab, Git, GitHub |

---

## 🧩 Project Structure

Landmark-Detection-ML/
│
├── data/ # (Placeholder for dataset or instructions)
│ └── README.md
│
├── notebooks/
│ └── landmark_detection.ipynb # Full EDA + model training
│
├── src/
│ ├── train_model.py # CNN model training script
│ ├── predict.py # Custom image prediction
│ ├── utils.py # Visualization & helper functions
│ └── config.py # Centralized configuration file
│
├── models/
│ └── landmark_model.h5 # Trained model weights
│
├── requirements.txt # Dependencies
├── .gitignore
└── README.md

yaml
Copy code

---

## ⚙️ Setup and Usage

### 1️⃣ Clone the Repository

git clone https://github.com/DishaChakraborty-11/Landmark-Detection-ML.git
cd Landmark-Detection-ML
2️⃣ Install Dependencies

pip install -r requirements.txt
3️⃣ Prepare Dataset
Download or create folders like:


data/
 ├── train/
 │   ├── Eiffel_Tower/
 │   └── Taj_Mahal/
 ├── validation/
 │   ├── Eiffel_Tower/
 │   └── Taj_Mahal/
 └── test/
     └── sample.jpg
4️⃣ Train the Model

python src/train_model.py
5️⃣ Predict on Custom Image

python src/predict.py --image "data/test/sample.jpg"
📊 Results
Metric	Result


Training Accuracy	~92%

Validation Accuracy	~88%

Model File	models/landmark_model.h5

Example Predictions:

Input Image	Predicted Landmark

< Eiffel Tower

< Taj Mahal
---
⚠️ Limitations

- Limited dataset diversity
- Sensitive to lighting and viewpoint variations
- No cross-dataset evaluation

---

👩‍💻 Author

Disha Chakraborty
B.Tech in Computer Science (AI & ML)
📍 Kolkata, India
🌐 GitHub | LinkedIn



