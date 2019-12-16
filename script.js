const placeList = document.querySelector('.places-list');
const userInfo = document.querySelector('.user-info');
const FormPlace = document.forms.newPlace;
const formPersonal = document.forms.personal;
const screenPlaceCard = document.querySelector('.popup__scrplacecard');
const popupInputTypeName = document.querySelector('.popup__input_type_name');
const popupInputTypeLinkUrl = document.querySelector('.popup__input_type_link-url');
const popupInpuTypePersonal = document.querySelector('.popup__input_type_personal');
const popupInputTypeAbout = document.querySelector('.popup__input_type_about');
const errorOutputStrings = {
  validationLenght: 'Должно быть от 2 до 30 символов',
  validationEmpty: 'Это обязательное поле',
  validationLink: 'Здесь должна быть ссылка'
};
const errorOutPutName = document.querySelector('.error__name');
const errorOutPutPersonal = document.querySelector('.error__personal');
const errorOutPutLink = document.querySelector('.error__link');
const errorOutPutAbout = document.querySelector('.error__about');

/* Создаем и рендерим карточку */
function addCard(imgName, imgLink) {
  const placeCard = document.createElement('div');
  const htmlBlock = '<div class="place-card__image">'
    + '<button class = "place-card__delete-icon"></button>'
    + '</div>'
    + '<div class = "place-card__description">'
    + '<h3 class = "place-card__name"></h3>'
    + '<button class = "place-card__like-icon"></button>'
    + '</div>';
  placeCard.classList.add('place-card');
  placeCard.insertAdjacentHTML('beforeend', htmlBlock);  
  const placeCardimage = placeCard.querySelector('.place-card__image');
  const placeCardname = placeCard.querySelector('.place-card__name');
  placeCardimage.style.backgroundImage = `url(${imgLink})`;
  placeCardname.textContent = imgName;
  placeList.appendChild(placeCard);
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
  const parentPopup = parameter.closest('.popup');

  if (parameter.classList.contains('place-card__image')) {
    screenPlaceCard.classList.toggle('popup_is-opened');
    imagelink.setAttribute('src', parameter.style.backgroundImage.slice(5, -2));
  } else if (parameter.classList.contains('button-user-info__set')) {
    parentNewPlace.classList.toggle('popup_is-opened');
  } else if (parameter.classList.contains('button-edit__set')) {
    parentPersonal.classList.toggle('popup_is-opened');
    onInputButton(parentPersonal.querySelector('.popup__button'), true);
  } else if (parameter.classList.contains('popup__close')) {
    if (parameter.closest('.popup').classList.contains('popup__scrplacecard')) {
      screenPlaceCard.classList.remove('popup_is-opened');
    } else {
      resetErrors(parentPopup);
      parentPopup.querySelector('.popup__form').reset();
      parentPopup.classList.remove('popup_is-opened');
    }
  }
}

/*  Не ссылка валидация input'а формы Новое место */
function validInputStringIsLink(inputString) {
  const errorlink = document.querySelector('.error__link');
  const teststr = /(^https?:\/\/)/;
  if (!teststr.test(inputString)) {
    errorlink.textContent = errorOutputStrings.validationLink;
    return false;
  }
  errorlink.textContent = '';
  return true;
}

/* Длина строки валидация input'а формы */
function validInputStringLength(inputString, outPutError) {
  if ((inputString.length <= 1) || (inputString.length > 30)) {
    outPutError.textContent = errorOutputStrings.validationLenght;
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
  outPutError.textContent = errorOutputStrings.validationEmpty;
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
  const userInfoName = document.querySelector('.user-info__name');
  const userInfoJob = document.querySelector('.user-info__job');

  if (forma === document.newPlace) {
    addCard(name, linkabout);
    resetFormPopupButtonErrors(parent, forma, childButton);
  }
  if (forma === document.personal) {
    userInfoJob.textContent = linkabout;
    userInfoName.textContent = name;
    resetFormPopupButtonErrors(parent, forma, childButton);
  }
}

function defineOutputErrorString(lineValue) {
  if (lineValue.classList.contains('popup__input_type_name')) {
    return errorOutPutName;
  }
  if (lineValue.classList.contains('popup__input_type_link-url')) {
    return errorOutPutLink;
  }
  if (lineValue.classList.contains('popup__input_type_personal')) {
    return errorOutPutPersonal;
  }
  if (lineValue.classList.contains('popup__input_type_about')) {
    return errorOutPutAbout;
  }
  return false;
}

function validationFormPlace(errorOutPutPlace, formButton, inputstringvalueForm) {
  if (errorOutPutPlace.classList.contains('error__name')) {
    if (validInputStringEmpty(inputstringvalueForm, errorOutPutPlace) && validInputStringLength(inputstringvalueForm, errorOutPutPlace)) {
      onInputButton(formButton, false);
    }
  } else if (errorOutPutPlace.classList.contains('error__link')) {
    onInputButton(formButton, false);
    if (validInputStringIsLink(inputstringvalueForm)) {
      onInputButton(formButton, true);
      FormPlace.addEventListener('submit', submitHandlerForms);
    }
  }
}

function validationFormPersonal(errorOutPerson, formButton, inputstringvalueForm) {
  if (errorOutPerson.classList.contains('error__personal')) {
    if (validInputStringEmpty(inputstringvalueForm, errorOutPerson) && validInputStringLength(inputstringvalueForm, errorOutPerson)) {
      onInputButton(formButton, false);
    }
  } else if (errorOutPerson.classList.contains('error__about')) {
    onInputButton(formButton, false);
    if (validInputStringEmpty(inputstringvalueForm, errorOutPerson) && validInputStringLength(inputstringvalueForm, errorOutPerson)) {
      onInputButton(formButton, true);
      formPersonal.addEventListener('submit', submitHandlerForms);
    }
  }
}

/* обработчик input в формах */
function inputHandlerForms(event) {
  event.preventDefault();
  const inputLine = event.target;
  const forma = inputLine.closest('.popup__form');
  const button = forma.querySelector('.popup__button');
  const inputstringvalue = inputLine.value;
  const errorOutPut = defineOutputErrorString(inputLine);

  onInputButton(button, false);
  if (forma === document.newPlace) {
    validationFormPlace(errorOutPut, button, inputstringvalue);
  }
  if (forma === document.personal) {
    validationFormPersonal(errorOutPut, button, inputstringvalue);
  }
}

/* Удаляем карточку */
function removeCardPlace(objTarget) {
  const parent = objTarget.closest('.place-card');
  placeList.removeChild(parent);
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

placeList.addEventListener('click', likeOrremoveHandler);
placeList.addEventListener('click', popupIsOpenClose);
userInfo.addEventListener('click', popupIsOpenClose);
popupInpuTypePersonal.addEventListener('input', inputHandlerForms);
popupInputTypeAbout.addEventListener('input', inputHandlerForms);
screenPlaceCard.addEventListener('click', popupIsOpenClose);
popupInputTypeName.addEventListener('input', inputHandlerForms);
popupInputTypeLinkUrl.addEventListener('input', inputHandlerForms);
FormPlace.addEventListener('click', popupIsOpenClose);
formPersonal.addEventListener('click', popupIsOpenClose);