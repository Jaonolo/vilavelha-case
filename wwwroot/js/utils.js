const groupFunctionOptions = {
    "Ver todas": (value) => "Todas as tarefas",
    "Agrupar por status": (value) => taskStatus[value.status],
    "Agrupar por data": (value) => {
        if (value.dueDate == null) return "Sem prazo";
        const date = new Date(value.dueDate);
        return date.toDateString();
    }
}
let groupFunction = groupFunctionOptions["Ver todas"];

const orderFunctionOptions = {
    "Ordenar por data": (a, b) => {
        if (a.dueDate == null && b.dueDate == null) {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return a.status == "Completed" ? 1 : -1;
        };
        if (a.dueDate == null) return 1;
        if (a.dueDate < b.dueDate) return -1;
        if (a.dueDate > b.dueDate) return 1;
        return 0;
    },
    "Ordenar alfabeticamente": (a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    }
}
let orderFunction = orderFunctionOptions["Ordenar alfabeticamente"];

const clearListeners = (selector) => {
    const element = document.querySelector(selector);
    const newElement = element.cloneNode(true);
    element.replaceWith(newElement);
    return newElement;
}