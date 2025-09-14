import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// 1. We ONLY need jsPDF now
import jsPDF from 'jspdf';

// We no longer import QuizReport or html2canvas
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
  // We no longer need the reportRef

  useEffect(() => {
    // This useEffect hook remains the same
    const fetchQuiz = async () => { try { const results = JSON.parse(localStorage.getItem('quizAppResults')) || {}; if (results[quizId]) { setPastResult(results[quizId]); setIsCompleted(true); setLoading(false); return; } const docRef = doc(db, 'quizzes', quizId); const docSnap = await getDoc(docRef); if (docSnap.exists()) { setQuizData(docSnap.data()); } else { setError('Quiz Not Found!'); } } catch (err) { setError('An error occurred.'); } finally { setLoading(false); } };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    // This useEffect hook remains the same
    if (showScore) { const results = JSON.parse(localStorage.getItem('quizAppResults')) || {}; const newResult = { score: score, total: quizData.questions.length, title: quizData.title }; results[quizId] = newResult; localStorage.setItem('quizAppResults', JSON.stringify(results)); }
  }, [showScore, quizId, score, quizData]);

  const handleAnswerClick = (selectedOptionIndex) => {
    // This function remains the same
    setUserAnswers([...userAnswers, selectedOptionIndex]); if (selectedOptionIndex === quizData.questions[currentQuestion].correctAnswer) { setScore(score + 1); } const nextQuestion = currentQuestion + 1; if (nextQuestion < quizData.questions.length) { setCurrentQuestion(nextQuestion); } else { setShowScore(true); }
  };

  const handleStartQuiz = () => { setQuizStarted(true); };

  // --- 2. THE NEW, NATIVE PDF EXPORT FUNCTION ---
  const handleExport = () => {
    setIsExporting(true);

    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 paper, portrait, millimeters
    const margin = 20;
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = margin; // Vertical position tracker

    // --- Draw Title ---
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text(quizData.title, pdf.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += 10;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text("Quiz Results", pdf.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += 15;

    // --- Loop through questions ---
    quizData.questions.forEach((question, index) => {
      const userAnswerIndex = userAnswers[index];
      const correctAnswerIndex = question.correctAnswer;
      const questionBlockHeight = 15 + (question.options.length * 15); // Rough estimation

      // --- !! CRITICAL PAGE BREAK LOGIC !! ---
      if (y + questionBlockHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin; // Reset y position for new page
      }

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${index + 1}. ${question.questionText}`, margin, y);
      y += 10;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      question.options.forEach((option, oIndex) => {
        let fillColor = [255, 255, 255]; // White (default)
        let textColor = [0, 0, 0]; // Black

        if (oIndex === correctAnswerIndex) {
          fillColor = [230, 255, 237]; // Light Green
        }
        if (oIndex === userAnswerIndex && userAnswerIndex !== correctAnswerIndex) {
          fillColor = [253, 234, 234]; // Light Red
        }

        pdf.setFillColor(...fillColor);
        pdf.setDrawColor(221, 221, 221); // Light grey border
        pdf.rect(margin, y - 4, pdf.internal.pageSize.getWidth() - (margin * 2), 10, 'FD'); // Draw the box
        pdf.setTextColor(...textColor);
        pdf.text(option, margin + 3, y);
        y += 12;
      });
      y += 5; // Extra space between questions
    });

    pdf.save(`${quizData.title.replace(/\s+/g, '-')}-results.pdf`);
    setIsExporting(false);
  };

  // --- The rest of the component's JSX remains the same ---
  // (Loading, Error, Completed, Start Screen, Score Screen, Active Quiz)
  
  // To avoid confusion, here is the full return block
  const [isCompleted, setIsCompleted] = useState(false);
  const [pastResult, setPastResult] = useState(null);
  
  if (loading) { return (<div className="quiz-container"><h2 className="quiz-title">LOADING QUIZ...</h2></div>); }
  if (error) { return (<div className="quiz-container"><h2 className="quiz-title">ERROR</h2><p className="question-text">{error}</p><Link to="/"><button className="home-cta-button">Back to Home</button></Link></div>); }
  if (isCompleted && pastResult) { return (<div className="quiz-container"><div className="score-section"><h2>QUIZ ALREADY TAKEN</h2><p>You previously completed "{pastResult.title}" and scored:</p><p className="final-score">{pastResult.score} / {pastResult.total}</p><Link to="/"><button className="play-again-btn">BACK TO HOME</button></Link></div></div>); }

  const activeQuestion = quizData.questions[currentQuestion];

  return (
    <div className="quiz-container">
      {!quizStarted ? (
        <div className="start-screen"><h2 className="quiz-title">{quizData.title}</h2><p className="question-text">This quiz has {quizData.questions.length} questions. Are you ready?</p><button onClick={handleStartQuiz} className="play-again-btn">START QUIZ</button></div>
      ) : showScore ? (
        <div className="score-section"><h2>QUIZ COMPLETE!</h2><p>You scored {score} out of {quizData.questions.length}</p><div className="score-buttons"><button onClick={handleExport} className="export-btn" disabled={isExporting}>{isExporting ? 'EXPORTING...' : 'EXPORT RESULTS'}</button></div></div>
      ) : (
        <>
          {activeQuestion.imageUrl && (<div className="question-image-container"><img src={activeQuestion.imageUrl} alt="Quiz Question" /></div>)}
          <div className="progress-text"><span>Question {currentQuestion + 1}</span>/{quizData.questions.length}</div>
          <p className="question-text">{activeQuestion.questionText}</p>
          <div className="answer-options">{activeQuestion.options.map((option, index) => (<button key={index} className="answer-btn" onClick={() => handleAnswerClick(index)}>{option}</button>))}</div>
        </>
      )}
      {/* The hidden report container is no longer needed */}
    </div>
  );
}

export default TakeQuiz;