const PLACE_LIST = document.querySelector('.places-list');
const USR_INFO = document.querySelector('.user-info');
const FORM_PLACE = document.forms.newPlace;
const FORM_PERSONAL = document.forms.personal;
const SCREEN_PLACE_CARD = document.querySelector('.popup__scrplacecard');
const popupInputTypeName = document.querySelector('.popup__input_type_name');
const popupInputTypeLinkUrl = document.querySelector('.popup__input_type_link-url');
const popupInpuTypePersonal = document.querySelector('.popup__input_type_personal');
const popupInputTypeAbout = document.querySelector('.popup__input_type_about');

/* Создаем и рендерим карточку */
function addCard(imgName, imgLink) {
  const placeCard = document.createElement('div');
  placeCard.classList.add('place-card');
  placeCard.innerHTML += `
    <div class="place-card__image">
    <button class="place-card__delete-icon"></button>
    </div>
    <div class="place-card__description">
    <h3 class="place-card__name"></h3>
    <button class="place-card__like-icon"></button>
    </div>
    `;
  const placeCardimage = placeCard.querySelector('.place-card__image');
  const placeCardname = placeCard.querySelector('.place-card__name');
  placeCardimage.style.backgroundImage = `url(${imgLink})`;
  placeCardname.textContent = imgName;
  PLACE_LIST.appendChild(placeCard);
}

/* Кнопка актив/дизактив */
function onInputButton(button, onOff) {
  if (onOff) {
    button.removeAttribute('disabled');
    button.classList.add('popup__button_isactiv');
  } else {
    button.setAttribute('disabled', false);
    button.classList.remove('popup__button_isactiv');
  }
}

/* Ресет сообщений об ошибках */
function resetErrors(forma) {
  const errorStrings = forma.querySelectorAll('.errors');
  errorStrings.forEach((item) => {
    item.textContent = '';
  });
}

/* Ресет для кнопки, формы и popup'а */
function resetFormPopupButtonErrors(parentPopup, targetForma, button) {
  resetErrors(targetForma);
  targetForma.reset();
  parentPopup.classList.remove('popup_is-opened');
  onInputButton(button, false);
}

/* Открываем или закрываем popup'ы обрабатываем click'и */
function popupIsOpenClose(event) {
  const imagelink = document.querySelector('.imagelink');
  const parameter = event.target;
  const parentPersonal = document.forms.personal.closest('.popup');
  const parentNewPlace = document.forms.newPlace.closest('.popup');
  const PARENT_POPUP = parameter.closest('.popup');

  if (parameter.classList.contains('place-card__image')) {
    SCREEN_PLACE_CARD.classList.toggle('popup_is-opened');
    imagelink.setAttribute('src', parameter.style.backgroundImage.slice(5, -2));
  }
  if (parameter.classList.contains('button-user-info__set')) {
    parentNewPlace.classList.toggle('popup_is-opened');
  }
  if (parameter.classList.contains('button-edit__set')) {
    parentPersonal.classList.toggle('popup_is-opened');
    onInputButton(parentPersonal.querySelector('.popup__button'), true);
  }
  if (parameter.classList.contains('popup__close')) {
    if (parameter.closest('.popup').classList.contains('popup__scrplacecard')) {
      SCREEN_PLACE_CARD.classList.remove('popup_is-opened');
    } else {
      resetErrors(PARENT_POPUP);
      PARENT_POPUP.querySelector('.popup__form').reset();
      PARENT_POPUP.classList.remove('popup_is-opened');
    }
  }
}

/*  Не ссылка валидация input'а формы Новое место */
function validInputStringIsLink(inputString) {
  const errorlink = document.querySelector('.error__link');
  const teststr = /(^https?:\/\/)/;
  if (!teststr.test(inputString)) {
    errorlink.textContent = 'Здесь должна быть ссылка';
    return false;
  }
  errorlink.textContent = '';
  return true;
}

/* Длина строки валидация input'а формы */
function validInputStringLength(inputString, outPutError) {
  if ((inputString.length <= 1) || (inputString.length > 30)) {
    outPutError.textContent = 'Поле должно содержать от 2 до 30 символов';
    return false;
  }
  outPutError.textContent = '';
  return true;
}

