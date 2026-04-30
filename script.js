// 1. Initialize Variables
let model = null;
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

// 2. Load the AI Model on Startup
async function initAI() {
    try {
        statusText.innerHTML = "⌛ Loading AI Brain...";
        model = await mobilenet.load();
        statusText.innerHTML = "✅ AI Ready - Click to Upload";
    } catch (e) {
        statusText.innerHTML = "❌ AI Load Failed. Check Connection.";
        console.error(e);
    }
}

// 3. Handle File Uploads
uploadZone.onclick = () => imageUpload.click();

imageUpload.onchange = (e) => {
    if (e.target.files && e.target.files[0]) {
        analyzeImage(e.target.files[0]);
    }
};

// 4. Analyze the Image
async function analyzeImage(file) {
    loading.classList.add('show');
    
    const img = new Image();
    const objectURL = URL.createObjectURL(file);
    img.src = objectURL;

    img.onload = async () => {
        detectedImage.src = objectURL;
        
        // AI Classification
        const predictions = await model.classify(img);
        const landmarkName = predictions[0].className.split(',')[0];
        const confidence = predictions[0].probability;

        // Fetch Detailed Tourism Data
        await fetchTourismData(landmarkName, confidence);
        loading.classList.remove('show');
    };
}

// 5. Fetch Dynamic Data (Wikipedia + Maps Links)
async function fetchTourismData(query, confidence) {
    // Default Fallback
    let info = {
        name: query,
        desc: "A globally recognized landmark identified by our AI.",
        foodLink: `https://www.google.com/maps/search/top+rated+restaurants+near+${encodeURIComponent(query)}`,
        routeLink: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`,
        budget: "$100 - $250 per day (Estimated)"
    };

    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        if (response.ok) {
            const data = await response.json();
            info.name = data.title;
            info.desc = data.extract;
        }
    } catch (err) {
        console.warn("External data fetch limited. Using AI prediction.");
    }

    displayResults(info, confidence);
}

// 6. Update the UI with Results
function displayResults(info, confidence) {
    detectedName.innerText = info.name;
    detectionDetails.innerHTML = `
        <div class="result-section" style="border-left: 5px solid #48bb78;">
            <h4><i class="fas fa-bullseye"></i> AI Match Accuracy</h4>
            <p>${(confidence * 100).toFixed(1)}% Match</p>
        </div>

        <div class="result-section">
            <h4><i class="fas fa-info-circle"></i> About this Landmark</h4>
            <p>${info.desc}</p>
        </div>

        <div class="result-section">
            <h4><i class="fas fa-route"></i> Easiest Travel Routes</h4>
            <p>Click below to see the best public transport and driving directions from your current location.</p>
            <a href="${info.routeLink}" target="_blank" class="action-link">
                <i class="fas fa-directions"></i> Get Real-Time Directions
            </a>
        </div>

        <div class="result-section">
            <h4><i class="fas fa-utensils"></i> Local Eateries & Specialty Food</h4>
            <p>I've found the highest-rated local restaurants and street food names nearby with photos:</p>
            <a href="${info.foodLink}" target="_blank" class="action-link" style="background:#f56565;">
                <i class="fas fa-map-marked-alt"></i> View Local Food & Photos
            </a>
        </div>

        <div class="result-section">
            <h4><i class="fas fa-wallet"></i> Estimated Daily Budget</h4>
            <p>${info.budget}</p>
        </div>
    `;
    
    detectionResult.style.display = 'block';
    detectionResult.scrollIntoView({ behavior: 'smooth' });
}

// 7. Chatbot Logic
function toggleChat() {
    if (chatbotContainer.style.display === 'flex') {
        chatbotContainer.style.display = 'none';
    } else {
        chatbotContainer.style.display = 'flex';
    }
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add User Bubble
    chatMessages.innerHTML += `<div class="message user-message">${text}</div>`;
    chatInput.value = '';

    // Simulate Bot Response
    setTimeout(() => {
        let botText = `I'm analyzing your request about ${detectedName.innerText || 'this landmark'}. You can find local food and routes in the cards above! What else can I help with?`;
        chatMessages.innerHTML += `<div class="message bot-message">${botText}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
}

// Allow "Enter" key for Chat
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Run Init
initAI();
