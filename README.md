# 🌍 TravelBud: AI-Powered Landmark Explorer

**TravelBud** is a smart, browser-based AI application that identifies global landmarks from photos and provides instant travel insights, including local food recommendations, navigation, and multi-day budgeting in Rupees.

### 🚀 [Live Demo](https://dishachakraborty-11.github.io/Landmark-Detection-ML/)

---

## ✨ Key Features
- **Instant AI Recognition:** Powered by **TensorFlow.js** and **MobileNet**, identifying monuments directly in your browser.
  
- **Smart TravelBud Chatbot:** An adaptive AI assistant that calculates trip budgets and suggests nearby attractions.
  
- **Dynamic Budgeting:** Automatically calculates 2-3 day expenses and converts them to **INR (₹)**.
  
- **Local Insights:** Integrated links for top-rated restaurants and Google Maps routes.
  
- **Privacy First:** All image processing happens locally on your device; no photos are uploaded to a server.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 (Modern Flexbox/Grid), FontAwesome.
- **Machine Learning:** [TensorFlow.js](https://www.tensorflow.org/js)
- **Pre-trained Model:** MobileNet v2 (Lightweight and fast for mobile/web).
- **APIs:** Wikipedia API for real-time landmark summaries.

## 📸 How to Use
1. **Upload:** Click the camera icon or the "Upload Landmark" button.
2. **Analyze:** Wait a second for the AI to scan the image.
3. **Explore:** View the landmark details, food links, and travel routes.
4. **Chat:** Ask TravelBud: *"What is the budget for 2 days in rupees?"* or *"What are some places near this?"*

## 📂 Project Structure
```text
├── index.html      # Main UI and TensorFlow integration
├── style.css       # Custom Glassmorphism and Responsive UI
├── script.js      # AI Logic, Chatbot Brain, and Wiki API calls
└── README.md       # Project Documentation
```

## Screenshots 
<img width="1920" height="1080" alt="Screenshot (51)" src="https://github.com/user-attachments/assets/d52e19fb-0dee-47de-859f-2fd2d78685ae" />
<img width="1920" height="1080" alt="Screenshot (52)" src="https://github.com/user-attachments/assets/1b4b4efb-8719-47f9-bf08-d87a000cce7c" />
<img width="1920" height="1080" alt="Screenshot (53)" src="https://github.com/user-attachments/assets/6d01d874-4238-49cc-9556-f2e8a69416e2" />
<img width="1920" height="1080" alt="Screenshot (54)" src="https://github.com/user-attachments/assets/e1941538-7d41-41aa-acd0-75943b88f77c" />

##⚠️ Limitations & Future Improvements
1. Model Accuracy & Training Data
The core AI uses the MobileNet v2 model. While fast and lightweight, it was trained on the ImageNet dataset, which means:

It may struggle to distinguish between similar-looking stone structures (e.g., misidentifying a specific Triumphal Arch in one city for another).

It performs best with clear, daylight photos. Low-light or extreme-angle shots may reduce confidence scores.

2. Client-Side Processing Power
Because all AI processing happens on the user's device (client-side) via TensorFlow.js:

Users on older smartphones or low-spec laptops might experience a 2–3 second delay while the model loads into the browser's memory.

The performance is dependent on the browser's ability to handle WebGL acceleration.

3. Static Budgeting Logic
Currently, the TravelBud Chatbot uses a "base-rate" calculation for budgets ($150/day):

Limitation: It does not account for real-time inflation, seasonal price spikes (like peak summer in Paris), or luxury vs. budget traveler preferences.

Future Fix: Integrating a dedicated Travel Cost API would provide real-time pricing data.

4. Internet Dependency for Details
While the AI recognizes the landmark offline once the model is loaded:

The Wikipedia summaries and Google Maps links require an active internet connection to fetch the latest descriptions and routes.

🛡️ License
Distributed under the MIT License. See LICENSE for more information.

Developed by Disha Chakraborty 🚀
