// --- DOM Elements ---
const body = document.body;
const themeIcon = document.getElementById('theme-icon');
const searchBarContainer = document.getElementById('search-bar-container');
const searchInput = document.getElementById('search-input');
const clearSearchButton = document.getElementById('clear-search-button');
const indicesContainer = document.getElementById('indices-container');
const trendingContainer = document.getElementById('trending-container');
const watchlistContainer = document.getElementById('watchlist-container');
const notificationBadge = document.getElementById('notification-badge');
const notificationsList = document.getElementById('notifications-list');
const sortOptionsContainer = document.getElementById('sort-options-container');
const filterOptionsContainer = document.getElementById('filter-options-container');
const stockSymbolInput = document.getElementById('stock-symbol-input');
const companyNameInput = document.getElementById('company-name-input');

// --- State Variables ---
let isDarkMode = false; // Keep track of theme state
let isSearchVisible = false;
let searchQuery = '';
let expandedStockId = null;
let currentSort = 'name'; // Default sort
let currentFilter = 'all'; // Default filter
let notificationCount = 3; // Initial count from example

// --- Sample Data ---
const indicesData = [
    { name: 'NIFTY 50', price: '22,403.44', change: '+120.35', percentChange: '+0.54%' },
    { name: 'SENSEX', price: '73,648.62', change: '+364.50', percentChange: '+0.49%' },
    { name: 'BANK NIFTY', price: '47,521.10', change: '-104.80', percentChange: '-0.22%' }
];

const trendingStocksData = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,850.75', change: '+2.4%', volume: '1.2M' },
    { symbol: 'TCS', name: 'Tata Consultancy', price: '3,905.20', change: '+1.6%', volume: '620K' },
    { symbol: 'HDFC', name: 'HDFC Bank', price: '1,678.45', change: '-0.3%', volume: '856K' },
    { symbol: 'INFOSYS', name: 'Infosys Limited', price: '1,456.30', change: '+0.8%', volume: '750K' },
    { symbol: 'HCLTECH', name: 'HCL Technologies', price: '1,245.70', change: '+3.2%', volume: '435K' }
];

