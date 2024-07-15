const dom = {
    new: document.getElementById('new'),
    add: document.getElementById('add'),
    tasks: document.getElementById('tasks')
}
//Массив задач
const tasks = [];

//Отслеживаем клик по кнопке Добавить задачу
dom.add.onclick = () => {
    const newTaskText = dom.new.value
    if(newTaskText && isNotHaveTask(newTaskText, tasks)) {
        addTask(newTaskText, tasks)
        dom.new.value = ''
        tasksRender(tasks)
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
                <div></div>
            </label>
            <div class="todo__task-text">${task.text}</div>
            <div class="todo__task-del">-</div>
         </div>
        `

        htmlList = htmlList + taskHtml
    })

    dom.tasks.innerHTML = htmlList
}


// Отслеживаем клик по чекбоксу задачи
dom.tasks.onclick = (event) => {
    const target = event.target
//     const isCheckboxEL = target.classList.contains('todo__checkbox-div')

//     if (isCheckboxEL) {
//         const isComplete = target.previousElementSibling.checked
//         const task = target.parentElement.parentElement
//         const taskId = task.getAttribute('id')
//         console.log(taskId)
//         // changeTaskStatus(taskId, tasks)
//     } 
// }

// //Функция изменения статуса задачи
// function changeTaskStatus(id, list) {
//     list.forEach((task) => {
//         if (task.id == id) {
//             task.isComplete = !task.isComplete
//         }
//     })
// }