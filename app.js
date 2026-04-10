$(document).ready(function () {
  // Data
  let tasks = [];
  let currentFilter = "all";

  // UI rendering functions

  // function to render stats
  function renderStats() {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const pending = tasks.filter((t) => t.status !== "done").length;

    $("#stat-total").text(total);
    $("#stat-completed").text(completed);
    $("#stat-pending").text(pending);
  }

  // function to render tasks
  function renderTask(task) {
    const li = $(`
    <li class="task-item" data-id="${task.id}">
      <div class="task-main">
        <label class="checkbox-wrapper">
          <input type="checkbox" class="task-checkbox" ${task.status === "done" ? "checked" : ""}>
          <span class="custom-checkbox"></span>
        </label>

        <div class="task-content">
          <div class="task-title-row">
            <h3 class="task-title">${task.title}</h3>
            <span class="task-status-badge status-${task.status}">
              ${task.status.replace("-", " ")}
            </span>
          </div>

          <p class="task-desc">${task.description || ""}</p>
        </div>
      </div>

      <div class="task-meta">
        <span class="task-date">Due: ${task.dueDate || "No date"}</span>
        <button class="btn-icon task-delete">✕</button>
      </div>
    </li>
  `);

    $("#task-list").append(li);
  }

  function getFilteredTasks() {
    if (currentFilter === "completed") {
      return tasks.filter((t) => t.status === "done");
    }
    if (currentFilter === "pending") {
      return tasks.filter((t) => t.status !== "done");
    }
    // "today" filter can be added later
    return tasks;
  }

  function refreshUI() {
    $("#task-list").empty();
    getFilteredTasks().forEach(renderTask);
    renderStats();
  }

  // Form submission
  $("#task-form").on("submit", function (e) {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      title: $("#task-title").val().trim(),
      description: $("#task-desc").val().trim(),
      dueDate: $("#task-date").val(),
      status: $("#task-status").val(),
    };

    tasks.push(newTask);
    refreshUI();
    this.reset();
  });

  // Delete Task
  $("#task-list").on("click", ".task-delete", function () {
    const li = $(this).closest(".task-item");
    const id = li.data("id");

    tasks = tasks.filter((t) => t.id !== id);
    refreshUI();
  });

  // Mark Complete & Umcomplete tasks

  $("#task-list").on("change", ".task-checkbox", function () {
    const li = $(this).closest(".task-item");
    const id = li.data("id");

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    task.status = this.checked ? "done" : "pending";
    refreshUI();
  });

  // filtered buttons
  $(".menu-item").on("click", function () {
    $(".menu-item").removeClass("active");
    $(this).addClass("active");

    currentFilter = $(this).data("filter");
    refreshUI();
  });
});
