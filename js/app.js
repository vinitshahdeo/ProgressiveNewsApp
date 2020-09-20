const apiKey = 'e32c17e50bf24b76b3e57bcae6c416f8'; // Get API key from NewsAPI.org
const defaultSource = 'the-hindu'; // default source of news
const sourceSelector = document.querySelector('#news-selector');
const newsArticles = document.querySelector('#news-list');

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

async function updateNews(source = defaultSource) {
  newsArticles.innerHTML = '';
  const response = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&sortBy=top&apiKey=${apiKey}`);
  const json = await response.json();
  console.log('Articles fetched', json);
  newsArticles.innerHTML =
    json.articles.map(createArticle).join('\n');
}

/**
 * @param {*} n 
 * Pad function to add leading zeroes
 */
function pad(n) { return n < 10 ? '0' + n : n; }

/**
 * @param {*} date 
 * Formats a date into readable human format
 */
function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let tmpDate = new Date(date);
  return `${pad(tmpDate.getDate())} ${months[(tmpDate.getMonth() - 1)]} ${tmpDate.getFullYear()} - ${pad(tmpDate.getHours())}:${pad(tmpDate.getMinutes())}`;
}

function createArticle(article) {
  return `
      <a class="story" href="${article.url}">
        <img class="story-image" src="${article.urlToImage}" alt="${article.title}">
        <p class="headline">${article.title}</p>
        <time class="date" datetime="${article.publishedAt}">${formatDate(article.publishedAt)}</time>
        <p class="author">${article.author ? article.author : ''}</p>
        <p class="description">${article.description}</p>
      </a>
  `;
}
