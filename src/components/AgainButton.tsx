import './Buttons.css'

interface AgainButtonProps {
  onClick: () => void
}

const AgainButton = ({ onClick }: AgainButtonProps) => {
  return (
    <button 
      className="again-button"
      onClick={onClick}
    >
      AGAIN
    </button>
  )
}

export default AgainButton