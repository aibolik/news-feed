import {
  createSourcesList,
  createNewsCards
} from './viewCreators.js';

export default (function() {

  let instance;

  function init() {

    const NEWS_API_HOST = 'https://newsapi.org/v2/';
    const API_KEY = '300ecf7f1d8c4128876d195675a1f16b';

    return {
      getSourcesList(state) {
        console.log('Getting sources list');
        fetch(`${NEWS_API_HOST}sources?apiKey=${API_KEY}`)
          .then(res => res.json())
          .then(sources => {
            let sourcesList = createSourcesList(sources, state);
            let sourcesListNode = document.querySelector('.sources__list');
            for (let node of sourcesList) {
              sourcesListNode.appendChild(node);
            }
          })
          .catch(err => {
            console.error(err);
          })
      },

      getNews(state, page = 1) {
        console.log('Getting news');
        let sourcesList = state.getSelectedSources();
        if (sourcesList.length === 0) {
          sourcesList = ['google-news'];
        }
        let sources = sourcesList.join(',');
        let url = `${NEWS_API_HOST}${state.endpoint}?apiKey=${API_KEY}&sources=${sources}&page=${page}`;
        fetch(url)
          .then(res => res.json())
          .then(news => {
            console.log('We got news');
            let newsDomNodes = createNewsCards(news);
            let newsListNode = document.getElementById('news-list');
            for (let node of newsDomNodes) {
              newsListNode.appendChild(node);
            }
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
