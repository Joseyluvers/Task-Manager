# 📋 Task Manager

A simple yet powerful task management application built with vanilla JavaScript, HTML, and CSS.

## Features

✨ **Core Features:**
- ➕ Add new tasks with a simple input field
- ✅ Mark tasks as complete/incomplete
- 🗑️ Delete individual tasks
- ⏱️ Set due date and time for tasks
- 🔔 Receive reminders with sound when tasks are due
- 🎯 Filter tasks (All, Active, Completed)
- 📊 View task statistics (Total & Completed count)
- 🧹 Clear all completed tasks at once

🔧 **Technical Features:**
- 💾 Local Storage persistence - tasks are saved automatically
- 📱 Fully responsive design for mobile and desktop
- ⌨️ Keyboard support (Enter key to add tasks)
- 🎨 Modern gradient UI with smooth animations
- 🛡️ XSS protection with HTML escaping

## How to Use

1. **Open the Project:**
   - Open `index.html` in your web browser
   - Or use Live Server extension in VS Code

2. **Add a Task:**
   - Type your task in the input field
   - Optionally set a due date and time using the date/time picker
   - Click "Add Task" or press Enter
   - New tasks are added to the list

3. **Manage Tasks:**
   - Click the checkbox to mark a task as complete
   - Click "Delete" to remove a task
   - Completed tasks appear with strikethrough text

4. **Filter Tasks:**
   - Click "All" to view all tasks
   - Click "Active" to see incomplete tasks only
   - Click "Completed" to see finished tasks only

5. **Clear Completed:**
   - Click "Clear Completed Tasks" to remove all finished tasks
   - A confirmation dialog will appear

## Project Structure

```
task-manager/
├── index.html      # Main HTML file with structure
├── styles.css      # Styling and responsive design
├── script.js       # Application logic and functionality
└── README.md       # This file
```

## File Descriptions

### index.html
- Main application structure
- Input field for adding tasks
- Task list container
- Filter buttons
- Statistics display

### styles.css
- Beautiful gradient background
- Modern card-based UI design
- Smooth animations and transitions
- Fully responsive layout
- Mobile-first design approach

### script.js
- `TaskManager` class for application logic
- Task storage and retrieval using LocalStorage
- Event handling and DOM manipulation
- Filter functionality
- HTML escaping for security

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Flexbox layout, gradients, animations
- **Vanilla JavaScript (ES6+)** - Object-oriented design with classes
- **LocalStorage API** - Data persistence

## Features in Detail

### Local Storage
Tasks are automatically saved to browser's LocalStorage when you:
- Add a new task
- Complete/uncomplete a task
- Delete a task

This means your tasks persist even after closing the browser!

### Responsive Design
The application works seamlessly on:
- Desktop browsers (1024px and up)
- Tablets (500px - 1024px)
- Mobile phones (below 500px)

### Security
- HTML content is escaped to prevent XSS attacks
- User input is validated before processing

## Future Enhancement Ideas

- 📅 Add due dates to tasks
- 🏷️ Categorize tasks with tags
- ⭐ Mark important tasks with priority levels
- 🔍 Search functionality
- 📤 Export/Import tasks
- 🌙 Dark mode theme
- 🔔 Notifications and reminders
- 👥 Collaboration features

## Browser Compatibility

Works on all modern browsers that support:
- ES6 JavaScript
- LocalStorage API
- CSS Flexbox

Tested on:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Getting Started

Simply open `index.html` in any modern web browser. No build tools or server required!

For development in VS Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## License

This is a learning project. Feel free to use and modify as needed.

## Author

Created as a Mini Project to practice JavaScript fundamentals.

---

Happy task managing! 🚀
