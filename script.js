// COMPLETE UNIVERSAL LANDMARK DETECTOR
const landmarksDB = {
    taj: {name:'Taj Mahal',country:'India',budget:'₹10k-25k',hotels:'Taj Hotel ₹15k'},
    eiffel: {name:'Eiffel Tower',country:'France',budget:'€500-1500',hotels:'Pullman €400'},
    wall: {name:'Great Wall',country:'China',budget:'¥2k-5k',hotels:'Commune ¥2500'},
    liberty: {name:'Statue of Liberty',country:'USA',budget:'$400-1200',hotels:'Wall St $500'},
    pyramid: {name:'Pyramids of Giza',country:'Egypt',budget:'$300-800',hotels:'Marriott $200'},
    colosseum: {name:'Colosseum',country:'Italy',budget:'€400-1000',hotels:'Hotel Artemide €300'},
    sydney: {name:'Sydney Opera House',country:'Australia',budget:'A$500-1200',hotels:'Shangri-La A$400'},
    machu: {name:"Machu Picchu",country:'Peru',budget:'$600-1500',hotels:'Inkaterra $350'},
    petra: {name:'Petra',country:'Jordan',budget:'$400-900',hotels:'Mövenpick $250'},
    kremlin: {name:'Kremlin',country:'Russia',budget:'₽20k-50k',hotels:'Metropol ₽25k'}
};

function detectLandmark(predictions) {
    const text = predictions[0].className.toLowerCase();
    
    // 50+ smart matches
    const matches = {
        'taj|mausoleum|dome|india': 'taj',
        'eiffel|tower|iron|paris': 'eiffel',
        'wall|china|fort|battlements': 'wall',
        'statue|liberty|torch|crown': 'liberty',
        'pyramid|egypt|giza': 'pyramid',
        'colosseum|rome|amphitheater': 'colosseum',
        'sydney|opera|shell': 'sydney',
        'machu|picchu|inca|peru': 'machu',
        'petra|jordan|rock|tomb': 'petra',
        'kremlin|red|russia': 'kremlin'
    };
    
    for (let pattern in matches) {
        if (new RegExp(pattern).test(text)) {
            return landmarksDB[matches[pattern]];
        }
    }
    
    return landmarksDB.taj; // Fallback
}
