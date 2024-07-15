const dom = {
    new: document.getElementById('new'),
    add: document.getElementById('add'),
    tasks: document.getElementById('tasks'),
    count: document.getElementById('count'),
    notCompletedCount: document.getElementById('not-completed-count'),
    completedCount: document.getElementById('completed-count'),
    markAll: document.getElementById('mark-all'),
    clearCompleted: document.getElementById('clear-completed'),
    filterAll: document.getElementById('filter-all'),
  filterActive: document.getElementById('filter-active'),
  filterCompleted: document.getElementById('filter-completed'),

}
//Массив задач
let tasks = [];

//Добавление новой задачи по клику на кнопку или нажатию клавиши Enter
function addNewTask() {
    const newTaskText = dom.new.value
    if(newTaskText && isNotHaveTask(newTaskText, tasks)) {
        addTask(newTaskText, tasks)
        dom.new.value = ''
        tasksRender(tasks)
        dom.new.focus()
    }
}

dom.add.onclick = addNewTask

dom.new.onkeyup = (event) => {
    if (event.key === 'Enter') {
        addNewTask()
    }
}

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

//Проверка существования задачи в массиве задач
function isNotHaveTask(text, list) {
    let isNoteHave = true

    list.forEach((task) => {
        if(task.text === text) {
            alert('Задача уже существует!')
            isNoteHave = false
        }
    })

    return isNoteHave
}

//Функция вывода списка задач
function tasksRender(list) {
    let htmlList = ''

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


// Отслеживаем клик по чекбоксу задачи
dom.tasks.onclick = (event) => {
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
            list.splice(idx, 1)
        }
    })
}

//Вывод кол-ва задач
function renderTaskCount(list) {
    dom.count.innerHTML = list.length
}

//Отметить все задачи(повторное нажатие убирает отметку)
dom.markAll.onclick = () => {
    const isAllTasksCompleted = tasks.every((task) => task.isComplete)
    tasks.forEach((task) => {
        task.isComplete = !isAllTasksCompleted
    })
    tasksRender(tasks)
};

//Удалить все выполненые задачи
dom.clearCompleted.onclick = () => {
    const filteredTasks = tasks.filter(task => !task.isComplete);
    tasks = filteredTasks
    tasksRender(filteredTasks)
    renderTaskCount(filteredTasks)
}