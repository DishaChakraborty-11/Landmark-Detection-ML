// FINAL SCRIPT - RENDERED APRIL 2026
let model = null;
const imageUpload = document.getElementById('imageUpload');
const statusText = document.getElementById('statusText');
const detectionResult = document.getElementById('detectionResult');
const detectedImage = document.getElementById('detectedImage');
const detectedName = document.getElementById('detectedName');
const detectionDetails = document.getElementById('detectionDetails');
const loading = document.getElementById('loading');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

async function initAI() {
    try {
        statusText.innerHTML = "⌛ TravelBud is waking up...";
        model = await mobilenet.load();
        statusText.innerHTML = "✅ AI Ready - Upload Photo";
    } catch (e) { statusText.innerHTML = "❌ AI Error"; }
}

document.getElementById('uploadZone').onclick = () => imageUpload.click();
imageUpload.onchange = (e) => { if (e.target.files[0]) analyzeImage(e.target.files[0]); };

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
        await fetchNewData(name, confidence);
        loading.classList.remove('show');
    };
}

async function fetchNewData(query, confidence) {
    let info = {
        name: query,
        desc: "A significant landmark identified by TravelBud.",
        foodLink: `https://www.google.com/maps/search/restaurants+near+${encodeURIComponent(query)}`,
        routeLink: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
    };
    try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        if (res.ok) {
            const data = await res.json();
            info.name = data.title;
            info.desc = data.extract;
        }
    } catch (e) {}
    renderResults(info, confidence);
}

function renderResults(info, confidence) {
    detectedName.innerText = info.name;
    detectionDetails.innerHTML = `
        <div class="result-section">
            <h4><i class="fas fa-info-circle"></i> ABOUT</h4>
            <p>${info.desc}</p>
        </div>
        <div class="result-section">
            <h4><i class="fas fa-map-marked-alt"></i> FOOD & ROUTES</h4>
            <a href="${info.foodLink}" target="_blank" class="action-link">Explore Local Food</a>
            <a href="${info.routeLink}" target="_blank" class="action-link" style="background:#4a5568">Get Directions</a>
        </div>
    `;
    detectionResult.style.display = 'block';
    detectionResult.scrollIntoView({behavior: 'smooth'});
}

function toggleChat() { chatbotContainer.style.display = (chatbotContainer.style.display === 'flex') ? 'none' : 'flex'; }

function sendMessage() {
    const text = chatInput.value.trim().toLowerCase();
    if (!text) return;
    chatMessages.innerHTML += `<div class="message user-message">${text}</div>`;
    chatInput.value = '';

    const landmark = detectedName.innerText;

    setTimeout(() => {
        let reply = "";
        if (text.includes("budget") || text.includes("cost") || text.includes("price")) {
            reply = `For **${landmark}**, a 1-day budget is roughly **$150-$200**. This covers a nice local meal ($40), transport ($20), and entry fees. Check the cards for exact food spots!`;
        } else if (text.includes("food") || text.includes("eat")) {
            reply = `There are amazing spots near **${landmark}**. Click the "Explore Local Food" button above to see names, ratings, and photos!`;
        } else {
            reply = `I'm TravelBud! I can help you with the budget, food, or routes for ${landmark}. What do you need?`;
        }
        chatMessages.innerHTML += `<div class="message bot-message">${reply}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
}
initAI();
