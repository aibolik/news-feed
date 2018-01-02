const ENDPOINT_TOP_HEADLINE = 'top-headlines';

export const ENDPOINT_CHANGE = 'ENDPOINT_CHANGE';
export const SOURCES_FETCH = 'SOURCES_FETCH';
export const SOURCES_TOGGLE = 'SOURCES_TOGGLE';
export const NEWS_FETCH = 'NEWS_FETCH';

export function changeEndpoint(endpoint) {
  return {
    type: ENDPOINT_CHANGE,
    payload: endpoint
  };
};

export function fetchSources(sources) {
  return {
    type: SOURCES_FETCH,
    payload: sources
  };
};

export function toggleSource(source) {
  return {
    type: SOURCES_TOGGLE,
    payload: source
  };
};

export function fetchNews(news) {
  return {
    type: NEWS_FETCH,
    payload: news
  }
}

export const actions = {
  changeEndpoint,
  fetchSources,
  toggleSource,
  fetchNews
};

const ACTION_HANDLERS = {
  [ENDPOINT_CHANGE]: (state, action) => {
    let payload = Object.assign({}, state);
    payload.endpoint = action.payload;

    return payload;
  },
  [SOURCES_FETCH]: (state, action) => {
    let payload = Object.assign({}, state);
    let sources = action.payload;

    for (let source of sources) {
      payload.sources[source.id] = {
        id: source.id,
        name: source.name,
        url: source.url,
        selected: false
      };
    }

    return payload;
  },
  [SOURCES_TOGGLE]: (state, action) => {
    let payload = Object.assign({}, state);
    let source = action.payload;
    payload.sources[source].selected = !payload.sources[source].selected;

    return payload;
  },
  [NEWS_FETCH]: (state, action) => {
    let payload = Object.assign({}, state);
    let news = action.payload;
    payload.news = news;

    return payload;
  }
}

const initialState = {
  endpoint: ENDPOINT_TOP_HEADLINE,
  sources: {},
  news: []
}
export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
