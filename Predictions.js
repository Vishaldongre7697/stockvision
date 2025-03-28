// --- Global Constants & Elements ---
// Use fixed dimensions matching the SVG viewBox
const CHART_VIEW_WIDTH = 311;
const CHART_HEIGHT = 220;
const SVG_NS = "http://www.w3.org/2000/svg";

// DOM Elements (Grouped for clarity)
const stockSelectorContainer = document.getElementById('stock-selector');
const headerElements = {
    symbol: document.getElementById('stock-symbol'),
    name: document.getElementById('stock-name'),
    price: document.getElementById('stock-price'),
    changeIcon: document.getElementById('change-icon'),
    change: document.getElementById('stock-change'),
};
const chartElements = {
    candleBtn: document.getElementById('candle-chart-btn'),
    lineBtn: document.getElementById('line-chart-btn'),
    candleContainer: document.getElementById('candle-chart-container'),
    lineContainer: document.getElementById('line-chart-container'),
    candleSvg: document.getElementById('candle-chart-svg'),
    lineSvg: document.getElementById('line-chart-svg'),
    candleLabels: document.getElementById('candle-chart-labels'),
    lineLabels: document.getElementById('line-chart-labels'),
    legend: document.getElementById('chart-legend'),
    timeframeButtons: document.querySelectorAll('.timeframe-button'),
    wrapper: document.querySelector('.chart-wrapper'), // Keep for potential future use, but not for width calculation now
};
const metricsElements = {
    confidenceFill: document.getElementById('confidence-fill'),
    confidenceText: document.getElementById('confidence-text'),
    directionBadge: document.getElementById('direction-badge'),
    directionIcon: document.getElementById('direction-icon'),
    directionText: document.getElementById('direction-text'),
    directionTimeframe: document.getElementById('direction-timeframe'),
    priceRangeMin: document.getElementById('price-range-min'),
    priceRangeMax: document.getElementById('price-range-max'),
    strategyValue: document.getElementById('strategy-value'),
    updateText: document.getElementById('update-text'),
};
const indicatorGrid = document.getElementById('indicator-grid');
const fundamentalGrid = document.getElementById('fundamental-grid');
const tradeElements = {
    quantityInput: document.getElementById('quantity'),
    entryPriceInput: document.getElementById('entry-price'),
    targetPriceInput: document.getElementById('target-price'),
    stopLossPriceInput: document.getElementById('stop-loss-price'),
    potentialProfitEl: document.getElementById('potential-profit'),
    potentialLossEl: document.getElementById('potential-loss'),
    riskRewardRatioEl: document.getElementById('risk-reward-ratio'),
    setAlertBtn: document.getElementById('set-alert-btn'),
    placeOrderBtn: document.getElementById('place-order-btn'),
};

// --- State Variables ---
let currentChartType = 'candle';
let currentStockSymbol = 'RELIANCE'; // Default stock
let currentStockData = {}; // Holds data for the currently selected stock
let chartMinValue = 0;
let chartMaxValue = 1;
let chartValueRange = 1;


