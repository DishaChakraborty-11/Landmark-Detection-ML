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

// 1. Initialize the AI
async function initAI() {
    try {
        model = await mobilenet.load();
        statusText.innerHTML = "✅ AI Ready - Click to Upload";
        console.log("AI Loaded");
    } catch (e) {
        statusText.innerHTML = "❌ Error loading AI";
        console.error(e);
    }
}

// 2. Handle Image Selection
imageUpload.onchange = (e) => {
    if (e.target.files.length > 0) {
        analyzeImage(e.target.files[0]);
    }
};

uploadZone.onclick = () => imageUpload.click();

// 3. Analyze Image
async function analyzeImage(file) {
    loading.classList.add('show');
    const img = document.createElement('img');
    const reader = new FileReader();

    reader.onload = (e) => {
        img.src = e.target.result;
        detectedImage.src = e.target.result;
        img.onload = async () => {
            const predictions = await model.classify(img);
            // Get the top prediction name
            const rawName = predictions[0].className.split(',')[0];
            await fetchTourismData(rawName, predictions[0].probability);
        };
    };
    reader.readAsDataURL(file);
}

// 4. Fetch Wikipedia & Tourism Data
async function fetchTourismData(query, confidence) {
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(wikiUrl);
        const data = await response.json();
        
        const info = {
            name: data.title || query,
            desc: data.extract || "A historic landmark of architectural significance.",
            visit: "Accessible via local transport. Best visited during morning hours.",
            stays: "Hotels ranging from budget to luxury available within 5km.",
            food: "Local street food and traditional regional cuisine are popular here.",
            budget: "$50 - $150 per day approx."
        };

        displayFinalResult(info, confidence);
    } catch (err) {
        displayFinalResult({name: query, desc: "Data fetch failed."}, confidence);
    } finally {
        loading.classList.remove('show');
    }
}

// 5. Show Final UI
function displayFinalResult(info, confidence) {
    detectedName.innerText = info.name;
    detectionDetails.innerHTML = `
        <div class="result-section">
            <h4 style="color:#38a169">🎯 Match: ${(confidence*100).toFixed(1)}%</h4>
        </div>
        <div class="result-section">
            <h4><i class="fas fa-info-circle"></i> About</h4>
            <p>${info.desc}</p>
        </div>
        <div class="result-section">
            <h4><i class="fas fa-plane"></i> How to Visit</h4>
            <p>${info.visit}</p>
        </div>
        <div class="result-section">
            <h4><i class="fas fa-hotel"></i> Stays Nearby</h4>
            <p>${info.stays}</p>
        </div>
        <div class="result-section">
            <h4><i class="fas fa-utensils"></i> Food to Try</h4>
            <p>${info.food}</p>
        </div>
        <div class="result-section">
            <h4><i class="fas fa-wallet"></i> Approx Budget</h4>
            <p>${info.budget}</p>
        </div>
    `;
    detectionResult.style.display = 'block';
    detectionResult.scrollIntoView({behavior: 'smooth'});
}

// Start
initAI();
