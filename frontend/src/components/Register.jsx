import {Link, useNavigate} from "react-router-dom";
import AlertPopup from "./AlertPopup";


export default function Register(props) {

  const navigate = useNavigate();

  // закрываем попап
  const handleCloseAlertPopup = () => {
    props.setIsAlertPopupOpen(false)
    props.onClose()
    // если регистрация успешная -> перенаправляем на станицу входа
    if (props.isRegistrationSuccessful) {
      navigate('/sign-in', {replace: true})
    }
    // сбрасываем стейт успешности регистрации
    props.setIsRegistrationSuccessful(false)
  }

  return (
    <>
      <div className={'login'}>
        <h2 className={'login__title'}>Регистрация</h2>
        <form onSubmit={props.handleSubmitRegistration}
              className={'login__form'}>
          <input id={'email'}
                 name="email"
                 onChange={props.handleChange}
                 value={props.formValue.email}
                 className={'login__input'}
                 type={'email'}
                 placeholder={'Email'}
                 required/>
          <input onChange={props.handleChange}
                 id={'password'}
                 name="password"
                 value={props.formValue.password}
                 className={'login__input'}
                 type={'password'}
                 placeholder={'Пароль'}
                 required />
          <button className={'login__submit-button'}
                  type={"submit"}>Зарегистрироваться</button>
        </form>
        <p className={'login__bottom-row'}>Уже зарегистрированы? <Link className={'login__link'} to={'/sign-in'}>Войти</Link></p>
      </div>

      <AlertPopup onClose={handleCloseAlertPopup}
                  isOpen={props.isOpen}
                  isRegistrationSuccessful={props.isRegistrationSuccessful}
      />

    </>
  )
}