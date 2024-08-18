import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({onReset}) {
  return (
    <header>
      <h1>Elements Quiz</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/quiz">Quiz</Link>
        <a onClick={onReset}>Reset Quiz</a>
      </nav>
    </header>
  );
}