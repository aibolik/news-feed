import { StoreManager } from './reducer.js';

export const handleSourceClick = (e, store) => {
  let target = e.target;
  let dataSource = target.getAttribute('data-source');
  store.dispatch(StoreManager.execute('SOURCES_TOGGLE', dataSource));
  document.querySelector('.sources__btn').classList.add('sources__btn--visible');
}

export const handleEndpointClick = (e, store) => {
  e.preventDefault();
  document.querySelector('.endpoints__item.endpoints__item--active').classList.remove('endpoints__item--active');
  e.target.classList.add('endpoints__item--active');
  let endpoint = e.target.getAttribute('data-endpoint');
  store.dispatch(StoreManager.execute('ENDPOINT_CHANGE', endpoint));
  require.ensure([], (require) => {
    require('../scss/news.scss');
    const api = require('./requests.js').default.getInstance();
    api.getNews(store);
  }, null, 'requests');
}

export const handleApplyFilter = (e, store) => {
  let sources = store.getSelectedSources();
  if (sources.length === 0) {
    alert('Please, specify at least one source');
    return;
  }
  require.ensure([], (require) => {
    const api = require('./requests.js').default.getInstance();
    api.getNews(store);
  }, null, 'requests');
  e.target.classList.remove('sources__btn--visible');
  document.querySelector('.sources__list').classList.remove('sources__list--opened');
  document.querySelector('.sources__title .arrow').classList.remove('arrow--down');
}
