const { addToDoItems, getToDoItemById } = require('../db/queries/toDoItems');
const SerpWow = require('google-search-results-serpwow');
// create the serpwow object
const serpwow = new SerpWow(process.env.SerpWowKey);
const axios = require('axios');

/**
 * 1 - Pre-defined tags containing the keywords used to categorize the toDoItem
 * 2 - Building the regex with tags
 * 3 - Combines all regex into object to pass into function to categorize the toDoItem
 */
// 1
const watchTags = ['watch', 'movie', 'film', 'directed', 'imdb', 'starring', 'television', 'netflix', 'tv', 'sitcom'];
const readTags = ['journal', 'textbook', 'read', 'published', 'novel', 'author', 'non-fiction', 'book', 'paperback', 'novels'];
const eatTags = ['cafe', 'food', 'recipe', 'menu', 'yelp', 'foodora', 'restaurant', 'eat', 'place'];
// 2
const watchRegex = buildRegex(watchTags);
const readRegex = buildRegex(readTags);
const eatRegex = buildRegex(eatTags);
// 3
const regexObj = {
  1: watchRegex,
  2: readRegex,
  3: eatRegex
};

/**
 * returns regex as an object
 * @param {Array} keywords for each specific category
 * @return {Object} Object with regex
 */
function buildRegex(tags) {
  return new RegExp("\\b(" + tags.join('|') + ")\\b", "ig")
}

/**
 * Get the user input and filter if there's a verb on that string by using our constructed object
 * @param {String}toDoItems the user input
 * @return {Boolean}false||{CategoryID}
 */
const categorizeByVerb = function (toDoItem) {
  const verbs = {
    watch: { 1: 'movies' },
    read: { 2: 'books' },
    eat: { 3: 'restaurants' },
    buy: { 4: 'products' }
  };
  const key = toDoItem.toLowerCase().split(' ');
  if (key.length > 1 && verbs.hasOwnProperty(key[0])) {
    return Number(Object.keys(verbs[key[0]]));
  }
  return false;
}

/**
 * return top 10 organic search results from google
 * https://www.npmjs.com/package/google-search-results-serpwow
 * @param {String} what the user inputs
 * @return {[Objects]} what the function returns
 */
const getSearchResults = (queryString) => {
  /*return new Promise( (resolve, reject) => {
    let result = serpwow.json({
      q: queryString,
      gl: 'ca',
      hl: 'en',
      location: 'Toronto,Ontario,Canada',
      google_domain: 'google.ca',
      num: 3
    });*/
  const params = {
    api_key: serpwow,
      q: queryString,
      engine: "google",
      location: "Toronto,Ontario,Canada",
      google_domain: "google.ca",
      gl: "ca",
      hl: "en",
      page: "1",
      num: "3"
    }

  // make the http GET request to SerpWow
  axios.get('https://api.serpwow.com/search', { params })
  .then(response => {
    if (!result.organic_results) {
      resolve(result.local_results);
    } else {
      resolve(result.organic_results);
    }
  });
};

/**
 * returns string with all results of API call
 * @param {Array} objects of top 10 google search
 * @return {String} to use in next function
 */
const combineResults = (arr) => {
  let str = '';
  for (let obj of arr) {
    str += str.concat(' ', obj.title.concat(' ', obj.snippet));
  }
  return str.toLowerCase();
}

/**
 * Returns category id
 * @param {String} final results from api results to compare against specific keywords
 * @return {Number} category_id
 */
const getCategory = function (string) {
  let arr = [];
  result = null;

  for (const regex in regexObj) {
    if (string.match(regexObj[regex]) && string.match(regexObj[regex]).length > arr.length) {
      arr = string.match(regexObj[regex]);
      result = Number(regex);
    }
  }
  if (!result) {
    result = 4;
  }
  return result;
}

/**
 * Calls addToDoItem function and inserts toDoItem into database
 * @param {String} toDoItem from user input
 * @return nothing yet..??? maybe something later
 */
const categorizeToDoItem =  async (obj) => {
  const { toDoItem, user_id } = obj;

  // check if toDoItem already exists for that user
  const toDoItems = await getToDoItemById(user_id);
  for (t of toDoItems) {
    if (t.input.toLowerCase() === toDoItem.toLowerCase()) {
      return { msg : 'Duplicate toDoItem. Please try another.'};

    }
  }

  const res = categorizeByVerb(toDoItem);

  const input = {
    toDoItem: toDoItem,
    userId: userId,
    categoryId: res
  }

  if (res) {
    const newToDoItem = await addToDoItem(input);
    return newToDoItem;
    //calls function that renders new toDoItem already categorized
  } else {
    return getSearchResults(toDoItem)
      .then(res => {
        return combineResults(res);

      })
      .then(res => {
        return getCategory(res);

      })
      .then(res => {
        input.categoryId = res;
        const newToDoItem = addToDoItem(input);
        return newToDoItem;
        console.log(newToDoItem);
      })
      .catch(err => {
        console.error('query error', err.stack);

      });
  }
}

module.exports = { categorizeToDoItem };
