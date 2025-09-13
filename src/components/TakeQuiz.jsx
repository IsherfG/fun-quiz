import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QuizReport from './QuizReport';
import './TakeQuiz.css';

function TakeQuiz() {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef();

  // --- NEW: State to handle completion status ---
  const [isCompleted, setIsCompleted] = useState(false);
  const [pastResult, setPastResult] = useState(null);

  // --- Effect to check for completion on load ---
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // First, check if the quiz has already been completed
        const results = JSON.parse(localStorage.getItem('quizAppResults')) || {};
        if (results[quizId]) {
          setPastResult(results[quizId]);
          setIsCompleted(true);
          setLoading(false); // We have our data, no need to fetch
          return; // Stop the function here
        }

        // If not completed, fetch from Firebase
        const docRef = doc(db, 'quizzes', quizId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuizData(docSnap.data());
        } else {
          setError('Quiz Not Found! The link may be incorrect or the quiz may have been deleted.');
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError('An error occurred while trying to load the quiz.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // --- Effect to SAVE completion status when the score is shown ---
  useEffect(() => {
    if (showScore) {
      const results = JSON.parse(localStorage.getItem('quizAppResults')) || {};
      const newResult = {
        score: score,
        total: quizData.questions.length,
        title: quizData.title
      };
      results[quizId] = newResult;
      localStorage.setItem('quizAppResults', JSON.stringify(results));
    }
  }, [showScore, quizId, score, quizData]);


  const handleAnswerClick = (selectedOptionIndex) => {
    setUserAnswers([...userAnswers, selectedOptionIndex]);
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

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const input = reportRef.current;
      html2canvas(input, { scale: 2 })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${quizData.title.replace(/\s+/g, '-')}-results.pdf`);
          setIsExporting(false);
        });
    }, 100);
  };

  if (loading) {
    return (<div className="quiz-container"><h2 className="quiz-title">LOADING QUIZ...</h2></div>);
  }

  if (error) {
    return (
      <div className="quiz-container">
        <h2 className="quiz-title">ERROR</h2>
        <p className="question-text">{error}</p>
        <Link to="/"><button className="home-cta-button">Back to Home</button></Link>
      </div>
    );
  }
  
  // --- NEW: Render block for already completed quizzes ---
  if (isCompleted && pastResult) {
    return (
      <div className="quiz-container">
        <div className="score-section">
          <h2>QUIZ ALREADY TAKEN</h2>
          <p>You previously completed "{pastResult.title}" and scored:</p>
          <p className="final-score">{pastResult.score} / {pastResult.total}</p>
          <Link to="/">
            <button className="play-again-btn">BACK TO HOME</button>
          </Link>
        </div>
      </div>
    );
  }

  const activeQuestion = quizData.questions[currentQuestion];

  return (
    <div className="quiz-container">
      {!quizStarted ? (
        <div className="start-screen">
          <h2 className="quiz-title">{quizData.title}</h2>
          <p className="question-text">This quiz has {quizData.questions.length} questions. Are you ready?</p>
          <button onClick={handleStartQuiz} className="play-again-btn">START QUIZ</button>
        </div>
      ) : showScore ? (
        <div className="score-section">
          <h2>QUIZ COMPLETE!</h2>
          <p>You scored {score} out of {quizData.questions.length}</p>
          <div className="score-buttons">
            {/* The "Play Again" button has been removed */}
            <button onClick={handleExport} className="export-btn" disabled={isExporting}>
              {isExporting ? 'EXPORTING...' : 'EXPORT RESULTS'}
            </button>
          </div>
        </div>
      ) : (
        <>
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

      {isExporting && (
        <div className="report-container">
          <QuizReport ref={reportRef} quizData={quizData} userAnswers={userAnswers} />
        </div>
      )}
    </div>
  );
}

export default TakeQuiz;