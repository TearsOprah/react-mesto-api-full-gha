export default function ImagePopup(props) {
  return (
    <div className={"popup popup_type_image"+ (props.isOpen && ' popup_opened')}>
      <div className="popup__image-container">
        <img className="popup__image" src={props.card.link} alt={props.card.name} />
        <p className="popup__description">{props.card.name}</p>
        <button onClick={props.onClose} className="popup__closer hovered-link popup__closer_type_image" type="button"
                aria-label="Закрыть"></button>
      </div>
    </div>
  )
}