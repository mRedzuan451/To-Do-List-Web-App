# Simple To-Do List Web App

A clean, intuitive, and responsive web application for managing daily tasks. This project was built to practice and showcase core JavaScript concepts, including DOM manipulation, event handling, and client-side storage.

**Live Demo:** [Link to your live app hosted on Netlify/Vercel]

![To-Do App Screenshot](link-to-your-app-screenshot.png) 
---


## 🌟 Features (Core & Advanced)

This application now includes the following advanced functionalities:

* **Add New Tasks:** Type a task and (optionally) set a due date, then press `Enter` or click "Add".
* **Edit Tasks In-Place:** Double-click a task to edit its text directly.
* **Mark Tasks as Complete:** Click a task's checkbox to toggle its completion status. Completed tasks are visually distinguished.
* **Delete Tasks:** Each task has a delete button. Deletion is confirmed with a dialog.
* **Bulk Actions:** Select multiple tasks to delete or mark as complete in one action.
* **Drag-and-Drop Reordering:** Reorder tasks by dragging them up or down the list.
* **Due Dates & Overdue Highlighting:** Tasks can have due dates. Overdue tasks are visually highlighted.
* **Data Persistence:** Tasks are saved to the browser's **Local Storage** for persistence across sessions.
* **Filter Tasks:** View **All**, **Active**, or **Completed** tasks with instant filtering.
* **Task Count:** Displays the number of active (incomplete) tasks remaining.
* **Clear Completed:** Remove all completed tasks at once (with confirmation).
* **Progress Bar:** Visualize your completion rate with a progress bar.
* **Export/Import:** Export your tasks to a file or import from a backup (JSON format).
* **Dark Mode:** Toggle between light and dark themes.
* **Accessibility:** Improved keyboard navigation, ARIA labels, and color contrast for better accessibility.
* **Responsive Design:** Fully responsive layout for desktops, tablets, and mobile devices.

---


## 🌊 User Flow

The user experience is designed to be simple, powerful, and accessible:

1.  **On Page Load:** The app loads any saved tasks from Local Storage and applies your preferred theme.
2.  **Adding a Task:** Enter a task (and optionally a due date), then press `Enter` or click "Add". The task appears in the list.
3.  **Editing a Task:** Double-click a task to edit its text. Press `Enter` or click away to save.
4.  **Completing a Task:** Click the checkbox to mark a task as complete/incomplete. The progress bar updates.
5.  **Bulk Actions:** Select multiple tasks to delete or mark as complete using the bulk action buttons.
6.  **Reordering:** Drag and drop tasks to reorder them.
7.  **Filtering:** Instantly filter tasks by All, Active, or Completed.
8.  **Deleting a Task:** Click the delete icon (with confirmation dialog) to remove a task.
9.  **Clearing Completed:** Click "Clear Completed" to remove all completed tasks (with confirmation).
10. **Export/Import:** Export your tasks to a file or import from a backup.
11. **Theme Toggle:** Switch between light and dark mode at any time.
12. **Accessibility:** Navigate and manage tasks using keyboard shortcuts and screen readers.

---

## 🛠️ Technologies & Tools Used

This project is built using fundamental and modern web technologies:

* **Core:**
    * HTML5 (Semantic Markup)
    * CSS3 (Custom Properties, Flexbox, Grid, Animations, Dark Mode)
    * JavaScript (ES6+)
* **APIs:**
    * Web Storage API (`localStorage`) for client-side data persistence
    * File API for export/import
* **Accessibility:**
    * ARIA labels, keyboard navigation, and color contrast
* **Development Tools:**
    * Visual Studio Code
    * Git & GitHub for version control
* **Deployment:**
    * Netlify for continuous integration and hosting
* **Development Tools:**
    * Visual Studio Code
    * Git & GitHub for version control.
* **Deployment:**
    * Netlify for continuous integration and hosting.

---

## 🎯 Project Goals & Learning Outcomes

The primary goal of this project was to solidify my understanding of front-end web development fundamentals. Key learning outcomes include:

* **DOM Manipulation:** Dynamically creating, reading, updating, and deleting HTML elements using JavaScript.
* **Event Handling:** Capturing and responding to user events like clicks (`click`), keyboard input (`keydown`), and form submissions (`submit`).
* **Client-Side Storage:** Implementing `localStorage` to create a persistent user experience.
* **Modular Code:** Structuring the JavaScript code into clear, reusable functions (e.g., `renderTasks()`, `addTask()`, `toggleComplete()`) for better maintainability.
* **Responsive Web Design:** Using CSS media queries and flexible layouts to ensure a great experience on all screen sizes.
