import logoPath from "../images/header-logo.svg";
import { useLocation, NavLink} from "react-router-dom";


export default function Header({ loggedIn, userData, handleLogout }) {
  const location = useLocation();

  return (
    <header className="header">
      <img className="header__logo" src={logoPath} alt="логотип" />

      {loggedIn ? (
        <nav className={'header__auth-nav'}>
          {userData && userData.data && userData.data.email ? (
            <p className={'header__email'}>{userData.data.email}</p>
          ) : null}
          <button className={'header__link header__link_logout hovered-link'} onClick={handleLogout}>
            Выйти
          </button>
        </nav>
      ) : (
        <nav className={'header__auth-nav'}>
          {location.pathname === '/sign-in' && (
            <NavLink to={"/sign-up"} className={'header__link hovered-link'}>
              Регистрация
            </NavLink>
          )}
          {location.pathname === '/sign-up' && (
            <NavLink to={'/sign-in'} className={'header__link hovered-link'}>
              Войти
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
}

