import Card from "./Card";
import CurrentUserContext from "../contexts/CurrentUserContext";
import React from "react";

export default function Main(props) {

  const currentUser = React.useContext(CurrentUserContext)

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__block">
          <div className="profile__avatar-edit">
            <img className="profile__avatar" src={currentUser.avatar} alt="аватар" />
            <button onClick={props.onEditAvatar} className="profile__avatar-button" type="button" aria-label="Обновить аватар"></button>
          </div>
          <div className="profile__info">
            <h1 className="profile__title">{currentUser.name}</h1>
            <button onClick={props.onEditProfile} className="profile__edit-button hovered-link" type="button" aria-label="Редактировать"></button>
            <p className="profile__subtitle">{currentUser.about}</p>
          </div>
        </div>
        <button onClick={props.onAddPlace} className="profile__add-button hovered-link" type="button" aria-label="Добавить"></button>
      </section>
      <section className="elements">
        <ul className="elements__list">
          {props.cards.map(card => (
            <Card card={card}
                  key={card._id}
                  onCardClick={props.onCardClick}
                  onCardLike={props.onCardLike}
                  onCardDelete={props.onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  )
}