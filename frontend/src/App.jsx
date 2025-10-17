import { useState } from 'react'
import Ping from './components/Ping'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Secure Document Sharing Platform</h1>
        <p>Platform for secure document exchange</p>
      </header>
      <main className="App-main">
        <Ping />
      </main>
    </div>
  )
}

export default App
