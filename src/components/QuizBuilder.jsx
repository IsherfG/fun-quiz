import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './QuizBuilder.css';

function QuizBuilder() {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', imageUrl: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allowRetakes, setAllowRetakes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy URL');

  const handleNext = () => { if (currentQuestionIndex < questions.length - 1) { setCurrentQuestionIndex(currentQuestionIndex + 1); } };
  const handlePrevious = () => { if (currentQuestionIndex > 0) { setCurrentQuestionIndex(currentQuestionIndex - 1); } };
  const handleQuestionTextChange = (event) => { const newQuestions = [...questions]; newQuestions[currentQuestionIndex].questionText = event.target.value; setQuestions(newQuestions); };
  const handleImageUrlChange = (event) => { const newQuestions = [...questions]; newQuestions[currentQuestionIndex].imageUrl = event.target.value.trim(); setQuestions(newQuestions); };
  const handleOptionChange = (optionIndex, event) => { const newQuestions = [...questions]; newQuestions[currentQuestionIndex].options[optionIndex] = event.target.value; setQuestions(newQuestions); };
  const handleCorrectAnswerChange = (optionIndex) => { const newQuestions = [...questions]; newQuestions[currentQuestionIndex].correctAnswer = optionIndex; setQuestions(newQuestions); };
  const handleAddQuestion = () => { const newQuestion = { questionText: '', imageUrl: '', options: ['', '', '', ''], correctAnswer: 0 }; setQuestions([...questions, newQuestion]); setCurrentQuestionIndex(questions.length); };
  const handleCopyUrl = () => { navigator.clipboard.writeText(generatedUrl).then(() => { setCopyButtonText('Copied!'); setTimeout(() => setCopyButtonText('Copy URL'), 2000); }); };
  const handleAllowRetakesChange = (event) => { setAllowRetakes(event.target.checked); };
  
  // --- NEW: The function to handle deleting a question ---
  const handleDeleteQuestion = () => {
    // Prevent deleting the very last question
    if (questions.length <= 1) {
      alert("You can't delete the only question!");
      return;
    }

    // Confirm with the user before deleting
    if (window.confirm("Are you sure you want to delete this question?")) {
      // Filter out the question at the current index
      const newQuestions = questions.filter((_, index) => index !== currentQuestionIndex);
      setQuestions(newQuestions);
      
      // Adjust the current index to avoid errors
      // If we deleted the last question, move to the new last question
      if (currentQuestionIndex >= newQuestions.length) {
        setCurrentQuestionIndex(newQuestions.length - 1);
      }
    }
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim()) { alert('Please enter a quiz title.'); return; }
    if (questions.some(q => !q.questionText.trim())) { alert('Please make sure every question has text.'); return; }
    setIsSaving(true);
    setGeneratedUrl('');
    try {
      const quizData = { title: quizTitle, questions: questions, createdAt: serverTimestamp(), allowRetakes: allowRetakes };
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

  const activeQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-builder">
      <h2>Create Your Quiz</h2>
      <input type="text" placeholder="Enter Your Quiz Title" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} className="quiz-title-input" disabled={isSaving} />
      <div className="question-card">
        <h4>Question {currentQuestionIndex + 1}</h4>
        <input type="text" placeholder="What is your question?" value={activeQuestion.questionText} onChange={handleQuestionTextChange} disabled={isSaving} />
        <input type="text" placeholder="Image URL (Optional)" value={activeQuestion.imageUrl} onChange={handleImageUrlChange} disabled={isSaving} className="image-url-input" />
        <p className="helper-text">Upload to a site like Imgur & paste the 'Direct Link' (ends in .jpg, .png) here.</p>
        <label>Answer Options (Click star ★ to mark correct)</label>
        <div className="options-container">
          {activeQuestion.options.map((option, oIndex) => (
            <div key={oIndex} className="answer-option-wrapper">
              <input type="text" placeholder={`Answer Option ${oIndex + 1}`} value={option} onChange={(e) => handleOptionChange(oIndex, e)} disabled={isSaving} />
              <button className={`correct-answer-btn ${activeQuestion.correctAnswer === oIndex ? 'selected' : ''}`} onClick={() => handleCorrectAnswerChange(oIndex)} title="Mark as correct answer" disabled={isSaving}>★</button>
            </div>
          ))}
        </div>
      </div>
      
      {/* --- UI UPDATED: Added the Delete button --- */}
      <div className="question-navigation">
        <button onClick={handlePrevious} disabled={isSaving || currentQuestionIndex === 0}>PREV</button>
        <div className="question-nav-center">
          <span className="question-progress">{currentQuestionIndex + 1} / {questions.length}</span>
          <button onClick={handleDeleteQuestion} className="delete-question-btn" disabled={isSaving || questions.length <= 1}>
            DELETE
          </button>
        </div>
        <button onClick={handleNext} disabled={isSaving || currentQuestionIndex === questions.length - 1}>NEXT</button>
      </div>

      <div className="quiz-options">
        <input type="checkbox" id="allowRetakes" checked={allowRetakes} onChange={handleAllowRetakesChange} disabled={isSaving} />
        <label htmlFor="allowRetakes">Allow users to retake this quiz</label>
      </div>
      <div className="builder-buttons"><button onClick={handleAddQuestion} disabled={isSaving}>Add New Question</button><button onClick={handleSaveQuiz} className="save-button" disabled={isSaving}>{isSaving ? 'SAVING...' : 'Save Quiz'}</button></div>
      {generatedUrl && (<div className="generated-url-container"><h4>Quiz Saved Successfully!</h4><div className="url-display"><input type="text" value={generatedUrl} readOnly /><button onClick={handleCopyUrl}>{copyButtonText}</button></div></div>)}
    </div>
  );
}

export default QuizBuilder;