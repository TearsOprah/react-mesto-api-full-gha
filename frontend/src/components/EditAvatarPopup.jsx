import PopupWithForm from "./PopupWithForm";
import React from "react";

export default function EditAvatarPopup(props) {

  const avatarErrorRef = React.useRef();
  const avatarRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    try {
      new URL(avatarRef.current.value);
      props.onUpdateAvatar({
        avatar: avatarRef.current.value /* Значение инпута, полученное с помощью рефа */,
      });
      // скидываем вписанное значение
      // avatarRef.current.value = ''
    } catch (err) {
      avatarErrorRef.current.textContent = 'Введите корректный URL';
    }
  }

  function handleClose() {
    props.onClose()
    // скидываем сообщение об ошибке
    avatarErrorRef.current.textContent = ''
    // скидываем вписанное значение
    avatarRef.current.value = ''
  }

  return (
    <PopupWithForm  isOpen={props.isOpen}
                    onClose={handleClose}
                    name={'avatar'}
                    title={'Обновить аватар'}
                    buttonText={props.isLoading? 'Сохранение...' : 'Сохранить'}
                    onSubmit={handleSubmit}>

      <div className="popup__field-container">
        <input id="avatarInput" className="popup__field" type="url" name="avatar" maxLength="1000"
               placeholder="Ссылка на картинку" required ref={avatarRef}/>
        <span ref={avatarErrorRef} id="avatarInput-error" className="popup__error popup__error_visible"></span>
      </div>

    </PopupWithForm>
  )
}