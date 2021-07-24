import './sass/main.scss';

import * as basicLightbox from 'basiclightbox';
import debounce from 'lodash.debounce';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import ApiService from './js/apiService';
// import infiniteLoad from './js/infiniteScroll';
import cardTpl from './templates/photoCard.hbs';

export const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('input', debounce(onSearch, 500));
refs.gallery.addEventListener('click', onImgClick);

const apiService = new ApiService();

function onSearch({ target: { value } }) {
  refs.gallery.innerHTML = '';
  if (!value.trim().length) {
    return;
  }

  apiService.query = value.trim();
  apiService.resetPage();
  apiService
    .fetchArticles()
    .then(data => {
      if (data.hits.length === 0) {
        error({
          text: 'Nothing matches found.',
        });
        return;
      }
      renderImg(data);
      infiniteLoad();
    })
    .catch(e => {
      error({
        text: `${e}`,
      });
    });
}

function onImgClick({ target }) {
  if (target.tagName !== 'IMG') {
    return;
  }

  basicLightbox.create(`<img src="${target.dataset.largeimg}">`).show();
}

function renderImg(data) {
  refs.gallery.insertAdjacentHTML('beforeend', cardTpl(data));
}

function infiniteLoad() {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(item => {
      if (!item.isIntersecting) {
        return;
      }
      apiService.fetchArticles().then(data => {
        observer.unobserve(item.target);
        renderImg(data);
        observer.observe(refs.gallery.lastElementChild);
      });
    });
  });
  observer.observe(refs.gallery.lastElementChild);
}