// --- Mock Data for Multiple Stocks ---
const allStockDetails = {
    'RELIANCE': {
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd',
        currentPrice: 2785.50,
        change: 35.25,
        changePercent: 1.28,
        chart: {
            priceData: [2720, 2750, 2735, 2758, 2780, 2775, 2790, 2810, 2795, 2785, 2800],
            predictedData: [2785, 2800, 2825, 2850, 2830],
            candleData: [
                { date: '09:30', open: 2720, high: 2735, low: 2710, close: 2730 }, { date: '09:45', open: 2730, high: 2755, low: 2728, close: 2750 }, { date: '10:00', open: 2750, high: 2760, low: 2735, close: 2735 }, { date: '10:15', open: 2735, high: 2765, low: 2730, close: 2758 }, { date: '10:30', open: 2758, high: 2790, low: 2755, close: 2780 }, { date: '10:45', open: 2780, high: 2785, low: 2768, close: 2775 }, { date: '11:00', open: 2775, high: 2795, low: 2770, close: 2790 }, { date: '11:15', open: 2790, high: 2815, low: 2785, close: 2810 }, { date: '11:30', open: 2810, high: 2815, low: 2792, close: 2795 }, { date: '11:45', open: 2795, high: 2798, low: 2780, close: 2785 },
            ],
            buyLevel: 2730,
            sellLevel: 2850,
            stopLoss: 2680,
        },
        predictionMetrics: { confidence: 84, priceRange: { min: 2700, max: 2850 }, direction: 'bullish', timeFrame: '10 minutes', strategy: 'Buy', updatedAt: '2 mins ago' },
        indicators: [ { name: 'RSI', value: 58.3, status: 'neutral' }, { name: 'MACD', value: 'Bullish', status: 'buy' }, { name: 'SMA 50', value: '₹2,678', status: 'buy' }, { name: 'SMA 200', value: '₹2,520', status: 'strong_buy' }, { name: 'Bollinger', value: 'Upper', status: 'sell' }, { name: 'Volume', value: '2.3M', status: 'strong_buy' } ],
        fundamentalData: [ { title: 'FII', value: '₹1,245 Cr', change: '₹245 Cr', changeDirection: 'up'}, { title: 'DII', value: '₹879 Cr', change: '₹124 Cr', changeDirection: 'up'}, { title: 'Deals', value: '3', change: '₹523 Cr', changeDirection: 'neutral'}, { title: 'Revenue', value: '₹242K Cr', change: '12.4%', changeDirection: 'up'}, { title: 'Mkt Cap', value: '₹19.2L Cr', change: '1.2%', changeDirection: 'up'}, { title: 'P/E', value: '28.6', change: '0.9', changeDirection: 'down'} ],
    },
    'TCS': {
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        currentPrice: 3850.10,
        change: -15.20,
        changePercent: -0.39,
        chart: {
            priceData: [3880, 3865, 3870, 3855, 3860, 3845, 3850, 3840, 3855, 3850],
            predictedData: [3855, 3865, 3875, 3860],
            candleData: [ { date: '09:30', open: 3880, high: 3885, low: 3860, close: 3865 }, { date: '09:45', open: 3865, high: 3875, low: 3850, close: 3870 }, { date: '10:00', open: 3870, high: 3872, low: 3850, close: 3855 }, { date: '10:15', open: 3855, high: 3865, low: 3840, close: 3860 }, { date: '10:30', open: 3860, high: 3862, low: 3840, close: 3845 }, { date: '10:45', open: 3845, high: 3855, low: 3840, close: 3850 }],
            buyLevel: 3800,
            sellLevel: 3950,
            stopLoss: 3750,
        },
        predictionMetrics: { confidence: 72, priceRange: { min: 3820, max: 3920 }, direction: 'neutral', timeFrame: '15 minutes', strategy: 'Hold', updatedAt: '5 mins ago' },
        indicators: [ { name: 'RSI', value: 45.1, status: 'neutral' }, { name: 'MACD', value: 'Bearish', status: 'sell' }, { name: 'SMA 50', value: '₹3,880', status: 'sell' }, { name: 'SMA 200', value: '₹3,750', status: 'buy' }, { name: 'Bollinger', value: 'Lower', status: 'buy' }, { name: 'Volume', value: '1.1M', status: 'neutral' } ],
        fundamentalData: [ { title: 'FII', value: '₹950 Cr', change: '-₹110 Cr', changeDirection: 'down'}, { title: 'DII', value: '₹620 Cr', change: '₹80 Cr', changeDirection: 'up'}, { title: 'Deals', value: '1', change: '₹210 Cr', changeDirection: 'neutral'}, { title: 'Revenue', value: '₹190K Cr', change: '8.1%', changeDirection: 'up'}, { title: 'Mkt Cap', value: '₹14.0L Cr', change: '-0.5%', changeDirection: 'down'}, { title: 'P/E', value: '30.1', change: '0.2', changeDirection: 'up'} ],
    },
    'INFY': {
        symbol: 'INFY',
        name: 'Infosys Ltd',
        currentPrice: 1420.75,
        change: 8.10,
        changePercent: 0.57,
        chart: {
            priceData: [1405, 1410, 1415, 1408, 1412, 1418, 1422, 1415, 1419, 1420],
            predictedData: [1425, 1430, 1428, 1435],
            candleData: [ { date: '09:30', open: 1405, high: 1412, low: 1402, close: 1410 }, { date: '09:45', open: 1410, high: 1418, low: 1408, close: 1415 }, { date: '10:00', open: 1415, high: 1416, low: 1405, close: 1408 }, { date: '10:15', open: 1408, high: 1415, low: 1406, close: 1412 }, { date: '10:30', open: 1412, high: 1420, low: 1410, close: 1418 }, { date: '10:45', open: 1418, high: 1425, low: 1416, close: 1422 }],
            buyLevel: 1400,
            sellLevel: 1450,
            stopLoss: 1380,
        },
        predictionMetrics: { confidence: 65, priceRange: { min: 1410, max: 1440 }, direction: 'bullish', timeFrame: '5 minutes', strategy: 'Buy', updatedAt: '1 min ago' },
        indicators: [ { name: 'RSI', value: 52.0, status: 'neutral' }, { name: 'MACD', value: 'Neutral', status: 'neutral' }, { name: 'SMA 50', value: '₹1,405', status: 'buy' }, { name: 'SMA 200', value: '₹1,390', status: 'buy' }, { name: 'Bollinger', value: 'Middle', status: 'neutral' }, { name: 'Volume', value: '3.5M', status: 'buy' } ],
        fundamentalData: [ { title: 'FII', value: '₹780 Cr', change: '₹55 Cr', changeDirection: 'up'}, { title: 'DII', value: '₹410 Cr', change: '₹30 Cr', changeDirection: 'up'}, { title: 'Deals', value: '2', change: '₹350 Cr', changeDirection: 'neutral'}, { title: 'Revenue', value: '₹146K Cr', change: '9.5%', changeDirection: 'up'}, { title: 'Mkt Cap', value: '₹5.9L Cr', change: '0.8%', changeDirection: 'up'}, { title: 'P/E', value: '24.5', change: '-0.3', changeDirection: 'down'} ],
    },
};


