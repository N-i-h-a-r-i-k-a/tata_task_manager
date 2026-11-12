
// ==========================================
// TASK TRACKER - TASK MANAGEMENT
// WITH CIRCULAR PIE CHART AND PAGINATION
// ==========================================

const API_BASE = "../../backend/";

let csrfToken = "";
let allTasks = [];
let currentPage = 1;
const tasksPerPage = 5;

// Chart.js instance
let taskStatusChartInstance = null;

// HTML Elements
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchTask");
const filterSelect = document.getElementById("filterStatus");

const paginationContainer =
    document.getElementById("taskPagination");

const pageInfo =
    document.getElementById("taskPageInfo");

// ==========================================
// 1. GET CSRF SECURITY TOKEN
// ==========================================

async function initializeCsrf() {
    const response = await fetch(API_BASE + "auth/csrf.php", {
        method: "GET",
        credentials: "same-origin"
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Unable to initialize security token."
        );
    }

    csrfToken = result.data.csrf_token;
}

// ==========================================
// 2. API REQUEST FUNCTION
// ==========================================

async function apiRequest(file, method = "GET", data = null) {

    const options = {
        method: method,
        credentials: "same-origin",
        headers: {}
    };

    if (method !== "GET") {
        options.headers["Content-Type"] = "application/json";
        options.headers["X-CSRF-Token"] = csrfToken;
        options.body = JSON.stringify(data || {});
    }

    const response = await fetch(
        API_BASE + "api/" + file,
        options
    );

    const result = await response.json();

    if (response.status === 401) {
        window.location.href = "login.html";
        throw new Error("Please log in again.");
    }

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Something went wrong."
        );
    }

    return result;
}

// ==========================================
// 3. DISPLAY MESSAGES
// ==========================================

function showMessage(message, isError = false) {

    const element = document.getElementById("taskMessage");

    if (element) {
        element.textContent = message;
        element.style.color = isError ? "#dc3545" : "#198754";
    }
}

// ==========================================
// 4. UPDATE DASHBOARD COUNTS
// ==========================================

function updateCounts(counts) {

    const total = document.getElementById("totalTasks");
    const pending = document.getElementById("pendingTasks");
    const progress = document.getElementById("progressTasks");
    const completed = document.getElementById("completedTasks");

    if (total) total.textContent = Number(counts.total) || 0;
    if (pending) pending.textContent = Number(counts.pending) || 0;
    if (progress) progress.textContent = Number(counts.in_progress) || 0;
    if (completed) completed.textContent = Number(counts.completed) || 0;

    updatePieChart(counts);
}

// ==========================================
// 5. CREATE CIRCULAR PIE CHART
// ==========================================