/* Пустая строка валидация input'а формы Новое место */
function validInputStringEmpty(inputString, outPutError) {
  if (inputString !== '') {
    return true;
  }
  outPutError.textContent = 'Это обязательное поле';
  return false;
}

/* Обработчик submit на формах */
function submitHandlerForms(event) {
  event.preventDefault();
  const childButton = event.target.querySelector('.button');
  const parent = event.target.closest('.popup');
  const forma = event.target.closest('.popup__form');
  const name = event.target.elements.name.value;
  const linkabout = event.target.elements.linkabout.value;
  const USER_INFO_NAME = document.querySelector('.user-info__name');
  const USER_INFO_JOB = document.querySelector('.user-info__job');

  if (forma === document.newPlace) {
    addCard(name, linkabout);
    resetFormPopupButtonErrors(parent, forma, childButton);
  }
  if (forma === document.personal) {
    USER_INFO_JOB.textContent = linkabout;
    USER_INFO_NAME.textContent = name;
    resetFormPopupButtonErrors(parent, forma, childButton);
  }
}

/* обработчик input в формах */
function inputHandlerForms(event) {
  event.preventDefault();
  let errorOutPut;
  const inputLine = event.target;
  const forma = inputLine.closest('.popup__form');
  const button = forma.querySelector('.popup__button');
  const inputstringvalue = inputLine.value;
  const errorOutPutName = document.querySelector('.error__name');
  const errorOutPutPersonal = document.querySelector('.error__personal');
  const errorOutPutLink = document.querySelector('.error__link');
  const errorOutPutAbout = document.querySelector('.error__about');

  if (inputLine.classList.contains('popup__input_type_name')) {
    errorOutPut = errorOutPutName;
  }
  if (inputLine.classList.contains('popup__input_type_link-url')) {
    errorOutPut = errorOutPutLink;
  }
  if (inputLine.classList.contains('popup__input_type_personal')) {
    errorOutPut = errorOutPutPersonal;
  }
  if (inputLine.classList.contains('popup__input_type_about')) {
    errorOutPut = errorOutPutAbout;
  }

  onInputButton(button, false);
  if (forma === document.newPlace) {
    if (errorOutPut === errorOutPutName) {
      if (validInputStringEmpty(inputstringvalue, errorOutPut) && validInputStringLength(inputstringvalue, errorOutPut)) {
        onInputButton(button, false);
      }
    }
    if (errorOutPut === errorOutPutLink) {
      onInputButton(button, false);
      if (validInputStringIsLink(inputstringvalue)) {
        onInputButton(button, true);
        FORM_PLACE.addEventListener('submit', submitHandlerForms);
      }
    }
  }
  

  if (forma === document.personal) {
    if (validInputStringEmpty(inputstringvalue, errorOutPut) && validInputStringLength(inputstringvalue, errorOutPut)) {
      onInputButton(button, true);
      FORM_PERSONAL.addEventListener('submit', submitHandlerForms);
    } else {
      onInputButton(button, false);
    }
  }
}
/* Удаляем карточку */
function removeCardPlace(objTarget) {
  const parent = objTarget.closest('.place-card');
  PLACE_LIST.removeChild(parent);
}

/* Ставим лайк */
function likePlaceCard(objCard) {
  objCard.classList.toggle('place-card__like-icon_liked');
}

/* Ставим лайк или удаляем карточку обработчик события */
function likeOrremoveHandler(event) {
  const name = event.target;
  if (name.classList.contains('place-card__like-icon')) {
    likePlaceCard(name);
  }
  if (name.classList.contains('place-card__delete-icon')) {
    removeCardPlace(name);
  }
}

PLACE_LIST.addEventListener('click', likeOrremoveHandler);
PLACE_LIST.addEventListener('click', popupIsOpenClose);
USR_INFO.addEventListener('click', popupIsOpenClose);
popupInpuTypePersonal.addEventListener('input', inputHandlerForms);
popupInputTypeAbout.addEventListener('input', inputHandlerForms);
SCREEN_PLACE_CARD.addEventListener('click', popupIsOpenClose);
popupInputTypeName.addEventListener('input', inputHandlerForms);
popupInputTypeLinkUrl.addEventListener('input', inputHandlerForms);
FORM_PLACE.addEventListener('click', popupIsOpenClose);
FORM_PERSONAL.addEventListener('click', popupIsOpenClose);