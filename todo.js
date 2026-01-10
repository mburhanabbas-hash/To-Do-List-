const UserData = document.getElementById('user-data-typed');
const AddBtn = document.getElementById('add-btn');
const CloneItem = document.getElementById('clone-content');
const PrintingCloneContainer = document.getElementById('bottom-section-adding');
const time = document.getElementById("time").value;
const EditIcon = document.querySelector('.edit-icon')
const DeleteCLone = document.querySelector('.trash-div')
const CheckBoxes = document.querySelector('.checkboxes')


let itemBeingEdited = null;
let editTarget = null;

const value = UserData.value.trim();
let counterkey = localStorage.length
AddBtn.addEventListener('click', () => {

    counterkey++;
    const value = UserData.value.trim();

    if (value === "") {
        UserData.style.borderColor = "red";
        return;
    }

    if (!selectedDay || !selectedTime) {
        alert("Please select day and time first");
        return;
    }

    if (editTarget) {
        editTarget.querySelector('#usertyped-text').innerText = value;
        editTarget.querySelector('.dateandtime').innerText =
            `${selectedDay} at ${selectedTime}`;

        editTarget = null;
        UserData.value = "";
        return;
    }


    const tododata = {
        text: UserData.value.trim(),
        time: ` ${selectedDay} at ${selectedTime}`,
        isChecked: false
    }
    console.log(tododata)



    // Setting Data In local Storage        
    localStorage.setItem("data_" + counterkey, `${tododata.text}`)
    localStorage.setItem("time_" + counterkey, ` ${tododata.time}`)
    localStorage.setItem("check_" + counterkey, "false");

    // Getting data From Local Storage

    const LocalUserDataText = localStorage.getItem("data_" + counterkey)
    const localStorageTime = localStorage.getItem("time_" + counterkey)
    console.log("data from Local Storage", LocalUserDataText, localStorageTime)
    const clone = CloneItem.cloneNode(true);
    clone.dataset.key = counterkey;
    clone.querySelector('#usertyped-text').innerText = LocalUserDataText
    clone.querySelector('.dateandtime').innerText = localStorageTime
    PrintingCloneContainer.appendChild(clone);
    UserData.value = "";

    const isChecked = localStorage.getItem("check_" + counterkey) === "true";
    const checkbox = clone.querySelector('.checkboxes');

    checkbox.checked = isChecked;

    if (isChecked) {
        clone.querySelector('#usertyped-text').style.textDecoration = "line-through dashed";
        clone.querySelector('.dateandtime').style.textDecoration = "line-through dashed";
    }


});


// 


PrintingCloneContainer.addEventListener('click', (e) => {

    const trashBtn = e.target.closest('.trash-div');
    if (trashBtn) {
        const cloneToRemove = trashBtn.closest('#clone-content');
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
        return;
    }
    const checkbox = e.target.closest('.checkboxes');
    if (checkbox) {
        const clone = checkbox.closest('#clone-content');
        if (!clone) return;

        const key = clone.dataset.key;
        const textSpan = clone.querySelector('#usertyped-text');
        const timeSpan = clone.querySelector('.dateandtime');

        if (checkbox.checked) {
            textSpan.style.textDecoration = "line-through dashed";
            timeSpan.style.textDecoration = "line-through dashed";
            localStorage.setItem(`check_${key}`, "true");
        } else if (!checkbox.checked) {
            textSpan.style.textDecoration = "none";
            timeSpan.style.textDecoration = "none";
            localStorage.setItem(`check_${key}`, "false");
        }
        return;
    }


    const editBtn = e.target.closest('.edit-icon');
    if (!editBtn) return;

    editTarget = editBtn.closest('#clone-content');

    UserData.value =
        editTarget.querySelector('#usertyped-text').innerText;

    const dateTime =
        editTarget.querySelector('.dateandtime').innerText;

    modal.style.display = "block";
});


const modal = document.getElementById("dataModal");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.querySelector(".close-btn");
const form = document.getElementById("dataForm");

openBtn.onclick = () => {
    modal.style.display = "block";
}

closeBtn.onclick = () => {
    modal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

let selectedDay = "";
let selectedTime = "";

form.addEventListener('submit', (e) => {
    e.preventDefault();

    selectedDay = document.getElementById("day").value;
    selectedTime = document.getElementById("time").value;

    modal.style.display = "none";
    form.reset();
});





window.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key.startsWith("data_")) {
            const index = key.split("_")[1];

            const text = localStorage.getItem(`data_${index}`);
            const time = localStorage.getItem(`time_${index}`);
            const checked = localStorage.getItem(`check_${index}`)

            if (!text || !time || !checked) continue;

            const clone = CloneItem.cloneNode(true);
            clone.querySelector('#usertyped-text').innerText = text;
            clone.querySelector('.dateandtime').innerText = time;
            if (checked) {
                clone.querySelector('.dateandtime').style.textDecoration = "line-through dashed";
                clone.querySelector('#usertyped-text').style.textDecoration = "line-through dashed";
            }
            if (!checked) {
                clone.querySelector('.dateandtime').style.textDecoration = "none";
                clone.querySelector('#usertyped-text').style.textDecoration = "none";
            }


            PrintingCloneContainer.appendChild(clone);
        }
    }
});


localStorage.setItem("name", "Irfan")