/**
 * Atmosphere - Premium Temperature Converter
 * Vanilla JS Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('converterForm');
    const tempInput = document.getElementById('tempInput');
    const unitRadios = document.querySelectorAll('input[name="inputUnit"]');
    const errorBanner = document.getElementById('errorBanner');
    const errorMessage = document.getElementById('errorMessage');
    const skyGradient = document.getElementById('skyGradient');

    // Result Cards & Values
    const cards = {
        C: document.getElementById('cardC'),
        F: document.getElementById('cardF'),
        K: document.getElementById('cardK')
    };
    
    const values = {
        C: document.getElementById('valC'),
        F: document.getElementById('valF'),
        K: document.getElementById('valK')
    };
    
    const formulas = {
        C: document.getElementById('formC'),
        F: document.getElementById('formF'),
        K: document.getElementById('formK')
    };

    // Physical Limits (Absolute Zero)
    const ABSOLUTE_ZERO = {
        C: -273.15,
        F: -459.67,
        K: 0
    };

    // Color Themes (Top gradient, Bottom gradient) based on Celsius
    const THEMES = {
        freezing: { top: '#0A1A3A', bot: '#1A4B82' }, // Deep cold
        cold:     { top: '#1A4B82', bot: '#4A8BCF' }, // Apple Default Blue
        mild:     { top: '#3A7BD5', bot: '#3A6073' }, // Neutral / Overcast
        warm:     { top: '#E6841D', bot: '#8A3B12' }, // Sunset Orange
        hot:      { top: '#901A1E', bot: '#D4422A' }  // Deep Heat Red
    };

    /**
     * Initialization
     */
    function init() {
        // Event Listeners
        form.addEventListener('submit', handleConversion);
        
        // Auto-convert on unit change
        unitRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                highlightActiveCard(radio.value);
                if (tempInput.value.trim() !== '') {
                    handleConversion();
                }
            });
        });

        // Setup initial UI state
        highlightActiveCard('C');
    }

    /**
     * Main Handler
     */
    function handleConversion(e) {
        if (e) e.preventDefault();

        const rawInput = tempInput.value.trim();
        const inputUnit = document.querySelector('input[name="inputUnit"]:checked').value;

        // 1. Validate Empty Input
        if (rawInput === '') {
            showError('Please enter a temperature.');
            resetOutputs();
            return;
        }

        // 2. Validate Numeric Input
        // Using Number() checks for purely numeric validity.
        const tempValue = Number(rawInput);
        if (isNaN(tempValue)) {
            showError('Invalid input. Please enter numbers only.');
            resetOutputs();
            return;
        }

        // 3. Validate Absolute Zero
        if (tempValue < ABSOLUTE_ZERO[inputUnit]) {
            showError(`Physics Violation: Below absolute zero (${ABSOLUTE_ZERO[inputUnit]}${inputUnit === 'K' ? 'K' : '°'+inputUnit}).`);
            resetOutputs();
            setAtmosphere(-300); // Trigger deep cold theme
            return;
        }

        // Success - hide errors
        hideError();

        // 4. Calculate
        const results = calculateTemperatures(tempValue, inputUnit);

        // 5. Update UI
        displayResults(results, inputUnit, tempValue);
        
        // 6. Update Visual Atmosphere based on Celsius value
        setAtmosphere(results.C);
    }

    /**
     * Core Math Logic
     */
    function calculateTemperatures(val, fromUnit) {
        let c, f, k;

        if (fromUnit === 'C') {
            c = val;
            f = (c * 9/5) + 32;
            k = c + 273.15;
        } else if (fromUnit === 'F') {
            f = val;
            c = (f - 32) * 5/9;
            k = c + 273.15;
        } else if (fromUnit === 'K') {
            k = val;
            c = k - 273.15;
            f = (c * 9/5) + 32;
        }

        return { C: c, F: f, K: k };
    }

    /**
     * DOM Manipulation Functions
     */
    function displayResults(res, inputUnit, rawVal) {
        // Format to 2 decimal places max, avoiding .00
        const format = (num) => parseFloat(num.toFixed(2));

        values.C.textContent = format(res.C);
        values.F.textContent = format(res.F);
        values.K.textContent = format(res.K);

        // Dynamic Formula Captions
        if (inputUnit === 'C') {
            formulas.C.textContent = 'Input Value';
            formulas.F.textContent = `(${format(rawVal)} × 9/5) + 32`;
            formulas.K.textContent = `${format(rawVal)} + 273.15`;
        } else if (inputUnit === 'F') {
            formulas.C.textContent = `(${format(rawVal)} - 32) × 5/9`;
            formulas.F.textContent = 'Input Value';
            formulas.K.textContent = `C + 273.15`;
        } else if (inputUnit === 'K') {
            formulas.C.textContent = `${format(rawVal)} - 273.15`;
            formulas.F.textContent = `(C × 9/5) + 32`;
            formulas.K.textContent = 'Input Value';
        }
    }

    function resetOutputs() {
        values.C.textContent = '--';
        values.F.textContent = '--';
        values.K.textContent = '--';
        
        formulas.C.textContent = 'Base SI Unit';
        formulas.F.textContent = 'Imperial Scale';
        formulas.K.textContent = 'Absolute Scale';
    }

    function highlightActiveCard(unit) {
        // Dim the card that represents the current input
        Object.keys(cards).forEach(key => {
            if (key === unit) {
                cards[key].classList.add('active-input');
            } else {
                cards[key].classList.remove('active-input');
            }
        });
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorBanner.style.display = 'flex';
        // Force reflow to restart CSS animation
        errorBanner.style.animation = 'none';
        errorBanner.offsetHeight; 
        errorBanner.style.animation = null; 
    }

    function hideError() {
        errorBanner.style.display = 'none';
    }

    /**
     * Atmospheric Visual Feedback
     */
    function setAtmosphere(celsius) {
        let theme;
        
        if (celsius <= 0) theme = THEMES.freezing;
        else if (celsius > 0 && celsius <= 15) theme = THEMES.cold;
        else if (celsius > 15 && celsius <= 28) theme = THEMES.mild;
        else if (celsius > 28 && celsius <= 40) theme = THEMES.warm;
        else theme = THEMES.hot;

        // Update CSS Variables for smooth gradient transition
        skyGradient.style.background = `linear-gradient(180deg, ${theme.top} 0%, ${theme.bot} 100%)`;
    }

    // Run Initialization
    init();
});