// --- Helper Functions ---
// Calculates Y coordinate within the fixed CHART_HEIGHT based on price and scale
const getYPosition = (price) => {
    if (chartValueRange <= 0) return CHART_HEIGHT / 2; // Avoid division by zero or negative range
    const calculatedY = CHART_HEIGHT - ((price - chartMinValue) / chartValueRange) * CHART_HEIGHT;
    // Clamp values to be within the chart boundaries to prevent minor overflows
    return Math.max(0, Math.min(CHART_HEIGHT, calculatedY));
};

function createSvgElement(tag, attributes) {
    const element = document.createElementNS(SVG_NS, tag);
    for (const key in attributes) { element.setAttribute(key, attributes[key]); }
    return element;
}

function getStatusColorClass(status) { return `status-${status}`; }
function getChangeColorClass(direction) { return direction || 'neutral'; }

function getStatusIconHtml(status) {
    switch (status) {
        case 'buy': return '<i class="fas fa-arrow-up"></i>';
        case 'strong_buy': return '<i class="fas fa-arrow-up-long"></i>';
        case 'sell': return '<i class="fas fa-arrow-down"></i>';
        case 'strong_sell': return '<i class="fas fa-arrow-down-long"></i>';
        default: return '<i class="fas fa-arrow-right"></i>';
    }
}
function getChangeIconHtml(direction) {
    switch (direction) {
        case 'up': return '<i class="fas fa-arrow-trend-up"></i>';
        case 'down': return '<i class="fas fa-arrow-trend-down"></i>';
        default: return '<i class="fas fa-minus"></i>';
    }
}

// --- Chart Rendering Functions --- (Use fixed CHART_VIEW_WIDTH and CHART_HEIGHT)

function calculateChartScale() {
    const { priceData = [], predictedData = [], candleData = [], buyLevel = 0, sellLevel = 0, stopLoss = 0 } = currentStockData.chart || {};
    const candleValues = candleData.flatMap(c => [c.open, c.high, c.low, c.close]);
    // Ensure the last historical price is included if prediction exists
    const lastHistoricalPrice = priceData.length > 0 ? [priceData[priceData.length - 1]] : [];
    const allPredValues = predictedData.length > 0 ? [...lastHistoricalPrice, ...predictedData] : [];

    const allValues = [
            ...priceData,
            ...allPredValues,
            ...candleValues,
            buyLevel,
            sellLevel,
            stopLoss
        ]
        .filter(v => typeof v === 'number' && isFinite(v)); // Ensure only valid numbers

     if (allValues.length === 0) { // Handle empty data case
        chartMinValue = 0;
        chartMaxValue = 100; // Default range
    } else {
        const minVal = Math.min(...allValues);
        const maxVal = Math.max(...allValues);
        // Ensure min and max are different, otherwise padding becomes 0
        if (minVal === maxVal) {
            chartMinValue = minVal - 10; // Add arbitrary padding
            chartMaxValue = maxVal + 10;
        } else {
            const padding = (maxVal - minVal) * 0.05; // 5% padding
            chartMinValue = minVal - padding;
            chartMaxValue = maxVal + padding;
        }
    }
    chartValueRange = chartMaxValue - chartMinValue;
     // Prevent zero or negative range which breaks getYPosition
    if (chartValueRange <= 0) {
        chartValueRange = 1; // Set a minimum range
    }
}


