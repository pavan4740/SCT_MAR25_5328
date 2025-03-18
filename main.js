// Navigation
const nav = document.getElementById('mainNav');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.style.background = 'rgba(255, 255, 255, 0.95)';
    nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  } else {
    nav.style.background = 'transparent';
    nav.style.boxShadow = 'none';
  }
});

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Calculator
const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

function updateDisplay() {
  const display = document.querySelector('.current-operand');
  display.textContent = calculator.displayValue;
}

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand) {
    calculator.displayValue = '0.';
    calculator.waitingForSecondOperand = false;
    return;
  }

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand === null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
  switch (operator) {
    case '+':
      return firstOperand + secondOperand;
    case '-':
      return firstOperand - secondOperand;
    case '×':
      return firstOperand * secondOperand;
    case '÷':
      return firstOperand / secondOperand;
    default:
      return secondOperand;
  }
}

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}

document.querySelector('.calculator').addEventListener('click', (event) => {
  const { target } = event;
  if (!target.matches('button')) return;

  if (target.classList.contains('operator')) {
    if (target.textContent === 'C') {
      resetCalculator();
      updateDisplay();
      return;
    }
    handleOperator(target.textContent);
    updateDisplay();
    return;
  }

  if (target.classList.contains('equals')) {
    handleOperator('=');
    updateDisplay();
    return;
  }

  if (target.textContent === '.') {
    inputDecimal(target.textContent);
    updateDisplay();
    return;
  }

  inputDigit(target.textContent);
  updateDisplay();
});

// Quiz
const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2
  }
];

let currentQuestion = 0;
let score = 0;

function loadQuestion() {
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const currentQuestionData = questions[currentQuestion];

  questionEl.textContent = currentQuestionData.question;
  optionsEl.innerHTML = '';

  currentQuestionData.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option';
    button.textContent = option;
    button.addEventListener('click', () => selectAnswer(index));
    optionsEl.appendChild(button);
  });

  document.getElementById('currentQuestion').textContent = currentQuestion + 1;
  document.getElementById('totalQuestions').textContent = questions.length;
  document.getElementById('score').textContent = score;
}

function selectAnswer(selectedIndex) {
  const options = document.querySelectorAll('.option');
  const correctIndex = questions[currentQuestion].correctAnswer;

  options.forEach(option => option.disabled = true);
  
  if (selectedIndex === correctIndex) {
    options[selectedIndex].classList.add('correct');
    score++;
  } else {
    options[selectedIndex].classList.add('wrong');
    options[correctIndex].classList.add('correct');
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }, 1000);
}

function showResult() {
  document.querySelector('.quiz-content').style.display = 'none';
  document.querySelector('.quiz-result').classList.remove('hidden');
  document.getElementById('finalScore').textContent = score;
  document.getElementById('totalScore').textContent = questions.length;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  document.querySelector('.quiz-content').style.display = 'block';
  document.querySelector('.quiz-result').classList.add('hidden');
  loadQuestion();
}

document.querySelector('.restart-button').addEventListener('click', restartQuiz);
loadQuestion();

// Todo List
class TodoList {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    this.form = document.getElementById('todo-form');
    this.input = document.getElementById('todo-input');
    this.list = document.getElementById('todo-list');

    this.form.addEventListener('submit', (e) => this.addTodo(e));
    this.renderTodos();
  }

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  addTodo(e) {
    e.preventDefault();
    const text = this.input.value.trim();
    if (text) {
      this.todos.push({
        id: Date.now().toString(),
        text,
        completed: false
      });
      this.input.value = '';
      this.saveTodos();
      this.renderTodos();
    }
  }

  toggleTodo(id) {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.saveTodos();
    this.renderTodos();
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
    this.renderTodos();
  }

  renderTodos() {
    this.list.innerHTML = '';
    this.todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''}>
        <span>${todo.text}</span>
        <button class="delete-btn">❌</button>
      `;

      const checkbox = li.querySelector('input');
      checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

      const deleteBtn = li.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

      this.list.appendChild(li);
    });
  }
}

new TodoList();