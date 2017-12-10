import { getNews } from './requests.js';

export const handleSourceClick = (e, state) => {
  let target = e.target;
  let dataSource = target.getAttribute('data-source');
  target.classList.toggle('sources__item--active');
  if (target.classList.contains('sources__item--active')) {
    state.sources[dataSource].selected = true;
  } else {
    state.sources[dataSource].selected = false;
  }
  document.querySelector('.sources__btn').classList.add('sources__btn--visible');
}

export const handleEndpointClick = (e, state) => {
  e.preventDefault();
  document.querySelector('.endpoint.endpoint--active').classList.remove('endpoint--active');
  e.target.classList.add('endpoint--active');
  state.endpoint = e.target.getAttribute('data-endpoint');
  let newsListNode = document.getElementById("news-list");
  while(newsListNode.hasChildNodes()) {
    newsListNode.removeChild(newsListNode.lastChild);
  }
  getNews(state);
}
