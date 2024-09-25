const html = String.raw;

const main = () => {
    console.log("running main.js");
    console.log(taskStatus);

    if (document.querySelector("#add-edit-modal").getAttribute("clearListener") !== "true") {
        document.querySelector("#add-edit-modal").setAttribute("clearListener", "true");
        $('#add-edit-modal').on('hidden.bs.modal', clearAddEditForm);
    }
    if (document.querySelector("#delete-modal").getAttribute("clearListener") !== "true") {
        document.querySelector("#delete-modal").setAttribute("clearListener", "true");
        $('#delete-modal').on('hidden.bs.modal', clearDeleteForm);
    }

    clearAddEditForm();
    clearDeleteForm();

    const addButton = clearListeners("#add-button");
    addButton.addEventListener("click", addTaskModal);

    setupSidebarButtons("group", (option) => () => {
        groupFunction = groupFunctionOptions[option];
        queryTasksAndRender();
    });

    setupSidebarButtons("order", (option) => () => {
        orderFunction = orderFunctionOptions[option];
        queryTasksAndRender();
    });

    document.querySelector("#sidebar-button").addEventListener("click", asideResponsive);

    return queryTasksAndRender();
};

const asideResponsive = () => {
    const offcanvasCheck = document.querySelector("#offcanvas").classList.contains("show");
    $("#offcanvas").offcanvas(offcanvasCheck ? "hide" : "show");
};

const queryTasksAndRender = (onSuccess = () => { }, onFailure = () => { }) => {
    const newOnSuccess = (tasks) => {
        if (onSuccess) onSuccess();
        taskListComponent(tasks);
    };

    tasksService.getAllTasks(newOnSuccess, onFailure);
};

const addTaskModal = () => {
    document.querySelector("#add-edit-submit").addEventListener("click", (e) => {
        e.preventDefault();
        tasksService.addTask(didAdded);
    });

    document.querySelector("#add-edit-modal-title").innerText = "Adicionar Tarefa";

    $('#add-edit-modal').modal('show');
};

const updateTaskModal = (id) => {
    const onSuccess = (task) => {
        document.querySelector("#add-edit-modal-title").innerText = "Editar Tarefa";
        document.querySelector("#add-edit-title").value = task.title;
        document.querySelector("#add-edit-description").value = task.description;
        document.querySelector("#add-edit-datetime").value = task.dueDate ? task.dueDate.substring(0, task.dueDate.length - 1) : "";

        document.querySelector("#add-edit-submit").addEventListener("click", (e) => {
            e.preventDefault();
            tasksService.updateTask(id, didUpdated);
        });

        $('#add-edit-modal').modal('show');
    }
    const onFailure = () => console.error('Failed to get task');

    tasksService.getTask(id, onSuccess, onFailure);
};

const deleteTaskModal = (id) => {
    document.querySelector("#delete-submit").addEventListener("click", (e) => tasksService.deleteTask(id, didDeleted));
    $('#delete-modal').modal('show');
};

const taskDetailsModal = (id) => {
    const onSuccess = (task) => {
        document.querySelector("#task-details-title").innerText = task.title;
        document.querySelector("#task-details-description").innerText = task.description;
        document.querySelector("#task-details-datetime").innerText = task.dueDate ? task.dueDate.substring(0, task.dueDate.length - 1) : "Sem prazo definido";
        document.querySelector("#task-details-status").value = task.status;

        document.querySelector("#task-details-status").addEventListener("change", (e) => {
            const value = e.target.value;

            const onSuccess = () => queryTasksAndRender();
            const onFailure = () => console.error('Failed to update task status');

            tasksService.changeTaskStatus(id, value, onSuccess, onFailure);
        });

        $('#task-details-modal').modal('show');
    }
    const onFailure = () => console.error('Failed to get task');

    tasksService.getTask(id, onSuccess, onFailure);
}

const didAdded = () => {
    const onSuccess = () => $('#add-edit-modal').modal('hide');
    const onFailure = () => console.error('Failed to add task');

    queryTasksAndRender(onSuccess, onFailure);
};

const didUpdated = () => {
    const onSuccess = () => $('#add-edit-modal').modal('hide');
    const onFailure = () => console.error('Failed to update task');

    queryTasksAndRender(onSuccess, onFailure);
};

const didDeleted = () => {
    const onSuccess = () => $('#delete-modal').modal('hide');
    const onFailure = () => console.error('Failed to delete task');

    queryTasksAndRender(onSuccess, onFailure);
};

const clearAddEditForm = () => {
    document.querySelector("#add-edit-title").value = "";
    document.querySelector("#add-edit-description").value = "";
    document.querySelector("#add-edit-datetime").value = "";

    clearListeners("#add-edit-submit");
};

