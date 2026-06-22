# Task Manager Project - Copilot Instructions

## Project Overview
A vanilla JavaScript Task Manager application with HTML5 and CSS3. This is a single-page application that runs entirely in the browser without requiring any build tools or server.

## Project Type
- **Type:** Vanilla JavaScript Web Application
- **Framework:** None (no dependencies)
- **Runtime:** Browser (all modern browsers)

## Project Structure
```
task-manager/
├── index.html      - Main HTML structure
├── styles.css      - Complete styling and responsive design
├── script.js       - Application logic (TaskManager class)
├── README.md       - Documentation
└── .github/
    └── copilot-instructions.md - This file
```

## Key Features
1. Add, delete, and manage tasks
2. Mark tasks as complete/incomplete
3. Filter tasks (All, Active, Completed)
4. View task statistics
5. Persistent storage using LocalStorage
6. Fully responsive design
7. No external dependencies required

## How to Run

### Method 1: Direct Browser Open
1. Navigate to the project folder in VS Code
2. Right-click on `index.html`
3. Select "Open with Default Browser"

### Method 2: Live Server (Recommended)
1. Install VS Code extension: "Live Server" by Ritwick Dey
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. The app will automatically reload on file changes

### Method 3: File Protocol
- Simply double-click `index.html` to open in your default browser

## Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Gradients, Animations
- **JavaScript (ES6+)** - Classes, Arrow Functions, Template Literals
- **Browser APIs** - LocalStorage, DOM API

## Code Organization

### TaskManager Class (script.js)
Main application controller with methods for:
- `constructor()` - Initialize the app
- `addTask()` - Add new tasks
- `deleteTask(id)` - Remove tasks
- `toggleTask(id)` - Mark complete/incomplete
- `setFilter(btn)` - Apply filters
- `clearCompletedTasks()` - Bulk delete completed
- `render()` - Update UI
- `saveTasks()` - Persist to localStorage
- `loadTasks()` - Retrieve from localStorage

## Development Guidelines

### Adding New Features
1. Update HTML structure in `index.html`
2. Add corresponding CSS in `styles.css`
3. Implement logic in the `TaskManager` class in `script.js`
4. Test in the browser and verify persistence

### Browser DevTools
- Press F12 to open DevTools
- Check Console tab for any errors
- Use Application tab to view LocalStorage data

### LocalStorage Data Location
View stored tasks:
1. Open DevTools (F12)
2. Go to Application → LocalStorage
3. Look for the 'tasks' key

## Customization Tips

### Change Colors
Edit the gradient colors in `styles.css`:
- Line 13: Main gradient
- Search for `#667eea` and `#764ba2`

### Change Font
Update `font-family` in `body` selector (line 10 of styles.css)

### Add New Filters
1. Add button in HTML
2. Update filter logic in `getFilteredTasks()` method
3. Style the new button in CSS

### Modify Task Properties
The task object currently has: `id`, `text`, `completed`, `createdAt`
To add new properties:
1. Update task creation in `addTask()`
2. Update localStorage save/load if needed
3. Update HTML rendering in `render()`

## Common Issues & Solutions

### Tasks Not Persisting
- Check if LocalStorage is enabled in browser
- Clear cache and reload
- Check browser console for errors

### Styling Not Applied
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check CSS file is linked correctly
- Verify no conflicting CSS

### JavaScript Not Working
- Press F12 and check Console for errors
- Verify all IDs in HTML match JavaScript
- Check that script.js loads after HTML

## Performance Notes
- Application uses vanilla JavaScript for optimal performance
- No external dependencies means minimal loading time
- LocalStorage is limited to ~5-10MB per domain
- Works offline after initial page load

## Accessibility
- Semantic HTML elements used throughout
- Color contrast meets WCAG standards
- Keyboard navigation supported (Enter key, Tab)
- Accessible form inputs with labels

## Testing Checklist
- [ ] Can add a task
- [ ] Can mark task as complete
- [ ] Can delete a task
- [ ] Filters work correctly
- [ ] Tasks persist after refresh
- [ ] Clear completed works
- [ ] Responsive on mobile
- [ ] No console errors

## Future Enhancement Ideas
- Add due dates
- Priority levels
- Task categories/tags
- Search functionality
- Dark mode
- Export/Import functionality
- Task editing capability
- Drag-and-drop reordering

## Version History
- v1.0 - Initial release with core functionality

## Notes for Copilot
- This is a simple project perfect for learning JavaScript
- No complex dependencies or build process
- Great for practicing OOP with classes
- Good for learning DOM manipulation
- Ideal for understanding LocalStorage API
