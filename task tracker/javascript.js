const searchString = document.querySelector(".searchbar input");
const searchbar = document.querySelector(".header-searchbar");
const searchheader = document.querySelector(".search-header");
const searchbtn = document.querySelector(".Search-btn i");
searchString.focus();
const tracker = document.querySelector(".task-tracker");

let index = 0;
let showsearch = false;

function saveInLocal(task, selected) {
    let selectedTasks = JSON.parse(localStorage.getItem("SELECTED_TASKS")) || [];
    let unselectedTasks = JSON.parse(localStorage.getItem("UNSELECTED_TASKS")) || [];

    if (selected) {
        if (!selectedTasks.includes(task)) {
            selectedTasks.push(task);
            unselectedTasks = unselectedTasks.filter(t => t !== task);
        }
    } else {
        if (!unselectedTasks.includes(task)) {
            unselectedTasks.push(task);
            selectedTasks = selectedTasks.filter(t => t !== task);
        }
    }

    localStorage.setItem("SELECTED_TASKS", JSON.stringify(selectedTasks));
    localStorage.setItem("UNSELECTED_TASKS", JSON.stringify(unselectedTasks));

    GetLocal();
}

function deleteInLocal(task) {
    let selectedTasks = JSON.parse(localStorage.getItem("SELECTED_TASKS")) || [];
    let unselectedTasks = JSON.parse(localStorage.getItem("UNSELECTED_TASKS")) || [];

    selectedTasks = selectedTasks.filter(t => t !== task);
    unselectedTasks = unselectedTasks.filter(t => t !== task);

    localStorage.setItem("SELECTED_TASKS", JSON.stringify(selectedTasks));
    localStorage.setItem("UNSELECTED_TASKS", JSON.stringify(unselectedTasks));

    GetLocal();
}

function GetLocal() {
    let selectedTasks = JSON.parse(localStorage.getItem("SELECTED_TASKS")) || [];
    let unselectedTasks = JSON.parse(localStorage.getItem("UNSELECTED_TASKS")) || [];

    selectedTasks.sort((a, b) => a.localeCompare(b));
    unselectedTasks.sort((a, b) => a.localeCompare(b));

    LoadLocal(selectedTasks, unselectedTasks);
}

function LoadLocal(selectedTasks, unselectedTasks) {
    let list = document.querySelector(".task-list");
    list.innerHTML = "";

    if (selectedTasks.length === 0 && unselectedTasks.length === 0) {
        let p = document.createElement("p");
        p.textContent = "No Tasks are found";
        p.style.textAlign = "center";
        p.style.fontSize = "20px";
        list.appendChild(p);
        return;
    }

    selectedTasks.forEach(task => createEntry(task, true));
    unselectedTasks.forEach(task => createEntry(task, false));
}

function submitTask() {
    if (searchString.value.trim() === "") {
        return;
    }
    let selectedTasks = JSON.parse(localStorage.getItem("SELECTED_TASKS")) || [];
    let unselectedTasks = JSON.parse(localStorage.getItem("UNSELECTED_TASKS")) || [];
    let newTask = searchString.value.trim();

    if (!selectedTasks.includes(newTask) && !unselectedTasks.includes(newTask)) {
        if (containsError()) {
            removeError();
        }
        createEntry(searchString.value, false);
        saveInLocal(searchString.value, false);
        searchString.value = "";
    } else {
        showError();
    }
}

function createEntry(input, selected) {
    let taskEntry = document.createElement('div');
    taskEntry.classList.add('task-entry');
    if (selected) {
        taskEntry.classList.add('checked');
    }

    let innerDiv = document.createElement('div');

    let checkDiv = document.createElement('div');
    checkDiv.id = 'check';
    checkDiv.addEventListener('click', selectTask);

    let label = document.createElement('label');
    label.id = 'check-text';
    label.textContent = input;
    label.addEventListener('click', selectTask);

    innerDiv.append(checkDiv);
    innerDiv.append(label);

    let button = document.createElement('button');
    button.id = index;
    button.textContent = '🗑️';
    button.addEventListener('click', deleteTask);
    button.style.cursor = "pointer";

    taskEntry.append(innerDiv);
    taskEntry.append(button);

    let list = document.querySelector(".task-list");
    list.append(taskEntry);

    let line = document.createElement("hr");
    list.append(line);
    index++;
}

function showError() {
    const msg = tracker.children[1].querySelector(".errormsg");
    msg.classList.add("showErrorMsg");
    msg.classList.remove("hideErrorMsg");
    msg.style.display = "flex";
}

function removeError() {
    const msg = tracker.children[1].querySelector(".errormsg");
    msg.classList.add("hideErrorMsg");
    msg.classList.remove("showErrorMsg");

    setTimeout(() => {
        msg.style.display = "none";
    }, 200);
}

function containsError() {
    return tracker.children[1].querySelector(".errormsg").classList.contains("showErrorMsg");
}

searchString.addEventListener('keydown', event => {
    if (event.key === "Enter") {
        submitTask();
    } else {
        searchString.focus();
    }
});
document.addEventListener('keydown', event => {
    if (event.key === "s" && event.ctrlKey) {
        event.preventDefault();
        togglesearch();
    }
    if (event.key === "i" && event.ctrlKey) {
        event.preventDefault();
        searchString.focus();
    }
});

function deleteTask(event) {
    let taskEntry = event.target.closest('.task-entry');
    if (!taskEntry) return;

    let taskString = taskEntry.querySelector("#check-text").textContent;
    deleteInLocal(taskString);
}

searchbar.addEventListener('input', event => {
    Search();
});
searchbar.addEventListener('keydown', event => {
    if (event.key === "Escape") {  
        if (showsearch) {
            togglesearch();
        }
    }
});

function togglesearch() {
    showsearch = !showsearch;

    if (showsearch) {
        searchbar.classList.replace("deactivate-searchbar", "activate-searchbar");
        searchheader.classList.replace("deactivate-searchheader", "activate-searchheader");
        searchbtn.classList.replace("fa-search", "fa-close");
        searchbar.focus();
    } else {
        searchbar.classList.replace("activate-searchbar", "deactivate-searchbar");
        searchheader.classList.replace("activate-searchheader", "deactivate-searchheader");
        searchbtn.classList.replace("fa-close", "fa-search");
        searchbar.value = "";
        searchString.focus();
        GetLocal();
    }
}

function Search() {
    let searchstr = searchbar.value;
    if (searchstr.trim() === "") {
        GetLocal();
        return;
    }
    SearchLocal(searchstr);
}

function SearchLocal(str) {
    let list = document.querySelector(".task-list");
    list.innerHTML = "";

    let selectedTasks = JSON.parse(localStorage.getItem("SELECTED_TASKS")) || [];
    let unselectedTasks = JSON.parse(localStorage.getItem("UNSELECTED_TASKS")) || [];
    
    let normalizedSearch = str.toLowerCase().replace(/\s+/g, "");
    
    let filteredSelected = selectedTasks.filter(e => e.toLowerCase().replace(/\s+/g, "").includes(normalizedSearch));
    let filteredUnselected = unselectedTasks.filter(e => e.toLowerCase().replace(/\s+/g, "").includes(normalizedSearch));

    LoadLocal(filteredSelected, filteredUnselected);
}

function selectTask(event) {
    const entry = event.target.closest('.task-entry');
    if (!entry) return;

    let taskString = entry.querySelector("#check-text").textContent;
    let isChecked = entry.classList.contains('checked');

    entry.classList.toggle('checked');
    saveInLocal(taskString, !isChecked);
}

GetLocal();
