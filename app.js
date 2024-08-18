document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#add-task");
  const taskInput = document.querySelector("#new-task");
  const taskList = document.querySelector("#task-list");
  const clearAllBtn = document.querySelector("#clear-all");
  const toastContainer = document.querySelector("#toast-container");

  // Load tasks from local storage
  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      const listItem = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("task-checkbox");
      checkbox.checked = task.completed;

      listItem.innerHTML = `
        <span class="task-text">${task.text}</span>
        <button class="edit-task">Edit</button>
        <button class="remove-task">Remove</button>
      `;

      listItem.prepend(checkbox);
      if (task.completed) {
        listItem.classList.add("task-completed");
      }

      taskList.appendChild(listItem);
      updateClearAllButtonVisibility();

      // Restore event listeners
      const editBtn = listItem.querySelector(".edit-task");
      editBtn.addEventListener("click", () => {
        const taskSpan = listItem.querySelector(".task-text");
        const currText = taskSpan.textContent;
        const input = document.createElement("input");
        input.type = "text";
        input.value = currText;
        taskSpan.replaceWith(input);
        input.focus();

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.classList.add("save-task");

        saveBtn.addEventListener("click", () => {
          const newText = input.value.trim();
          if (newText !== "") {
            const newSpan = document.createElement("span");
            newSpan.textContent = newText;
            newSpan.classList.add("task-text");
            input.replaceWith(newSpan);
            saveBtn.remove();
            showToast("Task Updated Successfully", "toast-updated");
            saveTasks();
          }
        });
        listItem.appendChild(saveBtn);
      });

      listItem.querySelector(".remove-task").addEventListener("click", () => {
        taskList.removeChild(listItem);
        showToast("Task Deleted Successfully", "toast-removed");
        saveTasks();
        updateClearAllButtonVisibility();
      });

      listItem
        .querySelector(".task-checkbox")
        .addEventListener("change", (e) => {
          if (e.target.checked) {
            listItem.classList.add("task-completed");
            editBtn.disabled = true;
          } else {
            listItem.classList.remove("task-completed");
            editBtn.disabled = false;
          }
          saveTasks();
        });
    });
  };

  // Save tasks to local storage
  const saveTasks = () => {
    const tasks = Array.from(taskList.children).map((li) => {
      const text = li.querySelector(".task-text").textContent;
      const completed = li.querySelector(".task-checkbox").checked;
      return { text, completed };
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // Toast notification function
  const showToast = (message, type) => {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 500);
    }, 3000);
  };

  // New Task Function
  const addTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const listItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");

    listItem.innerHTML = `
      <span class="task-text">${taskText}</span>
      <button class="edit-task">Edit</button>
      <button class="remove-task">Remove</button>
    `;

    listItem.prepend(checkbox);
    taskList.appendChild(listItem);
    taskInput.value = "";
    showToast("Task Added Successfully", "toast-added");
    saveTasks();
    updateClearAllButtonVisibility();

    // Edit Task Function
    const editBtn = listItem.querySelector(".edit-task");
    listItem.querySelector(".edit-task").addEventListener("click", () => {
      const taskSpan = listItem.querySelector(".task-text");
      const currText = taskSpan.textContent;
      const input = document.createElement("input");
      input.type = "text";
      input.value = currText;
      taskSpan.replaceWith(input);
      input.focus();

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.classList.add("save-task");

      saveBtn.addEventListener("click", () => {
        const newText = input.value.trim();
        if (newText !== "") {
          const newSpan = document.createElement("span");
          newSpan.textContent = newText;
          newSpan.classList.add("task-text");
          input.replaceWith(newSpan);
          saveBtn.remove();
          showToast("Task Updated Successfully", "toast-updated");
          saveTasks();
        }
      });
      listItem.appendChild(saveBtn);
    });

    // Remove Task Function
    listItem.querySelector(".remove-task").addEventListener("click", () => {
      taskList.removeChild(listItem);
      showToast("Task Deleted Successfully", "toast-removed");
      saveTasks();
      updateClearAllButtonVisibility();
    });

    listItem.querySelector(".task-checkbox").addEventListener("change", (e) => {
      if (e.target.checked) {
        listItem.classList.add("task-completed");
        editBtn.disabled = true;
      } else {
        listItem.classList.remove("task-completed");
        editBtn.disabled = false;
      }
      saveTasks();
    });
  };

  const clearAllTasks = () => {
    taskList.innerHTML = "";
    showToast("All tasks cleared!", "toast-updated");
    saveTasks();
    updateClearAllButtonVisibility();
  };

  const updateClearAllButtonVisibility = () => {
    if (taskList.children.length > 0) {
      clearAllBtn.style.display = "block";
    } else {
      clearAllBtn.style.display = "none";
    }
  };

  addBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });
  clearAllBtn.addEventListener("click", clearAllTasks);

  // Initial load of tasks
  loadTasks();
});
