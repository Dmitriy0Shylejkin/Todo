// DOM elements
const dom = {
  new: document.getElementById('new'),
  add: document.getElementById('add'),
  tasks: document.getElementById('tasks'),
  count: document.getElementById('count'),
  pagination: document.querySelector('.todo__pagination'),
  page: document.querySelectorAll(".pagination__page"),
  notCompletedCount: document.getElementById('not-completed-count'),
  completedCount: document.getElementById('completed-count'),
  markAll: document.getElementById('mark-all'),
  clearCompleted: document.getElementById('clear-completed'),
  filterAll: document.getElementById('filter-all'),
  filterActive: document.getElementById('filter-active'),
  filterCompleted: document.getElementById('filter-completed')
}

// Constants
const ITEMS_PER_PAGE = 5

// Variables
let tasks = []
let currentPage = 1
let currentFilter = 'all'
let editableTask = null

// The function of adding a new task
function addNewTask() {
  const newTaskText = dom.new.value

  // Removing unnecessary spaces
  const cleanedTaskText = _.trim(newTaskText)
  const withoutExtraSpaces = _.trimEnd(_.trimStart(cleanedTaskText))

  // Replacing multiple spaces in a row with one space
  const singleSpaces = withoutExtraSpaces.replace(/\s+/g, ' ')

  // Escaping scripts and symbols
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '#': '&#35;',
    '%': '&#37;',
    ':': '&#58;',
    '?': '&#63;',
    '*': '&#42;',
  }
  const escapedTaskText = singleSpaces.replace(/[&<>"'#%:?*]/g, (m) => map[m])

  if (escapedTaskText && isNotHaveTask(escapedTaskText, tasks)) {
    addTask(escapedTaskText, tasks)
    dom.new.value = ''
    tasksRender(tasks)
    dom.new.focus()

    // Automatically go to a new page
    const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)
    if ((currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE < tasks.length) {
        currentPage = totalPages;
        tasksRender(tasks);
    }
  } else if (!escapedTaskText) {
    alert('Поле не может быть пустым или содержать только пробелы.')
  }
}

// Event handlers for adding a new task
dom.add.onclick = addNewTask

dom.new.onkeyup = (event) => {
  if (event.key === 'Enter') {
    addNewTask()
  }
}

// The function of adding a task to the list
function addTask(text, list) {
  const timestamp = Date.now()
  const task = {
    id: timestamp,
    text,
    isComplete: false,
  }
  list.push(task)
  return timestamp
}

// Task availability check function
function isNotHaveTask(text, list) {
  let isNoteHave = true

  list.forEach((task) => {
    if (task.text === text) {
      alert('Задача уже существует!')
      isNoteHave = false
    }
  })

  return isNoteHave
} 

// Task rendering function
function tasksRender(list) {
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE)
  let htmlList = ''
  let paginationHtml = ''

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTasks = list.slice(startIndex, endIndex)

  currentTasks.forEach((task) => {
      const cls = task.isComplete ? 'todo__task todo__task_complete' : 'todo__task'
      const checked = task.isComplete ? 'checked' : ''

      const taskHtml = `
      <div id="${task.id}" class="${cls}">
          <label class="todo__checkbox">
               <input type="checkbox" ${checked}>
              <div class="todo__checkbox-div"></div>
          </label>
          <div class="todo__task-text" contenteditable="false">${task.text}</div>
          <div class="todo__task-del">-</div>
       </div>
      `

      htmlList = htmlList + taskHtml
  })

  for (let i = 1; i <= totalPages; i++) {
      let buttonClass = 'pagination__page'
      if (i === currentPage) {
          buttonClass += ' pagination__page--active'
      }
      paginationHtml += `<button class="${buttonClass}" data-page="${i}">${i}</button>`
    }

    dom.pagination.innerHTML = paginationHtml

  dom.tasks.innerHTML = htmlList
  renderTaskCount(list)
  
  dom.tasks.innerHTML = htmlList
  renderTaskCount(tasks)

}

// Event handler for changing the status of a task and deleting a task
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

// Task count function
function renderTaskCount(list) {
  dom.count.innerHTML = list.length
  dom.notCompletedCount.innerHTML = list.filter((task) => !task.isComplete).length
  dom.completedCount.innerHTML = list.filter((task) => task.isComplete).length
}

// Pagination function
function tasksPagination(event) {
if (event.target.classList.contains('pagination__page')) {
  currentPage = Number(event.target.dataset.page)
  let filteredTasks = []
    if (currentFilter === 'all') {
      filteredTasks = tasks
    } else if (currentFilter === 'active') {
      filteredTasks = tasks.filter((task) => !task.isComplete)
    } else if (currentFilter === 'completed') {
      filteredTasks = tasks.filter((task) => task.isComplete)
    }
  tasksRender(filteredTasks)
}
}

