


let quizData = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;


const welcomeScreen = document.getElementById('welcome-screen');
const loadingScreen = document.getElementById('loading-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const errorScreen = document.getElementById('error-screen');

const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const retryBtn = document.getElementById('retry-btn');

const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

const scorePercentage = document.getElementById('score-percentage');
const resultMessage = document.getElementById('result-message');
const scoreDetails = document.getElementById('score-details');
const answerReview = document.getElementById('answer-review');
const questionCountSpan = document.getElementById('question-count');
const errorMessage = document.getElementById('error-message');


startBtn.addEventListener('click', startQuiz);
prevBtn.addEventListener('click', goToPreviousQuestion);
nextBtn.addEventListener('click', goToNextQuestion);
submitBtn.addEventListener('click', submitQuiz);
restartBtn.addEventListener('click', restartQuiz);
retryBtn.addEventListener('click', startQuiz);


async function startQuiz() {
    showScreen('loading');
    
    try {
        console.log('Loading questions from JSON file...');
        const response = await fetch('questions.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        quizData = await response.json();
        
        if (!Array.isArray(quizData) || quizData.length === 0) {
            throw new Error('Invalid quiz data format or empty questions array');
        }
        
        for (let i = 0; i < quizData.length; i++) {
            const question = quizData[i];
            if (!question.question || !question.options || !Array.isArray(question.options) || 
                typeof question.correctIndex !== 'number') {
                throw new Error(`Invalid question structure at index ${i}`);
            }
        }
        
        console.log(`Successfully loaded ${quizData.length} questions`)
        
        initializeQuiz();
        
    } catch (error) {
        console.error('Error loading quiz data:', error);
        showError('Failed to load quiz questions. Please check if questions.json file exists and is properly formatted.');
    }
}
function initializeQuiz() {
    currentQuestionIndex = 0;
    userAnswers = new Array(quizData.length).fill(null);
    score = 0;
    
    totalQuestionsSpan.textContent = quizData.length;
    
    displayQuestion();
    updateProgress();
    updateNavigationButtons();
    
    showScreen('quiz');
}


function displayQuestion() {
    const question = quizData[currentQuestionIndex];
    
   
    questionText.textContent = question.question;
    
 
    optionsContainer.innerHTML = '';
    
   
    question.options.forEach((optionText, index) => {
        const optionElement = createOptionElement(optionText, index);
        optionsContainer.appendChild(optionElement);
    });
    
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    
    console.log(`Displaying question ${currentQuestionIndex + 1}: ${question.question}`);
}
function createOptionElement(optionText, index) {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    optionDiv.addEventListener('click', () => selectOption(index));
    
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = `question-${currentQuestionIndex}`;
    radioInput.value = index;
    radioInput.id = `option-${currentQuestionIndex}-${index}`;
    
    const optionLabel = document.createElement('label');
    optionLabel.htmlFor = radioInput.id;
    optionLabel.className = 'option-text';
    optionLabel.textContent = optionText;
    
    optionDiv.appendChild(radioInput);
    optionDiv.appendChild(optionLabel);
   
    if (userAnswers[currentQuestionIndex] === index) {
        radioInput.checked = true;
        optionDiv.classList.add('selected');
    }
    
    return optionDiv;
}
function selectOption(selectedIndex) {
    
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = document.querySelectorAll('.option')[selectedIndex];
    selectedOption.classList.add('selected');
    
    
    const radioButton = selectedOption.querySelector('input[type="radio"]');
    radioButton.checked = true;
   
    userAnswers[currentQuestionIndex] = selectedIndex;
    updateNavigationButtons();
    
    console.log(`User selected option ${selectedIndex} for question ${currentQuestionIndex + 1}`);
}


function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        updateProgress();
        updateNavigationButtons();
    }
}


function goToNextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        updateProgress();
        updateNavigationButtons();
    }
}


function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressPercent.textContent = `${Math.round(progress)}%`;
}


function updateNavigationButtons() {
    prevBtn.disabled = currentQuestionIndex === 0;
    
    const isCurrentQuestionAnswered = userAnswers[currentQuestionIndex] !== null;
    const isLastQuestion = currentQuestionIndex === quizData.length - 1;
    
    if (isLastQuestion) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = isCurrentQuestionAnswered ? 'inline-block' : 'none';
    } else {
        nextBtn.style.display = 'inline-block';
        nextBtn.disabled = !isCurrentQuestionAnswered;
        submitBtn.style.display = 'none';
    }
}


function submitQuiz() {
    
    const unansweredQuestions = userAnswers.findIndex(answer => answer === null);
    if (unansweredQuestions !== -1) {
        alert(`Please answer question ${unansweredQuestions + 1} before submitting.`);
        return;
    }
    
    calculateScore();
    displayResults();
    showScreen('results');
    
    console.log(`Quiz submitted. Final score: ${score}/${quizData.length}`);
}


function calculateScore() {
    score = 0;
    
    userAnswers.forEach((userAnswer, index) => {
        if (userAnswer === quizData[index].correctIndex) {
            score++;
        }
    });
    
    console.log(`Score calculation completed: ${score} correct out of ${quizData.length} questions`);
}


function displayResults() {
    const percentage = Math.round((score / quizData.length) * 100);
    
    
    scorePercentage.textContent = `${percentage}%`;
    scoreDetails.textContent = `You scored ${score} out of ${quizData.length} questions correctly.`;
    
   
    if (percentage >= 80) {
        resultMessage.textContent = 'Excellent! 🎉';
        resultMessage.style.color = '#28a745';
    } else if (percentage >= 60) {
        resultMessage.textContent = 'Good Job! 👍';
        resultMessage.style.color = '#007bff';
    } else if (percentage >= 40) {
        resultMessage.textContent = 'Not Bad! 👌';
        resultMessage.style.color = '#ffc107';
    } else {
        resultMessage.textContent = 'Keep Trying! 💪';
        resultMessage.style.color = '#dc3545';
    }
    
    
    generateDetailedReview();
}


function generateDetailedReview() {
    answerReview.innerHTML = '';
    
    quizData.forEach((question, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        const userAnswer = userAnswers[index];
        const correctAnswer = question.correctIndex;
        const isCorrect = userAnswer === correctAnswer;
        
        reviewItem.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        reviewItem.innerHTML = `
            <div class="review-question">
                <strong>Question ${index + 1}:</strong> ${question.question}
            </div>
            <div class="review-answer user-answer">
                <span class="answer-label">Your Answer:</span>
                ${question.options[userAnswer]} ${isCorrect ? '✅' : '❌'}
            </div>
            ${!isCorrect ? `
                <div class="review-answer correct-answer">
                    <span class="answer-label">Correct Answer:</span>
                    ${question.options[correctAnswer]} ✅
                </div>
            ` : ''}
        `;
        
        answerReview.appendChild(reviewItem);
    });
}


function restartQuiz() {
   
    currentQuestionIndex = 0;
    userAnswers = [];
    score = 0;
    
   
    quizData = [];
    
    
    showScreen('welcome');
    
    console.log('Quiz restarted');
}


function showScreen(screenName) {
    
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    
    const screenMap = {
        'welcome': welcomeScreen,
        'loading': loadingScreen,
        'quiz': quizScreen,
        'results': resultsScreen,
        'error': errorScreen
    };
    
    if (screenMap[screenName]) {
        screenMap[screenName].classList.add('active');
    }
    
    console.log(`Switched to ${screenName} screen`);
}


function showError(message) {
    errorMessage.textContent = message;
    showScreen('error');
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('Quiz application initialized');
    
    
    showScreen('welcome');
});