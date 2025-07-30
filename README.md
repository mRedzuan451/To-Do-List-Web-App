# Simple To-Do List Web App

A clean, intuitive, and responsive web application for managing daily tasks. This project was built to practice and showcase core JavaScript concepts, including DOM manipulation, event handling, and client-side storage.

**Live Demo:** [Link to your live app hosted on Netlify/Vercel]

![To-Do App Screenshot](link-to-your-app-screenshot.png) 
---

## 🌟 Features (Core Functions)

This application includes the following functionalities:

* **Add New Tasks:** A user can type a task into the input field and press `Enter` or click the "Add" button to add it to their list.
* **Mark Tasks as Complete:** By clicking on a task or its checkbox, a user can toggle its completion status. Completed tasks are visually distinguished (e.g., with a strikethrough).
* **Delete Tasks:** Each task has a "delete" button that, when clicked, removes the task from the list.
* **Data Persistence:** Tasks are saved to the browser's **Local Storage**. This means your to-do list will still be there even if you close the browser tab or refresh the page.
* **Filter Tasks:** Users can filter the view to see:
    * **All** tasks.
    * **Active** (incomplete) tasks only.
    * **Completed** tasks only.
* **Task Count:** A counter displays the number of active (incomplete) tasks remaining.
* **Clear Completed:** A button to delete all completed tasks at once for easy list cleanup.
* **Responsive Design:** The layout is fully responsive and works seamlessly on desktops, tablets, and mobile devices.

---

## 🌊 User Flow

The user experience is designed to be simple and straightforward:

1.  **On Page Load:** The application checks for any existing tasks in Local Storage and renders them on the screen. If there are no saved tasks, the list appears empty.
2.  **Adding a Task:** The user types a new to-do item into the main input field at the top. Upon hitting the `Enter` key or clicking the "Add" button, the task is instantly added to the bottom of the "Active" tasks list. The input field is then cleared.
3.  **Completing a Task:** The user clicks on the task item. The app updates the task's status, applies a "completed" style to it, and updates the active task counter.
4.  **Filtering the List:** The user can click on the "All," "Active," or "Completed" filter buttons at the bottom. The list of tasks will dynamically re-render to show only the relevant items without a page reload.
5.  **Deleting a Task:** The user hovers over a task item, and a "delete" icon appears. Clicking this icon permanently removes the task from the list and from Local Storage.
6.  **Closing the App:** The user can close the browser. Upon returning, all their previously saved tasks will be re-loaded exactly as they left them.

---

## 🛠️ Technologies & Tools Used

This project was built using fundamental web technologies, demonstrating a strong grasp of the basics.

* **Core:**
    * $HTML5$ (Semantic Markup)
    * $CSS3$ (Custom Properties, Flexbox, Grid)
    * $JavaScript (ES6+)$
* **APIs:**
    * Web Storage API (`localStorage`) for client-side data persistence.
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
