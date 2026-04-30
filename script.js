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
        console.log("Loading MobileNet...");
        model = await mobilenet.load();
        statusText.innerHTML = "✅ AI Ready - Click to Upload";
    } catch (e) {
        statusText.innerHTML = "❌ AI Load Failed - Refresh Page";
        console.error("Model load error:", e);
    }
}

// 2. Handle Click
uploadZone.onclick = () => imageUpload.click();

// 3. Handle File selection
imageUpload.onchange = (e) => {
    if (e.target.files && e.target.files[0]) {
        analyzeImage(e.target.files[0]);
    }
};

// 4. Main Analysis Logic
async function analyzeImage(file) {
    // Show loading UI
    loading.classList.add('show');
    
    try {
        // Convert file to image object
        const img = new Image();
        const objectURL = URL.createObjectURL(file);
        img.src = objectURL;

        img.onload = async () => {
            // Display the preview
            detectedImage.src = objectURL;
            
            // Run AI Detection
            const predictions = await model.classify(img);
            const topResult = predictions[0].className.split(',')[0];
            const confidence = predictions[0].probability;

            console.log("AI Detected:", topResult);

            // Try to get tourism info, but don't crash if it fails
            await fetchTourismData(topResult, confidence);
            
            loading.classList.remove('show');
        };
    } catch (err) {
        console.error("Analysis crashed:", err);
        alert("Something went wrong with the image scan.");
        loading.classList.remove('show');
    }
}

// 5. Wikipedia & Tourism Data (With Error Handling)
async function fetchTourismData(query, confidence) {
    // Default fallback info
    let info = {
        name: query.toUpperCase(),
        desc: "A significant architectural landmark identified by AI.",
        visit: "Check local travel advisories for entry times and transport.",
        stays: "Wide range of hotels and local guest houses available nearby.",
        food: "Popular for regional delicacies and street food markets.",
        budget: "$50 - $200 USD per day (estimated)."
    };

    try {
        // Try to fetch from Wikipedia
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
        const response = await fetch(wikiUrl);
        
        if (response.ok) {
            const data = await response.json();
            info.name = data.title;
            info.desc = data.extract;
        }
    } catch (err) {
        console.warn("Wikipedia fetch failed, using AI defaults.");
    }

    displayFinalResult(info, confidence);
}

// 6. Final UI Update
function displayFinalResult(info, confidence) {
    detectedName.innerText = info.name;
    detectionDetails.innerHTML = `
        <div class="result-section">
            <h4 style="color:#38a169">🎯 AI Match: ${(confidence*100).toFixed(1)}%</h4>
        </div>
        <div class="result-section">
            <h4><i class="fas fa-info-circle"></i> About</h4>
            <p>${info.desc}</p>
        </div>
        <div class="result-section">
            <h4><i class="fas fa-plane"></i> Travel Info</h4>
            <p>${info.visit}</p>
        </div>
        <div class="result-section">
            <h4><i class="fas fa-utensils"></i> Culture & Food</h4>
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

initAI();
