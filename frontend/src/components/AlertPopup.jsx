import imgOK from '../images/ok.png'
import imgErr from '../images/error.png'

export default function AlertPopup(props) {

  return (
    <div className={`popup ${props.isOpen && 'popup_opened'}`}>
      <div className={'popup__container'}>
        {props.isRegistrationSuccessful ?
          <img className={'popup__alert-image'} src={imgOK} alt={'successful image'}/> :
          <img className={'popup__alert-image'} src={imgErr} alt={'error image'} />}
        <p className={'popup__alert-text'}>{props.isRegistrationSuccessful ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так!\n' +
          'Попробуйте ещё раз.'}</p>
        <button onClick={props.onClose} className="popup__closer hovered-link" type="button" aria-label="Закрыть"></button>
      </div>
    </div>
  )
}