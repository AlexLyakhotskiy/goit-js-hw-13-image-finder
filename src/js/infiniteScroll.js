// import { galleryEl } from '../index';
// import ApiService from './js/apiService';

// export default function infiniteLoad() {
//   const observer = new IntersectionObserver((entries, observer) => {
//     entries.forEach(item => {
//       if (!item.isIntersecting) {
//         return;
//       }

//       apiService.fetchArticles().then(data => {
//         observer.unobserve(item.target);
//         renderImg(data);
//         observer.observe(galleryEl.lastElementChild);
//       });
//     });
//   });
//   observer.observe(galleryEl.lastElementChild);
// }
