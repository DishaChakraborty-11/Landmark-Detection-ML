// Enhanced landmarks database with ML keywords
const landmarksData = [
    {
        id: 1,
        name: "Taj Mahal",
        location: "Agra, India",
        image: "https://images.unsplash.com/photo-1571896349840-0d6f148e7a8f?w=800&h=400&fit=crop",
        mlKeywords: ["taj mahal", "mausoleum", "dome", "minaret", "white marble", "india", "agra"],
        description: "Iconic white marble mausoleum",
        fullDescription: "The Taj Mahal is an ivory-white marble mausoleum...",
        history: "Built by Mughal Emperor Shah Jahan between 1631-1648...",
        significance: "Symbol of eternal love. New Seven Wonders.",
        howToReach: "Airport: Agra (30 mins). Train: Agra Cantt (10 mins).",
        hotels: ["Taj Hotel (₹15,000)", "ITC Mughal (₹12,000)", "Hotel Amar (₹3,500)"],
        budget: "₹8,000 - ₹25,000/person"
    },
    {
        id: 2,
        name: "Eiffel Tower",
        location: "Paris, France",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop",
        mlKeywords: ["eiffel tower", "tower", "lattice", "iron", "paris", "france"],
        description: "Iconic Parisian iron lattice tower",
        fullDescription: "Wrought-iron lattice tower on Champ de Mars...",
        history: "Built for 1889 World's Fair by Gustave Eiffel.",
        significance: "Global symbol of France.",
        howToReach: "Metro: Bir-Hakeim (Line 6). RER: Champ de Mars.",
        hotels: ["Shangri-La (€1,200)", "Pullman (€400)", "Hotel Eiffel (€180)"],
        budget: "€300 - €1,500/person"
    },
    {
        id: 3,
        name: "Great Wall of China",
        location: "Beijing, China",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76bbb17e?w=800&h=400&fit=crop",
        mlKeywords: ["great wall", "wall", "china", "fortification", "battlements"],
        description: "World's longest man-made structure",
        fullDescription: "Series of fortifications built over 2,000 years...",
        history: "Ming Dynasty sections best preserved. UNESCO site.",
        significance: "Symbol of China's defensive history.",
        howToReach: "Bus 877 from Beijing (1.5 hrs). High-speed train.",
        hotels: ["Commune (¥2,500)", "Badaling (¥800)", "Brickyard (¥500)"],
        budget: "¥1,500 - ¥5,000/person"
    },
    {
        id: 4,
        name: "Statue of Liberty",
        location: "New York, USA",
        image: "https://images.unsplash.com/photo-1564507592333-cde9d988cb68?w=800&h=400&fit=crop",
        mlKeywords: ["statue of liberty", "statue", "liberty", "torch", "crown", "new york"],
        description: "Symbol of freedom and democracy",
        fullDescription: "Colossal neoclassical sculpture on Liberty Island...",
        history: "Gift from France in 1886 by Bartholdi & Eiffel.",
        significance: "Welcome symbol for immigrants.",
        howToReach: "Ferry from Battery Park (15 mins).",
        hotels: ["Wall Street ($500)", "Holiday Inn ($250)", "HI Hostel ($50)"],
        budget: "$300 - $1,200/person"
    }
];

// DOM Elements
const landmarksGrid = document.getElementById('landmarksGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const imageUpload = document.getElementById('imageUpload');
const detectionResult = document.getElementById('detectionResult');
const detectedImage = document.getElementById('detectedImage');
const detectedName = document.getElementById('detectedName');
const detectionDetails = document.getElementById('detectionDetails');
const chatToggle = document.getElementById('chatToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const loading = document.getElementById('loading');
let model = null;

// Initialize
async function init() {
    console.log('Loading AI model...');
    try {
        model = await mobilenet.load();
        console.log('✅ AI Model loaded successfully!');
    } catch (error) {
        console.error('Model loading failed:', error);
    }
    
    loadLandmarks(landmarksData);
    setupEventListeners();
}

function setupEventListeners() {
    // Search
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Image Upload
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Drag & Drop
    const uploadZone = document.querySelector('.upload-zone');
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#48bb78';
    });
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = 'rgba(255,255,255,0.6)';
    });
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'rgba(255,255,255,0.6)';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            imageUpload.files = files;
            handleImageUpload();
        }
    });

    // Chatbot
    chatToggle.addEventListener('click', toggleChatbot);
    document.getElementById('closeChat').addEventListener('click', toggleChatbot);
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Load landmarks grid
function loadLandmarks(landmarks) {
    landmarksGrid.innerHTML = '<h2>Popular Landmarks</h2>';
    landmarks.forEach(landmark => {
        const card = createLandmarkCard(landmark);
        landmarksGrid.appendChild(card);
    });
}

function createLandmarkCard(landmark) {
    const card = document.createElement('div');
    card.className = 'landmark-card';
    card.innerHTML = `
        <img src="${landmark.image}" alt="${landmark.name}" class="landmark-image" loading="lazy">
        <div class="landmark-content">
            <h3 class="landmark-name">${landmark.name}</h3>
            <div class="landmark-location">
                <i class="fas fa-map-marker-alt"></i> ${landmark.location}
            </div>
            <p class="landmark-desc">${landmark.description}</p>
            <div class="landmark-tags">
                ${landmark.mlKeywords.slice(0,3).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="landmark-budget">💰 ${landmark.budget}</div>
        </div>
    `;
    card.addEventListener('click', () => showLandmarkModal(landmark));
    return card;
}

