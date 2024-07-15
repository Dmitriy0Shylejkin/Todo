const dom = {
    new: document.getElementById('new'),
    add: document.getElementById('add'),
    tasks: document.getElementById('tasks'),
    count: document.getElementById('count'),
    pagination: document.querySelector('.todo__pagination')
}

const ITEMS_PER_PAGE = 5;

//Массив задач
let tasks = [];
let currentPage = 1;

//Функция добавления задачи
function addTask(text, list) {
    const timestamp = Date.now()
    const task = {
        id: timestamp,
        text,
        isComplete: false
    }
    list.push(task)
}

//Функция вывода списка задач
function tasksRender(list) {
    const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
    let htmlList = ''
    let paginationHtml = '';  

    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button class="pagination__page" data-page="${i}">${i}</button>`;
      }
      
      dom.pagination.innerHTML = paginationHtml;
      document.querySelectorAll(".pagination__page").forEach((button) => {
        button.addEventListener("click", function () {
          currentPage = parseInt(this.dataset.page);
          tasksRender(tasks);
        });
      });

    list.forEach((task) => {
        const cls = task.isComplete ? 'todo__task todo__task_complete' : 'todo__task'
        const checked = task.isComplete ? 'checked' : ''
        
        const taskHtml = `
        <div id="${task.id}" class="${cls}">
            <label class="todo__checkbox">
                 <input type="checkbox" ${checked}>
                <div class="todo__checkbox-div"></div>
            </label>
            <div class="todo__task-text">${task.text}</div>
            <div class="todo__task-del">-</div>
         </div>
        `

        htmlList = htmlList + taskHtml
    })

    dom.tasks.innerHTML = htmlList
    renderTaskCount(list)
}

//Функция изменения статуса задачи
function changeTaskStatus(id, list) {
    list.forEach((task) => {
        if (task.id == id) {
            task.isComplete = !task.isComplete
        }
    })
}

//Функция удаления задачи
function deleteTask(id, list) {
    list.forEach((task, idx) => {
        if (task.id == id) {
            list = list.splice(idx, 1)
        }
    })
}

//Вывод кол-ва задач
function renderTaskCount(list) {
    dom.count.innerHTML = list.length
}

//Отслеживаем клик по кнопке Добавить задачу
dom.add.addEventListener('click', event => {
    const newTaskText = dom.new.value
    if(newTaskText) {
        addTask(newTaskText, tasks)
        dom.new.value = ''
        tasksRender(tasks)
    }
})

// Отслеживаем клик по чекбоксу задачи
dom.tasks.addEventListener('click', (event) => {
    const target = event.target
    const isCheckboxEL = target.classList.contains('todo__checkbox-div')
    const isDeleteEL = target.classList.contains('todo__task-del')

    if (isCheckboxEL) {
        const task = target.parentElement.parentElement
        const taskId = task.getAttribute('id')
        changeTaskStatus(taskId, tasks)
        tasksRender(tasks)
    } 
    if (isDeleteEL) {
        const task = target.parentElement
        const taskId = task.getAttribute('id')
        deleteTask(taskId, tasks)
        tasksRender(tasks)
    }
})
