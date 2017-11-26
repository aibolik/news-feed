const NEWS_API_HOST = 'https://newsapi.org/v2/';
const API_KEY = '300ecf7f1d8c4128876d195675a1f16b';

getTopHeadlines = (sourcesList = '') => {
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
  let target = e.target.parentNode;
  let dataSource = target.getAttribute('data-source');
  document.querySelector('.source.is-active').classList.remove('is-active');
  target.classList.add('is-active');
  let newsListNode = document.getElementById("news-list");
  while(newsListNode.hasChildNodes()) {
    newsListNode.removeChild(newsListNode.lastChild);
  }
  getTopHeadlines([dataSource]);
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

let sourceLinks = document.getElementsByClassName('source');
Array.from(sourceLinks).forEach(element => {
  element.addEventListener('click', handleSourceClick);
});

getTopHeadlines(['abc-news-au']);
