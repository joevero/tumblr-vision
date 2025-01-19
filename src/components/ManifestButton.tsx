import './Buttons.css'

interface ManifestButtonProps {
  onClick: () => void
}

const ManifestButton = ({ onClick }: ManifestButtonProps) => {
  return (
    <button 
      className="manifest-button"
      onClick={onClick}
    >
      MANIFEST
    </button>
  )
}

export default ManifestButton