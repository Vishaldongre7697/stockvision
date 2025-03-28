// Mock data
const mockStockData = [
    {
        id: "1",
        name: "Reliance Industries",
        symbol: "RELIANCE",
        price: 2750.45,
        change: 2.34,
        recommendation: "Buy",
        confidence: 85,
        predictedRange: { min: 2700, max: 2950 },
        fundamentals: { fiiFlow: 234.5, diiFlow: 156.8, blockDeal: "Yes", revenue: 7920 },
        technical: { rsi: "65.4", sma: "2680.25", ema: "2710.50", volume: "High Buy" },
    },
    {
        id: "2",
        name: "Tata Consultancy Services",
        symbol: "TCS",
        price: 3450.75,
        change: -0.87,
        recommendation: "Hold",
        confidence: 65,
        predictedRange: { min: 3350, max: 3550 },
        fundamentals: { fiiFlow: -120.3, diiFlow: 89.5, blockDeal: "No", revenue: 5640 },
        technical: { rsi: "48.2", sma: "3480.10", ema: "3460.75", volume: "Moderate" },
    },
    {
        id: "3",
        name: "HDFC Bank",
        symbol: "HDFCBANK",
        price: 1680.3,
        change: 1.25,
        recommendation: "Buy",
        confidence: 78,
        predictedRange: { min: 1650, max: 1750 },
        fundamentals: { fiiFlow: 178.2, diiFlow: 145.6, blockDeal: "Yes", revenue: 4230 },
        technical: { rsi: "62.8", sma: "1650.45", ema: "1670.20", volume: "High Buy" },
    },
    {
        id: "4",
        name: "Infosys",
        symbol: "INFY",
        price: 1450.6,
        change: -1.45,
        recommendation: "Sell",
        confidence: 72,
        predictedRange: { min: 1380, max: 1480 },
        fundamentals: { fiiFlow: -98.5, diiFlow: -45.2, blockDeal: "No", revenue: 3560 },
        technical: { rsi: "38.5", sma: "1480.30", ema: "1460.15", volume: "High Sell" },
    },
    {
        id: "5",
        name: "Bharti Airtel",
        symbol: "BHARTIARTL",
        price: 875.25,
        change: 0.95,
        recommendation: "Hold",
        confidence: 60,
        predictedRange: { min: 850, max: 910 },
        fundamentals: { fiiFlow: 56.8, diiFlow: 78.3, blockDeal: "No", revenue: 2840 },
        technical: { rsi: "52.4", sma: "870.15", ema: "880.50", volume: "Moderate" },
    },
];

const trendingStocks = [
    { id: "t1", symbol: "TATASTEEL", price: 145.75, change: 3.25, volume: 15000000 },
    { id: "t2", symbol: "ICICIBANK", price: 960.3, change: 1.85, volume: 8500000 },
    { id: "t3", symbol: "SBIN", price: 625.45, change: 2.1, volume: 12000000 },
    { id: "t4", symbol: "ADANIENT", price: 2450.8, change: -1.75, volume: 5600000 },
    { id: "t5", symbol: "HCLTECH", price: 1280.6, change: 0.85, volume: 3200000 },
    { id: "t6", symbol: "WIPRO", price: 420.35, change: -0.65, volume: 4800000 },
    { id: "t7", symbol: "SUNPHARMA", price: 1150.9, change: 1.45, volume: 2900000 },
    { id: "t8", symbol: "BAJFINANCE", price: 7250.25, change: 2.8, volume: 1800000 },
];

// Utility function to conditionally join class names
const cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

// Function to format currency (Indian Rupees)
function formatCurrency(value) {
    if (typeof value !== 'number') return value; // Handle non-numeric gracefully
    return value.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).replace('₹', '₹'); // Ensure rupee symbol is used
}

// Helper to format volume numbers
const formatVolume = (volume) => {
    if (volume >= 10000000) { // Crores
        return `${(volume / 10000000).toFixed(2)} Cr`;
    } else if (volume >= 100000) { // Lakhs
        return `${(volume / 100000).toFixed(2)} L`;
    } else if (volume >= 1000) { // Thousands
        return `${(volume / 1000).toFixed(2)} K`;
    }
    return volume.toString();
};


// --- Color Helper Functions ---
const getRecommendationColor = (recommendation) => {
    switch (recommendation?.toLowerCase()) {
        case "buy": return "bg-green-500 hover:bg-green-600";
        case "sell": return "bg-red-500 hover:bg-red-600";
        case "hold": return "bg-amber-500 hover:bg-amber-600";
        default: return "bg-slate-500 hover:bg-slate-600";
    }
};

