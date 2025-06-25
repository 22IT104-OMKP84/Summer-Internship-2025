// Quiz questions data
const quizData = [
    {
        question: "What is the capital of France?",
        answers: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    {
        question: "What is the largest mammal in the world?",
        answers: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correct: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        answers: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: ["Ag", "Fe", "Au", "Cu"],
        correct: 2
    }
];

// Quiz state
let currentQuestion = 0;
let score = 0;
let quizCompleted = false;

// DOM Elements
const questionEl = document.getElementById('question');
const answersList = document.querySelector('.answers-list');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');

// Initialize quiz
function initQuiz() {
    showQuestion();
    updateProgressBar();
    nextBtn.addEventListener('click', handleNextQuestion);
}

// Display current question
function showQuestion() {
    const question = quizData[currentQuestion];
    questionEl.textContent = question.question;
    
    // Clear previous answers
    answersList.innerHTML = '';
    
    // Create answer buttons
    question.answers.forEach((answer, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.dataset.index = index;
        
        const marker = document.createElement('span');
        marker.className = 'option-marker';
        marker.textContent = String.fromCharCode(65 + index); // A, B, C, D
        
        button.appendChild(marker);
        button.appendChild(document.createTextNode(answer));
        
        button.addEventListener('click', () => handleAnswer(index));
        li.appendChild(button);
        answersList.appendChild(li);
    });
    
    // Reset feedback and next button
    feedbackEl.textContent = '';
    nextBtn.style.display = 'none';
    nextBtn.disabled = true;
}

// Handle answer selection
function handleAnswer(selectedIndex) {
    const question = quizData[currentQuestion];
    const buttons = document.querySelectorAll('.answer-btn');
    
    // Disable all buttons
    buttons.forEach(button => {
        button.disabled = true;
        button.classList.remove('selected');
    });
    
    // Mark selected answer
    buttons[selectedIndex].classList.add('selected');
    
    // Check if answer is correct
    if (selectedIndex === question.correct) {
        buttons[selectedIndex].classList.add('correct');
        feedbackEl.textContent = 'Correct! Well done!';
        feedbackEl.style.color = 'var(--success-color)';
        score++;
    } else {
        buttons[selectedIndex].classList.add('incorrect');
        buttons[question.correct].classList.add('correct');
        feedbackEl.textContent = `Incorrect. The correct answer is ${question.answers[question.correct]}`;
        feedbackEl.style.color = 'var(--error-color)';
    }
    
    // Show next button
    nextBtn.style.display = 'inline-flex';
    nextBtn.disabled = false;
    
    // Update score
    updateScore();
}

// Handle next question
function handleNextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < quizData.length) {
        showQuestion();
        updateProgressBar();
    } else {
        showQuizResults();
    }
}

// Update progress bar
function updateProgressBar() {
    const progress = ((currentQuestion) / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Update score display
function updateScore() {
    scoreEl.textContent = `Score: ${score}/${currentQuestion + 1}`;
}

// Show quiz results
function showQuizResults() {
    const percentage = (score / quizData.length) * 100;
    
    questionEl.textContent = 'Quiz Completed!';
    answersList.innerHTML = '';
    
    feedbackEl.innerHTML = `
        <h3>Your Results</h3>
        <p>You scored ${score} out of ${quizData.length}</p>
        <p>Percentage: ${percentage.toFixed(1)}%</p>
    `;
    
    nextBtn.textContent = 'Restart Quiz';
    nextBtn.addEventListener('click', restartQuiz);
    
    // Add confetti effect for good scores
    if (percentage >= 70) {
        showConfetti();
    }
}

// Restart quiz
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    quizCompleted = false;
    nextBtn.textContent = 'Next Question';
    nextBtn.removeEventListener('click', restartQuiz);
    initQuiz();
}

// Simple confetti effect
function showConfetti() {
    const colors = ['#4a90e2', '#2ecc71', '#e74c3c', '#f1c40f'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add confetti styles
const style = document.createElement('style');
style.textContent = `
    .confetti {
        position: fixed;
        top: -10px;
        width: 10px;
        height: 10px;
        animation: fall linear forwards;
        z-index: 1000;
    }
    
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Check authentication
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update user info
    document.getElementById('userName').textContent = `Welcome, ${user.name}!`;
    
    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}

// Start the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initQuiz();
});
  