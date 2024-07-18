// DOM элементы
( =>{})()const dom = {
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

// Константы
const ITEMS_PER_PAGE = 5

// Переменные
let tasks = []
let currentPage = 1
let currentFilter = 'all'
let editableTask = null

// Функция добавления новой задачи
function addNewTask() {
  const newTaskText = dom.new.value

  // Удаление лишних пробелов
  const cleanedTaskText = _.trim(newTaskText)
  const withoutExtraSpaces = _.trimEnd(_.trimStart(cleanedTaskText))

  // Замена множества пробелов подряд на один пробел
  const singleSpaces = withoutExtraSpaces.replace(/\s+/g, ' ')

  // Экранирование скриптов и символов
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

    // Автоматически переходим на новую страницу, если на текущей странице уже есть 5 задач
    const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)
    if ((currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE < tasks.length) {
        currentPage = totalPages;
        tasksRender(tasks);
    }
  } else if (!escapedTaskText) {
    alert('Поле не может быть пустым или содержать только пробелы.')
  }
}

// Обработчики событий для добавления новой задачи
dom.add.onclick = addNewTask

dom.new.onkeyup = (event) => {
  if (event.key === 'Enter') {
    addNewTask()
  }
}

// Функция добавления задачи в список
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

// Функция проверки наличия задачи
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

// Функция рендера задач
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
          buttonClass += ' pagination__page-active'
      }
      paginationHtml += `<button class="${buttonClass}" data-page="${i}">${i}</button>`
    }

    dom.pagination.innerHTML = paginationHtml

  dom.tasks.innerHTML = htmlList
  renderTaskCount(list)
  
  dom.tasks.innerHTML = htmlList
  renderTaskCount(tasks)

}

// Обработчик событий для изменения статуса задачи и удаления задачи
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

// Функция подсчета количества задач
function renderTaskCount(list) {
  dom.count.innerHTML = list.length
  dom.notCompletedCount.innerHTML = list.filter((task) => !task.isComplete).length
  dom.completedCount.innerHTML = list.filter((task) => task.isComplete).length
}

// Функция пагинации
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

// Функция изменения статуса задачи
function changeTaskStatus(id, list) {
  list.forEach((task) => {
      if (task.id == id) {
          task.isComplete = !task.isComplete
      }
  })
}

// Функция удаления задачи
function deleteTask(id, list) {
  list.forEach((task, idx) => {
      if (task.id == id) {
          [...list] = list.splice(idx, 1)
      }
  })
}

// Обработчики событий для кнопок "Mark all" и "Delete completed"
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

// Функция фильтрации задач
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

// Обработчики событий для кнопок фильтрации
dom.filterAll.addEventListener('click', () => filterTasks('all'))
dom.filterActive.addEventListener('click', () => filterTasks('active'))
dom.filterCompleted.addEventListener('click', () => filterTasks('completed'))

// Обработчик событий для кнопки добавления задачи
dom.add.addEventListener('click', () => {
  const newTaskText = dom.new.value
  if(newTaskText) {
      addTask(newTaskText, tasks)
      dom.new.value = ''
      
      // Проверяем, нужно ли обновить текущую страницу
    const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)
    if (totalPages > currentPage) {
      currentPage = totalPages
    }

      tasksRender(tasks)
  }
})

// Обработчик событий для удаления задачи
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

// Обработчик событий для редактирования задачи
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

// Функция обновления текста задачи
function updateTaskText(id, newText, list) {
  
  // Удаление лишних пробелов
  const cleanedTaskText = _.trim(newText)
  const withoutExtraSpaces = _.trimEnd(_.trimStart(cleanedTaskText))

  // Замена множества пробелов подряд на один пробел
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

// Функция получения текста задачи по id
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