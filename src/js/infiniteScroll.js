import refs from './refs';
import { apiService, renderImg } from '../index';

export default function infiniteLoad() {
  const observer = new IntersectionObserver(imageObserve);
  observer.observe(refs.gallery.lastElementChild);

  function imageObserve(entries) {
    entries.forEach(el => {
      if (!el.isIntersecting) {
        return;
      }
      addImages(el);
    });
  }

  async function addImages(el) {
    const data = await apiService.fetchArticles();
    observer.unobserve(el.target);
    renderImg(data);
    observer.observe(refs.gallery.lastElementChild);
  }
}
