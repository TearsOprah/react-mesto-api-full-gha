import PopupWithForm from "./PopupWithForm";
import {useContext, useState} from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import React from "react";
import {useRef} from "react";

export default function EditProfilePopup(props) {

  // Подписка на контекст
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const nameErrorRef = useRef();
  const descriptionErrorRef = useRef();

  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleChangeName(event) {
    setName(event.target.value);
  }

  function handleChangeDescription(event) {
    setDescription(event.target.value);
  }

  function handleSubmit(event) {
    // Запрещаем браузеру переходить по адресу формы
    event.preventDefault();

    // переменные с текстом ошибок
    let nameError = ''
    let descriptionError = ''

    // проверяем поле имени
    if (name.length < 2 || name.length > 40) {
      nameError = ('Имя должно содеражать от 2 до 40 символов')
    }

    // проверяем поле профессии
    if (description.length < 2 || description.length > 200) {
      descriptionError = ('профессия должна содержать от 2 до 200 символов')
    }

    // если есть ошибки - выводим и делаем span видимыми
    if (nameError || descriptionError) {
      nameErrorRef.current.textContent = nameError;
      descriptionErrorRef.current.textContent = descriptionError;
      return
    }

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name,
      about: description,
    });

    // обнуляем ошибки после отправки формы
    nameErrorRef.current.textContent = '';
    descriptionErrorRef.current.textContent = '';
  }

  function handleClose() {
    props.onClose()
    // обнуляем ошибки после закрытия
    nameErrorRef.current.textContent = '';
    descriptionErrorRef.current.textContent = '';
    // чтобы после закрытия попапа с ошибкой, в поле вернулось старое имя
    // setName(currentUser.name);
    // setDescription(currentUser.about)
  }

  return (
    <PopupWithForm isOpen={props.isOpen}
                   onClose={handleClose}
                   name={'edit'}
                   title={'Редактировать профиль'}
                   buttonText={props.isLoading? 'Сохранение...' : 'Сохранить'}
                   onSubmit={handleSubmit}>



      <div className="popup__field-container">
        <input onChange={handleChangeName}
               value={name || ''}
               id="nameInput"
               className="popup__field"
               type="text"
               name="name"
               minLength="2"
               maxLength="40"
               placeholder="Введите имя"
               required />
        <span ref={nameErrorRef} id="nameInput-error" className="popup__error popup__error_visible"></span>
      </div>
      <div className="popup__field-container">
        <input onChange={handleChangeDescription} value={description || ''} id="jobInput" className="popup__field" type="text" name="job" minLength="2" maxLength="200"
                 placeholder="Введите профессию" required />
        <span ref={descriptionErrorRef} id="jobInput-error" className="popup__error popup__error_visible"></span>
      </div>


    </PopupWithForm>
  )
}