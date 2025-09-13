import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './QuizBuilder.css';

function QuizBuilder() {
  const [quizTitle, setQuizTitle] = useState('');
  // ADD imageUrl to the question's initial state
  const [questions, setQuestions] = useState([
    { questionText: '', imageUrl: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy URL');

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionTextChange = (event) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].questionText = event.target.value;
    setQuestions(newQuestions);
  };

  // NEW: Handler for the image URL input
  const handleImageUrlChange = (event) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].imageUrl = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (optionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].options[optionIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].correctAnswer = optionIndex;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    // Add imageUrl to the new question object
    const newQuestion = {
      questionText: '',
      imageUrl: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim()) {
      alert('Please enter a quiz title.');
      return;
    }
    if (questions.some(q => !q.questionText.trim())) {
      alert('Please make sure every question has text.');
      return;
    }
    setIsSaving(true);
    setGeneratedUrl('');
    try {
      const quizData = {
        title: quizTitle,
        questions: questions,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'quizzes'), quizData);
      const fullUrl = `${window.location.origin}/quiz/${docRef.id}`;
      setGeneratedUrl(fullUrl);
    } catch (error) {
      console.error('Error saving quiz: ', error);
      alert('There was an error saving your quiz. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedUrl).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy URL'), 2000);
    });
  };

  const activeQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-builder">
      <h2>Create Your Quiz</h2>
      <input
        type="text"
        placeholder="Enter Your Quiz Title"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        className="quiz-title-input"
        disabled={isSaving}
      />
      <div className="question-card">
        <h4>Question {currentQuestionIndex + 1}</h4>
        <input
          type="text"
          placeholder="What is your question?"
          value={activeQuestion.questionText}
          onChange={handleQuestionTextChange}
          disabled={isSaving}
        />

        {/* --- NEW IMAGE URL INPUT --- */}
        <input
          type="text"
          placeholder="Image URL (Optional)"
          value={activeQuestion.imageUrl}
          onChange={handleImageUrlChange}
          disabled={isSaving}
          className="image-url-input"
        />

        <p className="helper-text">
          Upload to a site like Imgur & paste the 'Direct Link' (ends in .jpg, .png) here.
        </p>

        <label>Answer Options (Click star ★ to mark correct)</label>
        <div className="options-container">
          {activeQuestion.options.map((option, oIndex) => (
            <div key={oIndex} className="answer-option-wrapper">
              <input
                type="text"
                placeholder={`Answer Option ${oIndex + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(oIndex, e)}
                disabled={isSaving}
              />
              <button
                className={`correct-answer-btn ${activeQuestion.correctAnswer === oIndex ? 'selected' : ''
                  }`}
                onClick={() => handleCorrectAnswerChange(oIndex)}
                title="Mark as correct answer"
                disabled={isSaving}
              >
                ★
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="question-navigation">
        <button onClick={handlePrevious} disabled={isSaving || currentQuestionIndex === 0}>PREV</button>
        <span className="question-progress">{currentQuestionIndex + 1} / {questions.length}</span>
        <button onClick={handleNext} disabled={isSaving || currentQuestionIndex === questions.length - 1}>NEXT</button>
      </div>
      <div className="builder-buttons">
        <button onClick={handleAddQuestion} disabled={isSaving}>Add New Question</button>
        <button onClick={handleSaveQuiz} className="save-button" disabled={isSaving}>
          {isSaving ? 'SAVING...' : 'Save Quiz'}
        </button>
      </div>
      {generatedUrl && (
        <div className="generated-url-container">
          <h4>Quiz Saved Successfully!</h4>
          <div className="url-display">
            <input type="text" value={generatedUrl} readOnly />
            <button onClick={handleCopyUrl}>{copyButtonText}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizBuilder;