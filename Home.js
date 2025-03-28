// === app.js ===

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    setTimeout(initializeDashboard, 50);
});

// --- Data ---
const marketSummary = { 
    text: "Markets exhibit cautious optimism. Nifty holds above 22k support, driven by select heavyweights. Midcaps see profit booking. FIIs turn net buyers after several sessions, providing support. Global cues remain mixed.", 
    sentiment: 'neutral' 
};
let indices = [
    { id: 'i1', name: 'NIFTY 50', price: '22,185.20', change: '+90.00', percentChange: '+0.41%', open: '22,120.10', high: '22,210.50', low: '22,090.80', prevClose: '22,095.20' },
    { id: 'i2', name: 'SENSEX', price: '73,110.80', change: '+341.43', percentChange: '+0.47%', open: '72,850.00', high: '73,150.00', low: '72,750.00', prevClose: '72,769.37' },
    { id: 'i3', name: 'BANK NIFTY', price: '46,590.50', change: '-173.90', percentChange: '-0.37%', open: '46,800.00', high: '46,850.00', low: '46,550.00', prevClose: '46,764.40' },
    { id: 'i4', name: 'NIFTY IT', price: '33,780.10', change: '+129.30', percentChange: '+0.38%' },
    { id: 'i5', name: 'NIFTY AUTO', price: '16,010.90', change: '+60.50', percentChange: '+0.38%' },
];
const trendingStocksData = [
    { name: 'ZEEL', price: '145.80', change: '+8.50%' },
    { name: 'RELIANCE', price: '2,855.20', change: '+0.35%' },
    { name: 'YESBANK', price: '23.50', change: '+2.17%' },
    { name: 'TATAMOTORS', price: '992.10', change: '+0.36%' },
    { name: 'IRFC', price: '140.75', change: '-1.54%' },
];
const marketMoversData = {
    gainers: [
        { name: 'ZEEL', change: '+8.50%' },
        { name: 'PAYTM', change: '+5.00%' },
        { name: 'INDUSTOWER', change: '+4.80%' },
        { name: 'BHEL', change: '+4.55%' },
    ],
    losers: [
        { name: 'IRFC', change: '-1.54%' },
        { name: 'SAIL', change: '-1.20%' },
        { name: 'BANDHANBNK', change: '-1.15%' },
        { name: 'IDEA', change: '-1.05%' },
    ]
};
const sectorPerformanceData = [
    { name: 'NIFTY MEDIA', change: '+3.50%' },
    { name: 'NIFTY PSU BANK', change: '+1.20%' },
    { name: 'NIFTY REALTY', change: '+0.95%' },
    { name: 'NIFTY AUTO', change: '+0.38%' },
    { name: 'NIFTY IT', change: '+0.38%' },
    { name: 'NIFTY BANK', change: '-0.37%' },
    { name: 'NIFTY METAL', change: '-0.85%' },
];
let watchlist = [
    { id: 's1', name: 'RELIANCE', price: '2,855.20', change: '+9.30', percentChange: '+0.33%', indicator: 'HOLD', aiConfidence: 75, open: '2860.00', high: '2868.50', low: '2842.00', prevClose: '2845.90', marketCap: '19.3T', volume: '3.5M', avgVolume: '4.1M', predictedRange: { min: '2,820', max: '2,900' }, fiiDii: { fii: '+150', dii: '+210' }, volumeAnalysis: 'Avg Volume', blockDeals: [] },
    { id: 's2', name: 'TCS', price: '4,018.80', change: '-6.35', percentChange: '-0.16%', indicator: 'HOLD', aiConfidence: 70, open: '4030.00', high: '4045.00', low: '4010.50', prevClose: '4025.15', marketCap: '14.5T', volume: '1.8M', avgVolume: '2.2M', predictedRange: { min: '3,980', max: '4,100' }, fiiDii: { fii: '-80', dii: '+120' }, volumeAnalysis: 'Below Avg Volume', blockDeals: ['JPM sold 80k shares @ 4022'] },
    { id: 's13', name: 'TATAMOTORS', price: '992.10', change: '+3.60', percentChange: '+0.36%', indicator: 'BUY', aiConfidence: 82, open: '988.00', high: '995.50', low: '985.00', prevClose: '988.50', marketCap: '3.3T', volume: '12.1M', avgVolume: '10.5M', predictedRange: { min: '970', max: '1020' }, fiiDii: { fii: '+250', dii: '+150' }, volumeAnalysis: 'High Volume', blockDeals: [] },
    { id: 's7', name: 'SBIN', price: '747.00', change: '-1.50', percentChange: '-0.20%', indicator: 'HOLD', aiConfidence: 68, open: '750.00', high: '752.80', low: '745.10', prevClose: '748.50', marketCap: '6.7T', volume: '15.2M', avgVolume: '18.0M', predictedRange: { min: '735', max: '765' }, fiiDii: { fii: '-120', dii: '+190' }, volumeAnalysis: 'Avg Volume', blockDeals: [] },
    { id: 's4', name: 'INFY', price: '1,578.50', change: '+6.20', percentChange: '+0.39%', indicator: 'HOLD', aiConfidence: 71, open: '1570.00', high: '1585.00', low: '1568.30', prevClose: '1572.30', marketCap: '6.5T', volume: '4.5M', avgVolume: '5.1M', predictedRange: { min: '1,550', max: '1,610' }, fiiDii: { fii: '+90', dii: '+60' }, volumeAnalysis: 'Below Avg Volume', blockDeals: [] },
];
const allAvailableStocks = [
    { id: 's1', name: 'RELIANCE', price: '2,855.20', change: '+9.30' },
    { id: 's2', name: 'TCS', price: '4,018.80', change: '-6.35' },
    { id: 's3', name: 'HDFCBANK', price: '1,668.00', change: '-2.45' },
    { id: 's4', name: 'INFY', price: '1,578.50', change: '+6.20' },
    { id: 's5', name: 'ICICIBANK', price: '1,054.10', change: '+1.40' },
    { id: 's6', name: 'BHARTIARTL', price: '883.00', change: '+1.75' },
    { id: 's7', name: 'SBIN', price: '747.00', change: '-1.50' },
    { id: 's8', name: 'LICI', price: '908.00', change: '+3.00' },
    { id: 's9', name: 'HINDUNILVR', price: '2,460.15', change: '+4.50' },
    { id: 's10', name: 'ITC', price: '427.50', change: '-0.60' },
    { id: 's11', name: 'BAJFINANCE', price: '7,140.00', change: '-10.50' },
    { id: 's12', name: 'ADANIENT', price: '3,115.00', change: '+10.00' },
    { id: 's13', name: 'TATAMOTORS', price: '992.10', change: '+3.60' },
    { id: 's14', name: 'AXISBANK', price: '1083.20', change: '+3.10' },
    { id: 's15', name: 'LT', price: '3555.00', change: '+4.25' },
    { id: 's16', name: 'KOTAKBANK', price: '1845.00', change: '-5.20' },
    { id: 's17', name: 'PAYTM', price: '410.50', change: '+19.55' },
    { id: 's18', name: 'ZEEL', price: '145.80', change: '+11.50' },
    { id: 's19', name: 'ZOMATO', price: '190.20', change: '+2.80' },
    { id: 's20', name: 'IRFC', price: '140.75', change: '-2.20' },
];
const allAvailableIndices = [
    { id: 'i1', name: 'NIFTY 50', price: '22,185.20', change: '+90.00' },
    { id: 'i2', name: 'SENSEX', price: '73,110.80', change: '+341.43' },
    { id: 'i3', name: 'BANK NIFTY', price: '46,590.50', change: '-173.90' },
    { id: 'i4', name: 'NIFTY IT', price: '33,780.10', change: '+129.30' },
    { id: 'i5', name: 'NIFTY AUTO', price: '16,010.90', change: '+60.50' },
    { id: 'i6', name: 'NIFTY PHARMA', price: '14,200.50', change: '+20.55' },
    { id: 'i7', name: 'NIFTY FMCG', price: '48,300.10', change: '+76.50' },
    { id: 'i8', name: 'NIFTY MIDCAP 100', price: '38,750.80', change: '+50.60' },
    { id: 'i9', name: 'NIFTY SMALLCAP 100', price: '12,520.00', change: '+19.50' },
    { id: 'i10', name: 'INDIA VIX', price: '14.50', change: '+0.85' }
];