function drawGridAndLabels(svgElement, labelContainer) {
    svgElement.innerHTML = ''; // Clear previous
    labelContainer.innerHTML = ''; // Clear previous labels

    const gridGroup = createSvgElement('g', { class: 'grid' });
    svgElement.appendChild(gridGroup);

     // Add gradient defs if it's the line chart SVG and doesn't exist
    if (svgElement.id === 'line-chart-svg' && !svgElement.querySelector('defs')) {
        const defs = createSvgElement('defs');
        const gradient = createSvgElement('linearGradient', { id: 'areaGradient', x1: '0', y1: '0', x2: '0', y2: '1' });
        gradient.appendChild(createSvgElement('stop', { offset: '0', 'stop-color': '#2196F3', 'stop-opacity': '0.3' }));
        gradient.appendChild(createSvgElement('stop', { offset: '1', 'stop-color': '#2196F3', 'stop-opacity': '0.0' }));
        defs.appendChild(gradient);
        svgElement.insertBefore(defs, svgElement.firstChild); // Insert before grid
    }

    // Draw horizontal grid lines and labels
    [0, 0.25, 0.5, 0.75, 1].forEach((ratio) => {
        const y = CHART_HEIGHT * ratio;
        // Clamp y to prevent lines slightly outside due to floating point math
        const clampedY = Math.max(0, Math.min(CHART_HEIGHT, y));
        const price = chartMaxValue - (chartValueRange * ratio);
        gridGroup.appendChild(createSvgElement('line', {
            x1: 0,
            y1: clampedY,
            x2: CHART_VIEW_WIDTH,
            y2: clampedY,
            class: 'grid-line'
        }));

        // Position label slightly away from the line and edges
        const labelY = clampedY > CHART_HEIGHT - 10 ? clampedY - 4 : (clampedY < 10 ? clampedY + 10 : clampedY - 4); // Adjust if near top/bottom
        const textLabel = createSvgElement('text', {
            x: 5, // Small padding from left edge
            y: labelY,
            class: 'grid-label'
        });
        textLabel.textContent = price.toFixed(0); // Adjust decimals as needed
        gridGroup.appendChild(textLabel);
    });
}

function drawLevels(svgElement, labelContainer) {
     const { buyLevel, sellLevel, stopLoss } = currentStockData.chart || {};
     // Check if any level is a valid number
     if ( ![buyLevel, sellLevel, stopLoss].some(level => typeof level === 'number' && isFinite(level)) ) {
        return; // Don't draw if no valid levels
     }

     const levelsGroup = createSvgElement('g', { class: 'levels' });
     svgElement.appendChild(levelsGroup);

     const levelsData = [
         { value: buyLevel, class: 'buy', label: 'Buy' },
         { value: sellLevel, class: 'sell', label: 'Sell' },
         { value: stopLoss, class: 'stop', label: 'Stop' },
     ];

     levelsData.forEach(level => {
         // Ensure level.value is a valid number before drawing
         if (typeof level.value !== 'number' || !isFinite(level.value)) return;

         const y = getYPosition(level.value); // getYPosition now clamps the value

         // Draw horizontal line spanning the full width
         levelsGroup.appendChild(createSvgElement('line', {
             x1: 0,
             y1: y,
             x2: CHART_VIEW_WIDTH,
             y2: y,
             class: `level-line ${level.class}`
         }));

         // Draw a small dot near the left edge
         levelsGroup.appendChild(createSvgElement('circle', {
             cx: 10, // Position dot slightly inside the left edge
             cy: y,
             r: 4,
             class: `level-dot ${level.class}`
         }));

         // Add HTML label (positioned relative to the HTML container)
         const labelDiv = document.createElement('div');
         labelDiv.className = 'level-label';
         // Use percentage for vertical positioning relative to the container height
         labelDiv.style.top = `${(y / CHART_HEIGHT) * 100}%`;
         labelDiv.textContent = `${level.label}: ₹${level.value.toFixed(2)}`; // Format price
         labelContainer.appendChild(labelDiv);
     });
 }


