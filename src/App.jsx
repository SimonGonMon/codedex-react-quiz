import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import Header from './Header';
import Question from './Question';
import Results from './Results';
import UserForm from './UserForm';

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userName, setUserName] = useState('');
  const [element, setElement] = useState('');
  const [artwork, setArtwork] = useState(null);

  const questions = [
    {
      question: "What's your favorite color?",
      options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡", "Purple 🟣", "Orange 🟠"],
    },
  ];

  const keywords = {
    Fire: "fire",
    Water: "water",
    Earth: "earth",
    Air: "air",
    Spirit: "spirit",
    Light: "light",
  };

  const elements = {
    "Red 🔴": "Fire",
    "Blue 🔵": "Water",
    "Green 🟢": "Earth",
    "Yellow 🟡": "Air",
    "Purple 🟣": "Spirit",
    "Orange 🟠": "Light",
  };

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handleUserFormSubmit(name) {
    setUserName(name);
  }

  function determineElement(answers) {
    const counts = {};
    answers.forEach(function(answer) {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
    return Object.keys(counts).reduce(function(a, b) {
      return counts[a] > counts[b] ? a : b
    });
  }

  const fetchArtwork = async (keyword) => {
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}`);
    const data = await response.json();

    const randomIndex = Math.floor(Math.random() * data.objectIDs.length);
    const objectID = data.objectIDs[randomIndex];
    const artworkResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
    const artwork = await artworkResponse.json();

    if (!artwork.primaryImage) {
      return
    }
    setArtwork(artwork);
  };

  function resetQuiz() {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setUserName('');
    setElement('');
    setArtwork(null);
  }

  useEffect(function () {
    if (currentQuestionIndex === questions.length) {
      const selectedElement = determineElement(answers);
      setElement(selectedElement);
      fetchArtwork(keywords[selectedElement]);
    }
  }, [currentQuestionIndex]);

  return (
    <UserProvider value={{ name: userName, setName: setUserName }}>
      <Header onReset={resetQuiz} />
      <Routes>
        <Route path="/" element={<UserForm onSubmit={handleUserFormSubmit} />} />
        <Route
          path="/quiz"
          element={
            currentQuestionIndex < questions.length ? (
              <Question 
                question={questions[currentQuestionIndex].question} 
                options={questions[currentQuestionIndex].options} 
                onAnswer={handleAnswer} 
              />
            ) : (
              <Results element={element} artwork={artwork} />
            )
          }
        />
      </Routes>
    </UserProvider>
  );
}