const clearDeleteForm = () => clearListeners("#delete-submit");

const taskListComponent = (tasks) => {
    const tasksContainer = clearListeners("#task-list");

    const groupedTasks = Object.groupBy(tasks, groupFunction);
    Object.keys(groupedTasks).forEach((group) => groupedTasks[group].sort(orderFunction));

    let tasksHtml = {};

    Object.keys(groupedTasks).forEach((group) => {
        tasksHtml[group] = groupedTasks[group].map((task) => html`
            <div class="card">
                <div class="card-body d-flex flex-grow-1 justify-content-between align-items-center">
                    <div class="d-flex gap-2 align-items-center">
                        <input type="checkbox" class="task-checkbox" dbid="${task.id}" ${task.status == "Completed" ? "checked" : ""}>
                        <p style="margin: 0; vertical-align: middle;">${task.title}</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary edit-button" dbid="${task.id}"><i class="fa-solid fa-edit"></i></button>
                        <button class="btn btn-sm btn-outline-danger delete-button" dbid="${task.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `);
    });

    tasksContainer.innerHTML = Object.keys(tasksHtml).reduce((acc, group) => acc + html`
        <div id="task-subdiv" class="d-flex flex-column gap-3 px-0 px-md-3">
            <h2 class="fs-4 fw-semibold">${group}</h2>
            ${tasksHtml[group].join("")}
        </div>
    `, "");

    tasksContainer.addEventListener("click", (e) => {
        if (e.target.closest(".edit-button")) {
            updateTaskModal(e.target.closest(".edit-button").getAttribute("dbid"));
        } else if (e.target.closest(".delete-button")) {
            deleteTaskModal(e.target.closest(".delete-button").getAttribute("dbid"));
        }
    });

    tasksContainer.addEventListener("change", async (e) => {
        if (e.target.matches(".task-checkbox")) {
            console.log("oii")
            const id = e.target.getAttribute("dbid");
            const value = tasks.find((task) => task.id == id).status;

            const onSuccess = () => queryTasksAndRender();
            const onFailure = () => console.error('Failed to update task status');

            tasksService.toggleTaskStatus(id, value, onSuccess, onFailure);
        }
    });

    const itsNotAButton = (e) => !e.target.closest(".edit-button") && !e.target.closest(".delete-button") && !e.target.matches(".task-checkbox");

    tasksContainer.addEventListener("click", (e) => {
        if (itsNotAButton(e) && e.target.closest(".card")) {
            const id = e.target.closest(".card").querySelector(".task-checkbox").getAttribute("dbid");
            console.log(id);
            taskDetailsModal(id);
        }
    });

    return;
};

const setupSidebarButtons = (option, onClickHandler) => {
    const sidebar = document.querySelector(".sidebar>div");
    const offcanvas = document.querySelector(".offcanvas-body");

    const createButtonGroup = (title, options) => {
        const groupContainer = document.createElement("div");
        groupContainer.classList.add("mb-4");

        const groupTitle = document.createElement("h5");
        groupTitle.innerText = title;
        groupContainer.appendChild(groupTitle);

        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("btn-group-vertical", "w-100");

        Object.keys(options).forEach((option) => {
            const button = document.createElement("input");
            button.type = "radio";
            button.classList.add("btn-check");
            button.name = title.toLowerCase().replace(/ /g, "-"); // unique name for radio group
            button.id = `${title.toLowerCase().replace(/ /g, "-")}-${option}`;
            button.autocomplete = "off";

            const label = document.createElement("label");
            label.classList.add("btn", "btn-outline-primary", "btn-sm", "w-100", "mb-2");
            label.setAttribute("for", button.id);
            label.innerText = option;

            buttonGroup.appendChild(button);
            buttonGroup.appendChild(label);

            button.addEventListener("change", onClickHandler(option));
        });

        groupContainer.appendChild(buttonGroup);
        return groupContainer;
    };

    if (option !== "group" && option !== "order") {
        console.error("Invalid option");
        return;
    }

    if (option === "group") {
        const groupByOptions = createButtonGroup("Agrupar por", groupFunctionOptions);
        sidebar.appendChild(groupByOptions);
        const offcanvasGroupByOptions = groupByOptions.cloneNode(true);
        offcanvas.appendChild(offcanvasGroupByOptions);
    }

    if (option === "order") {
        const orderByOptions = createButtonGroup("Ordenar por", orderFunctionOptions);
        sidebar.appendChild(orderByOptions);
        const offcanvasOrderByOptions = orderByOptions.cloneNode(true);
        offcanvas.appendChild(offcanvasOrderByOptions);
    }
};

main();
