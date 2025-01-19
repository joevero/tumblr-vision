import { useState } from 'react'
import BoardContainer from './components/BoardContainer'
import TumblrUserInput from './components/TumblrUserInput'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState('igotstonedinsalemmassachusetts')
  const [isGenerating, setIsGenerating] = useState(false)

  return (
    <div className="app-container">
      <div className="left-section">
        <BoardContainer 
          currentUser={currentUser}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
      </div>
      <div className="right-section">
        <TumblrUserInput
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          disabled={isGenerating}
        />
      </div>
    </div>
  )
}

export default App