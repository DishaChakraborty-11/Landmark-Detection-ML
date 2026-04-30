/**
 * TravelBud AI - Master Logic (2026 Edition)
 * Features: Image Recognition, Wiki Integration, Currency Conversion, Multi-day Budgeting
 */

let model = null;

// UI Selection
const imageUpload = document.getElementById('imageUpload');
const uploadZone = document.getElementById('uploadZone');
const statusText = document.getElementById('statusText');
const detectionResult = document.getElementById('detectionResult');
const detectedImage = document.getElementById('detectedImage');
const detectedName = document.getElementById('detectedName');
const detectionDetails = document.getElementById('detectionDetails');
const loading = document.getElementById('loading');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

// 1. Initialize AI Model
async function initAI() {
    try {
        statusText.innerHTML = "⌛ TravelBud is waking up...";
        model = await mobilenet.load();
        statusText.innerHTML = "✅ AI Ready - Upload Landmark";
    } catch (e) {
        statusText.innerHTML = "❌ AI Load Failed. Check Console.";
        console.error("AI Error:", e);
    }
}

// 2. File Handling
if (uploadZone) {
    uploadZone.onclick = () => imageUpload.click();
}

imageUpload.onchange = (e) => {
    if (e.target.files && e.target.files[0]) {
        processImage(e.target.files[0]);
    }
};

// 3. Process & Analyze Image
async function processImage(file) {
    loading.classList.add('show');
    const objectURL = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectURL;

    img.onload = async () => {
        detectedImage.src = objectURL;
        
        // AI Identification
        const predictions = await model.classify(img);
        const topResult = predictions[0].className.split(',')[0];
        const probability = predictions[0].probability;

        // Fetch Data
        await fetchLandmarkInfo(topResult, probability);
        loading.classList.remove('show');
    };
}

// 4. Fetch Details & Dynamic Links
async function fetchLandmarkInfo(query, confidence) {
    let landmarkData = {
        name: query,
        desc: "A significant landmark identified by TravelBud AI.",
        foodLink: `https://www.google.com/maps/search/top+rated+restaurants+near+${encodeURIComponent(query)}`,
        routeLink: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
    };

    try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        if (res.ok) {
            const data = await res.json();
            landmarkData.name = data.title;
            landmarkData.desc = data.extract;
        }
    } catch (err) {
        console.warn("External API fetch failed, using fallback info.");
    }

    renderUI(landmarkData, confidence);
}

// 5. Render UI Cards
function renderUI(info, confidence) {
    detectedName.innerText = info.name;
    detectionDetails.innerHTML = `
        <div class="result-section" style="border-left: 5px solid #48bb78; background: #f0fff4; padding: 15px; border-radius: 8px;">
            <h4 style="color: #2f855a;"><i class="fas fa-check-circle"></i> AI Identification</h4>
            <p>TravelBud is ${(confidence * 100).toFixed(1)}% sure this is <strong>${info.name}</strong>.</p>
        </div>

        <div class="result-section" style="margin-top: 15px;">
            <h4 style="color: #4a5568;"><i class="fas fa-info-circle"></i> Summary</h4>
            <p style="color: #2d3748;">${info.desc}</p>
        </div>

        <div class="result-section" style="margin-top: 15px;">
            <h4 style="color: #4a5568;"><i class="fas fa-utensils"></i> Local Food & Routes</h4>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <a href="${info.foodLink}" target="_blank" class="action-link" style="background: #e53e3e;">
                    <i class="fas fa-hamburger"></i> View Local Food
                </a>
                <a href="${info.routeLink}" target="_blank" class="action-link" style="background: #3182ce;">
                    <i class="fas fa-route"></i> Get Directions
                </a>
            </div>
        </div>
    `;
    
    detectionResult.style.display = 'block';
    detectionResult.scrollIntoView({ behavior: 'smooth' });

    // Inform the chatbot about the new landmark
    chatMessages.innerHTML += `<div class="message bot-message">I've analyzed **${info.name}**! Ask me about the 2-day budget in rupees or places near it.</div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 6. TravelBud Smart Chatbot Logic
function toggleChat() {
    chatbotContainer.style.display = (chatbotContainer.style.display === 'flex') ? 'none' : 'flex';
}

function sendMessage() {
    const userInput = chatInput.value.trim().toLowerCase();
    if (!userInput) return;

    // Show User Message
    chatMessages.innerHTML += `<div class="message user-message">${userInput}</div>`;
    chatInput.value = '';

    const landmark = detectedName.innerText;

    // Chatbot Brain
    setTimeout(() => {
        let reply = "";
        
        // Currency & Days Detection
        const isRupees = userInput.includes("rupee") || userInput.includes("inr") || userInput.includes("rs");
        const isMultiDay = userInput.includes("2 day") || userInput.includes("3 day") || userInput.includes("two day") || userInput.includes("three day");
        const dayCount = (userInput.match(/\d+/) || [1])[0];

        if (landmark === "Processing..." || landmark === "") {
            reply = "Please upload a photo of a landmark first so I can help you with specific costs!";
        }
        else if (userInput.includes("budget") || userInput.includes("cost") || userInput.includes("price") || userInput.includes("much")) {
            const baseUsd = 150;
            const totalUsd = baseUsd * dayCount;
            const totalInr = totalUsd * 83; // Conversion Rate

            if (isRupees) {
                reply = `For a ${dayCount}-day trip to **${landmark}**, the budget is approximately **₹${totalInr.toLocaleString()}**. This includes local meals, travel, and entry fees.`;
            } else {
                reply = `For a ${dayCount}-day trip to **${landmark}**, expect to spend around **$${totalUsd}**. This covers your basic daily needs and sightseeing!`;
            }
        } 
        else if (userInput.includes("near") || userInput.includes("place") || userInput.includes("visit") || userInput.includes("attraction")) {
            reply = `There are several historic sites near **${landmark}**. If you click the **Blue 'Get Directions' button** above, Google Maps will show you all the top-rated 'Nearby Places' and hidden gems automatically!`;
        } 
        else if (userInput.includes("food") || userInput.includes("eat") || userInput.includes("specialty")) {
            reply = `The area around **${landmark}** is famous for its local street food. Click the **Red 'View Local Food' button** in the result card to see real photos and names of restaurants!`;
        }
        else {
            reply = `I'm TravelBud! I'm currently looking at **${landmark}**. You can ask me about the budget in rupees, travel routes, or local food recommendations!`;
        }

        chatMessages.innerHTML += `<div class="message bot-message">${reply}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
}

// 7. Event Listeners
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Run AI Start
initAI();
