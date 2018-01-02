import {
  newsCreator
} from './viewCreators.js';
import { actions } from './reducer.js';

export default (function() {

  let instance;

  function init() {

    const NEWS_API_HOST = 'https://newsapi.org/v2/';
    const API_KEY = '300ecf7f1d8c4128876d195675a1f16b';

    return {
      getSourcesList(store) {
        console.log('Getting sources list');
        fetch(`${NEWS_API_HOST}sources?apiKey=${API_KEY}`)
          .then(res => res.json())
          .then(sources => sources.sources.slice(0, 10))
          .then(sources => {
            store.dispatch(actions.fetchSources(sources));
          })
          .catch(err => {
            console.error(err);
          })
      },

      getNews(store, page = 1) {
        console.log('Getting news');
        let sourcesList = store.getSelectedSources();
        if (sourcesList.length === 0) {
          sourcesList = ['google-news'];
        }
        let sources = sourcesList.join(',');
        let url = `${NEWS_API_HOST}${store.getState().endpoint}?apiKey=${API_KEY}&sources=${sources}&page=${page}`;
        fetch(url)
          .then(res => res.json())
          .then(news => news.articles)
          .then(news => {
            console.log('We got news');
            store.dispatch(actions.fetchNews(news));
          })
          .catch(err => {
            console.error(err);
          });
      }
    }

  }

  return {
    getInstance() {
      if (!instance) {
        instance = init();
      }

      return instance;
    }
  }

})();
