document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const todoInput = document.getElementById("new-todo");
    const todoList = document.getElementById("todo-list");
    const filterButtons = document.querySelectorAll(".filters button");

    // Initial icon setup
    updateThemeIcon();

    // Theme toggle event listener
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        updateThemeIcon(); // Update icon based on theme
    });

    // Function to update the theme icon
    function updateThemeIcon() {
        const isDarkMode = document.body.classList.contains("dark-mode");
        themeToggleBtn.textContent = isDarkMode ? "☀️" : "🌙"; // Change icon based on mode
    }

    // Add new todo on Enter key press
    todoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && todoInput.value.trim() !== "") {
            const todoText = todoInput.value.trim();
            addTodoItem(todoText); // Call function to add todo item
            todoInput.value = ""; // Clear input
        }
    });

    // Function to add a new todo item
    function addTodoItem(text) {
        const li = document.createElement("li");
        li.classList.add("todo-item");
        li.draggable = true; // Enable dragging

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox"; // Create checkbox
        checkbox.classList.add("todo-checkbox");
        checkbox.addEventListener("change", () => {
            li.classList.toggle("completed", checkbox.checked); // Mark item as completed based on checkbox
            updateProgressBar(); // Update progress bar after completion toggle
        });

        const label = document.createElement("label");
        label.textContent = text; // Set the text for the todo item

        li.appendChild(checkbox); // Add checkbox to the list item
        li.appendChild(label); // Add label to the list item

        todoList.appendChild(li);
        updateProgressBar(); // Update progress bar when a new todo is added

        // Drag and drop functionality
        li.addEventListener("dragstart", dragStart);
        li.addEventListener("dragover", dragOver);
        li.addEventListener("drop", drop);
    }

    let draggedItem = null;

    function dragStart(e) {
        draggedItem = this; // Store the dragged item
        setTimeout(() => (this.style.display = "none"), 0); // Hide the dragged item temporarily
    }

    function dragOver(e) {
        e.preventDefault(); // Allow the drop
    }

    function drop(e) {
        e.preventDefault();
        this.style.display = "block"; // Show the dropped item
        todoList.insertBefore(draggedItem, this); // Move the dragged item before the dropped item
        draggedItem = null; // Reset the dragged item
    }

    // Filter todos based on selected filter
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");
            filterTodos(filter); // Call function to filter todos
        });
    });

    // Function to filter todos
    function filterTodos(filter) {
        const todoItems = todoList.querySelectorAll(".todo-item");
        todoItems.forEach((item) => {
            const isCompleted = item.classList.contains("completed");
            if (filter === "all") {
                item.style.display = "flex"; // Show all
            } else if (filter === "active") {
                item.style.display = isCompleted ? "none" : "flex"; // Show active only
            } else if (filter === "completed") {
                item.style.display = isCompleted ? "flex" : "none"; // Show completed only
            }
        });
    }

    // Clear completed todos
    document.getElementById("clear-completed").addEventListener("click", () => {
        const completedItems = todoList.querySelectorAll(".completed");
        completedItems.forEach((item) => {
            todoList.removeChild(item); // Remove completed items from the list
        });
        updateProgressBar(); // Update progress bar after clearing
    });

    // Function to update the progress bar
    function updateProgressBar() {
        const totalItems = todoList.children.length;
        const completedItems = todoList.querySelectorAll(".completed").length;
        const percentage = totalItems === 0 ? 0 : (completedItems / totalItems) * 100; // Calculate completion percentage
        document.getElementById("progress-bar").style.width = `${percentage}%`; // Update progress bar width
    }
});
