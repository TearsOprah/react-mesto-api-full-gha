import api from "../utils/api";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import {useEffect, useState} from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth";

function App() {

  const [cards, setCards] = useState([])


  function handleCardDelete(card) {
    const cardId = card._id;
    api.deleteCard(cardId)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== cardId))
      })
      .catch(err => {
        console.log(err)
      })
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
      .catch(err => {
        console.log(err)
      });
  }

  const [currentUser, setCurrentUser] = useState({})
  useEffect(() => {
    api.getUserData()
      .then(res => {
        setCurrentUser(res)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function handleCardClick(card) {
    setSelectedCard(card)
    setIsImagePopupOpen(true)
  }
  
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsImagePopupOpen(false)
    setSelectedCard({})
    setIsAlertPopupOpen(false)
  }


  // получаем список карточек
  useEffect(() => {
    api.getInitialCards()
      .then(res => {
        setCards(res)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])


  const [isLoading, setIsLoading] = useState(false);

  function handleUpdateUser(data) {
    setIsLoading(true)
    api.setUserData(data)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleUpdateAvatar({ avatar }) {
    setIsLoading(true)
    api.updateAvatar({ avatar })
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true)
    api.addNewCard(data)
      .then(newCard => {
        setCards((cards) => [newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const [selectedCard, setSelectedCard] = useState({})
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isAlertPopupOpen, setIsAlertPopupOpen] = useState(false)


  // переменная для слежения за всеми состояниями попапов
  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard.link || isAlertPopupOpen

  useEffect(() => {
    function closeByEscape(evt) {
      if(evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if(isOpen) { // навешиваем только при открытии
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen])

  const [loggedIn, setLoggedIn] = useState(false);

  function handleLogin() {
    setLoggedIn(true)
  }

  function handleLogout() {
    localStorage.removeItem('jwt');
    setLoggedIn(false)
  }

  const navigate = useNavigate();

  // проверяем токен
  useEffect(() => {
    handleTokenCheck()
  }, [loggedIn])

  // запишем data
  const [userData, setUserData] = useState('')

  // проверка токена
  const handleTokenCheck = () => {
    /* проверим, существует ли токен в хранилище браузера*/
    if (localStorage.getItem('jwt')){
      const jwt = localStorage.getItem('jwt')// присвоим токен переменной
      // вызовем метод auth.checkToken(), передающий этот токен
      // внутри следующего then(), если там есть объект res,
      // установим loggedIn значение true
      auth.checkToken(jwt)
        .then((res) => {
        if (res){
          const data = res;
          setLoggedIn(true);
          setUserData(data); // добавляем data в state
          // перенаправим пользователя в /
          navigate("/", {replace: true})
        }
      })
        .catch((err) => {
          console.log(err)
        });
    }
  }

  // регистрация

  // состояние полей в форме регистрации
  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  })

  // изменение полей
  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormValue({
      ...formValue,
      [name]: value
    });
  }

  // состояние успешности регистрации
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false);

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    setIsRegistrationSuccessful(false); // сбрасываем значение перед каждым запросом к API
    const { password, email } = formValue;
    auth.register({ password, email })
      .then((res) => {

        // если пришел ответ с data -> регистрация успешная
        if (res.data) {
          setIsRegistrationSuccessful(true)
          setIsAlertPopupOpen(true)
        }
      })
      .catch((err) => {
        // если ошибка -> регистрация неуспешная
        setIsRegistrationSuccessful(false)
        setIsAlertPopupOpen(true)
        console.log(err)
      })
  }

  // авторизация
  const handleSubmitLogin = (e) => {
    e.preventDefault();

    if (!formValue.email || !formValue.password){
      return;
    }

    auth.authorize(formValue.email, formValue.password)
      .then((data) => {
        // нужно проверить, есть ли у данных jwt
        if (data.token){
          // сохраняем токен в localStorage
          localStorage.setItem('jwt', data.token);
          // сбросить стейт, затем в колбэке установить
          // стейт loggedIn родительского App как true,
          setFormValue({email: '', password: ''});
          handleLogin()
          // перенаправьте его в /
          navigate('/', {replace: true});
        }
      })
      .catch(err => console.log(err));
  }


  return (
    <CurrentUserContext.Provider value={currentUser}>

      <div className="page">

        <Header userData={userData} loggedIn={loggedIn} handleLogout={handleLogout}/>

        <Routes>

          <Route path={'/'} element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Main onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    cards={cards}
              />
            </ProtectedRoute>

          } />

          <Route path={'/sign-up'}
                 element={<Register
                   formValue={formValue}
                   handleChange={handleChange}
                   setIsRegistrationSuccessful={setIsRegistrationSuccessful}
                   isRegistrationSuccessful={isRegistrationSuccessful}
                   handleSubmitRegistration={handleSubmitRegistration}
                   onClose={closeAllPopups}
                   isOpen={isAlertPopupOpen}
                   setIsAlertPopupOpen={setIsAlertPopupOpen}/>}
          />

          <Route path={'/sign-in'} element={
            <Login
              handleLogin={handleLogin}
              handleSubmitLogin={handleSubmitLogin}
              formValue={formValue}
              handleChange={handleChange}
            />} />

          <Route path={'*'} element={
            loggedIn ? (
              <Navigate to={'/'} />
            ) : (
              <Navigate to={'/sign-in'} />
            )
          } />

        </Routes>

        <Footer />

        <EditProfilePopup isLoading={isLoading}
                          onUpdateUser={handleUpdateUser}
                          isOpen={isEditProfilePopupOpen}
                          onClose={closeAllPopups} />

        <AddPlacePopup isLoading={isLoading}
                       onAddPlace={handleAddPlaceSubmit}
                       isOpen={isAddPlacePopupOpen}
                       onClose={closeAllPopups} />

        <PopupWithForm isOpen={''}
                       onClose={closeAllPopups}
                       name={'delete'}
                       title={'Вы уверены?'}
                       buttonText={'Сохранить'}>

          <input className="popup__save-button" type="submit" name="delete" value="Да" />

        </PopupWithForm>

        <EditAvatarPopup isLoading={isLoading}
                         onUpdateAvatar={handleUpdateAvatar}
                         isOpen={isEditAvatarPopupOpen}
                         onClose={closeAllPopups} />

        <ImagePopup card={selectedCard}
                    onClose={closeAllPopups}
                    isOpen={isImagePopupOpen}/>

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
