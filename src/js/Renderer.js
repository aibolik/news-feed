import { handleSourceClick } from './eventHandlers';

export default class Renderer {
  constructor(store, sourcesContainer, newsContainer, sourceCreator, newsCreator) {
    this.store = store;
    this.sourcesContainer = sourcesContainer;
    this.newsContainer = newsContainer;
    this.sourceCreator = sourceCreator;
    this.newsCreator = newsCreator;
  }

  clearSources() {
    this.sourcesContainer.innerHTML = '';
  }

  renderSources() {
    this.clearSources();
    let sourcesList = this.sourceCreator.createSourcesList(this.store.getState().sources);
    for (let source of sourcesList) {
      source.addEventListener('click', (e) => {
        handleSourceClick(e, this.store);
      });
      this.sourcesContainer.appendChild(source);
    }
  }

  clearNews() {
    this.newsContainer.innerHTML = '';
  }

  renderNews() {
    this.clearNews();
    let newsList = this.newsCreator.createNewsCards(this.store.getState().news);
    for(let newsItem of newsList) {
      this.newsContainer.appendChild(newsItem);
    }

  }

  render() {
    this.renderSources();
    this.renderNews();
  }
}