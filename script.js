// Task Manager Application with Notifications and Timing
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.notificationsEnabled = this.loadNotificationPreference();
        this.theme = this.loadThemePreference();
        this.reminderCheckInterval = null;
        this.audioContext = null;
        this.audioUnlocked = false;
        this.initializeElements();
        this.attachEventListeners();
        this.initializeAudioUnlock();
        this.applyTheme();
        this.syncNotificationToggleState();
        this.startReminderSystem();
        this.render();
    }

    // Initialize DOM elements
    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.dueDateTime = document.getElementById('dueDateTime');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearBtn = document.getElementById('clearCompleted');
        this.totalCount = document.getElementById('totalCount');
        this.completedCount = document.getElementById('completedCount');
        this.notificationToggle = document.getElementById('notificationsEnabled');
        this.themeToggle = document.getElementById('themeToggle');
        this.notificationContainer = document.getElementById('notificationContainer');
    }

    // Attach event listeners
    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target));
        });

        this.clearBtn.addEventListener('click', () => this.clearCompletedTasks());
        this.notificationToggle.addEventListener('change', async (e) => {
            if (e.target.checked) {
                await this.enableNotificationsFromUserGesture();
            } else {
                this.notificationsEnabled = false;
                this.saveSettings();
                this.showNotification('Notifications disabled', 'info');
            }
        });

        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    unlockAudio() {
        if (this.audioUnlocked) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().catch(() => {});
            }
            this.audioUnlocked = true;
        } catch (e) {
            console.log('Audio unlock not supported:', e);
        }
    }

    initializeAudioUnlock() {
        document.addEventListener('click', () => this.unlockAudio(), { once: true, passive: true });
        document.addEventListener('touchend', () => this.unlockAudio(), { once: true, passive: true });
    }

    // Add a new task with due date
    addTask() {
        const taskText = this.taskInput.value.trim();
        const dueDateTime = this.dueDateTime.value;

        if (!taskText) {
            this.showNotification('Please enter a task', 'warning');
            return;
        }

        const dueDate = dueDateTime ? new Date(dueDateTime) : null;

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toLocaleDateString(),
            dueDate: dueDate ? dueDate.toISOString() : null,
            notified: false
        };

        this.tasks.push(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.dueDateTime.value = '';
        this.taskInput.focus();
        
        this.showNotification(`Task added: "${taskText}"`, 'success');
        this.render();
    }

    // Delete a task
    deleteTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.showNotification('Task deleted', 'info');
            this.render();
        }
    }

    // Toggle task completion
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.notified = false; // Reset notification status
            this.saveTasks();
            const status = task.completed ? 'completed' : 'marked as active';
            this.showNotification(`Task ${status}`, 'info');
            this.render();
        }
    }

    // Set filter
    setFilter(btn) {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.render();
    }

    // Clear completed tasks
    clearCompletedTasks() {
        const completedCount = this.tasks.filter(t => t.completed).length;

        if (completedCount === 0) {
            this.showNotification('No completed tasks to clear', 'warning');
            return;
        }

        if (confirm(`Clear ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.showNotification(`${completedCount} task(s) cleared`, 'success');
            this.render();
        }
    }

    // Get filtered tasks
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            default:
                return this.tasks;
        }
    }

    // Calculate time remaining
    getTimeRemaining(dueDate) {
        const now = new Date();
        const due = new Date(dueDate);
        const diff = due - now;

        if (diff < 0) {
            const overdueMins = Math.floor(Math.abs(diff) / 60000);
            const overdueDays = Math.floor(overdueMins / 1440);
            
            if (overdueDays > 0) {
                return `Overdue by ${overdueDays}d`;
            } else {
                return `Overdue by ${overdueMins}m`;
            }
        }

        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ${hours % 24}h remaining`;
        } else if (hours > 0) {
            return `${hours}h ${mins % 60}m remaining`;
        } else if (mins > 0) {
            return `${mins}m remaining`;
        } else {
            return 'Due now!';
        }
    }

    // Format due date for display
    formatDueDate(dueDate) {
        const due = new Date(dueDate);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
        const diff = dueDay - today;

        let dateStr = '';

        if (diff === 0) {
            dateStr = 'Today';
        } else if (diff === 86400000) {
            dateStr = 'Tomorrow';
        } else if (diff === -86400000) {
            dateStr = 'Yesterday';
        } else {
            dateStr = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        const timeStr = due.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        return `${dateStr} at ${timeStr}`;
    }

    // Check for tasks due soon and send notifications
    checkReminders() {
        if (!this.notificationsEnabled) return;
        if ('Notification' in window && Notification.permission === 'denied') {
            this.syncNotificationToggleState();
            return;
        }

        const now = new Date();
        this.tasks.forEach(task => {
            if (!task.completed && task.dueDate && !task.notified) {
                const due = new Date(task.dueDate);
                const diffSeconds = Math.floor((due - now) / 1000);
                const diffMins = Math.floor(diffSeconds / 60);

                const isDueNow = diffSeconds >= 0 && diffSeconds <= 59;
                const isOverdueNow = diffSeconds < 0 && diffSeconds >= -59;
                const isDueSoon = diffMins > 0 && diffMins <= 5;

                if (isDueNow || isOverdueNow || isDueSoon) {
                    this.sendNotification(task, diffMins, isOverdueNow);
                    task.notified = true;
                    this.saveTasks();
                }
            }
        });
    }

    // Send browser and sound notification
    sendNotification(task, minutesRemaining, isOverdueNow = false) {
        let title, message;

        if (isOverdueNow || minutesRemaining <= 0) {
            title = '⏰ Task Overdue!';
            message = `"${task.text}" is due now or overdue.`;
        } else if (minutesRemaining === 0) {
            title = '⏰ Task Due Now';
            message = `"${task.text}" is due now.`;
        } else {
            title = '⏰ Task Due Soon';
            message = `"${task.text}" is due in ${minutesRemaining} minute(s)`;
        }

        // Show in-app notification
        this.showNotification(message, isOverdueNow || minutesRemaining <= 0 ? 'danger' : 'warning', 6000);

        // Browser notification
        this.sendBrowserNotification(title, message);

        // Play sound
        this.playNotificationSound();
    }

    // Send browser notification
    sendBrowserNotification(title, message) {
        if (!('Notification' in window)) {
            this.showNotification('Browser notifications are unavailable on this device.', 'info', 4000);
            return;
        }

        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '📋',
                tag: `task-reminder-${title}`,
                requireInteraction: false
            });
            return;
        }

        if (Notification.permission === 'default') {
            this.showNotification('Tap Enable Notifications and allow the permission prompt to receive browser reminders.', 'warning', 5000);
        }
    }

    saveSettings() {
        const settings = this.loadSettings();
        settings.notificationsEnabled = this.notificationsEnabled;
        settings.theme = this.theme;
        localStorage.setItem('taskManagerSettings', JSON.stringify(settings));
    }

    loadSettings() {
        const storedSettings = localStorage.getItem('taskManagerSettings');
        if (!storedSettings) {
            return {};
        }

        try {
            return JSON.parse(storedSettings) || {};
        } catch (e) {
            return {};
        }
    }

    loadNotificationPreference() {
        const settings = this.loadSettings();
        return settings.notificationsEnabled === true;
    }

    loadThemePreference() {
        const settings = this.loadSettings();
        return settings.theme === 'dark' ? 'dark' : 'light';
    }

    applyTheme() {
        document.body.classList.toggle('dark-mode', this.theme === 'dark');
        document.body.classList.toggle('light-mode', this.theme === 'light');
        if (this.themeToggle) {
            this.themeToggle.textContent = this.theme === 'dark' ? '☀️ Day' : '🌙 Night';
        }
        this.saveSettings();
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
    }

    syncNotificationToggleState() {
        if (!this.notificationToggle) return;

        if ('Notification' in window && Notification.permission === 'denied') {
            this.notificationsEnabled = false;
            this.saveSettings();
            this.notificationToggle.checked = false;
            this.notificationToggle.disabled = true;
            this.notificationToggle.closest('.notification-toggle').title = 'Notifications are blocked in this browser. Enable them in site settings.';
            return;
        }

        this.notificationToggle.checked = this.notificationsEnabled;
        this.notificationToggle.disabled = false;
    }

    async enableNotificationsFromUserGesture() {
        this.unlockAudio();

        if (!('Notification' in window)) {
            this.notificationsEnabled = true;
            this.notificationToggle.checked = true;
            this.saveSettings();
            this.showNotification('Mobile browser notifications are unavailable here. In-app alerts, sound, and vibration are enabled while this page is open.', 'info', 6000);
            return;
        }

        let permission = Notification.permission;

        if (permission === 'default') {
            try {
                permission = await Notification.requestPermission();
            } catch (e) {
                permission = Notification.permission;
            }
        }

        if (permission === 'granted') {
            this.notificationsEnabled = true;
            this.notificationToggle.checked = true;
            this.saveSettings();
            this.showNotification('Notifications enabled. Keep this page open to receive task reminders on mobile.', 'success', 5000);
            this.sendBrowserNotification('Task Manager notifications enabled', 'You will receive reminders for tasks that are due soon.');
            this.playNotificationSound();
            return;
        }

        this.notificationsEnabled = false;
        this.notificationToggle.checked = false;
        this.saveSettings();

        if (permission === 'denied') {
            this.notificationToggle.disabled = true;
            this.notificationToggle.closest('.notification-toggle').title = 'Notifications are blocked in this browser. Enable them in site settings.';
            this.showNotification('Notifications are blocked. Open your browser site settings and allow notifications for this page.', 'warning', 7000);
            return;
        }

        this.showNotification('Notifications were not enabled. Tap Enable Notifications and allow the permission prompt.', 'warning', 6000);
    }

    // Play notification sound and vibrate on supported devices
    playNotificationSound() {
        const playBeep = (audioContext, closeWhenDone = false) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            const startTime = audioContext.currentTime;
            const repeatDuration = 0.4;
            const gapDuration = 0.2;
            const repeats = 3;

            for (let i = 0; i < repeats; i += 1) {
                const beatStart = startTime + i * (repeatDuration + gapDuration);
                const beatEnd = beatStart + repeatDuration;
                gainNode.gain.setValueAtTime(0, beatStart);
                gainNode.gain.linearRampToValueAtTime(0.35, beatStart + 0.02);
                gainNode.gain.setValueAtTime(0.35, beatEnd - 0.05);
                gainNode.gain.linearRampToValueAtTime(0, beatEnd);
            }

            oscillator.start(startTime);
            oscillator.stop(startTime + repeats * (repeatDuration + gapDuration));

            oscillator.onended = () => {
                if (closeWhenDone && audioContext && audioContext.state !== 'closed') {
                    audioContext.close().catch(() => {});
                }
            };
        };

        try {
            if (this.audioUnlocked && this.audioContext && this.audioContext.state !== 'closed') {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().catch(() => {});
                }
                playBeep(this.audioContext);
            } else {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                playBeep(audioContext, true);
            }
        } catch (e) {
            console.log('Could not play notification sound:', e);
        }

        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
    }

    // Start reminder checking system
    startReminderSystem() {
        // Check reminders every 15 seconds so mobile timing is more responsive
        this.checkReminders();
        this.reminderCheckInterval = setInterval(() => {
            this.checkReminders();
        }, 15000);

        // Also check every 10 seconds for more frequent updates
        setInterval(() => {
            this.render();
        }, 10000);
    }

    // Update statistics
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;

        this.totalCount.textContent = total;
        this.completedCount.textContent = completed;
    }

    // Render the task list
    render() {
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            this.emptyState.classList.remove('hidden');
            this.taskList.classList.add('hidden');
        } else {
            this.emptyState.classList.add('hidden');
            this.taskList.classList.remove('hidden');

            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;

                let dueHtml = '';
                if (task.dueDate) {
                    const now = new Date();
                    const due = new Date(task.dueDate);
                    const isOverdue = due < now && !task.completed;
                    const isSoon = !isOverdue && (due - now) < 300000; // 5 minutes

                    const dueClass = isOverdue ? 'overdue' : isSoon ? 'due-soon' : '';
                    const timeClass = isOverdue ? 'overdue' : isSoon ? 'due-soon' : '';

                    dueHtml = `
                        <div class="task-due-section">
                            <span class="task-due-date ${dueClass}">${this.formatDueDate(task.dueDate)}</span>
                            <span class="task-time-remaining ${timeClass}">${this.getTimeRemaining(task.dueDate)}</span>
                        </div>
                    `;
                }

                li.innerHTML = `
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${task.completed ? 'checked' : ''}
                        onchange="taskManager.toggleTask(${task.id})"
                    >
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                    ${dueHtml}
                    <span class="task-date">${task.createdAt}</span>
                    <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">Delete</button>
                `;
                this.taskList.appendChild(li);
            });
        }

        this.updateStats();
    }

    // Show in-app notification
    showNotification(message, type = 'info', duration = 3000) {
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        this.notificationContainer.appendChild(notif);

        if (duration > 0) {
            setTimeout(() => {
                notif.remove();
            }, duration);
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Save tasks to localStorage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // Load tasks from localStorage
    loadTasks() {
        const stored = localStorage.getItem('tasks');
        return stored ? JSON.parse(stored) : [];
    }

    // Cleanup
    destroy() {
        if (this.reminderCheckInterval) {
            clearInterval(this.reminderCheckInterval);
        }
    }
}

// Initialize the app when DOM is ready
let taskManager;
document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (taskManager) {
        taskManager.destroy();
    }
});

