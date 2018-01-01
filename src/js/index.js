import 'babel-polyfill';
import 'whatwg-fetch';
import '../scss/style.scss';
import { handleEndpointClick } from './eventHandlers';

const ENDPOINT_TOP_HEADLINE = 'top-headlines';

let state = {
  endpoint: ENDPOINT_TOP_HEADLINE,
  sources: {},
  getSelectedSources() {
    let sources = [];
    Object.keys(this.sources).map(key => {
      if (state.sources[key].selected) {
        sources.push(state.sources[key].id);
      }
    });
    return sources;
  }
};

let applyFilter = (e) => {
  let sources = state.getSelectedSources();
  if (sources.length === 0) {
    alert('Please, specify at least one source');
    return;
  }
  let newsListNode = document.getElementById("news-list");
  while(newsListNode.hasChildNodes()) {
    newsListNode.removeChild(newsListNode.lastChild);
  }
  require.ensure([], (require) => {
    const api = require('./requests.js').default.getInstance();
    api.getNews(state);
  }, null, 'requests');
  e.target.classList.remove('sources__btn--visible');
  document.querySelector('.sources__list').classList.remove('sources__list--opened');
  document.querySelector('.sources__title .arrow').classList.remove('arrow--down');
};

// attaching click handlers

document.querySelector('.sources__btn').addEventListener('click', applyFilter);
document.querySelector('.sources__title').addEventListener('click', e => {
  document.querySelector('.sources__list').classList.toggle('sources__list--opened');
  document.querySelector('.sources__title .arrow').classList.toggle('arrow--down');
});
let $endpoints = document.querySelectorAll('.endpoints__item');
for (var i = 0; i < $endpoints.length; i++) {
  var element = $endpoints[i];
  element.addEventListener('click', (e) => {
    handleEndpointClick(e, state);
  });
}

document.querySelector('.news-list__fetch').addEventListener('click', (e) => {
  e.target.classList.toggle('news-list__fetch--hidden');
  require.ensure([], (require) => {
    require('../scss/news.scss');
    const api = require('./requests.js').default.getInstance();
    api.getNews(state);
    api.getSourcesList(state);
    document.querySelector('.endpoints').classList.remove('endpoints--hidden');
  }, null, 'requests');
});

// attach click handler for mobile navigation

let $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

if ($navbarBurgers.length > 0) {

  for (var i = 0; i < $navbarBurgers.length; i++) {
    var $el = $navbarBurgers[i];
    $el.addEventListener('click', function () {
      let target = $el.getAttribute('data-target');
      let $target = document.getElementById(target);

      $el.classList.toggle('is-active');
      $target.classList.toggle('is-active');
    });
  }
}
