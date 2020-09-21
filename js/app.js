const apiKey = 'b192f9a2ee0f4068bb68f021bb73bb06'; // Get API key from NewsAPI.org
const defaultSource = 'the-hindu'; // default source of news
const sourceSelector = document.querySelector('#news-selector');
const newsArticles = document.querySelector('#news-list');
const defaultSortby = 'top'
const sortbySelcector = document.querySelector('#sortby-selector')
const sortbyOptions = [
  { visibleOption : 'Top', query: 'top'},
  { visibleOption : 'Date Published', query: 'publishedAt'},
  { visibleOption : 'Popularity', query: 'popularity'}
]

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('./serviceWorker.js')
    .then(registration => console.log('Service Worker registered'))
    .catch(err => 'Service worker registration failed'));
}

window.addEventListener('load', e => {
  sourceSelector.addEventListener('change', evt => updateNews(evt.target.value));
  updateNewsSources().then(() => {
    sourceSelector.value = defaultSource;
    updateNews();
  });
  sortbySelcector.innerHTML = 
    sortbyOptions.map( option => `<option value="${option.query}">${option.visibleOption}</option>`)

  sortbySelcector.addEventListener('change', evt => updateNews(sourceSelector.value,evt.target.value))
});

window.addEventListener('online', () => updateNews(sourceSelector.value));

async function updateNewsSources() {
  const response = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
  const json = await response.json();
  sourceSelector.innerHTML =
    json.sources
    .map(source => `<option value="${source.id}">${source.name}</option>`)
    .join('\n');
}

async function updateNews(source = defaultSource,sortby = 'top') {
  newsArticles.innerHTML = '';
  const response = await fetch(`https://newsapi.org/v2/everything?sources=${source}&sortBy=${sortby}&apiKey=${apiKey}`);
  const json = await response.json();
  console.log('Articles fetched', json);
  newsArticles.innerHTML =
    json.articles.map(createArticle).join('\n');
}



function createArticle(article) {
  return `
      <a class="story" href="${article.url}">
        <img class="story-image" src="${article.urlToImage}" alt="${article.title}">
        <p class="headline">${article.title}</p>
        <p class="author">${article.author ? article.author : ''}</p>
        <p class="description">${article.description}</p>
      </a>
  `;
}