function renderCandleChart() {
    const { candleData = [] } = currentStockData.chart || {};
    drawGridAndLabels(chartElements.candleSvg, chartElements.candleLabels);
    const candlesGroup = createSvgElement('g', { class: 'candles' });
    chartElements.candleSvg.appendChild(candlesGroup);

    const numCandles = candleData.length;
    if (numCandles === 0) { // Handle empty data
       drawLevels(chartElements.candleSvg, chartElements.candleLabels);
       return;
    }

    // Calculate candle width with padding on both sides
    const candleWidth = CHART_VIEW_WIDTH / (numCandles + 1); // +1 for padding left/right overall
    const candleBodyWidth = Math.max(1, candleWidth * 0.8); // Make body slightly narrower than total space
    const candlePadding = (candleWidth - candleBodyWidth) / 2;

    candleData.forEach((candle, index) => {
        // Calculate X position for the center of the candle
        const centerX = candleWidth * (index + 0.5);
        const startX = centerX - candleBodyWidth / 2;

        // Get Y positions (already clamped by getYPosition)
        const openY = getYPosition(candle.open);
        const closeY = getYPosition(candle.close);
        const highY = getYPosition(candle.high);
        const lowY = getYPosition(candle.low);
        const isGreen = candle.close >= candle.open; // Treat equal as green

        // Draw wick (line from high to low)
        candlesGroup.appendChild(createSvgElement('line', {
            x1: centerX,
            y1: highY,
            x2: centerX,
            y2: lowY,
            class: 'candle-wick'
        }));

        // Draw body (rectangle)
        const bodyHeight = Math.max(1, Math.abs(closeY - openY)); // Ensure minimum height of 1px
        const bodyY = isGreen ? closeY : openY;
        candlesGroup.appendChild(createSvgElement('rect', {
            x: startX,
            y: bodyY,
            width: candleBodyWidth,
            height: bodyHeight,
            class: `candle-body ${isGreen ? 'green' : 'red'}`
        }));
    });

    drawLevels(chartElements.candleSvg, chartElements.candleLabels);
}

function renderLineChart() {
    const { priceData = [], predictedData = [] } = currentStockData.chart || {};
    drawGridAndLabels(chartElements.lineSvg, chartElements.lineLabels);
    const linesGroup = createSvgElement('g', { class: 'lines' });
    chartElements.lineSvg.appendChild(linesGroup);

    const numPoints = priceData.length;
     if (numPoints === 0) { // Handle no price data
        drawLevels(chartElements.lineSvg, chartElements.lineLabels);
        return;
    }

    // --- Historical Data ---
    const linePoints = priceData.map((price, index) => {
        // Calculate X position based on index, spanning the full width
        const x = numPoints > 1 ? (index / (numPoints - 1)) * CHART_VIEW_WIDTH : CHART_VIEW_WIDTH / 2; // Center if only one point
        const y = getYPosition(price); // Clamped Y position
        return `${x},${y}`;
    });

    const firstPoint = linePoints[0]; // Already a string "x,y"
    const lastPoint = linePoints[linePoints.length - 1];

    // Draw Area Path (Historical)
    linesGroup.appendChild(createSvgElement('path', {
        d: `M ${firstPoint} L ${linePoints.slice(1).join(' L ')} L ${lastPoint.split(',')[0]},${CHART_HEIGHT} L ${firstPoint.split(',')[0]},${CHART_HEIGHT} Z`,
        class: 'area-path'
    }));

    // Draw Main Line (Historical)
    linesGroup.appendChild(createSvgElement('path', {
        d: `M ${firstPoint} L ${linePoints.slice(1).join(' L ')}`,
        class: 'line-path'
    }));

    // Draw Data Points (Historical)
     priceData.forEach((price, index) => {
         const x = numPoints > 1 ? (index / (numPoints - 1)) * CHART_VIEW_WIDTH : CHART_VIEW_WIDTH / 2;
         const y = getYPosition(price);
         linesGroup.appendChild(createSvgElement('circle', { cx: x, cy: y, r: 3, class: 'data-point' }));
     });

    // --- Predicted Data ---
    if (predictedData.length > 0 && numPoints > 0) {
        // Combine last historical point with prediction points
        const allPredictionPointsData = [ priceData[numPoints - 1], ...predictedData ];
        const totalCombinedPoints = numPoints + predictedData.length; // Total points for scaling prediction X

        const predictionSvgPoints = allPredictionPointsData.map((price, index) => {
            const combinedIndex = numPoints - 1 + index; // Index in the combined historical+prediction timeline
            // Scale X based on the combined timeline
            const x = totalCombinedPoints > 1 ? (combinedIndex / (totalCombinedPoints - 1)) * CHART_VIEW_WIDTH : CHART_VIEW_WIDTH / 2;
            const y = getYPosition(price);
            return `${x},${y}`;
        });

        // Draw Prediction Line (starts from last historical point)
        linesGroup.appendChild(createSvgElement('path', {
            d: `M ${predictionSvgPoints[0]} L ${predictionSvgPoints.slice(1).join(' L ')}`, // Start from first point (last historical)
            class: 'prediction-path'
        }));
    }

    drawLevels(chartElements.lineSvg, chartElements.lineLabels);
}


