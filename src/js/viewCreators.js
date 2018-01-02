import {
  getHumanReadableTime
} from './utils.js';
import { handleSourceClick } from './eventHandlers.js';

const sourceCreatorPrototype = {
  createSourceItem({
    id,
    name,
    url,
    selected
  }) {
    let element = document.createElement('li');
    element.classList.add('sources__item');
    element.setAttribute('data-source', id);
    element.innerHTML = `${name}`;
    if (selected) {
      element.classList.add('sources__item--active');
    }
    return element;
  },
  createSourcesList(sources) {
    let sourcesList = [];
    for (let source in sources) {
      sourcesList.push(this.createSourceItem(sources[source]));
    }
    return sourcesList;
  }
};

const newsCreatorPrototype = {
  createNewsCard({
    source: {
      name
    },
    author = 'Not declared',
    title,
    description,
    url,
    urlToImage,
    publishedAt
  }) {
    let element = document.createElement('li');
    let image = urlToImage ?
      `<img src=${urlToImage} alt=${title} />` :
      `<img class='no-image' alt=${title} />`;
    element.innerHTML = `<div class="news-item">
          <figure class="image is-128x128">
            ${image}
          </figure>
          <div class="content">
            <a href="${url}" target="_blank" class="title">${title}</a>
            <p>
              ${description}
              <br />
              <span class="news-item__source">Source: ${name}</span>
              <br />
              <span class="news-item__date">Published at: ${getHumanReadableTime(publishedAt)}</span>
            </p>
          </div>
        </a>`;
    return element;
  },
  createNewsCards(news) {
    return news.map(newsItem => this.createNewsCard(newsItem));
  }
};

const beget = (function() {
  function F() {}

  return function(proto) {
    F.prototype = proto;
    return new F();
  };
})();

export const newsCreator = beget(newsCreatorPrototype);
export const sourceCreator = beget(sourceCreatorPrototype);
