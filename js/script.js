const NEWS_API_HOST = 'https://newsapi.org/v2/';
const API_KEY = '300ecf7f1d8c4128876d195675a1f16b';

let state = {
  endpoint: 'top-headlines',
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
}

// Requests

getSourcesList = () => {
  fetch(`${NEWS_API_HOST}sources?apiKey=${API_KEY}`)
  .then(res => res.json())
  .then(sources => {
    let sourcesList = createSourcesList(sources);
    let sourcesListNode = document.querySelector('.sources__list');
    for (let node of sourcesList) {
      sourcesListNode.appendChild(node);
    }
  })
  .catch(err => {
    console.error(err);
  })
}

getNews = (sourcesList = ['google-news'], page = 1) => {
  if (sourcesList.length === 0) {
    sourcesList = ['google-news'];
  }
  let sources = sourcesList.join(',');
  let url = `${NEWS_API_HOST}${state.endpoint}?apiKey=${API_KEY}&sources=${sources}&page=${page}`;
  fetch(url)
  .then(res => res.json())
  .then(news => {
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

// View creators

createSourceItem = ({ id, name, url }) => {
  state.sources[id] = {
    id,
    name,
    url,
    selected: false
  };
  let element = document.createElement('li');
  element.classList.add('sources__item');
  element.setAttribute('data-source', id);
  element.innerHTML = `${name}`;
  element.addEventListener('click', handleSourceClick);
  return element;
}

createSourcesList = sources => {
  return sources.sources.slice(0, 10).map(item => createSourceItem(item));
}

createNewsCard = ({
  source: {
    name
  },
  author = 'Not declared',
  title,
  description,
  url,
  urlToImage,
  publishedAt
}) => {
  let element = document.createElement('li');
  // element.classList.add('tile', 'is-4', 'is-child', 'box');
  element.innerHTML = `<div class="news-item">
      <figure class="image is-128x128">
        <img class="${urlToImage ? '' : 'no-image'}" src="${urlToImage || ''}" alt="${title}">
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
}

createNewsCards = news => {
  return news.articles.map(newsItem => createNewsCard(newsItem));
}

// Event handlers

handleSourceClick = (e) => {
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

handleEndpointClick = (e) => {
  e.preventDefault();
  document.querySelector('.endpoint.endpoint--active').classList.remove('endpoint--active');
  e.target.classList.add('endpoint--active');
  state.endpoint = e.target.getAttribute('data-endpoint');
  let newsListNode = document.getElementById("news-list");
  while(newsListNode.hasChildNodes()) {
    newsListNode.removeChild(newsListNode.lastChild);
  }
  let sources = state.getSelectedSources();
  getNews(sources);
}

applyFilter = (e) => {
  let sources = state.getSelectedSources();
  if (sources.length === 0) {
    alert('Please, specify at least one source');
    return;
  }
  let newsListNode = document.getElementById("news-list");
  while(newsListNode.hasChildNodes()) {
    newsListNode.removeChild(newsListNode.lastChild);
  }
  getNews(sources);
  e.target.classList.remove('sources__btn--visible');
  document.querySelector('.sources__list').classList.remove('sources__list--opened');
  document.querySelector('.sources__title .arrow').classList.remove('arrow--down');
}

// Utils

getHumanReadableTime = (timeString) => {
  let date = new Date(timeString);
  return date.toDateString();
}

// Main body

// attaching click handlers

document.querySelector('.sources__btn').addEventListener('click', applyFilter);
document.querySelector('.sources__title').addEventListener('click', e => {
  document.querySelector('.sources__list').classList.toggle('sources__list--opened');
  document.querySelector('.sources__title .arrow').classList.toggle('arrow--down');
});
let $endpoints = document.querySelectorAll('.endpoint');
$endpoints.forEach(element => {
  element.addEventListener('click', handleEndpointClick);
});

// attach click handler for mobile navigation

// Get all "navbar-burger" elements
let $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

// Check if there are any navbar burgers
if ($navbarBurgers.length > 0) {

  // Add a click event on each of them
  $navbarBurgers.forEach(function ($el) {
    $el.addEventListener('click', function () {

      // Get the target from the "data-target" attribute
      let target = $el.dataset.target;
      let $target = document.getElementById(target);

      // Toggle the class on both the "navbar-burger" and the "navbar-menu"
      $el.classList.toggle('is-active');
      $target.classList.toggle('is-active');

    });
  });
}

// start requests

getSourcesList();
getNews();