function renderChartLegend() {
     chartElements.legend.innerHTML = ''; // Clear existing
     const legendData = [
         { label: 'Price', color: '#2196F3' },
         { label: 'AI Prediction', color: '#9C27B0' },
         { label: 'Buy Level', color: '#4CAF50' },
         { label: 'Sell Level', color: '#F44336' },
         { label: 'Stop Loss', color: '#FF9800' },
     ];
     legendData.forEach(item => {
         const legendItem = document.createElement('div');
         legendItem.className = 'legend-item';
         legendItem.innerHTML = `<span class="legend-dot" style="background-color: ${item.color};"></span><span class="legend-text">${item.label}</span>`;
         chartElements.legend.appendChild(legendItem);
     });
 }

// --- Indicator/Data Rendering Functions --- (Use currentStockData)

function renderIndicators() {
    const indicators = currentStockData.indicators || [];
    indicatorGrid.innerHTML = '';
    indicators.forEach(indicator => {
        const card = document.createElement('div');
        card.className = 'indicator-card';
        const statusColorClass = getStatusColorClass(indicator.status);
        card.innerHTML = `
            <div class="indicator-header">
                <span class="indicator-name">${indicator.name}</span>
                <button title="${indicator.info || ''}"><i class="fas fa-info-circle indicator-info-icon"></i></button>
            </div>
            <div class="indicator-content">
                <span class="indicator-value">${indicator.value}</span>
                <div class="status-badge ${statusColorClass}">${getStatusIconHtml(indicator.status)}<span class="status-text">${indicator.status.replace('_', ' ').toUpperCase()}</span></div>
            </div>`;
        indicatorGrid.appendChild(card);
    });
}

function renderFundamentalData() {
    const fundamentalData = currentStockData.fundamentalData || [];
    fundamentalGrid.innerHTML = '';
    fundamentalData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'fundamental-item';
        const changeColorClass = getChangeColorClass(item.changeDirection);
        let changeHtml = '';
        if (item.change) {
            changeHtml = `<div class="change-info-container">${getChangeIconHtml(item.changeDirection)}<span class="change-text ${changeColorClass}">${item.change}</span></div>`;
        }
        card.innerHTML = `
            <div class="item-header"><span class="item-title">${item.title}</span><button title="${item.info || ''}"><i class="fas fa-info-circle item-info-icon"></i></button></div>
            <span class="item-value">${item.value}</span>
            ${changeHtml}`;
        fundamentalGrid.appendChild(card);
    });
}

