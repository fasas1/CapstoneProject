// DOM elements
const authSection = document.getElementById('authSection');
const taskSection = document.getElementById('taskSection');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const deadlineInput = document.getElementById('deadline');
const priorityInput = document.getElementById('priority');

// Event listeners for toggling forms
showSignup.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

showLogin.addEventListener('click', () => {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            authSection.classList.add('hidden');
            taskSection.classList.remove('hidden');
        } else {
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        alert('An error occurred during login. Please try again later.');
    }
});
 

// Handle Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('http://localhost:4000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            alert('Registration successful! Please log in.');
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        } else {
            alert('Signup failed. Please try again.');
        }
    } catch (error) {
        alert('An error occurred during signup. Please try again later.');
    }
});

// Handle Task Creation
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const deadline = deadlineInput.value;
    const priority = priorityInput.value;

    if (!title || !deadline || !priority) {
        alert('Title, deadline, and priority are required.');
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description, deadline, priority }),
        });

        if (response.ok) {
            const task = await response.json();
            renderTask(task);
            taskForm.reset();
        } else {
            const errorData = await response.json();
            alert(`Failed to create task: ${errorData.msg || 'Unknown error'}`);
        }
    } catch (error) {
        alert('An error occurred while creating the task. Please try again.');
    }
});

// Render Task in Task List
// function renderTask(task) {
//     const taskDiv = document.createElement('div');
//     taskDiv.innerHTML = `
//         <h3>${task.title}</h3>
//         <p>${task.description}</p>
//         <p>Deadline: ${task.deadline}</p>
//         <p>Priority: ${task.priority}</p>
//     `;
//     taskList.appendChild(taskDiv);
// }

// Render a task
function renderTask(task) {
    const taskList = document.getElementById('taskList');
    
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.id = `task-${task.id}`;
  
    taskDiv.innerHTML = `
      <div>
        <p><strong>Title:</strong> ${task.title}</p>
        <p><strong>Description:</strong> ${task.description}</p>
        <p><strong>Deadline:</strong> ${task.deadline}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
      </div>
      <div class="task-actions">
        <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
  
    taskList.appendChild(taskDiv);
  }
  
  // Edit a task
  async function editTask(taskId) {
    const taskDiv = document.getElementById(`task-${taskId}`);
    const token = localStorage.getItem('token');

    const title = prompt('Edit Task Title:', taskDiv.querySelector('p:nth-child(1)').innerText.split(': ')[1]);
    const description = prompt('Edit Task Description:', taskDiv.querySelector('p:nth-child(2)').innerText.split(': ')[1]);
    const deadline = prompt('Edit Deadline:', taskDiv.querySelector('p:nth-child(3)').innerText.split(': ')[1]);
    const priority = prompt('Edit Priority (low, medium, high):', taskDiv.querySelector('p:nth-child(4)').innerText.split(': ')[1]);

    if (!title || !deadline || !priority) {
        alert('Title, deadline, and priority are required.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description, deadline, priority }),
        });

        if (response.ok) {
            const updatedTask = await response.json();
            taskDiv.querySelector('p:nth-child(1)').innerText = `Title: ${updatedTask.title}`;
            taskDiv.querySelector('p:nth-child(2)').innerText = `Description: ${updatedTask.description}`;
            taskDiv.querySelector('p:nth-child(3)').innerText = `Deadline: ${updatedTask.deadline}`;
            taskDiv.querySelector('p:nth-child(4)').innerText = `Priority: ${updatedTask.priority}`;
        } else {
            alert('Failed to edit task. Please try again.');
        }
    } catch (error) {
        alert('An error occurred while editing the task. Please try again.');
    }
}

  // Delete a task
  async function deleteTask(taskId) {
    const token = localStorage.getItem('token');

    if (confirm('Are you sure you want to delete this task?')) {
        try {
            const response = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                document.getElementById(`task-${taskId}`).remove();
            } else {
                const errorData = await response.json();
                alert(`Failed to delete task: ${errorData.msg || 'Unknown error'}`);
            }
        } catch (error) {
            alert('An error occurred while deleting the task. Please try again.');
        }
    }
}

  
