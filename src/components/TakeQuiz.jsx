import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './TakeQuiz.css';

function TakeQuiz() {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  
  // NEW: State for the start screen
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, 'quizzes', quizId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuizData(docSnap.data());
        } else {
          setError('Quiz Not Found! The link may be incorrect or the quiz may have been deleted.');
        }
      } catch (err) {
        setError('An error occurred while trying to load the quiz.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswerClick = (selectedOptionIndex) => {
    if (selectedOptionIndex === quizData.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setQuizStarted(true); // Go back to the first question
  };
  
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  // --- RENDER LOGIC ---

  if (loading) {
    return <div className="quiz-container"><h2 className="quiz-title">LOADING QUIZ...</h2></div>;
  }
  if (error) {
    return (
      <div className="quiz-container">
        <h2 className="quiz-title">ERROR</h2>
        <p className="question-text">{error}</p>
        <Link to="/create"><button className="home-cta-button">Create a New Quiz</button></Link>
      </div>
    );
  }

  // Use a variable for the current question for easier access
  const activeQuestion = quizData.questions[currentQuestion];

  return (
    <div className="quiz-container">
      {!quizStarted ? (
        // --- START SCREEN ---
        <div className="start-screen">
          <h2 className="quiz-title">{quizData.title}</h2>
          <p className="question-text">
            This quiz has {quizData.questions.length} questions. Are you ready?
          </p>
          <button onClick={handleStartQuiz} className="play-again-btn">
            START QUIZ
          </button>
        </div>
      ) : showScore ? (
        // --- SCORE SCREEN ---
        <div className="score-section">
          <h2>QUIZ COMPLETE!</h2>
          <p>You scored {score} out of {quizData.questions.length}</p>
          <button onClick={handlePlayAgain} className="play-again-btn">
            PLAY AGAIN
          </button>
        </div>
      ) : (
        // --- ACTIVE QUIZ SCREEN ---
        <>
          {/* --- NEW: RENDER IMAGE IF URL EXISTS --- */}
          {activeQuestion.imageUrl && (
            <div className="question-image-container">
              <img src={activeQuestion.imageUrl} alt="Quiz Question" />
            </div>
          )}

          <div className="progress-text">
            <span>Question {currentQuestion + 1}</span>/{quizData.questions.length}
          </div>
          <p className="question-text">{activeQuestion.questionText}</p>
          <div className="answer-options">
            {activeQuestion.options.map((option, index) => (
              <button
                key={index}
                className="answer-btn"
                onClick={() => handleAnswerClick(index)}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TakeQuiz;