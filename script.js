
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const addtask = document.querySelector('#toggle-modal')
const modal = document.querySelector('.modal')
const modalBg = document.querySelector('.modal .bg')
const addtaskBtn = document.querySelector('.add-task-btn')

let taskData = {};
let tasks = document.querySelectorAll('.task');
let draggedEle = null;

function create_new_task(title, desc, col_type) {
  const div = document.createElement('div');
  div.classList.add('task');
  div.setAttribute('draggable', 'true');
  div.innerHTML = `
    <h3>${title}</h3>
    <h4>${desc}</h4>
    <button>Delete</button>
  `
  col_type.appendChild(div);
  div.addEventListener('drag', (e) => draggedEle = div);
  div.querySelector('button').addEventListener('click', () => {
    div.remove();
    update_task_count();
  })
  return div;
}

function update_task_count() {
  [todo, progress, done].forEach((col) => {
    const tasks = col.querySelectorAll('.task');
    const cnt = col.querySelector('.count');
    taskData[col.id] = Array.from(tasks).map(t => {
      return{
        title: t.querySelector('h3').innerText,
        desc: t.querySelector('h4').innerText
      }
    })
    //console.log(taskData);
    localStorage.setItem('taskData', JSON.stringify(taskData));
    cnt.innerText = tasks.length;
  })
}

if(localStorage.getItem('taskData')) {
  const data = JSON.parse(localStorage.getItem('taskData'));
  for(const col in data){
    const col_type = document.querySelector(`#${col}`); // col_type -> todo/progress/done
    data[col].forEach(task => {
      create_new_task(task.title, task.desc, col_type)
    })
    update_task_count();
  }
}

tasks.forEach((task) => {
  task.addEventListener('drag', (e) => {
    //console.log('dragging');
    draggedEle = task;
  })
})

function addDragEvents(col){
  col.addEventListener('dragenter', (e) => {
    e.preventDefault();
    col.classList.add("hover-over");
  })
  col.addEventListener('dragleave', (e) => {
    e.preventDefault();
    col.classList.remove("hover-over");
  })
  col.addEventListener('dragover', (e) => {
    e.preventDefault();
  })
  col.addEventListener('drop', (e) => {
    e.preventDefault();
    col.appendChild(draggedEle);
    col.classList.remove("hover-over");
    update_task_count();
  })
}

addDragEvents(todo);
addDragEvents(progress);
addDragEvents(done);

addtask.addEventListener('click', (e) => { modal.classList.toggle('active'); });
modalBg.addEventListener('click', () => modal.classList.remove('active'))

addtaskBtn.addEventListener('click', () => {
  const tasktitle = document.querySelector('#tasktitle').value;
  const taskDesc = document.querySelector('#taskdesc').value;
  create_new_task(tasktitle, taskDesc, todo)
  modal.classList.remove('active');
  update_task_count();
  document.querySelector('#tasktitle').value = "";
  document.querySelector('#taskdesc').value = "";
})