function updatePieChart(counts) {

    const canvas = document.getElementById("taskStatusChart");

    if (!canvas) return;

    // Read task counts
    const total = Number(counts.total) || 0;
    const pending = Number(counts.pending) || 0;
    const progress = Number(counts.in_progress) || 0;
    const completed = Number(counts.completed) || 0;

    // Update chart labels
    const chartTotal = document.getElementById("chartTotal");
    const chartPending = document.getElementById("chartPending");
    const chartProgress = document.getElementById("chartProgress");
    const chartCompleted = document.getElementById("chartCompleted");

    if (chartTotal) chartTotal.textContent = total;
    if (chartPending) chartPending.textContent = pending;
    if (chartProgress) chartProgress.textContent = progress;
    if (chartCompleted) chartCompleted.textContent = completed;

    // Check whether Chart.js is loaded
    if (typeof Chart === "undefined") {
        console.error("Chart.js is not loaded. Check your dashboard.html script.");
        return;
    }

    // Destroy previous chart before creating a new one
    if (taskStatusChartInstance) {
        taskStatusChartInstance.destroy();
        taskStatusChartInstance = null;
    }

    // Empty state
    const chartValues = total > 0
        ? [pending, progress, completed]
        : [1];

    const chartLabels = total > 0
        ? ["Pending", "In Progress", "Completed"]
        : ["No Tasks"];

    const chartColors = total > 0
        ? ["#f59e0b", "#3b82f6", "#16a34a"]
        : ["#d1d5db"];

    // Create circular pie chart
    taskStatusChartInstance = new Chart(canvas, {

        type: "pie",

        data: {
            labels: chartLabels,

            datasets: [{
                data: chartValues,

                backgroundColor: chartColors,

                borderColor: "#ffffff",

                borderWidth: 3,

                hoverOffset: 12
            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: true,

            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 800
            },

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {
                    enabled: total > 0,

                    callbacks: {
                        label: function(context) {

                            const value = context.raw;

                            const percentage = (
                                (value / total) * 100
                            ).toFixed(1);

                            return ` ${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ==========================================
// 6. CREATE HTML ELEMENTS SAFELY
// ==========================================

function createElement(tag, className, content) {

    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (content !== undefined) {
        element.textContent = content;
    }

    return element;
}

// ==========================================
// 7. DISPLAY TASKS
// ==========================================

function renderTasks(tasks) {

    if (!taskList) return;

    taskList.replaceChildren();

    if (!tasks || tasks.length === 0) {

        const empty = createElement("div", "empty-state");

        empty.append(
            createElement("span", "", "📝"),
            createElement("h3", "", "No tasks found"),
            createElement(
                "p",
                "",
                "Add a task or change your search."
            )
        );

        taskList.appendChild(empty);
        return;
    }

    tasks.forEach(task => {

        const item = createElement("article", "task-item");

        const details = createElement("div", "task-details");

        details.appendChild(
            createElement("h3", "", task.title)
        );

        if (task.description) {
            details.appendChild(
                createElement("p", "", task.description)
            );
        }

        const meta = createElement("div", "task-meta");

        const statusClasses = {
            "Pending": "status-pending",
            "In Progress": "status-progress",
            "Completed": "status-completed"
        };

        meta.appendChild(
            createElement(
                "span",
                "status-badge " +
                (statusClasses[task.status] || ""),
                task.status
            )
        );

        meta.appendChild(
            createElement(
                "span",
                "",
                "Created: " + task.created_at
            )
        );

        details.appendChild(meta);

        // Action buttons
        const actions = createElement("div", "task-actions");

        const editButton = createElement("button", "", "Edit");
        editButton.type = "button";

        editButton.addEventListener("click", () => {
            editTask(task);
        });

        const deleteButton = createElement(
            "button",
            "delete-btn",
            "Delete"
        );

        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        actions.append(editButton, deleteButton);

        item.append(details, actions);

        taskList.appendChild(item);
    });
}

// ==========================================
// 8. PAGINATION
// ==========================================

function renderPagination() {

    if (!paginationContainer || !pageInfo) return;

    paginationContainer.replaceChildren();

    const totalTasks = allTasks.length;

    const totalPages = Math.ceil(
        totalTasks / tasksPerPage
    );

    if (totalTasks === 0) {
        pageInfo.textContent = "Showing 0 tasks";
        return;
    }

    const start = (currentPage - 1) * tasksPerPage + 1;

    const end = Math.min(
        currentPage * tasksPerPage,
        totalTasks
    );

    pageInfo.textContent =
        `Showing ${start}–${end} of ${totalTasks} tasks`;

    if (totalPages <= 1) return;

    // Previous button
    const previousButton = createElement(
        "button",
        "",
        "Previous"
    );

    previousButton.type = "button";
    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayCurrentPage();
        }
    });

    paginationContainer.appendChild(previousButton);

    // Numbered page buttons
    for (let page = 1; page <= totalPages; page++) {

        const pageButton = createElement(
            "button",
            currentPage === page ? "active" : "",
            String(page)
        );

        pageButton.type = "button";

        if (currentPage === page) {
            pageButton.setAttribute("aria-current", "page");
        }

        pageButton.addEventListener("click", () => {
            currentPage = page;
            displayCurrentPage();
        });

        paginationContainer.appendChild(pageButton);
    }

    // Next button
    const nextButton = createElement(
        "button",
        "",
        "Next"
    );

    nextButton.type = "button";
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayCurrentPage();
        }
    });

    paginationContainer.appendChild(nextButton);
}

// ==========================================
// 9. DISPLAY CURRENT PAGE
// ==========================================

function displayCurrentPage() {

    const totalPages = Math.ceil(
        allTasks.length / tasksPerPage
    );

    if (totalPages > 0 && currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex =
        (currentPage - 1) * tasksPerPage;

    const endIndex =
        startIndex + tasksPerPage;

    const currentTasks = allTasks.slice(
        startIndex,
        endIndex
    );

    renderTasks(currentTasks);

    renderPagination();
}

// ==========================================
// 10. LOAD TASKS FROM DATABASE
// ==========================================

async function loadTasks() {

    if (!searchInput || !filterSelect) return;

    const params = new URLSearchParams({
        search: searchInput.value.trim(),
        status: filterSelect.value
    });

    try {

        const result = await apiRequest(
            "get_tasks.php?" + params.toString()
        );

        allTasks = Array.isArray(result.data.tasks)
            ? result.data.tasks
            : [];

        const totalPages = Math.ceil(
            allTasks.length / tasksPerPage
        );

        if (currentPage > totalPages) {
            currentPage = Math.max(1, totalPages);
        }

        updateCounts(result.data.counts);

        displayCurrentPage();

        const userName = document.getElementById("userName");

        if (userName && result.data.user) {
            userName.textContent =
                "Welcome, " + result.data.user.name;
        }

    } catch (error) {

        showMessage(error.message, true);
    }
}

// ==========================================
// 11. RESET TASK FORM
// ==========================================

function resetTaskForm() {

    if (!taskForm) return;

    taskForm.reset();

    document.getElementById("taskId").value = "";

    document.getElementById("saveTaskBtn").textContent =
        "Add Task";

    document.getElementById("cancelEditBtn").hidden = true;

    document.getElementById("taskTitleError").textContent = "";
}

// ==========================================
// 12. ADD OR UPDATE TASK
// ==========================================

if (taskForm) {

    taskForm.addEventListener("submit", async event => {

        event.preventDefault();

        const id = document.getElementById("taskId").value;

        const title =
            document.getElementById("taskTitle").value.trim();

        const description =
            document.getElementById("taskDescription").value.trim();

        const status =
            document.getElementById("taskStatus").value;

        if (!title || title.length > 150) {

            document.getElementById("taskTitleError").textContent =
                "Enter a title between 1 and 150 characters.";

            return;
        }

        document.getElementById("taskTitleError").textContent = "";

        const data = {
            title: title,
            description: description,
            status: status
        };

        try {

            let result;

            if (id) {

                data.id = Number(id);

                result = await apiRequest(
                    "update_task.php",
                    "POST",
                    data
                );

            } else {

                result = await apiRequest(
                    "add_task.php",
                    "POST",
                    data
                );
            }

            showMessage(result.message);

            resetTaskForm();

            currentPage = 1;

            await loadTasks();

        } catch (error) {

            showMessage(error.message, true);
        }
    });
}

// ==========================================
// 13. EDIT TASK
// ==========================================

function editTask(task) {

    document.getElementById("taskId").value = task.id;

    document.getElementById("taskTitle").value = task.title;

    document.getElementById("taskDescription").value =
        task.description || "";

    document.getElementById("taskStatus").value = task.status;

    document.getElementById("saveTaskBtn").textContent =
        "Update Task";

    document.getElementById("cancelEditBtn").hidden = false;

    const formCard = document.querySelector(".task-form-card");

    if (formCard) {
        formCard.scrollIntoView({
            behavior: "smooth"
        });
    }
}

// ==========================================
// 14. CANCEL EDITING
// ==========================================

const cancelEditButton =
    document.getElementById("cancelEditBtn");

if (cancelEditButton) {

    cancelEditButton.addEventListener("click", () => {

        resetTaskForm();

        showMessage("");
    });
}

// ==========================================
// 15. DELETE TASK
// ==========================================

async function deleteTask(id) {

    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {

        const result = await apiRequest(
            "delete_task.php",
            "POST",
            { id: Number(id) }
        );

        showMessage(result.message);

        await loadTasks();

    } catch (error) {

        showMessage(error.message, true);
    }
}

// ==========================================
// 16. SEARCH TASKS
// ==========================================

if (searchInput) {

    searchInput.addEventListener("input", () => {

        currentPage = 1;

        loadTasks();
    });
}

// ==========================================
// 17. FILTER TASKS BY STATUS
// ==========================================

if (filterSelect) {

    filterSelect.addEventListener("change", () => {

        currentPage = 1;

        loadTasks();
    });
}

// ==========================================
// 18. LOGOUT
// ==========================================

const logoutButton =
    document.getElementById("logoutBtn");

if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        try {

            const response = await fetch(
                API_BASE + "auth/logout.php",
                {
                    method: "POST",
                    credentials: "same-origin",
                    headers: {
                        "X-CSRF-Token": csrfToken
                    }
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Logout failed."
                );
            }

            window.location.href = "login.html";

        } catch (error) {

            showMessage(error.message, true);
        }
    });
}

// ==========================================
// 19. DISPLAY CURRENT DATE
// ==========================================

const dateElement =
    document.getElementById("currentDate");

if (dateElement) {

    dateElement.textContent =
        new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

// ==========================================
// 20. INITIALIZE DASHBOARD
// ==========================================

async function startDashboard() {

    try {

        await initializeCsrf();

        const result = await apiRequest("auth_check.php");

        const userName = document.getElementById("userName");

        if (userName) {
            userName.textContent =
                "Welcome, " + result.data.name;
        }

        await loadTasks();

    } catch (error) {

        if (error.message !== "Please log in again.") {
            console.error(
                "Dashboard initialization:",
                error
            );

            window.location.href = "login.html";
        }
    }
}

// Start application
startDashboard();
