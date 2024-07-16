const dom = {
  new: document.getElementById('new'),
  add: document.getElementById('add'),
  tasks: document.getElementById('tasks'),
  count: document.getElementById('count'),
  pagination: document.querySelector('.todo__pagination'),
  page: document.querySelectorAll(".pagination__page"),
  notCompletedCount: document.getElementById('not-completed-count'), //////////
  completedCount: document.getElementById('completed-count'),
  markAll: document.getElementById('mark-all'),
  clearCompleted: document.getElementById('clear-completed'),
  filterAll: document.getElementById('filter-all'),
  filterActive: document.getElementById('filter-active'),
  filterCompleted: document.getElementById('filter-completed'),      //////////
}

const ITEMS_PER_PAGE = 5;

let tasks = [];
let currentPage = 1;

/////////////
function addNewTask() {
  const newTaskText = dom.new.value;
  if (newTaskText && isNotHaveTask(newTaskText, tasks)) {
    addTask(newTaskText, tasks);
    dom.new.value = '';
    tasksRender(tasks);
    dom.new.focus();
  }
}

dom.add.onclick = addNewTask;

dom.new.onkeyup = (event) => {
  if (event.key === 'Enter') {
    addNewTask();
  }
};

function addTask(text, list) {
  const timestamp = Date.now();
  const task = {
    id: timestamp,
    text,
    isComplete: false,
  };
  list.push(task);
}

function isNotHaveTask(text, list) {
  let isNoteHave = true;

  list.forEach((task) => {
    if (task.text === text) {
      alert('Задача уже существует!');
      isNoteHave = false;
    }
  });

  return isNoteHave;
} 
/////////////

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
          <div class="todo__task-text" ondblclick="editTask(${task.id}, tasks, this)">${task.text}</div>
          
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
  //////////
  dom.tasks.innerHTML = htmlList;
  renderTaskCount(tasks);
  //////////
}

///////////
dom.tasks.onclick = (event) => {
  const target = event.target;
  const isCheckboxEL = target.classList.contains('todo__checkbox-div');
  const isDeleteEL = target.classList.contains('todo__task-del');

  if (isCheckboxEL) {
    const task = target.parentElement.parentElement;
    const taskId = task.getAttribute('id');
    changeTaskStatus(taskId, tasks);
    tasksRender(tasks);
  }
  if (isDeleteEL) {
    const task = target.parentElement;
    const taskId = task.getAttribute('id');
    deleteTask(taskId, tasks);
    tasksRender(tasks);
  }
};
///////////

function renderTaskCount(list) {
  dom.count.innerHTML = list.length
  dom.notCompletedCount.innerHTML = list.filter((task) => !task.isComplete).length;
  dom.completedCount.innerHTML = list.filter((task) => task.isComplete).length;
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

///////
dom.markAll.onclick = () => {
  const isAllTasksCompleted = tasks.every((task) => task.isComplete);
  tasks.forEach((task) => {
    task.isComplete = !isAllTasksCompleted;
  });
  tasksRender(tasks);
};

dom.clearCompleted.onclick = () => {
  const filteredTasks = tasks.filter((task) => !task.isComplete);
  tasks = filteredTasks;
  tasksRender(filteredTasks);
  renderTaskCount(filteredTasks);
};

function filterTasks(filter) {

  let filteredTasks = [];

  if (filter === 'all') {
    filteredTasks = tasks;
  } else if (filter === 'active') {
    filteredTasks = tasks.filter((task) => !task.isComplete);
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter((task) => task.isComplete);
  }

  tasksRender(filteredTasks);
}

dom.filterAll.addEventListener('click', () => filterTasks('all'));
dom.filterActive.addEventListener('click', () => filterTasks('active'));
dom.filterCompleted.addEventListener('click', () => filterTasks('completed'));
///////

dom.add.addEventListener('click', event => {
  const newTaskText = dom.new.value
  if(newTaskText) {
      addTask(newTaskText, tasks)
      dom.new.value = ''
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

///////
tasksRender(tasks);
///////
