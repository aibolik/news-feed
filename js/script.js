const NEWS_API_HOST = 'https://newsapi.org/v2/';
const API_KEY = '300ecf7f1d8c4128876d195675a1f16b';

let state = {
  sources: {}
}

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

getTopHeadlines = (sourcesList = ['google-news']) => {
  let sources = sourcesList.join(',');
  let url = `${NEWS_API_HOST}top-headlines?apiKey=${API_KEY}&sources=${sources}`;
  fetch(url)
  .then(res => res.json())
  .then(news => {
    let newsDomNodes = createNewsCards(news);
    let newsListNode = document.getElementById("news-list");
    for (let node of newsDomNodes) {
      newsListNode.appendChild(node);
    }

  })
  .catch(err => {
    console.error(err);
  });
}

getHumanReadableTime = (timeString) => {
  let date = new Date(timeString);
  return date.toDateString();
}

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

applyFilter = (e) => {
  let sources = [];
  Object.keys(state.sources).map(key => {
    if (state.sources[key].selected) {
      sources.push(state.sources[key].id);
    }
  });
  if (sources.length === 0) {
    alert('Please, specify at least one source');
    return;
  }
  let newsListNode = document.getElementById("news-list");
  while(newsListNode.hasChildNodes()) {
    newsListNode.removeChild(newsListNode.lastChild);
  }
  getTopHeadlines(sources);
  e.target.classList.remove('sources__btn--visible');
  document.querySelector('.sources__list').classList.remove('sources__list--opened');
  document.querySelector('.sources__title .arrow').classList.remove('arrow--down');
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
        <img src="${urlToImage}" alt="${title}">
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

document.querySelector('.sources__btn').addEventListener('click', applyFilter);
document.querySelector('.sources__title').addEventListener('click', e => {
  document.querySelector('.sources__list').classList.toggle('sources__list--opened');
  document.querySelector('.sources__title .arrow').classList.toggle('arrow--down');
});

getSourcesList();
getTopHeadlines();


document.addEventListener('DOMContentLoaded', function () {

  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {

        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }

});