let watchlistStocksData = [
    { id: '1', symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,850.75', change: '+68.25', percentChange: '+2.45%', volume: '1.2M', marketCap: '₹18.32T', signal: 'BUY', sector: 'Oil & Gas', aiConfidence: 85, support: '₹2,780', resistance: '₹2,920', fiiActivity: '+₹240Cr', diiActivity: '+₹180Cr', weekLow: '₹2,180', weekHigh: '₹2,950', news: [{ title: 'Reliance to acquire stake in EV startup', impact: 'positive', date: '1 day ago' }, { title: 'Q4 results beat analyst expectations', impact: 'positive', date: '1 week ago' }] },
    { id: '2', symbol: 'TATASTEEL', name: 'Tata Steel', price: '145.30', change: '-3.80', percentChange: '-2.55%', volume: '4.5M', marketCap: '₹1.78T', signal: 'HOLD', sector: 'Metal', aiConfidence: 62, support: '₹140', resistance: '₹152', fiiActivity: '-₹85Cr', diiActivity: '+₹120Cr', weekLow: '₹101', weekHigh: '₹160', news: [{ title: 'Steel prices remain under pressure', impact: 'negative', date: '2 days ago' }, { title: 'Company announces expansion plans', impact: 'positive', date: '1 week ago' }] },
    { id: '3', symbol: 'INFY', name: 'Infosys Ltd', price: '1,456.30', change: '+11.25', percentChange: '+0.78%', volume: '0.75M', marketCap: '₹6.05T', signal: 'STRONG BUY', sector: 'IT', aiConfidence: 91, support: '₹1,420', resistance: '₹1,480', fiiActivity: '+₹310Cr', diiActivity: '+₹150Cr', weekLow: '₹1,185', weekHigh: '₹1,560', news: [{ title: 'New AI partnership announced', impact: 'positive', date: '3 days ago' }, { title: 'Wins $250M deal with European client', impact: 'positive', date: '1 week ago' }] },
    { id: '4', symbol: 'SBIN', name: 'State Bank of India', price: '745.20', change: '-5.60', percentChange: '-0.75%', volume: '2.1M', marketCap: '₹6.65T', signal: 'SELL', sector: 'Banking', aiConfidence: 42, support: '₹730', resistance: '₹765', fiiActivity: '-₹210Cr', diiActivity: '-₹45Cr', weekLow: '₹570', weekHigh: '₹800', news: [{ title: 'Rising NPAs concern analysts', impact: 'negative', date: '2 days ago' }, { title: 'Bank announces new digital initiatives', impact: 'positive', date: '5 days ago' }] }
];

let notificationsData = [
    { id: 1, title: '🚀 RELIANCE breakout alert!', message: 'Stock has broken resistance at ₹2,850', time: '10 min ago' },
    { id: 2, title: '📊 Market Update', message: 'Nifty 50 hits new all-time high', time: '1 hour ago' },
    { id: 3, title: '🤖 AI Signal', message: 'Strong buy signal for TCS detected', time: '3 hours ago' }
];

const sortOptions = [
    { id: 'name', label: '📝 Name' },
    { id: 'price', label: '💰 Price' },
    { id: 'change', label: '📈 Change %' },
    { id: 'volume', label: '📊 Volume' },
    { id: 'aiConfidence', label: '🤖 AI Confidence' }
];

const filterOptions = [
    { id: 'all', label: '🌟 All Stocks' },
    { id: 'gainers', label: '📈 Top Gainers' },
    { id: 'losers', label: '📉 Top Losers' },
    { id: 'highVolume', label: '📊 High Volume' }, // Define logic for "high" volume if needed
    { id: 'highConfidence', label: '🎯 High AI Confidence' } // Define logic for "high" confidence if needed
];

// --- Helper Functions ---
const getThemeProp = (prop) => getComputedStyle(document.documentElement).getPropertyValue(prop).trim(); // Use documentElement for root vars

// Function to get signal color based on the current theme
const getSignalColor = (signal) => {
    // Colors are defined in CSS :root and [data-theme="dark"], just return the variable name
    if (signal?.includes('BUY')) return `var(--green)`;
    if (signal?.includes('SELL')) return `var(--red)`;
    return `var(--yellow)`; // Default for HOLD or N/A
};

// Function to get news impact color based on current theme
const getNewsImpactColor = (impact) => {
    // Colors are defined in CSS, just return variable name
    if (impact === 'positive') return `var(--green)`;
    if (impact === 'negative') return `var(--red)`;
    return `var(--text)`; // Neutral uses text color now
};

const formatNumberString = (numStr) => {
    if (typeof numStr !== 'string') return 0;
    // Handle T, M, K, Cr etc. for parsing
    let multiplier = 1;
    if (numStr.includes('T')) multiplier = 1e12;
    else if (numStr.includes('B') || numStr.includes('Cr')) multiplier = 1e7; // Corrected Cr to 10 million (1e7)
    else if (numStr.includes('M')) multiplier = 1e6;
    else if (numStr.includes('K') || numStr.includes('k')) multiplier = 1e3;

    // Remove non-numeric characters except '.' and potentially '-'
    const cleanedStr = numStr.replace(/[₹,CrTMBKk+\s%]/gi, ''); // Case insensitive K
    const num = parseFloat(cleanedStr) || 0;
    return num * multiplier;
};

// Function to calculate the position for the range bar marker
function calculatePricePosition(currentPriceStr, lowStr, highStr) {
    const current = formatNumberString(currentPriceStr);
    const low = formatNumberString(lowStr);
    const high = formatNumberString(highStr);

    if (high <= low || isNaN(current) || isNaN(low) || isNaN(high)) return '50%'; // Avoid division by zero or invalid range/values

    const range = high - low;
    const position = ((current - low) / range) * 100;

    // Clamp between 0% and 100%
    return `${Math.max(0, Math.min(100, position))}%`;
}


// --- Rendering Functions ---

function renderIndices() {
    if (!indicesContainer) return;
    indicesContainer.innerHTML = indicesData.map(item => `
        <div class="index-card">
            <div class="index-name">${item.name}</div>
            <div class="index-price">₹${item.price}</div>
            <div class="index-change ${item.percentChange.startsWith('+') ? 'positive' : 'negative'}">
                ${item.change} (${item.percentChange})
            </div>
        </div>
    `).join('');
}

function renderTrendingStocks() {
    if (!trendingContainer) return;
    trendingContainer.innerHTML = trendingStocksData.map(item => `
        <div class="trending-card">
            <div class="trending-name">${item.name}</div>
            <div class="trending-symbol">${item.symbol}</div>
            <div class="trending-change ${item.change.startsWith('+') ? 'positive' : 'negative'}">
                ${item.change}
            </div>
            <div class="trending-volume">Vol: ${item.volume}</div>
        </div>
    `).join('');
}

function renderWatchlist() {
    if (!watchlistContainer) return;
    let displayStocks = [...watchlistStocksData];

    // 1. Filter
    if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        displayStocks = displayStocks.filter(stock =>
            stock.name.toLowerCase().includes(lowerCaseQuery) ||
            stock.symbol.toLowerCase().includes(lowerCaseQuery)
        );
    }

    if (currentFilter !== 'all') {
        switch (currentFilter) {
            case 'gainers':
                displayStocks = displayStocks.filter(stock => formatNumberString(stock.percentChange) > 0);
                break;
            case 'losers':
                displayStocks = displayStocks.filter(stock => formatNumberString(stock.percentChange) < 0);
                break;
            case 'highVolume':
                displayStocks = displayStocks.filter(stock => formatNumberString(stock.volume) > 1000000); // Example: > 1M
                break;
            case 'highConfidence':
                displayStocks = displayStocks.filter(stock => stock.aiConfidence > 80);
                break;
        }
    }

    // 2. Sort
    displayStocks.sort((a, b) => {
        switch (currentSort) {
            case 'price':
                return formatNumberString(b.price) - formatNumberString(a.price);
            case 'change':
                return formatNumberString(b.percentChange) - formatNumberString(a.percentChange);
            case 'volume':
                return formatNumberString(b.volume) - formatNumberString(a.volume);
            case 'aiConfidence':
                return b.aiConfidence - a.aiConfidence;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });

    // 3. Render
    watchlistContainer.innerHTML = displayStocks.length > 0 ? displayStocks.map(item => {
        const isExpanded = item.id === expandedStockId;
        const changeIsPositive = formatNumberString(item.percentChange) >= 0;
        const fiiIsPositive = formatNumberString(item.fiiActivity) >= 0;
        const diiIsPositive = formatNumberString(item.diiActivity) >= 0;
        const signal = item.signal || '';
        const pricePosition = calculatePricePosition(item.price, item.weekLow, item.weekHigh);

        return `
            <div class="stock-card ${isExpanded ? 'expanded' : ''}" id="stock-${item.id}">
                <div class="stock-card-clickable-area" onclick="toggleStockExpansion('${item.id}')">
                    <div class="stock-card-header">
                        <div>
                            <div class="stock-title-row">
                                <span class="stock-name">${item.name}</span>
                                <span class="stock-symbol">${item.symbol}</span>
                            </div>
                            <div class="stock-price">₹${item.price}</div>
                            <div class="stock-change ${changeIsPositive ? 'positive' : 'negative'}">
                                ${item.change} (${item.percentChange})
                            </div>
                            <div class="stock-volume">
                                Volume: ${item.volume} | Mkt Cap: ${item.marketCap}
                            </div>
                        </div>
                        <div class="stock-right-side">
                            <span class="signal-badge" style="background-color: ${getSignalColor(signal)}; color: ${signal?.includes('HOLD') ? 'black' : 'white'};">
                                ${signal}
                            </span>
                            <div class="sector-text">${item.sector}</div>
                        </div>
                    </div>
                     <div class="expand-button-container">
                        <i class="fa-solid fa-chevron-down"></i>
                     </div>
                </div>

                <div class="expanded-section">
                    ${isExpanded ? `
                    <div class="expanded-section-item">
                        <div class="expanded-label">🤖 AI Confidence</div>
                        <div class="progress-bar-wrapper">
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${item.aiConfidence}%; background-color: var(--primary);"></div>
                            </div>
                            <span class="confidence-text">${item.aiConfidence}%</span>
                        </div>
                    </div>

                    <div class="tech-levels-container">
                        <div class="level-item">
                            <div class="expanded-label">📊 Support</div>
                            <div class="level-value">${item.support}</div>
                        </div>
                        <div class="level-item">
                            <div class="expanded-label">📈 Resistance</div>
                            <div class="level-value">${item.resistance}</div>
                        </div>
                    </div>

                    <div class="institutional-container">
                        <div class="institutional-item">
                            <div class="expanded-label">🏢 FII Activity</div>
                            <div class="activity-value ${fiiIsPositive ? 'positive' : 'negative'}">${item.fiiActivity}</div>
                        </div>
                        <div class="institutional-item">
                            <div class="expanded-label">🏛 DII Activity</div>
                            <div class="activity-value ${diiIsPositive ? 'positive' : 'negative'}">${item.diiActivity}</div>
                        </div>
                    </div>

                    <div class="week-range-container">
                        <div class="expanded-label">📅 52 Week Range</div>
                        <div class="range-bar-container">
                            <span class="range-value low">${item.weekLow}</span>
                            <div class="range-bar" style="--current-price-position: ${pricePosition};"></div>
                            <span class="range-value high">${item.weekHigh}</span>
                        </div>
                    </div>

                    <div class="news-container">
                        <div class="expanded-label">📰 Recent News</div>
                        ${item.news && item.news.length > 0 ? item.news.map(newsItem => `
                            <div class="news-item">
                                <div class="news-title ${newsItem.impact}" style="color: ${getNewsImpactColor(newsItem.impact)}">
                                    ${newsItem.title}
                                </div>
                                <div class="news-date">${newsItem.date}</div>
                            </div>
                        `).join('') : '<p class="news-date">No recent news available.</p>'}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('') : `<p class="loading-placeholder">No stocks match your criteria.</p>`;
}


function renderNotifications() {
    if (!notificationsList) return;
    notificationsList.innerHTML = notificationsData.length > 0
        ? notificationsData.map(item => `
            <div class="notification-item">
                <div class="notification-content">
                    <div class="notification-title">${item.title}</div>
                    <div class="notification-message">${item.message}</div>
                    <div class="notification-time">${item.time}</div>
                </div>
            </div>
        `).join('')
        : `<p class="loading-placeholder">No new notifications.</p>`;

    updateNotificationBadge();
}

function updateNotificationBadge() {
    if (!notificationBadge) return;
    if (notificationCount > 0) {
        notificationBadge.textContent = notificationCount;
        notificationBadge.classList.remove('hidden');
    } else {
        notificationBadge.classList.add('hidden');
    }
}

function renderSortOptions() {
    if (!sortOptionsContainer) return;
    sortOptionsContainer.innerHTML = sortOptions.map(option => `
        <div class="modal-option ${currentSort === option.id ? 'selected' : ''}" onclick="applySort('${option.id}')">
             <span class="checkmark">✓</span>
             <span class="modal-option-text">${option.label}</span>
        </div>
    `).join('');
}

function renderFilterOptions() {
    if (!filterOptionsContainer) return;
    filterOptionsContainer.innerHTML = filterOptions.map(option => `
        <div class="modal-option ${currentFilter === option.id ? 'selected' : ''}" onclick="applyFilter('${option.id}')">
            <span class="checkmark">✓</span>
            <span class="modal-option-text">${option.label}</span>
        </div>
    `).join('');
}


// --- Event Handlers & Actions ---

function toggleTheme() {
    isDarkMode = !isDarkMode;
    body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    if (themeIcon) {
        themeIcon.className = `fa-regular ${isDarkMode ? 'fa-sun' : 'fa-moon'}`;
    }
    // Re-rendering might be needed if JS logic relies on theme colors directly,
    // but since we use CSS variables now, it might not be strictly necessary
    // unless components explicitly need recalculation based on theme.
    // Let's keep it for safety with signal/news colors potentially.
    renderWatchlist();
}

function toggleSearch() {
    isSearchVisible = !isSearchVisible;
    if (searchBarContainer) {
        searchBarContainer.classList.toggle('show', isSearchVisible);
    }
    if (isSearchVisible && searchInput) {
        searchInput.focus();
    }
}

function handleSearch(query) {
    searchQuery = query.trim(); // Store trimmed query
    if (clearSearchButton) {
        clearSearchButton.classList.toggle('hidden', !searchQuery);
    }
    // Debounce this in a real app for performance
    renderWatchlist();
}

function clearSearch() {
    searchQuery = '';
    if (searchInput) {
        searchInput.value = '';
    }
    if (clearSearchButton) {
        clearSearchButton.classList.add('hidden');
    }
    renderWatchlist();
    if (searchInput) {
        searchInput.focus();
    }
}

function toggleStockExpansion(id) {
    // Find the card element
    const cardElement = document.getElementById(`stock-${id}`);
    if (!cardElement) return;

    if (expandedStockId === id) {
        expandedStockId = null; // Collapse
        cardElement.classList.remove('expanded');
    } else {
        // Collapse previously expanded card if any
        if (expandedStockId) {
            const previousCard = document.getElementById(`stock-${expandedStockId}`);
            if (previousCard) {
                previousCard.classList.remove('expanded');
            }
        }
        // Expand the new one
        expandedStockId = id;
        cardElement.classList.add('expanded');
        // Important: Re-render the specific expanded section content *after* adding class
        // For simplicity, we re-render the whole list, but optimizing this is possible
        renderWatchlist();
    }
    // Note: With the current full re-render approach in renderWatchlist,
    // managing the class directly might seem redundant, but it helps if you optimize later.
}


function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Ensure content is ready before showing
        if (modalId === 'sort-modal') renderSortOptions();
        if (modalId === 'filter-modal') renderFilterOptions();
        modal.classList.add('show');
        // Optional: Focus first input in add stock modal
        if (modalId === 'add-stock-modal' && stockSymbolInput) {
             setTimeout(() => stockSymbolInput.focus(), 50); // Delay focus slightly
        }
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function handleOverlayClick(event, modalId) {
    // Close modal if click is directly on the overlay (the element with the ID)
    if (event.target.id === modalId) {
        hideModal(modalId);
    }
}

function handleNotificationBell() {
    showModal('notifications-modal');
}

function clearNotifications() {
    notificationCount = 0;
    notificationsData = []; // Clear the data array as well
    renderNotifications(); // Re-render the empty list
    // Keep modal open after clearing
}

function addStock() {
    const symbol = stockSymbolInput?.value.trim().toUpperCase();
    const name = companyNameInput?.value.trim();

    if (!symbol || !name) {
        alert('Please enter both stock symbol and company name.');
        return;
    }

    // Basic check if stock already exists (by symbol)
    const exists = watchlistStocksData.some(stock => stock.symbol === symbol);
    if (exists) {
         alert(`${symbol} is already in your watchlist.`);
         return;
    }

    const newStock = {
        id: Date.now().toString(), // Simple unique ID
        symbol: symbol,
        name: name,
        price: 'N/A', // Placeholder - fetch real data in a real app
        change: '0.00',
        percentChange: '0.00%',
        volume: 'N/A',
        marketCap: 'N/A',
        signal: 'N/A',
        sector: 'N/A',
        aiConfidence: 0,
        support: 'N/A',
        resistance: 'N/A',
        fiiActivity: 'N/A',
        diiActivity: 'N/A',
        weekLow: 'N/A',
        weekHigh: 'N/A',
        news: []
    };
    watchlistStocksData.unshift(newStock); // Add to the beginning
    renderWatchlist();
    hideModal('add-stock-modal');
    // Clear modal inputs
    if (stockSymbolInput) stockSymbolInput.value = '';
    if (companyNameInput) companyNameInput.value = '';
}

function applySort(sortId) {
    currentSort = sortId;
    hideModal('sort-modal');
    renderWatchlist(); // Re-render with new sorting
}

function applyFilter(filterId) {
    currentFilter = filterId;
    hideModal('filter-modal');
    renderWatchlist(); // Re-render with new filter
}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initializing watchlist...");

    // Check if essential containers exist before rendering
    if (!indicesContainer || !trendingContainer || !watchlistContainer || !notificationsList || !notificationBadge) {
        console.error("One or more essential containers not found in the DOM.");
        // Optionally display an error message to the user
        // document.body.innerHTML = "<p>Error loading page components. Please try again later.</p>";
        return; // Stop initialization if containers are missing
    }

    renderIndices();
    renderTrendingStocks();
    renderWatchlist();
    renderNotifications(); // Render notifications list
    updateNotificationBadge(); // Set initial badge state

    // Set initial theme icon based on default isDarkMode state
    if (themeIcon) {
        themeIcon.className = `fa-regular ${isDarkMode ? 'fa-sun' : 'fa-moon'}`;
    }

    // Check for background-clip support (Less relevant now, but good practice)
    if (typeof CSS !== 'undefined' && CSS.supports && (CSS.supports('background-clip', 'text') || CSS.supports('-webkit-background-clip', 'text'))) {
        document.documentElement.classList.add('supports-bgcliptext');
    }

    console.log("Initialization complete.");
});