import React, { forwardRef } from 'react';
import './QuizReport.css';

const QuizReport = forwardRef(({ quizData, userAnswers }, ref) => {
  return (
    <div ref={ref} className="report-content">
      <h1 className="report-title">{quizData.title}</h1>
      <p className="report-subtitle">Quiz Results</p>
      
      {quizData.questions.map((question, index) => {
        const userAnswerIndex = userAnswers[index];
        const correctAnswerIndex = question.correctAnswer;
        
        return (
          <div key={index} className="report-question-block">
            <h3 className="report-question-text">
              {index + 1}. {question.questionText}
            </h3>
            <ul className="report-options-list">
              {question.options.map((option, oIndex) => {
                let className = '';
                if (oIndex === correctAnswerIndex) {
                  className = 'correct'; // Always highlight the correct answer
                }
                if (oIndex === userAnswerIndex && userAnswerIndex !== correctAnswerIndex) {
                  className = 'incorrect'; // Highlight the user's wrong answer
                }
                return (
                  <li key={oIndex} className={className}>
                    {option}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
});

export default QuizReport;