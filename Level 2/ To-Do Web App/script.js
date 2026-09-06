/**
 * FocusList - To-Do Web App
 * Handles State Management, LocalStorage, DOM Rendering, and User Interactions.
 */

// --- STATE MANAGEMENT ---
let tasks = [];
let editingId = null;
let pendingDeleteTask = null;
let deleteTimeout = null;

// --- DOM ELEMENTS ---
const elements = {
    greeting: document.getElementById('greeting'),
    form: document.getElementById('add-task-form'),
    input: document.getElementById('task-input'),
    errorMsg: document.getElementById('input-error'),
    pendingList: document.getElementById('list-pending'),
    completedList: document.getElementById('list-completed'),
    pendingCount: document.getElementById('count-pending'),
    completedCount: document.getElementById('count-completed'),
    emptyPending: document.getElementById('empty-pending'),
    emptyCompleted: document.getElementById('empty-completed'),
    sumPending: document.getElementById('summary-pending'),
    sumCompleted: document.getElementById('summary-completed'),
    progressFill: document.getElementById('progress-fill'),
    toastContainer: document.getElementById('toast-container')
};

// --- INITIALIZATION ---
function init() {
    setGreeting();
    loadTasks();
    render();
    setupEventListeners();
}

function setGreeting() {
    const hour = new Date().getHours();
    let greetingText = 'Good evening, Atharv.'; // Default to evening as per current context
    
    if (hour >= 5 && hour < 12) greetingText = 'Good morning, Atharv.';
    else if (hour >= 12 && hour < 17) greetingText = 'Good afternoon, Atharv.';
    
    elements.greeting.textContent = greetingText;
}

function setupEventListeners() {
    elements.form.addEventListener('submit', handleAddTask);
    // Escape key globally to cancel edits
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && editingId !== null) cancelEdit();
    });
}

// --- CORE OPERATIONS ---
function loadTasks() {
    try {
        const stored = localStorage.getItem('focuslist_tasks');
        if (stored) tasks = JSON.parse(stored);
    } catch (e) {
        console.error('Failed to parse localStorage data', e);
        tasks = []; // Fallback gracefully
    }
}

function saveTasks() {
    localStorage.setItem('focuslist_tasks', JSON.stringify(tasks));
}

function handleAddTask(e) {
    e.preventDefault();
    const text = elements.input.value.trim();
    
    if (!text) {
        showError("Please enter a task.");
        return;
    }
    
    clearError();
    
    const newTask = {
        id: generateId(),
        text: text,
        completed: false,
        createdAt: Date.now(),
        completedAt: null
    };
    
    tasks.unshift(newTask); // Add to top of list
    saveTasks();
    elements.input.value = '';
    
    render();
    showToast('Task added');
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    task.completed = !task.completed;
    task.completedAt = task.completed ? Date.now() : null;
    
    saveTasks();
    render();
    
    if (task.completed) {
        showToast('Task completed');
    }
}

function initiateDelete(id) {
    // 1. Find and visually remove
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;
    
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    if (taskElement) taskElement.classList.add('removing');
    
    // 2. Wait for animation, then actually remove from state
    setTimeout(() => {
        pendingDeleteTask = { ...tasks[taskIndex], index: taskIndex };
        tasks.splice(taskIndex, 1);
        saveTasks();
        render();
        
        // 3. Trigger Undo Toast
        showUndoToast();
    }, 250); 
}

function undoDelete() {
    if (!pendingDeleteTask) return;
    
    // Restore task to its original position
    tasks.splice(pendingDeleteTask.index, 0, pendingDeleteTask);
    pendingDeleteTask = null;
    clearTimeout(deleteTimeout);
    
    saveTasks();
    render();
    showToast('Task restored');
}

// --- INLINE EDITING ---
function startEdit(id) {
    editingId = id;
    render(); // Re-render to show edit UI
    
    // Focus the newly created input
    setTimeout(() => {
        const input = document.getElementById(`edit-input-${id}`);
        if (input) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        }
    }, 0);
}

function saveEdit(id, newText) {
    const text = newText.trim();
    if (!text) {
        alert("Task cannot be empty.");
        return;
    }
    
    const task = tasks.find(t => t.id === id);
    if (task && task.text !== text) {
        task.text = text;
        saveTasks();
        showToast('Task updated');
    }
    
    editingId = null;
    render();
}

function cancelEdit() {
    editingId = null;
    render();
}

// --- UTILS ---
function generateId() {
    return 'task_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function getRelativeTime(timestamp) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDifference = Math.round((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference === 0) {
        const hoursDiff = Math.round((timestamp - Date.now()) / (1000 * 60 * 60));
        if (hoursDiff === 0) {
            const minDiff = Math.round((timestamp - Date.now()) / (1000 * 60));
            if (minDiff === 0) return 'Just now';
            return rtf.format(minDiff, 'minute');
        }
        return rtf.format(hoursDiff, 'hour');
    }
    if (daysDifference > -7) return rtf.format(daysDifference, 'day');
    
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function showError(msg) {
    elements.errorMsg.textContent = msg;
}

