const UserData = document.getElementById('user-data-typed');
const AddBtn = document.getElementById('add-btn');
const PrintingCloneContainer = document.getElementById('bottom-section-adding');
const EditIcon = document.querySelector('.edit-icon')
const DeleteCLone = document.querySelector('.trash-div')
const CheckBoxes = document.querySelector('.checkboxes')
const form = document.getElementById("dataForm");
const Topform = document.querySelector('form');
const NoTaskspan = document.getElementById('notaskspan')
const NumberofTasks = document.getElementById('NoofTasks')
const value = UserData.value.trim();


let selectedDay = "";
let selectedTime = "";
let itemBeingEdited = null;
let editTarget = null;
let counterkey = localStorage.length



// New Clone Container On Add
function createCloneElement(tododata, key, checked = false) {
    const clone = document.createElement('div');
    clone.classList.add('bottom-card-inneritems');
    clone.dataset.key = key;

    const timingDiv = document.createElement('div');
    timingDiv.classList.add('timing-and-work');
    timingDiv.style.display = 'flex';
    timingDiv.style.gap = '10px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkboxes');
    checkbox.checked = checked;

    const textTimeDiv = document.createElement('div');
    textTimeDiv.style.display = 'flex';
    textTimeDiv.style.flexDirection = 'column';

    const textSpan = document.createElement('span');
    textSpan.id = 'usertyped-text';
    textSpan.classList.add('usertyped-text');
    textSpan.style.fontWeight = '700';
    textSpan.innerText = tododata.text;
    textSpan.style.textDecoration = checked ? "line-through dashed" : "none";

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('dateandtime');
    timeSpan.innerText = tododata.time;
    timeSpan.style.textDecoration = checked ? "line-through dashed" : "none";

    textTimeDiv.appendChild(textSpan);
    textTimeDiv.appendChild(timeSpan);

    timingDiv.appendChild(checkbox);
    timingDiv.appendChild(textTimeDiv);

    const btnDiv = document.createElement('div');
    btnDiv.style.display = 'flex';
    btnDiv.style.gap = '10px';

    const editBtn = document.createElement('div');
    editBtn.classList.add('edit-icon');
    editBtn.innerHTML = `<svg id="edit-section" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="#fcfcfc" d="m7 17.013l4.413-.015l9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583zM18.045 4.458l1.589 1.583l-1.597 1.582l-1.586-1.585zM9 13.417l6.03-5.973l1.586 1.586l-6.029 5.971L9 15.006z" stroke-width="0.5" stroke="#f1ebeb" />
        <path fill="#fcfcfc" d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2" stroke-width="0.5" stroke="#f1ebeb" />
    </svg>`;

    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('trash-div');
    deleteBtn.innerHTML = `<svg class="trash-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" stroke="red" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>`;

    btnDiv.appendChild(editBtn);
    btnDiv.appendChild(deleteBtn);

    clone.appendChild(timingDiv);
    clone.appendChild(btnDiv);

    return clone;
}

// press Enter To save Data

Topform.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        AddingData();
        NoTaskspan.style.display = "none"

    }
});


AddBtn.addEventListener("click", (event) => {
    event.preventDefault();
    AddingData();
    NoTaskspan.style.display = "none"
});

