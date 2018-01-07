import 'babel-polyfill';
import 'whatwg-fetch';
import '../scss/style.scss';
import {
  sourceCreator,
  newsCreator
} from './viewCreators.js';
import {
  handleEndpointClick,
  handleApplyFilter
} from './eventHandlers';
import {
  createStore
} from './redux.js';
import reducer from './reducer.js';
import Renderer from './Renderer.js';

const store = createStore(reducer);

const renderer = new Renderer(
  store,
  document.querySelector('.sources__list'),
  document.querySelector('#news-list'),
  sourceCreator,
  newsCreator
);

/*
* Implementation of Strategy behavioral pattern.
* We set Strategy that creates news. We can set different
* strategies to get different results.
*/
renderer.setNewsCreator(newsCreator);
renderer.setSourceCreator(sourceCreator);

store.subscribe(() => {
  renderer.render();
});

/*
  Decorate default store to add helper method
*/
store.getSelectedSources = function() {
  let sources = this.getState().sources;
  let sourcesList = [];
  for (let sourceId in sources) {
    if (sources[sourceId].selected) {
      sourcesList.push(sourceId);
    }
  }
  return sourcesList;
};

/*
  Handler for applying sources filter
*/
document.querySelector('.sources__btn').addEventListener('click', e => {
  handleApplyFilter(e, store);
});

/*
  Handler for endpoints
*/
let $endpoints = document.querySelectorAll('.endpoints__item');
for (var i = 0; i < $endpoints.length; i++) {
  var element = $endpoints[i];
  element.addEventListener('click', (e) => {
    handleEndpointClick(e, store);
  });
}

/*
  Handler for initial loading of items
*/
document.querySelector('.news-list__fetch').addEventListener('click', (e) => {
  e.target.classList.toggle('news-list__fetch--hidden');
  require.ensure([], (require) => {
    require('../scss/news.scss');
    const api = require('./requests.js').default.getInstance();
    api.getNews(store);
    api.getSourcesList(store);
    document.querySelector('.endpoints').classList.remove('endpoints--hidden');
  }, null, 'requests');
});

/*
 Setup for responsive dropdown and mobile navigation burger
*/
document.querySelector('.sources__title').addEventListener('click', e => {
  document.querySelector('.sources__list').classList.toggle('sources__list--opened');
  document.querySelector('.sources__title .arrow').classList.toggle('arrow--down');
});

let $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

if ($navbarBurgers.length > 0) {

  for (var i = 0; i < $navbarBurgers.length; i++) {
    var $el = $navbarBurgers[i];
    $el.addEventListener('click', function() {
      let target = $el.getAttribute('data-target');
      let $target = document.getElementById(target);

      $el.classList.toggle('is-active');
      $target.classList.toggle('is-active');
    });
  }
}