const getPriceChangeColor = (change) => {
    return change >= 0 ? "text-green-500" : "text-red-500";
};

const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "bg-green-500";
    if (confidence >= 50) return "bg-amber-500";
    return "bg-red-500";
};

const getVolumeColor = (volume) => {
    if (volume?.toLowerCase().includes("high buy")) return "bg-green-500";
    if (volume?.toLowerCase().includes("high sell")) return "bg-red-500";
    return "bg-amber-500"; // Moderate or other
};


// --- DOM Element Creation Functions ---

// Creates a single stock suggestion card
function createStockCard(stock) {
    const card = document.createElement('div');
    card.className = "overflow-hidden transition-all duration-300 hover:shadow-md rounded-lg border border-border bg-card text-card-foreground shadow mb-4";
    card.dataset.stockId = stock.id; // Add data attribute for identification

    // --- Card Header ---
    const headerContent = document.createElement('div');
    headerContent.className = "flex items-center justify-between p-4 cursor-pointer";
    headerContent.addEventListener('click', () => toggleCardDetails(card));

    const nameSymbolDiv = document.createElement('div');
    nameSymbolDiv.className = 'flex-1';
    nameSymbolDiv.innerHTML = `
        <h3 class="font-semibold text-lg">${stock.name}</h3>
        <p class="text-sm text-muted-foreground">${stock.symbol}</p>
    `;

    const priceChangeDiv = document.createElement('div');
    priceChangeDiv.className = 'flex flex-col items-end mx-4';
    priceChangeDiv.innerHTML = `
        <p class="font-semibold text-lg">${formatCurrency(stock.price)}</p>
        <p class="${cn("text-sm font-medium", getPriceChangeColor(stock.change))}">
            ${stock.change >= 0 ? "+" : ""}${stock.change}% ${stock.change >= 0 ? " ▲" : " ▼"}
        </p>
    `;

    const recommendationDiv = document.createElement('div');
    recommendationDiv.className = 'flex flex-col items-center';
    recommendationDiv.innerHTML = `
        <span class="${cn("mb-2 px-3 py-1 text-white rounded-full text-xs font-semibold", getRecommendationColor(stock.recommendation))}">
            ${stock.recommendation}
        </span>
        <div class="toggle-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down h-5 w-5 text-muted-foreground transition-transform duration-300"><path d="m6 9 6 6 6-6"/></svg>
        </div>
    `;

    headerContent.appendChild(nameSymbolDiv);
    headerContent.appendChild(priceChangeDiv);
    headerContent.appendChild(recommendationDiv);
    card.appendChild(headerContent);

    // --- Card Details (Initially Hidden) ---
    const details = document.createElement('div');
    details.className = "details-content p-4 border-t border-border"; // Use class for styling/selection
    details.style.display = 'none'; // Initially hide the details

    details.innerHTML = `
        <div class="mb-4">
            <div class="flex justify-between items-center mb-1">
                <span class="text-sm text-muted-foreground">Confidence</span>
                <span class="text-sm font-medium">${stock.confidence}%</span>
            </div>
            <div class="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div class="${cn('h-full rounded-full', getConfidenceColor(stock.confidence))}" style="width: ${stock.confidence}%;"></div>
            </div>
        </div>

        <div class="flex justify-between items-center mb-4">
            <span class="text-sm text-muted-foreground">Predicted Range:</span>
            <span class="text-sm font-medium">${formatCurrency(stock.predictedRange.min)} - ${formatCurrency(stock.predictedRange.max)}</span>
        </div>

        <div class="mb-4">
            <h4 class="font-medium mb-2">Fundamental Data</h4>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-muted-foreground">FII Flow</p>
                    <p class="${cn("font-medium", stock.fundamentals.fiiFlow > 0 ? "text-green-500" : "text-red-500")}">${stock.fundamentals.fiiFlow > 0 ? "+" : ""}${formatCurrency(stock.fundamentals.fiiFlow)} Cr</p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">DII Flow</p>
                    <p class="${cn("font-medium", stock.fundamentals.diiFlow > 0 ? "text-green-500" : "text-red-500")}">${stock.fundamentals.diiFlow > 0 ? "+" : ""}${formatCurrency(stock.fundamentals.diiFlow)} Cr</p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">Block Deal</p>
                    <p class="font-medium">${stock.fundamentals.blockDeal}</p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">Revenue</p>
                    <p class="font-medium">${formatCurrency(stock.fundamentals.revenue)} Cr</p>
                </div>
            </div>
        </div>

        <div>
            <h4 class="font-medium mb-2">Technical Data</h4>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-muted-foreground">RSI</p>
                    <p class="font-medium">${stock.technical.rsi}</p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">SMA (50)</p>
                    <p class="font-medium">${stock.technical.sma}</p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">EMA (20)</p>
                    <p class="font-medium">${stock.technical.ema}</p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground">Volume</p>
                    <div class="flex items-center">
                         <div class="${cn("h-3 w-3 rounded-full mr-2", getVolumeColor(stock.technical.volume))}"></div>
                         <p class="font-medium">${stock.technical.volume}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    card.appendChild(details);

    return card;
}

// Toggles the visibility of the details section of a stock card
function toggleCardDetails(cardElement) {
    const details = cardElement.querySelector('.details-content');
    const icon = cardElement.querySelector('.toggle-icon svg');
    const isExpanded = cardElement.classList.contains('expanded');

    if (isExpanded) {
        cardElement.classList.remove('expanded');
        details.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    } else {
        cardElement.classList.add('expanded');
        details.style.display = 'block';
         // Optional: Add entry animation class if needed (ensure defined in CSS)
        details.classList.add('animate-in', 'fade-in-50');
        icon.style.transform = 'rotate(180deg)';
    }
}


// Creates and populates the trending stocks widget
function createTrendingStocksWidget() {
    const scrollContainer = document.getElementById('trending-stocks-scroll');
    if (!scrollContainer) return; // Exit if container not found

    scrollContainer.innerHTML = ''; // Clear previous items

    trendingStocks.forEach(stock => {
        const stockElement = document.createElement('div');
        stockElement.className = "min-w-[160px] mr-3 snap-start hover:shadow-md transition-shadow cursor-pointer rounded-lg border border-border bg-card text-card-foreground shadow"; // Removed mb-4 as parent has spacing

        stockElement.innerHTML = `
            <div class="p-4">
                <h3 class="font-bold text-lg">${stock.symbol}</h3>
                <p class="font-medium">${formatCurrency(stock.price)}</p>
                <div class="flex items-center mt-2">
                    <p class="${cn("text-sm font-medium", getPriceChangeColor(stock.change))}">
                         ${stock.change >= 0 ? "+" : ""}${stock.change}% ${stock.change >= 0 ? " ▲" : " ▼"}
                    </p>
                </div>
                <p class="text-xs text-muted-foreground mt-2">Vol: ${formatVolume(stock.volume)}</p>
            </div>
        `;
        scrollContainer.appendChild(stockElement);
    });

     // --- Auto-scroll animation for Trending Stocks ---
     let scrollInterval;
     let position = 0;
     let scrollWidth = scrollContainer.scrollWidth;
     let clientWidth = scrollContainer.clientWidth;
     let isScrollingPaused = false; // Flag to pause on hover

     const startAutoScroll = () => {
         // Only start if not already scrolling and enough content to scroll
         if (scrollInterval || scrollWidth <= clientWidth) return;

         scrollInterval = setInterval(() => {
             if (isScrollingPaused) return; // Skip if paused

             position += 1; // Adjust speed here (lower = faster, higher = slower interval needed)
             // If scrolled past the effectively duplicate items needed for smooth looping
             if (position >= scrollWidth) {
                 position = 0; // Reset smoothly
                 scrollContainer.scrollTo({ left: 0, behavior: 'auto' }); // Instant jump back
             } else {
                scrollContainer.scrollLeft = position;
             }

         }, 30); // Adjust interval for speed
     };

     const stopAutoScroll = () => {
         clearInterval(scrollInterval);
         scrollInterval = null;
     };

     const resetAndStartScroll = () => {
        stopAutoScroll();
        scrollWidth = scrollContainer.scrollWidth; // Recalculate width
        clientWidth = scrollContainer.clientWidth;
         // Duplicate content for seamless looping if width allows
        if (scrollWidth > clientWidth && !scrollContainer.dataset.cloned) {
            const originalChildren = Array.from(scrollContainer.children);
            originalChildren.forEach(child => {
                scrollContainer.appendChild(child.cloneNode(true));
            });
            scrollWidth = scrollContainer.scrollWidth; // Update scroll width after cloning
            scrollContainer.dataset.cloned = 'true'; // Mark as cloned
        }

        // Delay start slightly to allow DOM updates
        setTimeout(startAutoScroll, 100);
     }

    // Pause scrolling on hover
     scrollContainer.addEventListener('mouseenter', () => isScrollingPaused = true);
     scrollContainer.addEventListener('mouseleave', () => {
         isScrollingPaused = false;
         // Optionally restart immediately or wait
         // if (!scrollInterval) startAutoScroll();
     });

     // Start after a delay
     const timer = setTimeout(resetAndStartScroll, 2000);

     // Clean up on page unload
     window.addEventListener('beforeunload', () => {
         clearTimeout(timer);
         stopAutoScroll();
     });

     // Optional: Restart scroll on window resize if dimensions change significantly
     let resizeTimeout;
     window.addEventListener('resize', () => {
         clearTimeout(resizeTimeout);
         resizeTimeout = setTimeout(() => {
             resetAndStartScroll(); // Recalculate and restart
         }, 250);
     });
}


// --- Main Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const microphoneButton = document.getElementById('microphone-button');
    const stockCardsContainer = document.getElementById('stock-cards-container');
    const mainContent = document.getElementById('main-content');
    const micIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic h-5 w-5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`;
    const listeningIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle h-5 w-5 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`; // Simple spinner


    let searchQuery = "";
    let filteredStocks = [...mockStockData]; // Use spread to create a mutable copy
    let isListening = false;
    let recognition; // Speech recognition instance

    // Function to render stock cards based on the filtered data
    function renderStockCards() {
        if (!stockCardsContainer) return;
        stockCardsContainer.innerHTML = ''; // Clear existing cards
        if (filteredStocks.length === 0) {
            stockCardsContainer.innerHTML = '<p class="text-center text-muted-foreground py-12">No stocks match your search.</p>';
        } else {
            filteredStocks.forEach(stock => {
                const card = createStockCard(stock);
                stockCardsContainer.appendChild(card);
            });
        }
    }

    // Function to update filtered stocks based on search query
    function updateFilteredStocks() {
        const query = searchQuery.trim().toLowerCase();
        if (query === "") {
            filteredStocks = [...mockStockData];
        } else {
            filteredStocks = mockStockData.filter(stock =>
                stock.name.toLowerCase().includes(query) ||
                stock.symbol.toLowerCase().includes(query)
            );
        }
        renderStockCards(); // Re-render the cards
    }

    // --- Speech Recognition Setup ---
    function setupSpeechRecognition() {
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();

            recognition.continuous = false; // Only listen for a single utterance
            recognition.interimResults = false; // We only want the final result
            recognition.lang = "en-US"; // Or "en-IN" for Indian English accent

            recognition.onstart = () => {
                isListening = true;
                microphoneButton.innerHTML = listeningIconSVG;
                microphoneButton.classList.add('text-primary');
                microphoneButton.disabled = true; // Prevent multiple clicks while listening
            };

            recognition.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                searchQuery = speechResult;
                searchInput.value = speechResult; // Update input field
                updateFilteredStocks(); // Update the displayed stocks
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                if (event.error === 'no-speech') {
                    alert("Didn't hear anything. Please try again.");
                } else if (event.error === 'not-allowed') {
                    alert("Microphone access denied. Please allow microphone access in browser settings.");
                } else {
                    alert(`Speech recognition error: ${event.error}`);
                }
            };

            recognition.onend = () => {
                isListening = false;
                microphoneButton.innerHTML = micIconSVG;
                microphoneButton.classList.remove('text-primary');
                microphoneButton.disabled = false; // Re-enable button
            };

        } else {
            // Disable microphone button if not supported
            microphoneButton.disabled = true;
            microphoneButton.title = "Speech recognition is not supported in your browser.";
            console.warn("Speech recognition not supported.");
        }
    }

    function startListening() {
        if (recognition && !isListening) {
            try {
                recognition.start();
            } catch (err) {
                console.error("Error starting recognition:", err);
                 // Handle cases where recognition might be already started or in a bad state
                 isListening = false;
                 microphoneButton.innerHTML = micIconSVG;
                 microphoneButton.classList.remove('text-primary');
                 microphoneButton.disabled = false;
            }
        } else if (!recognition) {
             alert("Speech recognition is not available or not set up correctly.");
        }
    }

    // --- Initial Setup ---

    // 1. Animate main content in
    if (mainContent) {
        // Use setTimeout to allow the initial state (opacity-0) to render first
        setTimeout(() => {
            mainContent.classList.remove('opacity-0', '-translate-y-5');
            mainContent.classList.add('opacity-100', 'translate-y-0');
        }, 50); // Small delay
    }

    // 2. Create and populate trending stocks
    createTrendingStocksWidget();

    // 3. Initial render of all stock cards
    renderStockCards();

    // 4. Set up Speech Recognition
    setupSpeechRecognition();


    // --- Event Listeners ---

    // Search input changes
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            searchQuery = event.target.value;
            updateFilteredStocks();
        });
    }

    // Microphone button click
    if (microphoneButton) {
        microphoneButton.addEventListener('click', () => {
            if (!isListening) {
                startListening();
            }
            // No action needed if already listening (onend will handle reset)
        });
    }

}); // End of DOMContentLoaded