// Adding Data and set that data Into LocalStorage 
function AddingData(formElement) {
    const value = UserData.value.trim();

    const selectedDay = document.getElementById("day");
    const selectedTime = document.getElementById("time");
    if (value === "") {
        UserData.style.borderColor = "red";
        return;
    } else {
        UserData.style.borderColor = "green";

    }

    if (!selectedDay.value || !selectedTime.value) {
        selectedDay.style.borderColor = "red";
        selectedTime.style.borderColor = "red";
        return;
    } else {
        selectedDay.style.borderColor = "green";
        selectedTime.style.borderColor = "green";
    }

    // Handle edit mode
    if (editTarget) {
        editTarget.querySelector('#usertyped-text').innerText = value;
        editTarget.querySelector('.dateandtime').innerText =
            `${selectedDay.value} at ${selectedTime.value}`;

        const key = editTarget.dataset.key;
        localStorage.setItem(`data_${key}`, value);
        localStorage.setItem(`time_${key}`, `${selectedDay.value} at ${selectedTime.value}`);

        editTarget = null;
        UserData.value = "";
        return;
    }

    // Create new todo object
    counterkey++;
    const tododata = {
        text: value,
        time: `${selectedDay.value} at ${selectedTime.value}`,
        isChecked: false
    };

    // Save in localStorage
    localStorage.setItem(`data_${counterkey}`, tododata.text);
    localStorage.setItem(`time_${counterkey}`, tododata.time);
    localStorage.setItem(`check_${counterkey}`, "false");

    // Clone template and fill
    const clone = createCloneElement(tododata, counterkey, false);
    clone.dataset.key = counterkey;
    clone.querySelector('#usertyped-text').innerText = tododata.text;
    clone.querySelector('.dateandtime').innerText = tododata.time;

    // Checkbox default
    const checkbox = clone.querySelector('.checkboxes');
    checkbox.checked = false;

    clone.querySelector('#usertyped-text').style.textDecoration = "none";
    clone.querySelector('.dateandtime').style.textDecoration = "none";

    PrintingCloneContainer.appendChild(clone);

    UserData.value = "";

    // Reset form if available
    if (formElement) formElement.reset();
};


// Printing Clone Container

PrintingCloneContainer.addEventListener('click', (e) => {


    // trashBtn
    const trashBtn = e.target.closest('.trash-div');
    if (trashBtn) {
        const cloneToRemove = trashBtn.closest('.bottom-card-inneritems');
        if (!cloneToRemove) return;

        const key = cloneToRemove.dataset.key;
        if (key) {
            localStorage.removeItem(`data_${key}`);
            localStorage.removeItem(`time_${key}`);
            localStorage.removeItem(`check_${key}`);
        }

        if (cloneToRemove === editTarget) {
            editTarget = null;
            UserData.value = "";
        }

        cloneToRemove.remove();
        updateTaskCount();
        return;
    }

    // checkboxes 

    const checkbox = e.target.closest('.checkboxes');
    if (checkbox) {
        const clone = checkbox.closest('.bottom-card-inneritems');
        if (!clone) return;

        const key = clone.dataset.key;
        const textSpan = clone.querySelector('#usertyped-text');
        const timeSpan = clone.querySelector('.dateandtime');

        if (checkbox.checked) {
            textSpan.style.textDecoration = "line-through dashed";
            timeSpan.style.textDecoration = "line-through dashed";
            localStorage.setItem(`check_${key}`, "true");
        } else {
            textSpan.style.textDecoration = "none";
            timeSpan.style.textDecoration = "none";
            localStorage.setItem(`check_${key}`, "false");
        }
        return;
    }

    const editBtn = e.target.closest('.edit-icon');
    if (!editBtn) return;

    editTarget = editBtn.closest('.bottom-card-inneritems');
    UserData.value = editTarget.querySelector('#usertyped-text').innerText;
    PrintingCloneContainer.appendChild(clone);
    updateTaskCount();


});


// On page Reload to get datas Fro local Storage
window.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key.startsWith("data_")) {
            const index = key.split("_")[1];

            const text = localStorage.getItem(`data_${index}`);
            const time = localStorage.getItem(`time_${index}`);
            const checked = localStorage.getItem(`check_${index}`) === "true";

            const clone = createCloneElement({ text, time }, index, checked);
            clone.dataset.key = index;
            clone.querySelector('#usertyped-text').innerText = text;
            clone.querySelector('.dateandtime').innerText = time;


            const checkbox = clone.querySelector('.checkboxes');
            checkbox.checked = checked;

            if (checked) {
                clone.querySelector('#usertyped-text').style.textDecoration = "line-through dashed";
                clone.querySelector('.dateandtime').style.textDecoration = "line-through dashed";
            } else {
                clone.querySelector('#usertyped-text').style.textDecoration = "none";
                clone.querySelector('.dateandtime').style.textDecoration = "none";
            }


            PrintingCloneContainer.appendChild(clone);
            updateTaskCount()
        }
    }
});

// Updating Task Count  
function updateTaskCount() {
    const totalTasks = PrintingCloneContainer.querySelectorAll('.bottom-card-inneritems').length;
    NumberofTasks.innerText = totalTasks;

    if (totalTasks === 0) {
        NoTaskspan.style.display = "flex";
    } else {
        NoTaskspan.style.display = "none";
    }
}



localStorage.setItem("name", "Irfan")