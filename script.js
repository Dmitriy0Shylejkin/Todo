const dom = {
    new: document.getElementById('new'),
    add: document.getElementById('add'),
    tasks: document.getElementById('tasks'),
    count: document.getElementById('count'),
    pagination: document.querySelector('.todo__pagination'),
    page: document.querySelectorAll(".pagination__page")
}

const ITEMS_PER_PAGE = 5;

let tasks = [];
let currentPage = 1;

function tasksRender(list) {
    const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
    let htmlList = ''
    let paginationHtml = '';

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentTasks = list.slice(startIndex, endIndex);

    currentTasks.forEach((task) => {
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

    for (let i = 1; i <= totalPages; i++) {
        let buttonClass = 'pagination__page';
        if (i === currentPage) {
            buttonClass += ' pagination__page_active';
        }
        paginationHtml += `<button class="${buttonClass}" data-page="${i}">${i}</button>`;
      }

      dom.pagination.innerHTML = paginationHtml;

    dom.tasks.innerHTML = htmlList
    renderTaskCount(list)
}

function renderTaskCount(list) {
    dom.count.innerHTML = list.length
}

function tasksPagination(event) {
  if (event.target.classList.contains('pagination__page')) {
    currentPage = Number(event.target.dataset.page);
    tasksRender(tasks);
  }
}

function addTask(text, list) {
    const timestamp = Date.now()
    const task = {
        id: timestamp,
        text,
        isComplete: false
    }
    list.push(task)
}

function changeTaskStatus(id, list) {
    list.forEach((task) => {
        if (task.id == id) {
            task.isComplete = !task.isComplete
        }
    })
}

function deleteTask(id, list) {
    list.forEach((task, idx) => {
        if (task.id == id) {
            [...list] = list.splice(idx, 1)
        }
    })
}

dom.add.addEventListener('click', event => {
    const newTaskText = dom.new.value
    if(newTaskText) {
        addTask(newTaskText, tasks)
        dom.new.value = ''
        tasksRender(tasks)
    }
})

dom.tasks.addEventListener('click', (event) => {
    const target = event.target
    const isCheckboxEL = target.classList.contains('todo__checkbox-div')

    if (isCheckboxEL) {
        const task = target.parentElement.parentElement
        const taskId = task.getAttribute('id')
        changeTaskStatus(taskId, tasks)
        tasksRender(tasks)
    }
})

dom.tasks.addEventListener('click', (event) => {
    const target = event.target;
    const isDeleteEL = target.classList.contains('todo__task-del')

    if (isDeleteEL) {
        const task = target.parentElement
        const taskId = task.getAttribute('id')
        deleteTask(taskId, tasks)
        tasksRender(tasks)
    }
})

dom.pagination.addEventListener("click", tasksPagination);