function renderPredictionMetrics() {
     const metrics = currentStockData.predictionMetrics || {};
     const confidence = metrics.confidence || 0;
     let confidenceColor;
     if (confidence >= 80) confidenceColor = '#4CAF50';
     else if (confidence >= 60) confidenceColor = '#8BC34A';
     else if (confidence >= 40) confidenceColor = '#FFC107';
     else confidenceColor = '#F44336';
     metricsElements.confidenceFill.style.width = `${confidence}%`;
     metricsElements.confidenceFill.style.backgroundColor = confidenceColor;
     metricsElements.confidenceText.textContent = `${confidence}%`;

     const isBullish = metrics.direction === 'bullish';
     metricsElements.directionBadge.className = `direction-badge ${isBullish ? 'bullish' : 'bearish'}`;
     metricsElements.directionIcon.className = `fas ${isBullish ? 'fa-arrow-up' : 'fa-arrow-down'} direction-icon ${isBullish ? 'bullish' : 'bearish'}`;
     metricsElements.directionText.className = `direction-text ${isBullish ? 'bullish' : 'bearish'}`;
     metricsElements.directionText.textContent = (metrics.direction || 'N/A').toUpperCase();
     metricsElements.directionTimeframe.textContent = `Next ${metrics.timeFrame || 'N/A'}`;

     metricsElements.priceRangeMin.textContent = `₹${(metrics.priceRange?.min || 0).toFixed(2)}`; // Format price
     metricsElements.priceRangeMax.textContent = `₹${(metrics.priceRange?.max || 0).toFixed(2)}`; // Format price

     const isBuyStrategy = metrics.strategy === 'Buy';
     metricsElements.strategyValue.textContent = metrics.strategy || 'N/A';
     metricsElements.strategyValue.className = `strategy-value ${isBuyStrategy ? 'buy' : (metrics.strategy === 'Sell' ? 'sell' : 'neutral')}`;
     metricsElements.updateText.textContent = `Updated ${metrics.updatedAt || 'N/A'}`;
 }


// --- Trade Calculation ---
function calculateTradeMetrics() {
    const qty = parseFloat(tradeElements.quantityInput.value) || 0;
    const entry = parseFloat(tradeElements.entryPriceInput.value) || 0;
    const target = parseFloat(tradeElements.targetPriceInput.value) || 0;
    const stop = parseFloat(tradeElements.stopLossPriceInput.value) || 0;

    let potentialProfit = 0;
    let potentialLoss = 0;
    let riskRewardRatio = 0;

    if (qty > 0 && entry > 0 && target > 0 && target > entry) {
        potentialProfit = (target - entry) * qty;
    }
    if (qty > 0 && entry > 0 && stop > 0 && entry > stop) {
        potentialLoss = (entry - stop) * qty; // Loss is positive value
    }

    if (potentialLoss > 0 && potentialProfit > 0) {
        riskRewardRatio = potentialProfit / potentialLoss;
    }

    tradeElements.potentialProfitEl.textContent = `₹${potentialProfit.toFixed(2)}`;
    tradeElements.potentialLossEl.textContent = `₹${potentialLoss.toFixed(2)}`;
    tradeElements.riskRewardRatioEl.textContent = riskRewardRatio > 0 ? `1:${riskRewardRatio.toFixed(2)}` : 'N/A';
}

// --- UI Update Function ---
function updateUIForStock(symbol) {
    currentStockSymbol = symbol;
    currentStockData = allStockDetails[symbol];
     if (!currentStockData) {
        console.error(`No data found for stock symbol: ${symbol}`);
        // Optionally display an error message to the user
        return;
    }

    // 1. Update Header
    headerElements.symbol.textContent = currentStockData.symbol;
    headerElements.name.textContent = currentStockData.name;
    headerElements.price.textContent = `₹${currentStockData.currentPrice.toFixed(2)}`;
    const isPositiveChange = currentStockData.change >= 0;
    headerElements.changeIcon.className = `fas ${isPositiveChange ? 'fa-caret-up' : 'fa-caret-down'} change-icon ${isPositiveChange ? 'up' : 'down'}`;
    headerElements.change.className = `change ${isPositiveChange ? 'up' : 'down'}`;
    headerElements.change.textContent = `${Math.abs(currentStockData.change).toFixed(2)} (${Math.abs(currentStockData.changePercent).toFixed(2)}%)`;

    // 2. Calculate Chart Scale for the new data
    calculateChartScale();

    // 3. Re-render the currently active chart type
    // Important: Calculations now use fixed viewBox dimensions
    if (currentChartType === 'candle') {
        renderCandleChart();
    } else {
        renderLineChart();
    }
    // Ensure legend is rendered
    renderChartLegend();

    // 4. Re-render other data sections
    renderPredictionMetrics();
    renderIndicators();
    renderFundamentalData();

    // 5. Update Trade Calculator (reset/default values)
    tradeElements.entryPriceInput.value = currentStockData.currentPrice.toFixed(2); // Default to current price
    // Use optional chaining ?. and nullish coalescing ?? for safer defaults
    tradeElements.targetPriceInput.value = (currentStockData.chart?.sellLevel ?? currentStockData.currentPrice * 1.02).toFixed(2);
    tradeElements.stopLossPriceInput.value = (currentStockData.chart?.buyLevel ?? currentStockData.currentPrice * 0.98).toFixed(2);
    calculateTradeMetrics(); // Recalculate based on new defaults

    // 6. Update Stock Selector Button Active State
    document.querySelectorAll('.stock-button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.symbol === symbol);
    });
}


