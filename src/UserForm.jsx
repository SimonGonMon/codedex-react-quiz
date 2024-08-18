import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';

export default function UserForm() {
  const [inputName, setInputName] = useState('');
  const { setName } = useContext(UserContext);

  function handleSubmit(e) {
    e.preventDefault();
    setName(inputName);
    window.history.pushState({}, '', '/quiz');
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  }

  function handleInput(e) {
    setInputName(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Enter your name:</label>
      <input
        type="text"
        id="name"
        value={inputName}
        onChange={handleInput}
        required
      />
      <button type="submit">Start Quiz</button>
    </form>
  );
}