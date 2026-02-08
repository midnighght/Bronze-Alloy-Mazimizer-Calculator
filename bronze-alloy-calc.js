// Button selection state management
let selectedButton = 1; // Default to Button 1

// Metal labels for each button mode
const metalLabels = [
    ["Copper", "Tin", ""],
    ["Copper", "Zinc", "Bismuth"],
    ["Copper", "Silver", "Gold"]
];

// Ratio definitions for each bronze type
const bronzeRatios = [
    // Tin Bronze (Button 1) - 2 metals
    {
        rmin: [
            { num: 88, den: 100 },  // Copper min
            { num: 8, den: 100 }     // Tin min
        ],
        rmax: [
            { num: 92, den: 100 },  // Copper max
            { num: 12, den: 100 }    // Tin max
        ]
    },
    // Bismuth Bronze (Button 2) - 3 metals
    {
        rmin: [
            { num: 5, den: 10 },    // Copper min
            { num: 2, den: 10 },    // Zinc min
            { num: 1, den: 10 }     // Bismuth min
        ],
        rmax: [
            { num: 7, den: 10 },    // Copper max
            { num: 3, den: 10 },    // Zinc max
            { num: 2, den: 10 }     // Bismuth max
        ]
    },
    // Black Bronze (Button 3) - 3 metals
    {
        rmin: [
            { num: 68, den: 100 },  // Copper min
            { num: 8, den: 100 },   // Silver min
            { num: 8, den: 100 }    // Gold min
        ],
        rmax: [
            { num: 84, den: 100 },  // Copper max
            { num: 16, den: 100 },  // Silver max
            { num: 16, den: 100 }   // Gold max
        ]
    }
];

// Utility functions for ratio-based calculations
function ceilDiv(a, b) {
    return Math.floor((a + b - 1) / b);
}

function floorDiv(a, b) {
    return Math.floor(a / b);
}

// Check if total alloy T is feasible given available metals and ratio constraints
function feasible(T, A, rmin, rmax) {
    let sumLow = 0;
    let sumHigh = 0;
    const n = A.length;

    for (let i = 0; i < n; i++) {
        let low = ceilDiv(rmin[i].num * T, rmin[i].den);
        let high = floorDiv(rmax[i].num * T, rmax[i].den);

        low = Math.max(low, 0);
        high = Math.min(high, A[i]);

        if (low > high) return false;

        sumLow += low;
        sumHigh += high;
    }
    return sumLow <= T && T <= sumHigh;
}