// --- Event Listeners ---

// Stock Selector Buttons
function setupStockSelectorListeners() {
    document.querySelectorAll('.stock-button').forEach(button => {
        button.addEventListener('click', () => {
            const selectedSymbol = button.dataset.symbol;
            if (selectedSymbol !== currentStockSymbol) {
                updateUIForStock(selectedSymbol);
            }
        });
    });
}

// Chart Type Toggle
chartElements.candleBtn.addEventListener('click', () => {
    if (currentChartType !== 'candle') {
        currentChartType = 'candle';
        chartElements.candleBtn.classList.add('active');
        chartElements.lineBtn.classList.remove('active');
        chartElements.candleContainer.style.display = 'block';
        chartElements.lineContainer.style.display = 'none';
        // Rerender with fixed dimensions
        calculateChartScale(); // Recalculate scale just in case data could differ per view
        renderCandleChart();
    }
});
chartElements.lineBtn.addEventListener('click', () => {
    if (currentChartType !== 'line') {
        currentChartType = 'line';
        chartElements.lineBtn.classList.add('active');
        chartElements.candleBtn.classList.remove('active');
        chartElements.lineContainer.style.display = 'block';
        chartElements.candleContainer.style.display = 'none';
         // Rerender with fixed dimensions
        calculateChartScale(); // Recalculate scale just in case data could differ per view
        renderLineChart();
    }
});

// Timeframe Buttons (Visual Only - Add data fetching logic here)
chartElements.timeframeButtons.forEach(button => {
    button.addEventListener('click', () => {
        chartElements.timeframeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        console.log(`Timeframe changed to: ${button.textContent} for ${currentStockSymbol}`);
        // TODO: Fetch new data for the current stock and timeframe
        // Then call:
        // calculateChartScale();
        // if (currentChartType === 'candle') renderCandleChart(); else renderLineChart();
        alert(`Data loading for ${button.textContent} timeframe not implemented.`);
    });
});

// Trade Calculator Inputs
[tradeElements.quantityInput, tradeElements.entryPriceInput, tradeElements.targetPriceInput, tradeElements.stopLossPriceInput].forEach(input => {
    input.addEventListener('input', calculateTradeMetrics);
});

// Action Buttons
tradeElements.setAlertBtn.addEventListener('click', () => { alert(`Set Alert for ${currentStockSymbol} - Not Implemented`); });
tradeElements.placeOrderBtn.addEventListener('click', () => { alert(`Place Order for ${currentStockSymbol} - Not Implemented`); });

// REMOVED Resize Listener - Relying on SVG scaling now
// function handleResize() { ... }
// window.removeEventListener('resize', handleResize); // Ensure it's removed if added previously


// --- Initial Setup ---
function initializeApp() {
    // NO LONGER NEEDED: Update Chart Width based on clientWidth
    // CHART_VIEW_WIDTH = chartElements.wrapper?.clientWidth || 311;

    // Create Stock Selector Buttons
    stockSelectorContainer.innerHTML = ''; // Clear any placeholders
    Object.keys(allStockDetails).forEach(symbol => {
        const button = document.createElement('button');
        button.className = 'stock-button';
        button.dataset.symbol = symbol; // Store symbol in data attribute
        button.textContent = symbol;
        stockSelectorContainer.appendChild(button);
    });
    setupStockSelectorListeners(); // Add listeners AFTER buttons are created

    // Initial UI Render for the default stock
    // This will calculate scale and render charts using fixed dimensions (311x220)
    updateUIForStock(currentStockSymbol);

    // Set initial chart visibility
    if (currentChartType === 'candle') {
        chartElements.lineContainer.style.display = 'none';
        chartElements.candleContainer.style.display = 'block';
        chartElements.candleBtn.classList.add('active'); // Ensure correct button active state
        chartElements.lineBtn.classList.remove('active');
    } else {
        chartElements.candleContainer.style.display = 'none';
        chartElements.lineContainer.style.display = 'block';
        chartElements.lineBtn.classList.add('active'); // Ensure correct button active state
        chartElements.candleBtn.classList.remove('active');
    }
}

// Run initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);