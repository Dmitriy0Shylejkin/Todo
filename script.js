// DOM elements
  const input = document.getElementById('input');
  const add = document.getElementById('add');
  const container = document.getElementById('container');
  const count = document.getElementById('count');
  const pagination = document.querySelector('.todo__pagination');
  const page = document.querySelectorAll(".pagination__page");
  const notCompletedCount = document.getElementById('not-completed-count');
  const completedCount = document.getElementById('completed-count');
  const markAll = document.getElementById('mark-all');
  const clearCompleted = document.getElementById('clear-completed');
  const filterAll = document.getElementById('filter-all');
  const filterActive = document.getElementById('filter-active');
  const filterCompleted = document.getElementById('filter-completed');

// Constants
const ITEMS_PER_PAGE = 5;

// Variables
let tasks = [];
let currentPage = 1;
let currentFilter = 'all';
let editableTask = null;

// The function of adding a new task
const addNewTask = () => {
  const newTaskText = getCleanedTaskText(input.value)

  if (newTaskText && isNotHaveTask(newTaskText, tasks)) {
    addTask(newTaskText, tasks)
    input.value = '';
    tasksRender(tasks)
    input.focus()

    // Automatically go to a new page
    const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)
    if ((currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE < tasks.length) {
        currentPage = totalPages;
        tasksRender(tasks);
    }
    
  }
}

// The function of adding a task to the list
const addTask = (text, list) => {
  const timestamp = Date.now();
  const task = {
    id: timestamp,
    text,
    isComplete: false,
  }
  list.push(task)
  return timestamp;
}

// Task availability check function
const isNotHaveTask = (text, list) => {
  let isNoteHave = true

  list.forEach((task) => {
    if (task.text === text) {
      alert('Задача уже существует!')
      isNoteHave = false
    }
  })

  return isNoteHave
}

// Function to clean and escape task text
const getCleanedTaskText = (taskText) => {
  const cleanedTaskText = _.trim(taskText);
  const withoutExtraSpaces = _.trimEnd(_.trimStart(cleanedTaskText));
  const singleSpaces = withoutExtraSpaces.replace(/\s+/g, ' ');
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
  return singleSpaces.replace(/[&<>"'#%:?*]/g, (m) => map[m]);
}

const tasksSample = (list) => {
  const cls = list.isComplete ? 'todo__task todo__task_complete' : 'todo__task';
  const checked = list.isComplete ? 'checked' : '';

  return `
      <div id="${list.id}" class="${cls}">
          <label class="todo__checkbox">
               <input type="checkbox" ${checked}>
              <div class="todo__checkbox-div"></div>
          </label>
          <div class="todo__task-text" contenteditable="false">${list.text}</div>
          <div class="todo__task-del">-</div>
       </div>
      `
}

// Task rendering function
const tasksRender = (list) => {
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE)
  let htmlList = ''
  let paginationHtml = ''

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTasks = list.slice(startIndex, endIndex)

  currentTasks.forEach((task) => {
      const taskHtml = tasksSample(task);
      htmlList = htmlList + taskHtml
  })

  for (let i = 1; i <= totalPages; i++) {
      let buttonClass = 'pagination__page'
      if (i === currentPage) {
          buttonClass += ' pagination__page--active'
      }
      paginationHtml += `<button class="${buttonClass}" data-page="${i}">${i}</button>`
    }

    pagination.innerHTML = paginationHtml
    container.innerHTML = htmlList
    renderTaskCount(tasks)
}

// Task count function
const renderTaskCount = (list) => {
  count.innerHTML = list.length;
  notCompletedCount.innerHTML = list.filter((task) => !task.isComplete).length;
  completedCount.innerHTML = list.filter((task) => task.isComplete).length;
}

// Pagination function
const tasksPagination = (event) => {
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
const changeTaskStatus = (id, list) => {
  list.forEach((task, i, array) => {
      if (task.id == id) {
          task.isComplete = !task.isComplete
      }
  })
}

// Task deletion function
const deleteTask = (id, list) => {
  list.forEach((task, idx) => {
      if (task.id == id) {
          [...list] = list.splice(idx, 1)
      }
  })
}

// Task filtering function
const filterTasks = (filter) => {
  currentFilter = filter;

  let filteredTasks = [];

  if (currentFilter === 'all') {
    filteredTasks = tasks
  } else if (currentFilter === 'active') {
    filteredTasks = tasks.filter((task) => !task.isComplete)
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter((task) => task.isComplete)
  }

  tasksRender(filteredTasks)
}

// The function of getting the task text by id
const getTaskTextById = (id, list) => {
  let taskText = '';
  list.forEach((task) => {
    if (task.id == id) {
      taskText = task.text
    }
  })
  return taskText;
}


// Event handlers for filtering buttons
filterAll.addEventListener('click', () => filterTasks('all'))
filterActive.addEventListener('click', () => filterTasks('active'))
filterCompleted.addEventListener('click', () => filterTasks('completed'))

// Event handler for the add task button
add.addEventListener('click', () => {
  console.log(input);
  const newTaskText = getCleanedTaskText(input.value)
  if(newTaskText) {
      addTask(newTaskText, tasks)
      input.value = ''

      // Checking whether the current page needs to be updated
    const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)
    if (totalPages > currentPage) {
      currentPage = totalPages
    }

      tasksRender(tasks)
  }
})

// Event handler for deleting a task
container.addEventListener('click', (event) => {
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
container.addEventListener('dblclick', (event) => {
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
    const newText = getCleanedTaskText(editableTask.textContent.trim())
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
    const newText = getCleanedTaskText(editableTask.textContent.trim())
    if (newText !== '') {
      updateTaskText(editableTask.parentNode.id, newText, tasks)
      tasksRender(tasks)
    }
    editableTask.contentEditable = false
    editableTask = null
  }
})

// // Task text update function
const updateTaskText = (id, newText, list) => {
  if (newText) {
    list.forEach((task) => {
      if (task.id == id) {
        task.text = newText;
      }
    })
  } else {
    alert('Поле не может быть пустым или содержать только пробелы.')
  }
}

// Event handlers for the "Mark all" and "Delete completed" buttons
markAll.addEventListener('click', () => {
  const isAllTasksCompleted = tasks.every((task) => task.isComplete)
  tasks.forEach((task) => {
    task.isComplete = !isAllTasksCompleted
  })
  tasksRender(tasks)
})

clearCompleted.addEventListener('click', () => {
  const filteredTasks = tasks.filter((task) => !task.isComplete)
  tasks = filteredTasks
  tasksRender(filteredTasks)
  renderTaskCount(filteredTasks)
})

// Event handler for changing the status of a task and deleting a task
container.addEventListener('click', (event) => {
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

// Event handler for pagination
pagination.addEventListener("click", tasksPagination);

// Event handlers for adding a new task
add.addEventListener('click', addNewTask);

input.addEventListener('keyup', (event) => {
  if (event.code === 'Enter') {
    addNewTask();
  }
});

// Initializing the task renderer
tasksRender(tasks)