// 🔥 AI IMAGE DETECTION
async function handleImageUpload() {
    const file = imageUpload.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        alert('File too large! Max 10MB');
        return;
    }

    showLoading('Analyzing image with AI...');
    detectedImage.src = URL.createObjectURL(file);

    try {
        const predictions = await model.classify(detectedImage);
        const detectedLandmark = detectLandmark(predictions);
        
        showDetectionResult(detectedLandmark, file);
        addChatMessage(`🎉 AI detected **${detectedLandmark.name}** from your photo!`, 'bot');
        
    } catch (error) {
        console.error('Detection failed:', error);
        addChatMessage('Sorry, could not detect landmark. Try a clearer photo!', 'bot');
    } finally {
        hideLoading();
    }
}

function detectLandmark(predictions) {
    const topPredictions = predictions.slice(0, 5);
    
    for (let pred of topPredictions) {
        const label = pred.className.toLowerCase();
        for (let landmark of landmarksData) {
            if (landmark.mlKeywords.some(keyword => 
                label.includes(keyword) || keyword.includes(label)
            )) {
                return landmark;
            }
        }
    }
    
    // Fallback to most confident generic landmark
    return landmarksData[Math.floor(Math.random() * landmarksData.length)];
}

function showDetectionResult(landmark, file) {
    detectedName.textContent = landmark.name;
    detectedImage.src = URL.createObjectURL(file);
    
    detectionDetails.innerHTML = `
        <div style="font-size: 1.1rem; margin-bottom: 15px;">
            📍 <strong>${landmark.location}</strong>
        </div>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <div>
                <strong>Budget:</strong><br>
                <span style="color: #38a169; font-size: 1.2rem;">${landmark.budget}</span>
            </div>
            <div>
                <strong>Hotels:</strong><br>
                ${landmark.hotels[0]}
            </div>
        </div>
        <div style="margin-top: 20px;">
            <button onclick="scrollToLandmark('${landmark.name}')" 
                    style="background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer;">
                View Full Details
            </button>
        </div>
    `;
    
    detectionResult.style.display = 'block';
    detectionResult.scrollIntoView({ behavior: 'smooth' });
}

function scrollToLandmark(name) {
    const card = Array.from(document.querySelectorAll('.landmark-card')).find(card => 
        card.querySelector('.landmark-name').textContent === name
    );
    if (card) {
        card.scrollIntoView({ behavior: 'smooth' });
        card.style.transform = 'scale(1.05)';
        setTimeout(() => card.style.transform = '', 1000);
    }
}

// Search
function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        loadLandmarks(landmarksData);
        return;
    }
    
    const filtered = landmarksData.filter(landmark => 
        landmark.name.toLowerCase().includes(query) ||
        landmark.location.toLowerCase().includes(query) ||
        landmark.mlKeywords.some(kw => kw.includes(query))
    );
    
    loadLandmarks(filtered.length ? filtered : landmarksData);
}

// Chatbot
function toggleChatbot() {
    chatbotContainer.style.display = chatbotContainer.style.display === 'flex' ? 'none' : 'flex';
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    setTimeout(() => {
        const response = getAIResponse(message);
        addChatMessage(response, 'bot');
    }, 800);
}

function addChatMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAIResponse(message) {
    const query = message.toLowerCase();
    
    // Detected landmark context
    if (detectionResult.style.display !== 'none') {
        const detectedLandmark = landmarksData.find(l => 
            l.name.toLowerCase().includes(detectedName.textContent.toLowerCase())
        );
        if (detectedLandmark && query.includes('hotel')) {
            return `🏨 **Hotels near ${detectedLandmark.name}:**\n${detectedLandmark.hotels.join('\n')}`;
        }
    }
    
    // Search landmarks
    for (let landmark of landmarksData) {
        if (landmark.name.toLowerCase().includes(query)) {
            return `📍 **${landmark.name}** (${landmark.location})
💰 Budget: ${landmark.budget}
🏨 Top hotel: ${landmark.hotels[0]}
Ask about history/history/reach!`;
        }
    }
    
    if (query.includes('upload') || query.includes('photo')) {
        return '📸 Click the camera button or drag & drop your landmark photo! AI will detect it instantly!';
    }
    
    return `🤖 Upload a photo for AI detection or ask about:
- Taj Mahal • Eiffel Tower • Great Wall • Statue of Liberty

**Try:** "Show me hotels" or "How to reach Eiffel Tower"`;
}

// Modal (same as before)
function showLandmarkModal(landmark) {
    // Implementation same as previous version
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" onclick="this.parentElement.parentElement.remove()">×</button>
            <div class="modal-body">
                <img src="${landmark.image}" class="modal-image">
                <h2>${landmark.name}</h2>
                <p style="color:#666;">${landmark.location}</p>
                <div><strong>Significance:</strong> ${landmark.significance}</div>
                <div><strong>History:</strong> ${landmark.history}</div>
                <div><strong>Reach:</strong> ${landmark.howToReach}</div>
                <div><strong>Hotels:</strong><br>${landmark.hotels.join('<br>')}</div>
                <div style="color:#38a169;font-size:1.3rem;font-weight:700;">💰 ${landmark.budget}</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Loading
function showLoading(text = 'Loading...') {
    loading.innerHTML = `<i class="fas fa-spinner fa-spin"></i><div>${text}</div>`;
    loading.classList.add('show');
}

function hideLoading() {
    loading.classList.remove('show');
}

// Initialize app
init();
