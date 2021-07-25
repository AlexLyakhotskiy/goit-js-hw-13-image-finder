import * as basicLightbox from 'basiclightbox';
import debounce from 'lodash.debounce';
import { success, error } from '@pnotify/core';
import { Spinner } from 'spin.js';

import refs from './js/refs';
import ApiService from './js/apiService';
import infiniteLoad from './js/infiniteScroll';
import cardTpl from './templates/photoCard.hbs';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import './sass/main.scss';

refs.form.addEventListener('input', debounce(onSearch, 500));
refs.form.addEventListener('submit', e => e.preventDefault());
refs.gallery.addEventListener('click', onImgClick);

const spinner = new Spinner({ color: '#fff', radius: 12, length: 12 });
export const apiService = new ApiService();

function onSearch({ target: { value } }) {
  refs.gallery.innerHTML = '';
  const trimedValue = value.trim();
  if (!trimedValue.length) {
    return;
  }
  responseImg(trimedValue);
}

function onImgClick({ target }) {
  if (target.tagName !== 'IMG') {
    return;
  }
  basicLightbox.create(`<img src="${target.dataset.largeimg}">`).show();
}

async function responseImg(value) {
  apiService.query = value;
  apiService.resetPage();
  spinner.spin(document.body);
  try {
    const data = await apiService.fetchArticles();
    if (!data.hits.length) {
      error({
        text: 'Nothing matches found.',
        delay: 800,
      });
      return;
    }
    success({
      text: `Your query: '${value}' was found.`,
      delay: 1000,
    });
    renderImg(data);
    infiniteLoad();
  } catch (e) {
    error({
      text: `${e}`,
    });
  } finally {
    spinner.stop();
  }
}

export function renderImg(data) {
  refs.gallery.insertAdjacentHTML('beforeend', cardTpl(data));
}
