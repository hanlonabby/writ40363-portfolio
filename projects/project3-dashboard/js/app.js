// ==========================================
// PROJECT 3: PERSONAL DATA DASHBOARD
// LAB16-20
// ==========================================

console.log('Dashboard app loaded!');

// ---------------- WEATHER WIDGET ----------------

function loadWeather() {
  console.log('🌤️ Loading weather data...');

  const weatherDisplay = document.getElementById('weather-display');
  // Optional: nicer loading text
  weatherDisplay.textContent = 'Weather in Chicago, IL right now...';

  fetch('./data/weather.json')
    .then(response => {
      console.log('✅ Got response:', response);

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.status);
      }

      return response.json();
    })
    .then(data => {
      console.log('✅ Weather data loaded:', data);
      displayWeather(data);
    })
    .catch(error => {
      console.error('❌ Error loading weather:', error);
      displayWeatherError();
    });
}

function displayWeather(weather) {
  console.log('📊 Displaying weather data...');

  const weatherDisplay = document.getElementById('weather-display');

  weatherDisplay.innerHTML = `
    <div class="weather-current">
      <div class="weather-icon">${weather.icon}</div>
      <div class="weather-temp">${weather.temperature}°F</div>
      <div class="weather-location">${weather.location}</div>
      <div class="weather-condition">${weather.condition}</div>
    </div>
    <div class="weather-details">
      <div class="weather-detail">
        <span>💧 Humidity</span>
        <strong>${weather.humidity}%</strong>
      </div>
      <div class="weather-detail">
        <span>💨 Wind Speed</span>
        <strong>${weather.windSpeed} mph</strong>
      </div>
      <div class="weather-detail">
        <span>🌡️ Feels Like</span>
        <strong>${weather.feelsLike}°F</strong>
      </div>
    </div>
  `;

  console.log('✅ Weather displayed successfully!');
}

function displayWeatherError() {
  const weatherDisplay = document.getElementById('weather-display');

  weatherDisplay.innerHTML = `
    <div class="error-message">
      <div class="error-icon">⚠️</div>
      <p>Could not load weather data</p>
      <p class="error-hint">Check console for details</p>
    </div>
  `;
}

// ---------------- QUOTES WIDGET ----------------

let allQuotes = [];
let currentQuoteIndex = -1;

function loadQuotes() {
  console.log('Loading quotes...');

  fetch('./data/quotes.json')
    .then(response => {
      console.log('Got quotes response:', response);

      if (!response.ok) {
        throw new Error('Quotes response was not ok ' + response.status);
      }

      return response.json();
    })
    .then(data => {
      console.log('Quotes data:', data);
      allQuotes = data;
      displayRandomQuote();
    })
    .catch(error => {
      console.error('Error loading quotes:', error);
      displayQuotesError();
    });
}

function displayRandomQuote() {
  if (allQuotes.length === 0) {
    console.error('No quotes available');
    return;
  }

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * allQuotes.length);
  } while (randomIndex === currentQuoteIndex && allQuotes.length > 1);

  currentQuoteIndex = randomIndex;
  const quote = allQuotes[randomIndex];

  const quotesDisplay = document.getElementById('quotes-display');
  quotesDisplay.innerHTML = `
    <div class="quote-card">
      <div class="quote-text">"${quote.text}"</div>
      <div class="quote-author">— ${quote.author}</div>
    </div>
  `;

  console.log('Displayed quote:', quote);
}

function displayQuotesError() {
  const quotesDisplay = document.getElementById('quotes-display');
  quotesDisplay.innerHTML = `
    <div class="error-message">
      ⚠️ Could not load quotes
    </div>
  `;
}

function setupQuotesButton() {
  const newQuoteBtn = document.getElementById('new-quote-btn');

  if (!newQuoteBtn) {
    console.error('New quote button not found');
    return;
  }

  newQuoteBtn.addEventListener('click', () => {
    console.log('New quote button clicked!');
    displayRandomQuote();
  });
}

// ---------------- TASKS WIDGET ----------------

function loadTasks() {
  const tasksJSON = localStorage.getItem('dashboardTasks');
  return tasksJSON ? JSON.parse(tasksJSON) : [];
}

function saveTasks(tasks) {
  localStorage.setItem('dashboardTasks', JSON.stringify(tasks));
  console.log('Tasks saved:', tasks);
}

function displayTasks() {
  const tasks = loadTasks();
  const tasksList = document.getElementById('tasks-list');

  if (tasks.length === 0) {
    tasksList.innerHTML = `
      <div class="no-tasks">
        No tasks yet. Add one above! ✨
      </div>
    `;
    updateTaskStats(tasks);
    return;
  }

  tasksList.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(index));

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(index));

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteBtn);

    tasksList.appendChild(taskItem);
  });

  updateTaskStats(tasks);
}

function addTask(taskText) {
  const tasks = loadTasks();

  const newTask = {
    text: taskText,
    completed: false,
    id: Date.now()
  };

  tasks.push(newTask);
  saveTasks(tasks);
  displayTasks();

  console.log('Task added:', newTask);
}

function setupTaskForm() {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText) {
      addTask(taskText);
      taskInput.value = '';
      taskInput.focus();
    }
  });
}

function toggleTask(index) {
  const tasks = loadTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  displayTasks();

  console.log('Task toggled:', tasks[index]);
}

function deleteTask(index) {
  const tasks = loadTasks();
  const taskToDelete = tasks[index];

  if (confirm(`Delete task: "${taskToDelete.text}"?`)) {
    tasks.splice(index, 1);
    saveTasks(tasks);
    displayTasks();

    console.log('Task deleted');
  }
}

function updateTaskStats(tasks) {
  const statsDiv = document.getElementById('task-stats');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  if (totalTasks === 0) {
    statsDiv.innerHTML = '';
    return;
  }

  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  statsDiv.innerHTML = `
    <div class="stat">Total: <strong>${totalTasks}</strong></div>
    <div class="stat">Completed: <strong>${completedTasks}</strong></div>
    <div class="stat">Pending: <strong>${pendingTasks}</strong></div>
    <div class="stat">Progress: <strong>${completionPercentage}%</strong></div>
  `;
}

// ---------------- THEME TOGGLE ----------------

function initializeTheme() {
  const savedTheme = localStorage.getItem('dashboardTheme');

  if (savedTheme === 'dark') {
    document.body.classList.add('theme-dark');
    updateThemeIcon('dark');
  } else {
    updateThemeIcon('light');
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('theme-dark');

  localStorage.setItem('dashboardTheme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark ? 'dark' : 'light');

  console.log('Theme switched to:', isDark ? 'dark' : 'light');
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('.theme-icon');

  if (!themeIcon) return;

  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  } else {
    console.error('Theme toggle button not found');
  }
}


initializeTheme();
setupThemeToggle();
loadWeather();
loadQuotes();
displayTasks();
setupTaskForm();
setupQuotesButton();
