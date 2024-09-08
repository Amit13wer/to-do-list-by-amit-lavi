// Function to generate a unique ID for each task
function generateTaskId() {
    return `task-${Date.now()}`;
}

// Function to handle overdue tasks
function handleOverdueTasks(taskElement, dueDate) {
    if (dueDate && new Date(dueDate) < new Date()) {
        taskElement.classList.add('overdue');
    } else {
        taskElement.classList.remove('overdue');
    }
}

// Function to add a new task
function addTask() {
    const taskText = document.getElementById('task-input').value.trim();
    const priority = document.getElementById('priority-select').value;
    const category = document.getElementById('category-select').value;
    const dueDate = document.getElementById('due-date-input').value;

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const listItem = document.createElement('li');
    listItem.textContent = `${taskText} ${dueDate ? `(Due: ${dueDate})` : ''}`;
    listItem.classList.add(priority, category);
    listItem.dataset.id = generateTaskId(); // Add unique ID

    handleOverdueTasks(listItem, dueDate); // Check for overdue tasks

    listItem.addEventListener('click', handleTaskClick); // Attach click event

    document.getElementById('todo-list').appendChild(listItem);
    saveTasks();

    // Clear input fields
    document.getElementById('task-input').value = '';
    document.getElementById('priority-select').value = 'low';
    document.getElementById('category-select').value = 'work';
    document.getElementById('due-date-input').value = '';
}

// Function to handle task clicks
function handleTaskClick(event) {
    const taskElement = event.currentTarget;
    showEditModal(taskElement);
}

// Function to show the edit modal with task details
function showEditModal(taskElement) {
    document.getElementById('edit-task-text').value = taskElement.textContent.split(' (Due:')[0];
    const dueDateText = taskElement.textContent.split(' (Due:')[1]?.replace(')', '');
    document.getElementById('edit-task-due-date').value = dueDateText || '';
    document.getElementById('edit-task-priority').value = taskElement.classList.contains('high') ? 'high' : (taskElement.classList.contains('medium') ? 'medium' : 'low');
    document.getElementById('edit-task-category').value = taskElement.classList.contains('work') ? 'work' : (taskElement.classList.contains('personal') ? 'personal' : 'study');
    document.getElementById('edit-task-modal').style.display = 'flex';
    document.getElementById('save-edit-task-btn').onclick = () => saveTaskChanges(taskElement);
}

// Function to save task changes
function saveTaskChanges(taskElement) {
    const updatedText = document.getElementById('edit-task-text').value.trim();
    const updatedDueDate = document.getElementById('edit-task-due-date').value;
    const updatedPriority = document.getElementById('edit-task-priority').value;
    const updatedCategory = document.getElementById('edit-task-category').value;

    taskElement.textContent = `${updatedText} ${updatedDueDate ? `(Due: ${updatedDueDate})` : ''}`;
    taskElement.className = updatedPriority; // Update priority
    taskElement.classList.add(updatedCategory); // Update category

    handleOverdueTasks(taskElement, updatedDueDate); // Check for overdue tasks

    document.getElementById('edit-task-modal').style.display = 'none';
    saveTasks();
}

// Function to close the edit modal
document.querySelector('.modal .close').addEventListener('click', () => {
    document.getElementById('edit-task-modal').style.display = 'none';
});

// Function to save tasks to localStorage
function saveTasks() {
    const tasks = Array.from(document.getElementById('todo-list').children).map(task => ({
        text: task.textContent,
        priority: Array.from(task.classList).find(cls => ['low', 'medium', 'high'].includes(cls)),
        category: Array.from(task.classList).find(cls => ['work', 'personal', 'study'].includes(cls)),
        dueDate: task.textContent.includes('Due:') ? task.textContent.split('Due: ')[1] : ''
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.textContent = `${task.text} ${task.dueDate ? `(Due: ${task.dueDate})` : ''}`;
        listItem.classList.add(task.priority, task.category);
        handleOverdueTasks(listItem, task.dueDate); // Check for overdue tasks
        listItem.addEventListener('click', handleTaskClick); // Attach click event
        document.getElementById('todo-list').appendChild(listItem);
    });
}

// Function to handle task filtering
function filterTasks() {
    const categoryFilter = document.getElementById('filter-category').value;
    const statusFilter = document.getElementById('filter-status').value;
    const dueDateFilter = document.getElementById('filter-due-date').value;

    const today = new Date().toISOString().split('T')[0];
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to the start of the week (Sunday)
    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay())); // Set to the end of the week (Saturday)
    const startOfMonth = new Date();
    startOfMonth.setDate(1); // Set to the start of the month

    Array.from(document.getElementById('todo-list').children).forEach(task => {
        const isCategoryMatch = categoryFilter === 'all' || task.classList.contains(categoryFilter);
        const isStatusMatch = statusFilter === 'all' || (statusFilter === 'completed' && task.classList.contains('completed')) || (statusFilter === 'incomplete' && !task.classList.contains('completed'));
        const dueDateText = task.textContent.split(' (Due:')[1]?.replace(')', '');
        const isDueDateMatch = dueDateFilter === 'all' ||
            (dueDateFilter === 'today' && dueDateText === today) ||
            (dueDateFilter === 'this-week' && new Date(dueDateText) >= startOfWeek && new Date(dueDateText) <= endOfWeek) ||
            (dueDateFilter === 'this-month' && new Date(dueDateText) >= startOfMonth && new Date(dueDateText) < new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1));

        task.style.display = isCategoryMatch && isStatusMatch && isDueDateMatch ? '' : 'none';
    });
}

// Function to handle clearing all tasks
function clearTasks() {
    document.getElementById('todo-list').innerHTML = '';
    localStorage.removeItem('tasks');
}

// Event listeners for filters and clear button
document.getElementById('filter-category').addEventListener('change', filterTasks);
document.getElementById('filter-status').addEventListener('change', filterTasks);
document.getElementById('filter-due-date').addEventListener('change', filterTasks);
document.getElementById('clear-tasks-btn').addEventListener('click', clearTasks);

// Event listener for adding tasks
document.getElementById('add-task-btn').addEventListener('click', addTask);

// Load tasks and apply filters on page load
window.onload = () => {
    loadTasks();
    filterTasks();
};