// --- State Variables ---
let activePriceAlerts = {};
let currentModalItemsData = [];
let currentModalType = '';
let notificationTimeout;
let dataUpdateInterval;
let appSettings = { stockAlerts: true, newsAlerts: true, aiAlerts: false, watchlistAlerts: true, popupAlerts: true };

// --- DOM Elements ---
const profileBtn = document.getElementById('profileBtn');
const profilePanel = document.getElementById('profilePanel');
const logoutBtn = document.getElementById('logoutBtn');
const voiceBtn = document.getElementById('voiceBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const refreshBtn = document.getElementById('refreshBtn');
const notificationBtn = document.getElementById('notificationBtn');
const notificationBadge = document.getElementById('notificationBadge');
const settingsEntryBtn = document.getElementById('settingsEntryBtn');
const addIndexBtn = document.getElementById('addIndexBtn');
const addStockBtn = document.getElementById('addStockBtn');
const sortWatchlistSelect = document.getElementById('sortWatchlist');
const marketSummaryTextEl = document.getElementById('marketSummaryText');
const trendingStocksContainer = document.getElementById('trendingStocks');
const marketIndicesContainer = document.getElementById('marketIndices');
const watchlistItemsContainer = document.getElementById('watchlistItems');
const marketMoversContent = document.getElementById('marketMoversContent');
const marketMoversTabs = document.querySelector('.market-movers-tabs');
const sectorListContainer = document.getElementById('sectorList');
const listModal = document.getElementById('listModal');
const modalTitle = document.getElementById('modalTitle');
const modalItems = document.getElementById('modalItems');
const modalSearch = document.getElementById('modalSearch');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalLoading = document.getElementById('modalLoading');
const modalEmpty = document.getElementById('modalEmpty');
const modalOverlay = document.querySelector('#listModal .modal-overlay');
const settingsModal = document.getElementById('settingsModal');
const settingsModalCloseBtn = document.getElementById('settingsModalCloseBtn');
const settingsModalOverlay = document.querySelector('#settingsModal .modal-overlay');
const settingsToggles = settingsModal?.querySelectorAll('.switch input[type="checkbox"]');
const settingsThemeButtons = settingsModal?.querySelectorAll('.theme-option');
const notificationToast = document.getElementById('notificationToast');
const notificationText = document.getElementById('notificationText');
const toastCloseBtn = document.getElementById('toastCloseBtn');

// --- Helper Functions ---
function getSentimentEmoji(changePercentStr) {
    const percent = parseFloat(String(changePercentStr).replace(/[+%]/g, '')) || 0;
    if (percent > 1.5) return '';
    if (percent > 0.3) return '';
    if (percent < -1.5) return '';
    if (percent < -0.3) return '';
    return '→';
}

function formatMarketCap(marketCapStr) {
    return marketCapStr ? `${marketCapStr}` : '-';
}

function formatVolume(volumeStr) {
    if (!volumeStr) return '-';
    const num = parseFloat(String(volumeStr).replace(/[MK]/gi, ''));
    if (isNaN(num)) return volumeStr;
    if (String(volumeStr).toUpperCase().includes('M')) return `${num.toFixed(1)}M`;
    if (String(volumeStr).toUpperCase().includes('K')) return `${num.toFixed(0)}K`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
}

function calculatePercentChange(priceStr, changeStr) {
    const price = parseFloat(String(priceStr).replace(/,/g, ''));
    const change = parseFloat(String(changeStr).replace(/,/g, '').replace(/[+%]/g, ''));
    if (isNaN(price) || isNaN(change) || price === 0) return '+0.00%';
    if (String(changeStr).includes('%')) {
        return (change >= 0 ? '+' : '') + Math.abs(change).toFixed(2) + '%';
    }
    const originalPrice = price - change;
    if (originalPrice === 0 || isNaN(originalPrice)) return (change >= 0 ? '+' : '') + 'N/A';
    const percent = (change / originalPrice) * 100;
    return (percent >= 0 ? '+' : '') + percent.toFixed(2) + '%';
}

// --- Render Functions ---
function renderMarketSummary() {
    marketSummaryTextEl.textContent = marketSummary.text;
    const flameSpan = document.querySelector('.sentiment-flame');
    if (flameSpan) flameSpan.style.display = marketSummary.sentiment === 'positive' ? 'inline' : 'none';
    const breadthContainer = document.querySelector('.market-breadth-placeholder');
    if (breadthContainer) {
        breadthContainer.innerHTML = `<span class="breadth-label">Breadth:</span><span class="advances"><i data-lucide="arrow-up"></i> 1310</span><span class="declines"><i data-lucide="arrow-down"></i> 740</span><span class="unchanged"><i data-lucide="minus"></i> 120</span>`;
        lucide.createIcons();
    }
}

function renderTrendingStocks() {
    if (!trendingStocksData || trendingStocksData.length === 0) {
        trendingStocksContainer.innerHTML = '<p class="text-muted text-sm px-2 py-4 text-center">No trending stocks.</p>';
        return;
    }
    trendingStocksContainer.innerHTML = trendingStocksData.map(stock => 
        `<div class="trending-item"><div><span class="trending-name">${stock.name}</span><span class="price-container">₹${stock.price}</span></div><span class="change-pill ${stock.change.startsWith('+') ? 'change-up' : 'change-down'}">${stock.change}</span></div>`
    ).join('');
    flashPriceChanges('#trendingStocks .trending-item', true);
}

function renderIndices() {
    if (!indices || indices.length === 0) {
        marketIndicesContainer.innerHTML = '<p class="text-muted text-sm px-2 py-4 text-center">No indices added.</p>';
        return;
    }
    marketIndicesContainer.innerHTML = indices.map(index => 
        `<div class="index-item"><div><h3>${index.name}</h3><span class="price-container">₹${index.price}</span></div><span class="change-pill ${index.percentChange.startsWith('+') ? 'change-up' : 'change-down'}">${index.percentChange}</span></div>`
    ).join('');
    flashPriceChanges('#marketIndices .index-item');
}

function renderMarketMovers(type = 'gainers') {
    const movers = marketMoversData[type] || [];
    if (movers.length === 0) {
        marketMoversContent.innerHTML = `<p class="text-muted text-sm px-2 py-4 text-center">No ${type} data.</p>`;
        return;
    }
    marketMoversContent.innerHTML = movers.map(mover => 
        `<div class="mover-item"><span class="name">${mover.name}</span><span class="change ${mover.change.startsWith('+') ? 'change-up' : 'change-down'}">${mover.change}</span></div>`
    ).join('');
}

function renderSectorPerformance() {
    if (!sectorPerformanceData || sectorPerformanceData.length === 0) {
        sectorListContainer.innerHTML = '<p class="text-muted text-sm px-2 py-4 text-center">No sector data.</p>';
        return;
    }
    sectorListContainer.innerHTML = sectorPerformanceData.map(sector => 
        `<div class="sector-item"><span class="name">${sector.name}</span><span class="change ${sector.change.startsWith('+') ? 'change-up' : 'change-down'}">${sector.change}</span></div>`
    ).join('');
}

function renderWatchlist() {
    if (!watchlist || watchlist.length === 0) {
        watchlistItemsContainer.innerHTML = `<div class="text-center text-muted p-6">Your watchlist is empty.<br>Use the 'Add Stock' button.</div>`;
        return;
    }
    watchlistItemsContainer.innerHTML = watchlist.map(stock => `
        <div class="watchlist-item" data-stock-id="${stock.id}">
            <div class="watchlist-header ${activePriceAlerts[stock.id] ? 'has-alert' : ''}" role="button" tabindex="0" aria-expanded="false" aria-controls="details-${stock.id}">
                <span class="expand-icon"><i data-lucide="chevron-down"></i></span>
                <div class="watchlist-info">
                    <span class="watchlist-sentiment-emoji" title="Day Sentiment">${getSentimentEmoji(stock.percentChange)}</span>
                    <span class="watchlist-name" title="${stock.name}">${stock.name}</span>
                </div>
                <span class="watchlist-price price-container">₹${stock.price}</span>
                <span class="watchlist-change price-change">
                    <span class="change-pill ${stock.change.startsWith('+') ? 'change-up' : 'change-down'}">${stock.change} (${stock.percentChange})</span>
                </span>
                <span class="watchlist-indicator-ai">
                    <span class="stock-indicator ${stock.indicator.toLowerCase()}">${stock.indicator}</span>
                    <span class="ai-confidence-display" title="AI Confidence: ${stock.aiConfidence}%">
                        <span class="confidence-bar-container"><span class="confidence-bar" style="width: ${stock.aiConfidence}%;"></span></span> ${stock.aiConfidence}%
                    </span>
                </span>
            </div>
            <div class="watchlist-details" id="details-${stock.id}">
                <div class="watchlist-details-content">
                    <div class="details-grid-group">
                        <h4><i data-lucide="candlestick-chart"></i> Price Details</h4>
                        <p><span class="details-label">Open:</span> <span class="details-value">₹${stock.open || '-'}</span></p>
                        <p><span class="details-label">High:</span> <span class="details-value">₹${stock.high || '-'}</span></p>
                        <p><span class="details-label">Low:</span> <span class="details-value">₹${stock.low || '-'}</span></p>
                        <p><span class="details-label">Prev Close:</span> <span class="details-value">₹${stock.prevClose || '-'}</span></p>
                    </div>
                    <div class="details-grid-group">
                        <h4><i data-lucide="info"></i> Market Info</h4>
                        <p><span class="details-label">Market Cap:</span> <span class="details-value">${formatMarketCap(stock.marketCap)}</span></p>
                        <p><span class="details-label">Volume:</span> <span class="details-value">${formatVolume(stock.volume)}</span></p>
                        <p><span class="details-label">Avg Volume:</span> <span class="details-value">${formatVolume(stock.avgVolume)}</span></p>
                    </div>
                    <div class="details-grid-group">
                        <h4><i data-lucide="brain-circuit"></i> AI Prediction</h4>
                        <p><span class="details-label">Pred. Range:</span> <span class="details-value">₹${stock.predictedRange.min} - ₹${stock.predictedRange.max}</span></p>
                    </div>
                    <div class="details-grid-group">
                        <h4><i data-lucide="landmark"></i> Institutional Flows (Cr)</h4>
                        <p class="fii-dii-data">
                            <span class="${stock.fiiDii.fii.startsWith('+') ? 'fii-positive' : 'fii-negative'}"><i data-lucide="globe"></i> FII: ${stock.fiiDii.fii}</span>
                            <span class="${stock.fiiDii.dii.startsWith('+') ? 'fii-positive' : 'fii-negative'}"><i data-lucide="building"></i> DII: ${stock.fiiDii.dii}</span>
                        </p>
                    </div>
                    ${stock.blockDeals && stock.blockDeals.length > 0 ? `
                        <div class="details-grid-group" style="grid-column: 1 / -1;">
                            <h4><i data-lucide="boxes"></i> Recent Block Deals</h4>
                            <ul class="block-deals-list">${stock.blockDeals.map(deal => `<li>${deal}</li>`).join('')}</ul>
                        </div>` : ''}
                    <div class="alert-section">
                        <h5><i data-lucide="bell-plus"></i> Set Price Alert</h5>
                        <label for="alert-price-${stock.id}" class="sr-only">Target Price</label>
                        <input type="number" id="alert-price-${stock.id}" placeholder="Target" class="alert-target-price" aria-label="Target Price">
                        <button class="btn btn-sm set-alert-btn" data-stock-id="${stock.id}">Set</button>
                        ${activePriceAlerts[stock.id] ? `<p class="alert-active">Alert: ${activePriceAlerts[stock.id].direction === 'above' ? '>' : '<'} ₹${activePriceAlerts[stock.id].target}</p>` : ''}
                    </div>
                    <button class="sell-button" data-stock-id="${stock.id}" title="Sell Action (Not Implemented)">
                        <i data-lucide="minus-circle"></i> Sell ${stock.name}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    addWatchlistExpansionListeners();
    addAlertListeners();
    addSellButtonListeners();
    lucide.createIcons();
}

// --- Modal Logic ---
function showListModal(type) {
    currentModalType = type;
    modalTitle.textContent = type === 'stock' ? 'Add Stock' : 'Add Index';
    modalSearch.value = '';
    modalItems.innerHTML = '';
    modalEmpty.classList.add('hidden');
    modalLoading.classList.remove('hidden');
    listModal.classList.remove('hidden');
    modalSearch.focus();
    setTimeout(() => {
        currentModalItemsData = (type === 'stock') ? [...allAvailableStocks] : [...allAvailableIndices];
        renderModalItems(currentModalItemsData);
        modalLoading.classList.add('hidden');
    }, 150);
}

function renderModalItems(items) {
    const existingIds = (currentModalType === 'stock') ? new Set(watchlist.map(item => item.id)) : new Set(indices.map(item => item.id));
    if (items.length === 0) {
        modalItems.innerHTML = '';
        modalEmpty.classList.remove('hidden');
    } else {
        modalEmpty.classList.add('hidden');
        modalItems.innerHTML = items.map(item => {
            const isAdded = existingIds.has(item.id);
            return `<div class="flex justify-between items-center"><div class="modal-item-info"><h3>${item.name}</h3><p>₹${item.price} (${item.change || 'N/A'})</p></div><button class="add-item-btn" data-id="${item.id}" data-name="${item.name}" data-type="${currentModalType}" ${isAdded ? 'disabled title="Already added"' : 'title="Add to list"'} aria-label="${isAdded ? `Added ${item.name}` : `Add ${item.name}`}"><i data-lucide="${isAdded ? 'check' : 'plus'}"></i></button></div>`;
        }).join('');
    }
    lucide.createIcons();
}

function closeModal(modalElement) {
    modalElement.classList.add('hidden');
}

function handleAddItem(event) {
    const button = event.target.closest('.add-item-btn');
    if (!button || button.disabled) return;
    const id = button.dataset.id, type = button.dataset.type, name = button.dataset.name;
    const itemToAdd = currentModalItemsData.find(item => item.id === id);
    if (!itemToAdd) return;
    if (type === 'stock') {
        const newStockItem = {
            id: itemToAdd.id,
            name: itemToAdd.name,
            price: itemToAdd.price,
            change: itemToAdd.change || '+0.00',
            percentChange: calculatePercentChange(itemToAdd.price, itemToAdd.change || '+0.00'),
            indicator: 'HOLD',
            aiConfidence: Math.floor(Math.random() * 40 + 55),
            open: '-',
            high: '-',
            low: '-',
            prevClose: '-',
            marketCap: '-',
            volume: '-',
            avgVolume: '-',
            predictedRange: { min: (parseFloat(itemToAdd.price.replace(/,/g, '')) * 0.97).toFixed(0), max: (parseFloat(itemToAdd.price.replace(/,/g, '')) * 1.03).toFixed(0) },
            fiiDii: { fii: (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 150 + 10), dii: (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 120 + 10) },
            volumeAnalysis: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            blockDeals: []
        };
        watchlist.push(newStockItem);
        sortWatchlist(sortWatchlistSelect.value);
    } else {
        const newIndexItem = {
            id: itemToAdd.id,
            name: itemToAdd.name,
            price: itemToAdd.price,
            change: itemToAdd.change || '+0.00',
            percentChange: calculatePercentChange(itemToAdd.price, itemToAdd.change || '+0.00'),
            open: itemToAdd.open || '-',
            high: itemToAdd.high || '-',
            low: itemToAdd.low || '-',
            prevClose: itemToAdd.prevClose || '-'
        };
        indices.push(newIndexItem);
        renderIndices();
    }
    button.disabled = true;
    button.innerHTML = '<i data-lucide="check"></i>';
    button.title = "Added";
    lucide.createIcons();
    showNotification(`${name} added`, 'success', 2000);
}

// --- Watchlist Feature Logic ---
function addWatchlistExpansionListeners() {
    watchlistItemsContainer.querySelectorAll('.watchlist-header').forEach(header => {
        header.removeEventListener('click', toggleDetails);
        header.removeEventListener('keydown', handleDetailsKeydown);
        header.addEventListener('click', toggleDetails);
        header.addEventListener('keydown', handleDetailsKeydown);
    });
}

function handleDetailsKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDetails.call(this);
    }
}

function toggleDetails() {
    const details = this.nextElementSibling;
    if (details && details.classList.contains('watchlist-details')) {
        const isVisible = !details.classList.contains('visible');
        details.classList.toggle('visible', isVisible);
        this.setAttribute('aria-expanded', isVisible);
        this.classList.toggle('expanded', isVisible);
        const chevron = this.querySelector('.expand-icon i');
        if (chevron) {
            chevron.style.transform = isVisible ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }
}

function addAlertListeners() {
    watchlistItemsContainer.querySelectorAll('.set-alert-btn').forEach(button => {
        button.removeEventListener('click', handleSetAlert);
        button.addEventListener('click', handleSetAlert);
    });
}

function handleSetAlert(event) {
    const stockId = event.target.dataset.stockId;
    const itemElement = event.target.closest('.watchlist-item');
    const input = itemElement.querySelector('.alert-target-price');
    const targetPrice = parseFloat(input.value);
    if (!stockId || isNaN(targetPrice) || targetPrice <= 0) {
        showNotification("Invalid target price.", 'warning');
        input.focus();
        input.select();
        return;
    }
    const currentStock = watchlist.find(s => s.id === stockId);
    if (!currentStock) return;
    const currentPrice = parseFloat(currentStock.price.replace(/,/g, ''));
    const direction = targetPrice > currentPrice ? 'above' : 'below';
    activePriceAlerts[stockId] = { target: targetPrice, direction: direction };
    showNotification(`Alert set for ${currentStock.name} ${direction === 'above' ? '>' : '<'} ₹${targetPrice}`, 'success', 3000);
    const alertSection = itemElement.querySelector('.alert-section');
    const alertActiveP = alertSection.querySelector('.alert-active');
    const newAlertText = `Alert: ${direction === 'above' ? '>' : '<'} ₹${targetPrice}`;
    if (alertActiveP) {
        alertActiveP.textContent = newAlertText;
    } else {
        const newP = document.createElement('p');
        newP.className = 'alert-active';
        newP.textContent = newAlertText;
        alertSection.appendChild(newP);
    }
    input.value = '';
    itemElement.querySelector('.watchlist-header')?.classList.add('has-alert');
}

function sortWatchlist(sortBy) {
    const parseNum = (str) => parseFloat(String(str).replace(/,/g, '')) || 0;
    const parsePercent = (str) => parseFloat(String(str).replace(/[+%]/g, '')) || 0;
    switch (sortBy) {
        case 'name-asc':
            watchlist.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            watchlist.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'change-desc':
            watchlist.sort((a, b) => parsePercent(b.percentChange) - parsePercent(a.percentChange));
            break;
        case 'change-asc':
            watchlist.sort((a, b) => parsePercent(a.percentChange) - parsePercent(b.percentChange));
            break;
        case 'confidence-desc':
            watchlist.sort((a, b) => b.aiConfidence - a.aiConfidence);
            break;
        case 'default':
        default:
            watchlist.sort((a, b) => parseInt(a.id.replace(/[^0-9]/g, ''), 10) - parseInt(b.id.replace(/[^0-9]/g, ''), 10));
            break;
    }
    renderWatchlist();
}

function addSellButtonListeners() {
    watchlistItemsContainer.querySelectorAll('.sell-button').forEach(button => {
        button.removeEventListener('click', handleSellAction);
        button.addEventListener('click', handleSellAction);
    });
}

function handleSellAction(event) {
    const stockId = event.target.dataset.stockId;
    const stock = watchlist.find(s => s.id === stockId);
    showNotification(`Sell action for ${stock?.name || 'stock'} not implemented.`, 'info');
}

// --- Settings Logic ---
function openSettingsModal() {
    settingsModal.classList.remove('hidden');
    loadSettings();
}

function closeSettingsModal() {
    settingsModal.classList.add('hidden');
}

function loadSettings() {
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
        appSettings = JSON.parse(storedSettings);
    }
    applySettingsToUI();
}

function applySettingsToUI() {
    if (settingsToggles) {
        for (const key in appSettings) {
            const toggle = document.getElementById(`toggle${key.charAt(0).toUpperCase() + key.slice(1).replace('Alerts','')}`);
            if (toggle) {
                toggle.checked = appSettings[key];
            }
        }
    }
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    settingsThemeButtons?.forEach(button => {
        button.classList.toggle('active', button.dataset.theme === currentTheme);
    });
    lucide.createIcons();
}

function handleSettingsChange(event) {
    if (event.target.type === 'checkbox') {
        const key = event.target.id.replace('toggle', '').replace(/^[A-Z]/, c => c.toLowerCase()) + 'Alerts';
        if (key in appSettings) {
            appSettings[key] = event.target.checked;
            localStorage.setItem('appSettings', JSON.stringify(appSettings));
            console.log('Settings updated:', appSettings);
        }
    }
}

function handleSettingsThemeChange(event) {
    const button = event.target.closest('.theme-option');
    if (button && !button.classList.contains('active')) {
        const newTheme = button.dataset.theme;
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        applySettingsToUI();
    }
}

// --- Simulation & Updates ---
function simulateDataUpdate() {
    let watchlistUpdated = false, indicesUpdated = false, trendingUpdated = false, moversUpdated = false, sectorsUpdated = false;
    watchlist = watchlist.map(stock => {
        const currentPrice = parseFloat(stock.price.replace(/,/g, ''));
        const changeFactor = (Math.random() - 0.49) * 0.018;
        let newPrice = Math.max(currentPrice * (1 + changeFactor), 0.01);
        const priceDiff = newPrice - currentPrice;
        if (Math.abs(priceDiff) < 0.01 && Math.random() < 0.7) return stock;
        watchlistUpdated = true;
        if (activePriceAlerts[stock.id]) {
            const alertInfo = activePriceAlerts[stock.id];
            const crossedAbove = alertInfo.direction === 'above' && currentPrice < alertInfo.target && newPrice >= alertInfo.target;
            const crossedBelow = alertInfo.direction === 'below' && currentPrice > alertInfo.target && newPrice <= alertInfo.target;
            if (crossedAbove || crossedBelow) {
                if (appSettings.stockAlerts || appSettings.popupAlerts) showNotification(`ALERT: ${stock.name} ${crossedBelow ? 'hit' : 'crossed'} ₹${alertInfo.target}! Now ₹${newPrice.toFixed(2)}`, 'warning', 10000);
                delete activePriceAlerts[stock.id];
                setTimeout(() => {
                    document.querySelector(`.watchlist-item[data-stock-id="${stock.id}"] .watchlist-header`)?.classList.remove('has-alert');
                }, 100);
            }
        }
        const newPriceStr = newPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const newChangeStr = (priceDiff >= 0 ? '+' : '') + priceDiff.toFixed(2);
        const newPercentStr = calculatePercentChange(newPriceStr, newChangeStr);
        const high = Math.max(parseFloat(stock.high?.replace(/,/g, '') || newPrice), newPrice);
        const low = Math.min(parseFloat(stock.low?.replace(/,/g, '') || newPrice), newPrice);
        return {
            ...stock,
            price: newPriceStr,
            change: newChangeStr,
            percentChange: newPercentStr,
            high: high.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            low: low.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            aiConfidence: Math.max(50, Math.min(95, stock.aiConfidence + Math.floor(Math.random() * 7) - 3))
        };
    });
    indices = indices.map(index => {
        const currentPrice = parseFloat(index.price.replace(/,/g, ''));
        const changeFactor = (Math.random() - 0.495) * 0.009;
        let newPrice = currentPrice * (1 + changeFactor);
        const priceDiff = newPrice - currentPrice;
        if (Math.abs(priceDiff) < 0.01 && Math.random() < 0.6) return index;
        indicesUpdated = true;
        const newPriceStr = newPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const newChangeStr = (priceDiff >= 0 ? '+' : '') + priceDiff.toFixed(2);
        const newPercentStr = calculatePercentChange(newPriceStr, newChangeStr);
        return { ...index, price: newPriceStr, change: newChangeStr, percentChange: newPercentStr };
    });
    trendingStocksData.forEach(stock => {
        const currentPrice = parseFloat(stock.price.replace(/,/g, ''));
        const changeFactor = (Math.random() - 0.48) * 0.025;
        let newPrice = Math.max(currentPrice * (1 + changeFactor), 0.01);
        const priceDiff = newPrice - currentPrice;
        if (Math.abs(priceDiff) > 0.01 || Math.random() < 0.15) {
            trendingUpdated = true;
            stock.price = newPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const originalPrice = newPrice / (1 + changeFactor);
            const percentChange = ((newPrice - originalPrice) / originalPrice) * 100;
            stock.change = (percentChange >= 0 ? '+' : '') + percentChange.toFixed(2) + '%';
        }
    });
    if (Math.random() < 0.15) moversUpdated = true;
    if (Math.random() < 0.15) sectorsUpdated = true;
    if (watchlistUpdated) { renderWatchlist(); flashPriceChanges('#watchlistItems .watchlist-item'); }
    if (indicesUpdated) { renderIndices(); flashPriceChanges('#marketIndices .index-item'); }
    if (trendingUpdated) { renderTrendingStocks(); flashPriceChanges('#trendingStocks .trending-item', true); }
    if (moversUpdated) { renderMarketMovers(marketMoversTabs.querySelector('.tab-btn.active')?.dataset.tab || 'gainers'); }
    if (sectorsUpdated) { renderSectorPerformance(); }
}

function flashPriceChanges(containerSelector) {
    document.querySelectorAll(containerSelector).forEach(item => {
        const changeElement = item.querySelector('.change-pill');
        if (changeElement) {
            const changeText = changeElement.textContent || '';
            let flashClass = '';
            if (changeText.includes('+')) flashClass = 'price-flash-up';
            else if (changeText.includes('-')) flashClass = 'price-flash-down';
            if (flashClass) {
                changeElement.classList.add(flashClass);
                setTimeout(() => { if (changeElement) changeElement.classList.remove(flashClass); }, 600);
            }
        }
    });
}

// --- Notifications ---
function showNotification(message, type = 'info', duration = 3000) {
    if (notificationTimeout) clearTimeout(notificationTimeout);
    notificationText.textContent = message;
    const iconElement = notificationToast.querySelector('.toast-icon');
    const toastClasses = ['toast-info', 'toast-success', 'toast-warning', 'toast-danger'];
    notificationToast.classList.remove(...toastClasses);
    let icon = 'info';
    switch (type) {
        case 'success':
            notificationToast.classList.add('toast-success');
            icon = 'check-circle';
            break;
        case 'warning':
            notificationToast.classList.add('toast-warning');
            icon = 'alert-triangle';
            break;
        case 'danger':
            notificationToast.classList.add('toast-danger');
            icon = 'x-circle';
            break;
        case 'info':
        default:
            notificationToast.classList.add('toast-info');
            icon = 'info';
            break;
    }
    iconElement.setAttribute('data-lucide', icon);
    lucide.createIcons();
    notificationToast.classList.remove('hidden');
    notificationTimeout = setTimeout(() => { notificationToast.classList.add('hidden'); }, duration);
}

// --- Theme Logic ---
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        themeToggleBtn.innerHTML = '<i data-lucide="sun"></i>';
    } else {
        document.body.classList.remove('dark');
        themeToggleBtn.innerHTML = '<i data-lucide="moon"></i>';
    }
    lucide.createIcons();
    applySettingsToUI();
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profilePanel.classList.toggle('hidden');
    });
    document.querySelectorAll('.profile-nav-link')?.forEach(link => { link.addEventListener('click', handleProfileLinkClick); });
    logoutBtn.addEventListener('click', handleLogout);
    voiceBtn.addEventListener('click', handleVoiceSearch);
    themeToggleBtn.addEventListener('click', handleThemeToggle);
    refreshBtn.addEventListener('click', handleRefresh);
    notificationBtn.addEventListener('click', handleNotificationClick);
    addIndexBtn.addEventListener('click', () => showListModal('index'));
    addStockBtn.addEventListener('click', () => showListModal('stock'));
    sortWatchlistSelect.addEventListener('change', (e) => sortWatchlist(e.target.value));
    modalSearch.addEventListener('input', handleModalSearch);
    modalItems.addEventListener('click', handleAddItem);
    modalCloseBtn.addEventListener('click', () => closeModal(listModal));
    modalOverlay.addEventListener('click', () => closeModal(listModal));
    settingsEntryBtn.addEventListener('click', openSettingsModal);
    settingsModalCloseBtn?.addEventListener('click', closeSettingsModal);
    settingsModalOverlay?.addEventListener('click', closeSettingsModal);
    settingsModal?.addEventListener('change', handleSettingsChange);
    settingsThemeButtons?.forEach(button => button.addEventListener('click', handleSettingsThemeChange));
    marketMoversTabs?.addEventListener('click', handleMoversTabClick);
    toastCloseBtn.addEventListener('click', () => { if (notificationTimeout) clearTimeout(notificationTimeout); notificationToast.classList.add('hidden'); });
}

// --- Event Handler Functions ---
function handleProfileLinkClick(e) {
    e.preventDefault();
    const action = e.currentTarget.dataset.action;
    profilePanel.classList.add('hidden');
    switch (action) {
        case 'edit-profile':
            showNotification('Edit Profile: Not implemented.', 'info');
            break;
        case 'change-password':
            showNotification('Change Password: Not implemented.', 'info');
            break;
        case 'view-privacy':
            showNotification('Privacy Policy: Not implemented.', 'info');
            break;
        case 'open-settings':
            openSettingsModal();
            break;
    }
}

function handleLogout() {
    showNotification('Logout: Not implemented.', 'info');
    profilePanel.classList.add('hidden');
}

function handleVoiceSearch() {
    voiceBtn.style.color = 'var(--primary)';
    showNotification('Voice search not implemented.', 'info', 2000);
    setTimeout(() => { voiceBtn.style.color = 'var(--text-muted)'; }, 2000);
}

function handleThemeToggle() {
    const isDark = document.body.classList.toggle('dark');
    const newTheme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

function handleRefresh() {
    if (refreshBtn.classList.contains('loading')) return;
    refreshBtn.classList.add('loading');
    refreshBtn.disabled = true;
    lucide.createIcons();
    showNotification("Refreshing data...", "info", 800);
    setTimeout(() => {
        simulateDataUpdate();
        renderMarketSummary();
        renderMarketMovers(marketMoversTabs.querySelector('.tab-btn.active')?.dataset.tab || 'gainers');
        renderSectorPerformance();
        refreshBtn.classList.remove('loading');
        refreshBtn.disabled = false;
        lucide.createIcons();
    }, 500);
}

function handleNotificationClick() {
    showNotification('Notification panel not implemented.', 'info');
    notificationBadge.classList.add('hidden');
}

function handleModalSearch() {
    const searchTerm = modalSearch.value.toLowerCase().trim();
    const filteredItems = currentModalItemsData.filter(item => item.name.toLowerCase().includes(searchTerm));
    renderModalItems(filteredItems);
}

function handleMoversTabClick(e) {
    if (e.target.classList.contains('tab-btn') && !e.target.classList.contains('active')) {
        marketMoversTabs.querySelector('.active')?.classList.remove('active');
        e.target.classList.add('active');
        renderMarketMovers(e.target.dataset.tab);
    }
}

// --- Initialization ---
function initializeDashboard() {
    document.body.classList.remove('preload');
    const storedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(storedTheme);
    loadSettings();
    setupEventListeners();

    // Initial Render
    renderMarketSummary();
    renderIndices();
    renderTrendingStocks();
    renderMarketMovers();
    renderSectorPerformance();
    sortWatchlist(sortWatchlistSelect.value);

    // Start Simulation
    if (dataUpdateInterval) clearInterval(dataUpdateInterval);
    dataUpdateInterval = setInterval(simulateDataUpdate, 3000);

    lucide.createIcons();
    console.log("Market Dashboard Pro Initialized");
}