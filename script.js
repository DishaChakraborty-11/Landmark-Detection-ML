let model = null;

// UI Elements
const imageUpload = document.getElementById('imageUpload');
const uploadZone = document.getElementById('uploadZone');
const statusText = document.getElementById('statusText');
const detectionResult = document.getElementById('detectionResult');
const detectedImage = document.getElementById('detectedImage');
const detectedName = document.getElementById('detectedName');
const detectionDetails = document.getElementById('detectionDetails');
const loading = document.getElementById('loading');

// Chatbot Elements
const chatbotContainer = document.getElementById('chatbotContainer');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

// 1. Initialize AI
async function initAI() {
    try {
        statusText.innerHTML = "⌛ TravelBud is waking up...";
        model = await mobilenet.load();
        statusText.innerHTML = "✅ AI Ready - Click to Upload";
    } catch (e) {
        statusText.innerHTML = "❌ AI Failed to load.";
    }
}

// 2. Upload Logic
uploadZone.onclick = () => imageUpload.click();
imageUpload.onchange = (e) => {
    if (e.target.files && e.target.files[0]) analyzeImage(e.target.files[0]);
};

// 3. Analyze Image
async function analyzeImage(file) {
    loading.classList.add('show');
    const objectURL = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectURL;

    img.onload = async () => {
        detectedImage.src = objectURL;
        const predictions = await model.classify(img);
        const name = predictions[0].className.split(',')[0];
        const confidence = predictions[0].probability;
        
        await fetchTourismData(name, confidence);
        loading.classList.remove('show');
    };
}

// 4. Fetch Data & Links
async function fetchTourismData(query, confidence) {
    let info = {
        name: query,
        desc: "A world-famous landmark detected by TravelBud AI.",
        foodLink: `https://www.google.com/maps/search/top+rated+restaurants+near+${encodeURIComponent(query)}`,
        routeLink: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`,
        budget: "$120 - $250 USD per day (Comfort Stay)"
    };

    try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        if (res.ok) {
            const data = await res.json();
            info.name = data.title;
            info.desc = data.extract;
        }
    } catch (err) { console.log("Wiki limited"); }

    displayResults(info, confidence);
}

// 5. Show Results
function displayResults(info, confidence) {
    detectedName.innerText = info.name;
    detectionDetails.innerHTML = `
        <div class="result-section" style="border-left: 5px solid #48bb78; background: #f0fff4;">
            <h4><i class="fas fa-bullseye"></i> AI Confidence</h4>
            <p>TravelBud is ${(confidence * 100).toFixed(1)}% sure this is ${info.name}.</p>
        </div>
        <div class="result-section">
            <h4><i class="fas fa-info-circle"></i> About</h4>
            <p>${info.desc}</p>
        </div>
        <div class="result-section">
            <h4><i class="fas fa-map-signs"></i> Easiest Travel Routes</h4>
            <p>Click below for real-time GPS routes from your location:</p>
            <a href="${info.routeLink}" target="_blank" class="action-link"><i class="fas fa-route"></i> Get Directions</a>
        </div>
        <div class="result-section">
            <h4><i class="fas fa-utensils"></i> Local Eateries & Food Photos</h4>
            <p>See names and photos of the best-rated spots nearby:</p>
            <a href="${info.foodLink}" target="_blank" class="action-link" style="background:#e53e3e;"><i class="fas fa-search-location"></i> View Local Food</a>
        </div>
        <div class="result-section">
            <h4><i class="fas fa-wallet"></i> Approx Budget</h4>
            <p>${info.budget}</p>
        </div>
    `;
    detectionResult.style.display = 'block';
    detectionResult.scrollIntoView({ behavior: 'smooth' });
}

// 6. Chatbot Functions
function toggleChat() {
    chatbotContainer.style.display = chatbotContainer.style.display === 'flex' ? 'none' : 'flex';
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    chatMessages.innerHTML += `<div class="message user-message">${text}</div>`;
    chatInput.value = '';
    setTimeout(() => {
        chatMessages.innerHTML += `<div class="message bot-message">TravelBud here! I'm looking into your question about ${detectedName.innerText}. Check the links I provided for food and routes!</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
}

initAI();