// Task status change function
function changeTaskStatus(id, list) {
  list.forEach((task) => {
      if (task.id == id) {
          task.isComplete = !task.isComplete
      }
  })
}

// Task deletion function
function deleteTask(id, list) {
  list.forEach((task, idx) => {
      if (task.id == id) {
          [...list] = list.splice(idx, 1)
      }
  })
}

// Event handlers for the "Mark all" and "Delete completed" buttons
dom.markAll.onclick = () => {
  const isAllTasksCompleted = tasks.every((task) => task.isComplete)
  tasks.forEach((task) => {
    task.isComplete = !isAllTasksCompleted
  })
  tasksRender(tasks)
}

dom.clearCompleted.onclick = () => {
  const filteredTasks = tasks.filter((task) => !task.isComplete)
  tasks = filteredTasks
  tasksRender(filteredTasks)
  renderTaskCount(filteredTasks)
}

// Task filtering function
function filterTasks(filter) {
  currentFilter = filter

  let filteredTasks = []

  if (currentFilter === 'all') {
    filteredTasks = tasks
  } else if (currentFilter === 'active') {
    filteredTasks = tasks.filter((task) => !task.isComplete)
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter((task) => task.isComplete)
  }

  tasksRender(filteredTasks)
}

// Event handlers for filtering buttons
dom.filterAll.addEventListener('click', () => filterTasks('all'))
dom.filterActive.addEventListener('click', () => filterTasks('active'))
dom.filterCompleted.addEventListener('click', () => filterTasks('completed'))

// Event handler for the add task button
dom.add.addEventListener('click', () => {
  const newTaskText = dom.new.value
  if(newTaskText) {
      addTask(newTaskText, tasks)
      dom.new.value = ''
      
      // Checking whether the current page needs to be updated
    const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)
    if (totalPages > currentPage) {
      currentPage = totalPages
    }

      tasksRender(tasks)
  }
})

// Event handler for deleting a task
dom.tasks.addEventListener('click', (event) => {
  const target = event.target
  const isDeleteEL = target.classList.contains('todo__task-del')

  if (isDeleteEL) {
      const task = target.parentElement
      const taskId = task.getAttribute('id')
      deleteTask(taskId, tasks)
      tasksRender(tasks)
  }
})

// Event handler for editing the task
dom.tasks.addEventListener('dblclick', (event) => {
  const target = event.target
  const isTaskTextEL = target.classList.contains('todo__task-text')

  if (isTaskTextEL) {
    editableTask = target
    target.contentEditable = true
    target.focus()
  }
})

document.addEventListener('keydown', (event) => {
  if (editableTask && event.key === 'Enter') {
    const newText = editableTask.textContent.trim()
    if (newText !== '') {
      updateTaskText(editableTask.parentNode.id, newText, tasks)
      tasksRender(tasks)
    }
    editableTask.contentEditable = false
    editableTask = null
  } else if (editableTask && event.key === 'Escape') {
    editableTask.textContent = getTaskTextById(editableTask.parentNode.id, tasks)
    editableTask.contentEditable = false
    editableTask = null
  }
})

document.addEventListener('blur', (event) => {
  if (editableTask && event.target === editableTask) {
    const newText = editableTask.textContent.trim()
    if (newText !== '') {
      updateTaskText(editableTask.parentNode.id, newText, tasks)
      tasksRender(tasks)
    }
    editableTask.contentEditable = false
    editableTask = null
  }
})

// Task text update function
function updateTaskText(id, newText, list) {
  
  // Removing unnecessary spaces
  const cleanedTaskText = _.trim(newText)
  const withoutExtraSpaces = _.trimEnd(_.trimStart(cleanedTaskText))

  // Replacing multiple spaces in a row with one space
  const singleSpaces = withoutExtraSpaces.replace(/\s+/g, ' ')
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '#': '&#35;',
    '%': '&#37;',
    ':': '&#58;',
    '?': '&#63;',
    '*': '&#42;',
  }
  const escapedTaskText = singleSpaces.replace(/[&<>"'#%:?*]/g, (m) => map[m])
  
  if (escapedTaskText) {
    list.forEach((task) => {
      if (task.id == id) {
        task.text = escapedTaskText;
      }
    })
  } else {
    alert('Поле не может быть пустым или содержать только пробелы.')
  }
}

// The function of getting the task text by id
function getTaskTextById(id, list) {
  let taskText = ''
  list.forEach((task) => {
    if (task.id == id) {
      taskText = task.text
    }
  })
  return taskText
}

// Обработчик событий для пагинации
dom.pagination.addEventListener("click", tasksPagination)

// Инициализация рендера задач
tasksRender(tasks)