// Find maximum alloy using binary search
function maxAlloy(A, rmin, rmax) {
    let lo = 0;
    let hi = A.reduce((sum, val) => sum + val, 0);
    let best = 0;

    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (feasible(mid, A, rmin, rmax)) {
            best = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return best;
}

// Calculate actual metal amounts needed for the optimal total
function recoverSolution(T, A, rmin, rmax) {
    const n = A.length;
    const low = new Array(n);
    const high = new Array(n);
    const x = new Array(n);

    let sumLow = 0;
    for (let i = 0; i < n; i++) {
        low[i] = ceilDiv(rmin[i].num * T, rmin[i].den);
        high[i] = floorDiv(rmax[i].num * T, rmax[i].den);

        low[i] = Math.max(low[i], 0);
        high[i] = Math.min(high[i], A[i]);

        x[i] = low[i];
        sumLow += low[i];
    }

    let remaining = T - sumLow;

    for (let i = 0; i < n && remaining > 0; i++) {
        const add = Math.min(remaining, high[i] - low[i]);
        x[i] += add;
        remaining -= add;
    }

    return x;
}

// Main calculation function
function calculateOptimalAlloy() {
    // Get input values
    const metal1 = parseFloat(document.getElementById('metal1-input').value) || 0;
    const metal2 = parseFloat(document.getElementById('metal2-input').value) || 0;
    const metal3 = parseFloat(document.getElementById('metal3-input').value) || 0;

    // Get ratios for selected bronze type
    const ratios = bronzeRatios[selectedButton - 1];
    
    // Determine number of metals based on button selection
    const metalCount = selectedButton === 1 ? 2 : 3;
    const A = metalCount === 2 ? [metal1, metal2] : [metal1, metal2, metal3];
    
    // Calculate maximum alloy
    const maxAlloyAmount = maxAlloy(A, ratios.rmin, ratios.rmax);
    
    // Get optimal metal amounts
    const optimalAmounts = recoverSolution(maxAlloyAmount, A, ratios.rmin, ratios.rmax);
    
    // Calculate ratios for display
    const optimalRatios = optimalAmounts.map(amount => 
        maxAlloyAmount > 0 ? amount / maxAlloyAmount : 0
    );
    
    // Display results
    displayResults(maxAlloyAmount, optimalRatios, metalCount);
}

// Function to display results in the UI
function displayResults(max_alloy, optimal_ratios, metalCount) {
    const resultElements = document.querySelectorAll('.result-units h3');
    
    if (max_alloy === 0 || !isFinite(max_alloy)) {
        // No valid calculation
        resultElements.forEach(el => el.textContent = '-');
        return;
    }

    // Calculate the metal amounts needed
    const metal1_needed = (optimal_ratios[0] * max_alloy);
    const metal2_needed = (optimal_ratios[1] * max_alloy);
    const metal3_needed = metalCount === 3 ? (optimal_ratios[2] * max_alloy) : 0;

    // Display results
    resultElements[0].textContent = metal1_needed;
    resultElements[1].textContent = metal2_needed;
    resultElements[2].textContent = metalCount === 3 ? metal3_needed : '-';
}

function updateButtonStates() {
    const buttons = document.querySelectorAll('.mode-button');
    buttons.forEach(button => {
        const buttonNum = button.getAttribute('data-button');
        if (parseInt(buttonNum) === selectedButton) {
            // Selected state
            button.classList.remove('text-midnight-300', 'hover:text-midnight-200', 'bg-midnight-700/50', 'hover:bg-midnight-700');
            button.classList.add('text-midnight-100', 'bg-midnight-600', 'ring-2', 'ring-midnight-400');
        } else {
            // Unselected state
            button.classList.remove('text-midnight-100', 'bg-midnight-600', 'ring-2', 'ring-midnight-400');
            button.classList.add('text-midnight-300', 'hover:text-midnight-200', 'bg-midnight-700/50', 'hover:bg-midnight-700');
        }
    });
    
    // Update elements based on selection
    updatePageElements();
    
    // Recalculate when button changes
    calculateOptimalAlloy();
}

function updatePageElements() {
    // This function will be called when the selected button changes
    // Add your logic here to modify other elements based on selectedButton
    console.log('Selected button:', selectedButton);
    
    const metalExtraElements = document.querySelectorAll('.metal-extra');
    
    if (selectedButton === 1) {
        // Button 1: Hide the third metal (show only 2 metals)
        metalExtraElements.forEach(el => {
            el.style.display = 'none';
        });
    } else if (selectedButton === 2 || selectedButton === 3) {
        // Button 2 or 3: Show all three metals
        metalExtraElements.forEach(el => {
            el.style.display = '';
        });
    }
    
    // Update metal labels based on selected button
    const labels = metalLabels[selectedButton - 1]; // Get labels for current button (0-indexed)
    const allMetalLabels = document.querySelectorAll('.metal-label');
    
    // Update all metal labels (both in results and materials sections)
    allMetalLabels.forEach((label, index) => {
        const metalIndex = index % 3; // Cycle through 0, 1, 2 for each set of 3 labels
        label.textContent = labels[metalIndex] || 'Metal ' + (metalIndex + 1);
    });
}

// Add click handlers to all buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.mode-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            selectedButton = parseInt(button.getAttribute('data-button'));
            updateButtonStates();
        });
    });
    
    // Add input event listeners for real-time calculation
    const inputs = [
        document.getElementById('metal1-input'),
        document.getElementById('metal2-input'),
        document.getElementById('metal3-input')
    ];
    
    inputs.forEach(input => {
        input.addEventListener('input', calculateOptimalAlloy);
    });
    
    // Initialize button states
    updateButtonStates();
    
    // Initial calculation
    calculateOptimalAlloy();
});