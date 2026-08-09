import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { quizQuestions } from './data/questions';

// Helper function for true randomness (Fisher-Yates Shuffle)
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // New States for Timer and Selection
  const [selectedOption, setSelectedOption] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Initialize quiz on component mount
  useEffect(() => {
    startQuiz();
  }, []);

  // Timer logic
  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const startQuiz = () => {
    // Select 40 random questions instead of 10
    const shuffledQuestions = shuffleArray(quizQuestions).slice(0, 40);
    
    // Shuffle options for each question
    const questionsWithOptionsShuffled = shuffledQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));

    setQuestions(questionsWithOptionsShuffled);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption("");
    setTimeElapsed(0);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return; // Prevent submission if no option is selected

    if (selectedOption === questions[currentIndex].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentIndex(nextQuestion);
      setSelectedOption(""); // Reset selection for the next question
    } else {
      setShowResult(true);
      setIsTimerRunning(false); // Stop the timer when exam finishes
    }
  };

  if (questions.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light py-5">
      <div className="card shadow-lg w-100" style={{ maxWidth: '650px', borderRadius: '15px' }}>
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <h2 className="mb-0 h5 fw-bold">Social Science Quiz</h2>
          <div className="bg-white text-primary px-3 py-1 rounded-pill fw-bold fs-6 shadow-sm">
            ⏱️ {formatTime(timeElapsed)}
          </div>
        </div>
        
        <div className="card-body p-4 p-md-5">
          {showResult ? (
            <div className="text-center">
              <h3 className="mb-4 text-success fw-bold">Exam Completed!</h3>
              <div className="mb-4 p-3 bg-light rounded-3 border">
                <h4 className="mb-3">
                  Your Score: <span className="text-primary fs-1 fw-bold">{score}</span> / 40
                </h4>
                <h5 className="text-muted">
                  Time Taken: <span className="text-dark fw-bold">{formatTime(timeElapsed)}</span>
                </h5>
              </div>
              <p className="text-muted mb-4 fs-5">
                {score >= 32 ? "Excellent Performance! 🌟" : score >= 20 ? "Good Job! 👍" : "Keep Learning! 📚"}
              </p>
              <button 
                className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm"
                onClick={startQuiz}
              >
                Retake Exam
              </button>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="badge bg-secondary rounded-pill px-3 py-2 fs-6">
                  Question {currentIndex + 1} / {questions.length}
                </span>
              </div>
              
              <h4 className="mb-4 fw-normal lh-base" style={{ minHeight: '60px' }}>
                {questions[currentIndex].question}
              </h4>
              
              <div className="d-grid gap-3 mt-4 mb-4">
                {questions[currentIndex].options.map((option, index) => (
                  <button
                    key={index}
                    className={`btn btn-lg text-start px-4 py-3 rounded-3 ${selectedOption === option ? 'btn-primary shadow' : 'btn-outline-primary'}`}
                    onClick={() => handleOptionSelect(option)}
                    style={{ transition: 'all 0.2s ease-in-out' }}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="d-flex justify-content-end border-top pt-4">
                <button 
                  className="btn btn-success btn-lg px-5 rounded-pill shadow-sm"
                  onClick={handleSubmit}
                  disabled={!selectedOption}
                >
                  {currentIndex === questions.length - 1 ? 'Finish Exam' : 'Submit & Next'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
