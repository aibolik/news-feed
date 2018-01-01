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
  document.querySelector('.endpoints__item.endpoints__item--active').classList.remove('endpoints__item--active');
  e.target.classList.add('endpoints__item--active');
  state.endpoint = e.target.getAttribute('data-endpoint');
  let newsListNode = document.getElementById("news-list");
  while(newsListNode.hasChildNodes()) {
    newsListNode.removeChild(newsListNode.lastChild);
  }
  require.ensure([], (require) => {
    require('../scss/news.scss');
    const api = require('./requests.js').default.getInstance();
    api.getNews(state);
  }, null, 'requests');
}
