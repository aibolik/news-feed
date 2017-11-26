class NewsApi {
  static const HOST = 'https://newsapi.org/v2/';

  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  getTopHeadlines(sourcesList = '', category = 'general') {
    let sources = sourcesList.join(',');
    let url = `${this.HOST}top-headlines?apiKey=${this.apiKey}&category=${category}&sources=${sources}`;
    return fetch(url);
  }
}

// module.exports
