
export default function Login(props) {


  return (
    <div className={'login'}>
      <h2 className={'login__title'}>Вход</h2>
      <form onSubmit={props.handleSubmitLogin} className={'login__form'}>
        <input className={'login__input'}
               id={'email'}
               name="email"
               onChange={props.handleChange}
               value={props.formValue.email}
               type={'email'}
               placeholder={'Email'}
               required />
        <input className={'login__input'}
               onChange={props.handleChange}
               id={'password'}
               name="password"
               value={props.formValue.password}
               type={'password'}
               placeholder={'Пароль'}
               required />
        <button className={'login__submit-button'} type={"submit"}>Войти</button>
      </form>
    </div>
  )
}