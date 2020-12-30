import './styles.css';

import debounce from 'lodash.debounce';
import '../node_modules/toastr/build/toastr.css';
import toastr from 'toastr';

import templateItems from './templates/resultSearchList.hbs';
import templateOneCountry from './templates/onlyOneResult.hbs';
import fetchCountries from './js/fetchCountries';

//==================================================================
const refs = {
  inputSearch: document.querySelector('#searchQuery'),
  searchItems: document.querySelector('ul.js-countries'),
};

//==================================================================

const makeItEmpty = () => {
  refs.searchItems.innerHTML = '';
};

//==================================================================
const countriesListMarkUp = (names, makeLikeThis) => {
  const template = makeLikeThis(names);
  makeItEmpty();
  refs.searchItems.insertAdjacentHTML('afterbegin', template);
};

const chooseRightTemplate = answer => {
  if (answer.length > 10) {
    errorNotify(1);
  } else if (2 <= answer.length && answer.length <= 10) {
    countriesListMarkUp(answer, templateItems);
  } else {
    countriesListMarkUp(answer, templateOneCountry);
  }
  return answer;
};

//==================================================================

const inputHandler = () => {
  const searchQuery = refs.inputSearch.value;
  if (searchQuery === '') {
    return makeItEmpty();
  }

  fetchCountries(searchQuery)
    .then(answer => chooseRightTemplate(answer))
    .then(({ status }) => {
      if (status === 404) {
        makeItEmpty();
        errorNotify(0);
      }
    });
};

const errorNotify = number =>
  number === 1
    ? toastr.error(
        'Too many matches found. Please enter a more specific query!',
      )
    : toastr.error('Unlucky! Please try one more time, honey ¯|_(ツ)_/¯');

const debounced = debounce(inputHandler, 500);

refs.inputSearch.addEventListener('input', debounced);

//======================================

toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: 'toast-top-right',
  preventDuplicates: false,
  onclick: null,
  showDuration: '300',
  hideDuration: '1000',
  timeOut: '5000',
  extendedTimeOut: '1000',
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
};
