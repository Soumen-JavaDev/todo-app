let futureData = [];
let todayData = [];
let completeData = [];
let button = document.querySelector(".addBtn");

function normalizeDate(date) {
  date.setHours(0, 0, 0, 0);
  return date;
}

function getLocalStorage() {
  let allData = JSON.parse(localStorage.getItem("toDoData")) || [];
  futureData = [];
  todayData = [];
  completeData = [];

  allData.forEach((item) => {
    const today = normalizeDate(new Date());
    const selectedDate = normalizeDate(new Date(item.deadline));

    if (selectedDate.getTime() === today.getTime() && !item.complete) {
      todayData.push(item);
    } else if (item.complete) {
      completeData.push(item);
    } else {
      futureData.push(item);
    }
  });
}

function setLocalStorage() {
  let allData = todayData.concat(futureData, completeData);
  localStorage.setItem("toDoData", JSON.stringify(allData));
}

function addTaskToCategory(task) {
  const today = normalizeDate(new Date());
  const selectedDate = normalizeDate(new Date(task.deadline));

  if (selectedDate.getTime() === today.getTime() && !task.complete) {
    todayData.push(task);
  } else {
    futureData.push(task);
  }

  setLocalStorage();
  getLocalStorage();
  displayData();
}
button.addEventListener("click", () => {
  let taskName = document.querySelector(".task-name");
  let deadline = document.querySelector(".date");
  let priority = document.querySelector(".Priority");
  
let taskNameValue = taskName.value;
let deadlineValue = deadline.value;
let priorityValue = priority.value;
  const today = normalizeDate(new Date());
  const selectedDate = normalizeDate(new Date(deadlineValue));

  if (taskNameValue === "" || deadlineValue === "" || priorityValue === "Priority") {
    alert("Please fill in all details");
    return;
  } else if (selectedDate < today) {
    alert("You cannot enter a past date");
    return;
  }

  let newObj = {
  taskName: taskNameValue,
  deadline: deadlineValue,
  priority: priorityValue,
  complete: false,
};


  addTaskToCategory(newObj);

  taskName.value = "";
deadline.value = "";
priority.value = "Priority";

});

function sortByPriority(arr) {
 const priority_order = { high: 3, medium: 2, low: 1 };
return arr.sort((a, b) => {
  return priority_order[b.priority.toLowerCase()] - priority_order[a.priority.toLowerCase()];
});
}
function displayData() {
  let today_box = document.querySelector(".Today_box_container");
  let future_box = document.querySelector(".Future_box_container");
  let complete_box = document.querySelector(".complete_box_container");

  // Clear all boxes
  today_box.innerHTML = "";
  future_box.innerHTML = "";
  complete_box.innerHTML = "";
  todayData=sortByPriority(todayData)
  futureData=sortByPriority(futureData)
  completeData=sortByPriority(completeData)
  // Today tasks
  todayData.forEach((item, i) => {
    let div = document.createElement("div");
    div.className = "task_body1";

    div.innerHTML = `
      <div class="body_item1">${i + 1}. ${item.taskName}</div>
      <div class="body_item2">${item.deadline}</div>
      <div class="body_item3">${item.priority}</div>
      <div class="body_item4">
        <img src="assets/successicon.svg" alt="complete" class="success" task-is="today-task" data-index="${i}">
        <img src="assets/DeleteIcon.svg" alt="delete" class="delete" task-is="today-task" data-index="${i}">
      </div>
    `;
    today_box.appendChild(div);
  });

  // Future tasks
  futureData.forEach((item, i) => {
    let div = document.createElement("div");
    div.className = "task_body1";

    div.innerHTML = `
      <div class="body_item1">${i + 1}. ${item.taskName}</div>
      <div class="body_item2">${item.deadline}</div>
      <div class="body_item3">${item.priority}</div>
      <div class="body_item4">
        <img src="assets/successicon.svg" alt="complete" class="success" task-is="future-task" data-index="${i}">
        <img src="assets/DeleteIcon.svg" alt="delete" class="delete" task-is="future-task" data-index="${i}">
      </div>
    `;
    future_box.appendChild(div);
  });

  // Completed tasks
  completeData.forEach((item, i) => {
    let div = document.createElement("div");
    div.className = "task_body1";

    div.innerHTML = `
      <div class="body_item1">${i + 1}. ${item.taskName}</div>
      <div class="body_item2">${item.deadline}</div>
      <div class="body_item3">${item.priority}</div>
      <div class="body_item4">
        <img src="assets/DeleteIcon.svg" alt="delete" class="delete" task-is="complete-task" data-index="${i}">
      </div>
    `;
    complete_box.appendChild(div);
  });

  
  addDeleteEvents();
  addSuccessEvents();
}

function addDeleteEvents() {
  let deleteButton = document.querySelectorAll(".delete");

  deleteButton.forEach((item) => {
    item.addEventListener("click", () => {
      let index = parseInt(item.getAttribute("data-index"));
      let box_name = item.getAttribute("task-is");

      if (box_name === "today-task") {
        todayData.splice(index, 1);
      } else if (box_name === "future-task") {
        futureData.splice(index, 1);
      } else {
        completeData.splice(index, 1);
      }

      setLocalStorage();
      getLocalStorage();
      displayData();
    });
  });
}
function addSuccessEvents() {
  let successButtons = document.querySelectorAll(".success");

  successButtons.forEach((item) => {
    item.addEventListener("click", () => {
      let index = parseInt(item.getAttribute("data-index"));
      let boxName = item.getAttribute("task-is");

      let taskList;

      if (boxName === "today-task") {
        taskList = todayData;
      } else if (boxName === "future-task") {
        taskList = futureData;
      } else {
        return; // do nothing if not matched
      }

      if (index >= 0 && index < taskList.length) {
        // Mark complete
        taskList[index].complete = true;

        // Move to completeData
        completeData.push(taskList[index]);

        // Remove from original list
        taskList.splice(index, 1);

        // Update and refresh
        setLocalStorage();
        getLocalStorage();
        displayData();
      }
    });
  });
}

window.addEventListener("load",()=>{
     getLocalStorage();
        displayData();
});
