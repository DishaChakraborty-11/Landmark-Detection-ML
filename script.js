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

// 2. Load the AI Model
async function initAI() {
    try {
        statusText.innerHTML = "⌛ TravelBud is waking up...";
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
        
        // Run AI Analysis
        const predictions = await model.classify(img);
        const landmarkName = predictions[0].className.split(',')[0];
        const confidence = predictions[0].probability;

        // Get Details
        await fetchTourismData(landmarkName, confidence);
        loading.classList.remove('show');
    };
}

// 5. Fetch Wikipedia & Generate Dynamic Links
async function fetchTourismData(query, confidence) {
    let info = {
        name: query,
        desc: "A world-famous landmark detected by TravelBud AI.",
        foodLink: `https://www.google.com/maps/search/top+rated+restaurants+near+${encodeURIComponent(query)}`,
        routeLink: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`,
        budget: "$120 - $250 USD per day (Estimated)"
    };

    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        if (response.ok) {
            const data = await response.json();
            info.name = data.title;
            info.desc = data.extract;
        }
    } catch (err) {
        console.warn("Wiki data fetch limited.");
    }

    displayResults(info, confidence);
}

// 6. Display Results in UI
function displayResults(info, confidence) {
    detectedName.innerText = info.name;
    detectionDetails.innerHTML = `
        <div class="result-section" style="border-left: 5px solid #48bb78; background: #f0fff4;">
            <h4><i class="fas fa-bullseye"></i> AI Match Accuracy</h4>
            <p>TravelBud is ${(confidence * 100).toFixed(1)}% sure this is ${info.name}.</p>
        </div>

        <div class="result-section">
            <h4><i class="fas fa-info-circle"></i> About</h4>
            <p>${info.desc}</p>
        </div>

        <div class="result-section">
            <h4><i class="fas fa-route"></i> Easiest Travel Routes</h4>
            <p>Click below to see the best public transport and driving directions to ${info.name}:</p>
            <a href="${info.routeLink}" target="_blank" class="action-link">
                <i class="fas fa-directions"></i> Get Real-Time Directions
            </a>
        </div>

        <div class="result-section">
            <h4><i class="fas fa-utensils"></i> Local Eateries & Photos</h4>
            <p>See names and photos of top-rated local spots near ${info.name}:</p>
            <a href="${info.foodLink}" target="_blank" class="action-link" style="background:#e53e3e;">
                <i class="fas fa-search-location"></i> View Local Food & Photos
            </a>
        </div>

        <div class="result-section">
            <h4><i class="fas fa-wallet"></i> Estimated Daily Budget</h4>
            <p>${info.budget}</p>
        </div>
    `;
    
    detectionResult.style.display = 'block';
    detectionResult.scrollIntoView({ behavior: 'smooth' });

    // Update Chatbot Context
    chatMessages.innerHTML += `<div class="message bot-message">I've analyzed ${info.name}! Check the cards above for food photos and GPS routes. What else can I help with?</div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 7. SMART CHATBOT LOGIC
function toggleChat() {
    chatbotContainer.style.display = (chatbotContainer.style.display === 'flex') ? 'none' : 'flex';
}

function sendMessage() {
    const text = chatInput.value.trim().toLowerCase();
    if (!text) return;

    // Add User Message
    chatMessages.innerHTML += `<div class="message user-message">${text}</div>`;
    chatInput.value = '';

    const currentLandmark = detectedName.innerText;

    // Smart Responses based on User Input
    setTimeout(() => {
        let response = "";

        if (currentLandmark === "Processing..." || currentLandmark === "") {
            response = "I'm ready! Just upload a photo first so I know which landmark we're planning for.";
        } 
        else if (text.includes("food") || text.includes("eat") || text.includes("restaurant") || text.includes("specialty")) {
            response = `For **${currentLandmark}**, local meals usually range from $15-$40 depending on your choice. I've found some great spots for you! Click the **red button** above to see restaurant names and photos.`;
        } 
        else if (text.includes("travel") || text.includes("cost") || text.includes("price") || text.includes("budget")) {
            response = `Visiting **${currentLandmark}** usually fits a daily budget of about $150. This covers transport, food, and entry. You can see your custom route by clicking the **blue button**!`;
        } 
        else if (text.includes("route") || text.includes("directions") || text.includes("how to go")) {
            response = `I've mapped out the best way to get to **${currentLandmark}**. Just click the **blue 'Get Directions' button** above for a live GPS route!`;
        } 
        else {
            response = `I'm TravelBud, and I'm here to help with your trip to **${currentLandmark}**. Would you like to know about local food, travel routes, or the estimated budget?`;
        }

        chatMessages.innerHTML += `<div class="message bot-message">${response}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
}

// Handle Enter Key
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Run
initAI();
