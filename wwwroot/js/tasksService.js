const tasksService = (function () {
    // Private function
    const apiRequest = async (url, options = {}, onSuccess = () => { }, onFailure = () => { }) => {
        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                onFailure();
            }

            const data = options.method !== "DELETE" ? await response.json() : null;
            onSuccess(data);
        } catch (error) {
            console.error("Error in API request:", error);
            onSuccess(null, error);
        }
    };

    // Public functions
    return {
        /**
         * Calls the API to delete a task.
         * 
         * @param {number} id - The task ID.
         * 
         * @param {function} onSuccess - The function to call when the API request is successful.
         * 
         * @returns {void}
        **/
        deleteTask: (id, onSuccess, onFailure) => {
            apiRequest(`/tasks/delete/${id}`, { method: "DELETE" }, onSuccess, onFailure);
        },

        /**
         * Calls the API to update a task.
         * 
         * @param {number} id - The task ID.
         * 
         * @param {function} onSuccess - The function to call when the API request is successful.
         * 
         * @returns {void}
        **/
        updateTask: (id, onSuccess, onFailure) => {
            const title = document.querySelector("#add-edit-title").value;
            const description = document.querySelector("#add-edit-description").value;
            const dueDate = document.querySelector("#add-edit-datetime").value;

            apiRequest(`/tasks/edit/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, description, dueDate })
            }, onSuccess, onFailure);
        },

        /**
         * Calls the API to add a task.
         * 
         * @param {function} onSuccess - The function to call when the API request is successful.
         * 
         * @returns {void}
        **/
        addTask: (onSuccess, onFailure) => {
            const title = document.querySelector("#add-edit-title").value;
            const description = document.querySelector("#add-edit-description").value;
            const dueDate = document.querySelector("#add-edit-datetime").value;

            apiRequest("/tasks/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, description, dueDate, status: "Pending" })
            }, onSuccess, onFailure);
        },

        /**
         * Calls the API to get all tasks.
         * 
         * @param {function} onSuccess - The function to call when the API request is successful.
         * 
         * @returns {void}
        **/
        getAllTasks: (onSuccess, onFailure) => {
            apiRequest("/tasks/getTasks", {}, onSuccess, onFailure);
        },

        getTask: (id, onSuccess, onFailure) => {
            apiRequest(`/tasks/getTask/${id}`, {}, onSuccess, onFailure);
        },

        toggleTaskStatus: (id, oldValue, onSuccess, onFailure) => {
            apiRequest(`/tasks/edit/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ status: oldValue == "Completed" ? "Pending" : "Completed" })
                },
                onSuccess,
                onFailure
            )
        },

        changeTaskStatus: (id, status, onSuccess, onFailure) => {
            apiRequest(`/tasks/edit/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ status: status })
                },
                onSuccess,
                onFailure
            )
        }
    };
})();