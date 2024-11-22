import React from 'react';
import logo from './logo.svg';
import './App.css';
import JsonProcessor from './components/JsonProcessor.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <main className="App-main">
        <JsonProcessor />
      </main>
    </div>
  );
}

export default App;