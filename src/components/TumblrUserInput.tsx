import { useState, useEffect } from 'react'
import { fetchUserAvatar } from '../lib/api'
import './TumblrUserInput.css'

interface TumblrUserInputProps {
  currentUser: string
  setCurrentUser: (user: string) => void
  disabled: boolean
}

const TumblrUserInput = ({ 
  currentUser, 
  setCurrentUser, 
  disabled 
}: TumblrUserInputProps) => {
  const [inputValue, setInputValue] = useState(currentUser)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAvatar(currentUser)
  }, [currentUser])

  const fetchAvatar = async (username: string) => {
    try {
      const avatar = await fetchUserAvatar(username)
      setAvatarUrl(avatar)
      setError(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setAvatarUrl(null)
      setError('User not found')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled) return

    try {
      await fetchAvatar(inputValue)
      setCurrentUser(inputValue)
      setError(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('User not found')
    }
  }

  return (
    <div className="tumblr-user-input">
      <h2>CURRENT VISIONARY:</h2>
      <div className="input-container">
        <div className="avatar-container">
          {error ? (
            <div className="error-avatar">X</div>
          ) : (
            <img 
              src={avatarUrl || 'default-avatar.png'} 
              alt="User avatar" 
              className="user-avatar"
            />
          )}
        </div>
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-wrapper">
            <span className="at-symbol">@</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={disabled}
              className={error ? 'error' : ''}
            />
          </div>
          <button 
            type="submit" 
            disabled={disabled}
            className="change-button"
          >
            CHANGE
          </button>
        </form>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  )
}

export default TumblrUserInput