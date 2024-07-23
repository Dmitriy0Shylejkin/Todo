const dom = {
    new: document.getElementById('new'),
    add: document.getElementById('add'),
    tasks: document.getElementById('tasks'),
    tasksText: document.querySelectorAll('.todo__task-text'),
    pagination: document.querySelector('.todo__pagination'),
    page: document.querySelectorAll(".pagination__page"),
    countAll: document.getElementById('count__all'),
    countCompleted: document.getElementById('count__completed'),
    countNotCompleted: document.getElementById('count__notcompleted'),
    completeAll: document.getElementById('completeAll'),
    deleteAll: document.querySelector('.btn__delete-completed'),
    showAll: document.querySelector('.btn__all'),
    showActive: document.querySelector('.btn__completed'),
    showCompleted: document.querySelector('.btn__notcompleted'),
}

const ITEMS_PER_PAGE = 5;

let tasks = [];
let currentPage = 1;
let showTasksType = 'all';

function tasksRender(list) {
    const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
    let htmlList = ''
    let paginationHtml = '';

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const tasksToShow = list.filter((task) => {
        if (showTasksType === 'active') {
          return task.isComplete; 
        } if (showTasksType === 'completed') {
          return !task.isComplete;
        } return true;
      });
    const currentTasks = tasksToShow.slice(startIndex, endIndex);

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
    if (list.length) {
        dom.countAll.innerHTML = list.length;
        dom.countCompleted.innerHTML = list.filter((task) => !!task.isComplete).length;
        dom.countNotCompleted.innerHTML = list.filter((task) => !task.isComplete).length;
    } else {
        dom.countAll.innerHTML = "";
        dom.countCompleted.innerHTML = "";
        dom.countNotCompleted.innerHTML = "";
    }
}

function completeAllTasks(event) {
    if (tasks.length) {
        tasks = tasks.map((task) => {
            task.isComplete = event.target.checked;
            return task;
        });
        tasksRender(tasks);
    }
}

function deleteCompletedTasks(event) {
    tasks = tasks.filter((task) => !task.isComplete);
    tasksRender(tasks);
}

function tasksPagination(event) {
  if (event.target.classList.contains('pagination__page')) {
    currentPage = Number(event.target.dataset.page);
    tasksRender(tasks);
  }
}

function addTask(text, list) {
    const task = {
        id: Date.now(),
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

function showTasks(type) {
    switch (type) {
      case 'all':
        showTasksType = 'all';
        break;
      case 'active':
        showTasksType = 'active';
        break;
      case 'completed':
        showTasksType = 'completed';
        break;
      default:
        showTasksType = 'all';
    }
  }
  
  function handleAllTasks() {
    showTasks('all');
    tasksRender(tasks);
  }
  
  function handleActiveTasks() {
    showTasks('active');
    tasksRender(tasks);
  }
  
  function handleCompletedTasks() {
    showTasks('completed');
    tasksRender(tasks);
  }

dom.add.addEventListener('click', () => {
    const newTaskText = dom.new.value
    if(newTaskText) {
        addTask(newTaskText, tasks)
        dom.new.value = ''
        tasksRender(tasks)
    }
})


dom.tasks.addEventListener('dblclick', event => {
    const target = event.target;
    const isTaskText = target.classList.contains('todo__task-text');
    console.log(target)
  
    if (isTaskText) {
      const task = target.parentElement;
      const taskId = task.getAttribute('id');
      const taskText = task.querySelector('.todo__task-text');
      const taskTextEdit = task.querySelector('.todo__task-text_edit');
  
      if (taskTextEdit.hasAttribute('contenteditable')) {
        taskText.textContent = taskTextEdit.textContent;
        taskTextEdit.removeAttribute('contenteditable');
        taskTextEdit.classList.remove('todo__task-text_edit_active');
      } else {
        taskTextEdit.textContent = taskText.textContent;
        taskTextEdit.setAttribute('contenteditable', true);
        taskTextEdit.classList.add('todo__task-text_edit_active');
        taskTextEdit.focus();
  
        taskTextEdit.addEventListener('keydown', event => {
          if (event.key === 'Enter') {
            taskText.textContent = taskTextEdit.textContent;
            taskTextEdit.removeAttribute('contenteditable');
            taskTextEdit.classList.remove('todo__task-text_edit_active');
          }
        });
  
        taskTextEdit.addEventListener('keydown', event => {
          if (event.key === 'Escape') {
            taskTextEdit.textContent = taskText.textContent;
            taskTextEdit.removeAttribute('contenteditable');
            taskTextEdit.classList.remove('todo__task-text_edit_active');
      }})
}}
});

dom.new.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      const newTaskText = dom.new.value.trim();
      if (newTaskText) {
        addTask(newTaskText, tasks);
        dom.new.value = '';
        tasksRender(tasks);
      }
    }
  });

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

dom.showAll.addEventListener('click', handleAllTasks);
dom.showActive.addEventListener('click', handleActiveTasks);
dom.showCompleted.addEventListener('click', handleCompletedTasks);
dom.completeAll.addEventListener("change", completeAllTasks);
dom.deleteAll.addEventListener('click', deleteCompletedTasks);

dom.pagination.addEventListener("click", tasksPagination);  
