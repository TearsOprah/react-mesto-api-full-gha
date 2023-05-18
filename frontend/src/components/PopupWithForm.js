export default function PopupWithForm(props) {

  return (
    <div className={`popup popup_type_${props.name}` + (props.isOpen && ' popup_opened')}>
      <div className="popup__container">
        <form className="popup__form" name={`${props.name}-form`} onSubmit={props.onSubmit} >
          <h2 className="popup__title">{props.title}</h2>
          {props.children}
          <input className="popup__save-button" type="submit" name="save" value={props.buttonText} />
        </form>
        <button onClick={props.onClose} className="popup__closer hovered-link popup__closer_type_edit" type="button"
                aria-label="Закрыть"></button>
      </div>
    </div>
  )
}