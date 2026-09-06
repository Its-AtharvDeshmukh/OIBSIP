// ============================================================
// Calculator state
// ============================================================
// currentInput        -> the number currently shown/being typed
// previousInput       -> the number entered before the pending operator
// currentOperator     -> the pending operator ("+", "−", "×", "÷")
// awaitingNewInput    -> true when the next digit should START a new
//                        number instead of appending to currentInput
//                        (set after an operator, and after "=")
// hasError            -> true when in an error state (e.g. divide by zero)
// ============================================================

let currentInput = "0";
let previousInput = null;
let currentOperator = null;
let awaitingNewInput = false;
let hasError = false;

const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

// ============================================================
// Display rendering
// ============================================================

function updateDisplay() {
  resultEl.classList.remove("error");
  resultEl.textContent = currentInput;

  if (currentOperator && previousInput !== null) {
    expressionEl.textContent = `${previousInput} ${currentOperator}`;
  } else {
    expressionEl.textContent = "";
  }
}

function pulseResult() {
  resultEl.classList.remove("pulse");
  void resultEl.offsetWidth; // force reflow so the animation can restart
  resultEl.classList.add("pulse");
}

function showError(message) {
  hasError = true;
  expressionEl.textContent = "";
  resultEl.textContent = message;
  resultEl.classList.add("error");
}

// ============================================================
// Core calculator actions
// ============================================================

function clearCalculator() {
  currentInput = "0";
  previousInput = null;
  currentOperator = null;
  awaitingNewInput = false;
  hasError = false;
  updateDisplay();
}

function deleteLastCharacter() {
  if (hasError) {
    clearCalculator();
    return;
  }

  if (awaitingNewInput) {
    // Nothing meaningful to delete from the "old" number anymore
    return;
  }

  currentInput = currentInput.length <= 1 ? "0" : currentInput.slice(0, -1);
  updateDisplay();
}

function handleNumber(digit) {
  if (hasError) clearCalculator();

  if (awaitingNewInput) {
    // Start a brand new number (after an operator or after "=")
    currentInput = digit;
    awaitingNewInput = false;
  } else if (currentInput === "0") {
    currentInput = digit;
  } else if (currentInput.replace("-", "").length < 15) {
    // Cap length so long numbers never break the layout
    currentInput += digit;
  }

  updateDisplay();
}

function handleDecimal() {
  if (hasError) clearCalculator();

  if (awaitingNewInput) {
    currentInput = "0.";
    awaitingNewInput = false;
    updateDisplay();
    return;
  }

  // Prevent multiple decimal points in the same number
  if (!currentInput.includes(".")) {
    currentInput += ".";
    updateDisplay();
  }
}

function handleOperator(operator) {
  if (hasError) clearCalculator();

  if (currentOperator !== null && previousInput !== null && !awaitingNewInput) {
    // A calculation is already pending and the user typed a new number:
    // resolve it first, left-to-right, then keep chaining.
    const outcome = performCalculation();
    if (outcome === null) return; // an error was already shown
    previousInput = outcome;
    currentInput = outcome;
  } else {
    previousInput = currentInput;
  }

  currentOperator = operator;
  awaitingNewInput = true; // next digit starts a fresh number
  updateDisplay();
}

function performCalculation() {
  const a = parseFloat(previousInput);
  const b = parseFloat(currentInput);

  if (Number.isNaN(a) || Number.isNaN(b)) return null;

  let result;
  switch (currentOperator) {
    case "+":
      result = a + b;
      break;
    case "−":
      result = a - b;
      break;
    case "×":
      result = a * b;
      break;
    case "÷":
      if (b === 0) {
        showError("Cannot divide by zero");
        return null;
      }
      result = a / b;
      break;
    default:
      return null;
  }

  // Round away tiny floating point errors (e.g. 0.1 + 0.2)
  result = Math.round((result + Number.EPSILON) * 1e10) / 1e10;
  return result.toString();
}

function calculateResult() {
  if (hasError) {
    clearCalculator();
    return;
  }

  if (currentOperator === null || previousInput === null) {
    return; // nothing to calculate
  }

  const outcome = performCalculation();
  if (outcome === null) return; // error already shown

  currentInput = outcome;
  currentOperator = null;
  previousInput = null;
  awaitingNewInput = true; // next digit starts a fresh calculation
  updateDisplay();
  pulseResult();
}

// ============================================================
// Event wiring
// ============================================================

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", () => {
    switch (button.dataset.action) {
      case "number":
        handleNumber(button.dataset.value);
        break;
      case "decimal":
        handleDecimal();
        break;
      case "operator":
        handleOperator(button.dataset.operator);
        break;
      case "equals":
        calculateResult();
        break;
      case "clear":
        clearCalculator();
        break;
      case "backspace":
        deleteLastCharacter();
        break;
    }
  });
});

// Basic keyboard support for a smoother experience
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    handleNumber(key);
  } else if (key === ".") {
    handleDecimal();
  } else if (key === "+") {
    handleOperator("+");
  } else if (key === "-") {
    handleOperator("−");
  } else if (key === "*") {
    handleOperator("×");
  } else if (key === "/") {
    event.preventDefault();
    handleOperator("÷");
  } else if (key === "Enter" || key === "=") {
    calculateResult();
  } else if (key === "Backspace") {
    deleteLastCharacter();
  } else if (key === "Escape") {
    clearCalculator();
  }
});

// ============================================================
// Initial state
// ============================================================
updateDisplay();