function clearError() {
    elements.errorMsg.textContent = '';
}

// --- TOAST NOTIFICATIONS ---
function showToast(message) {
    createToastDOM(message);
}

function showUndoToast() {
    // Clear existing delete timeout if user rapid-deletes
    if (deleteTimeout) clearTimeout(deleteTimeout);
    
    const toast = createToastDOM('Task deleted', true);
    
    deleteTimeout = setTimeout(() => {
        pendingDeleteTask = null; // Expire undo buffer
        removeToastDOM(toast);
    }, 5000);
}

function createToastDOM(message, isUndo = false) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const textNode = document.createElement('span');
    textNode.textContent = message;
    toast.appendChild(textNode);
    
    if (isUndo) {
        const undoBtn = document.createElement('button');
        undoBtn.className = 'toast-undo-btn';
        undoBtn.textContent = 'Undo';
        undoBtn.onclick = () => {
            undoDelete();
            removeToastDOM(toast);
        };
        toast.appendChild(undoBtn);
    }
    
    elements.toastContainer.appendChild(toast);
    
    if (!isUndo) {
        setTimeout(() => removeToastDOM(toast), 3000);
    }
    
    return toast;
}

function removeToastDOM(toast) {
    toast.classList.add('toast-exit');
    setTimeout(() => {
        if(toast.parentElement) toast.remove();
    }, 300);
}

// --- UI RENDERING (Safe DOM) ---
function render() {
    // 1. Filter arrays
    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);
    
    // 2. Update Counters & Empty States
    updateCounters(pending.length, completed.length);
    
    // 3. Clear existing lists safely
    elements.pendingList.innerHTML = '';
    elements.completedList.innerHTML = '';
    
    // 4. Render Pending
    pending.forEach(task => elements.pendingList.appendChild(createTaskDOM(task)));
    
    // 5. Render Completed
    completed.forEach(task => elements.completedList.appendChild(createTaskDOM(task)));
}

function updateCounters(pendingLen, completedLen) {
    const total = pendingLen + completedLen;
    
    // Section Badges
    elements.pendingCount.textContent = pendingLen;
    elements.completedCount.textContent = completedLen;
    
    // Header Summary Pills
    elements.sumPending.textContent = pendingLen;
    elements.sumCompleted.textContent = completedLen;
    
    // Progress Bar
    const percentage = total === 0 ? 0 : Math.round((completedLen / total) * 100);
    elements.progressFill.style.width = `${percentage}%`;
    
    // Empty states toggle
    elements.emptyPending.classList.toggle('visible', pendingLen === 0);
    elements.emptyCompleted.classList.toggle('visible', completedLen === 0);
}

// SVGs stored as strings for clean injection into buttons (Safe since they are hardcoded layout elements, not user text)
const SVGS = {
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`
};

function createTaskDOM(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-id', task.id);
    
    // EDIT MODE
    if (editingId === task.id) {
        const form = document.createElement('form');
        form.className = 'edit-form';
        form.onsubmit = (e) => {
            e.preventDefault();
            saveEdit(task.id, input.value);
        };
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `edit-input-${task.id}`;
        input.className = 'edit-input';
        input.value = task.text;
        
        const actionDiv = document.createElement('div');
        actionDiv.className = 'edit-actions';
        
        const saveBtn = document.createElement('button');
        saveBtn.type = 'submit';
        saveBtn.className = 'edit-save';
        saveBtn.textContent = 'Save';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'edit-cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = cancelEdit;
        
        actionDiv.append(saveBtn, cancelBtn);
        form.append(input, actionDiv);
        li.appendChild(form);
        return li;
    }
    
    // DISPLAY MODE
    const checkBtn = document.createElement('button');
    checkBtn.className = `checkbox-btn ${task.completed ? 'checked' : ''}`;
    checkBtn.setAttribute('aria-label', task.completed ? 'Mark pending' : 'Mark complete');
    checkBtn.innerHTML = SVGS.check;
    checkBtn.onclick = () => toggleTask(task.id);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';
    
    // Safe DOM injection for user text
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text; 
    
    const metaSpan = document.createElement('span');
    metaSpan.className = 'task-meta';
    metaSpan.textContent = task.completed 
        ? `Completed ${getRelativeTime(task.completedAt)}` 
        : `Added ${getRelativeTime(task.createdAt)}`;
        
    contentDiv.append(textSpan, metaSpan);
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';
    
    if (!task.completed) {
        const editBtn = document.createElement('button');
        editBtn.className = 'icon-btn';
        editBtn.setAttribute('aria-label', 'Edit task');
        editBtn.innerHTML = SVGS.edit;
        editBtn.onclick = () => startEdit(task.id);
        actionsDiv.appendChild(editBtn);
    }
    
    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn delete-btn';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.innerHTML = SVGS.trash;
    delBtn.onclick = () => initiateDelete(task.id);
    
    actionsDiv.appendChild(delBtn);
    li.append(checkBtn, contentDiv, actionsDiv);
    
    return li;
}

// Boot the application
document.addEventListener('DOMContentLoaded', init);