const NEWS_API_HOST = 'https://newsapi.org/v2/';
const API_KEY = '300ecf7f1d8c4128876d195675a1f16b';

getTopHeadlines = (sourcesList = '', category = 'general') => {
  let sources = sourcesList.join(',');
  let url = `${NEWS_API_HOST}top-headlines?apiKey=${API_KEY}&category=${category}&sources=${sources}`;
  return fetch(url);
}

//2017-11-26T08:37:11Z
getHumanReadableTime = (timeString) => {
  let date = new Date(timeString);
  return date.toDateString();
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

getTopHeadlines(['abc-news-au'])
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
