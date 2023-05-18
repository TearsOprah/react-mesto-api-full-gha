import PopupWithForm from "./PopupWithForm";
import {useState} from "react";


export default function AddPlacePopup(props) {
  
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const [nameError, setNameError] = useState('');
  const [linkError, setLinkError] = useState('');


  function handleChangeName(ev) {
    setName(ev.target.value);
    // проверяем имя
    if (ev.target.value.length < 2 || ev.target.value.length > 30) {
      setNameError('Имя должно содержать от 2 до 30 символов');
    } else {
      setNameError('');
    }
  }
  
  function handleChangeLink(ev) {
    setLink(ev.target.value)
    // проверяем ссылку
    if (!isValidUrl(ev.target.value)) {
      setLinkError('Введите корректный URL');
    } else {
      setLinkError('');
    }
  }

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  }
  
  function handleSubmit(ev) {
    ev.preventDefault();

    // проверяем поле имени
    if (name.length < 2 || name.length > 30) {
      return;
    }
    // проверяем валидность link
    if (!isValidUrl(link)) {
      return;
    }

    props.onAddPlace({name, link})

    // обнуляем значения полей
    setName('');
    setLink('');
  }

  function handleClose() {
    props.onClose()
    // очищаем поля
    setName('');
    setLink('');
    // обнуляем ошибку после отправки формы
    setLinkError('');
    setNameError('');
  }
  
  return (
    <PopupWithForm isOpen={props.isOpen}
                   onClose={handleClose}
                   name={'add'}
                   title={'Новое место'}
                   buttonText={props.isLoading? 'Сохранение...' : 'Создать'}
                   onSubmit={handleSubmit}>


      <div className="popup__field-container">
        <input value={name} onChange={handleChangeName} id="cardNameInput" className="popup__field" type="text" name="name" minLength="2" maxLength="30"
                 placeholder="Название" required />
        {nameError && <span id="cardNameInput-error" className="popup__error popup__error_visible">{nameError}</span>}
      </div>
      <div className="popup__field-container">
        <input value={link} onChange={handleChangeLink} id="linkInput" className="popup__field" type="url" name="link" maxLength="1000"
                 placeholder="Ссылка на картинку" required />
        {linkError && <span id="linkInput-error" className="popup__error popup__error_visible">{linkError}</span>}
      </div>


    </PopupWithForm>
  )
}