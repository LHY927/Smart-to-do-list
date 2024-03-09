const language = require("@google-cloud/language");
const e = require("express");
const { forEach } = require("lodash");

// Instantiates a client
const client = new language.LanguageServiceClient();

const categorizeText = async function (text) {
  // Add length to the text to meet the minimum length requirement
  text = Array(21).join(text + " ");
  console.log("Text type :", typeof text);
  // console.log("Text:", text);

  const document = {
    content: text,
    type: "PLAIN_TEXT",
  };

  const [classification] = await client.classifyText({ document });

  // Get categories from the API result
  const apiCategories = classification.categories.map((category) =>
    category.name.toLowerCase()
  );

  console.log("API Categories:", apiCategories);

  // Define keywords for each category
  const categoryKeywords = {
    1: [
      "Harry Potter",
      "watch",
      "movie",
      "film",
      "directed",
      "imdb",
      "starring",
      "television",
      "netflix",
      "tv",
      "sitcom",
    ],
    2: [
      "cafe",
      "food",
      "recipe",
      "menu",
      "yelp",
      "foodora",
      "restaurant",
      "eat",
      "place",
    ],
    3: [
      "journal",
      "textbook",
      "read",
      "published",
      "novel",
      "author",
      "non-fiction",
      "books",
      "book",
      "paperback",
      "novels",
    ],
    4: [
      "products",
      "buy",
      "makeup",
      "make-up",
      "clothes",
      "fashion",
      "shoes",
      "electronics",
      "shopping",
      "store",
      "online",
      "amazon",
      "ebay",
    ],
  };

  // Check for keywords in API categories
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    // Check if any keyword matches with words in apiCategories
    let isCategoryMatched = false;
    keywords.some((keyword) =>
      apiCategories.some((category) => {
        const words = category.split(/[\/&\s]+/);
        words.forEach((e) => {
          console.log(words);
          console.log(e, keyword);
          // console.log("for each", e, keyword);
          // console.log("Text type e:", typeof e);
          // console.log("Text type keyword:", typeof keyword);
          if (e === keyword) {
            console.log(`Keyword matched for category ${category}`);
            isCategoryMatched = true;
          }
        });
      })
    );
    console.log(isCategoryMatched, isCategoryMatched);
    // If any keyword matches with words in apiCategories, return the category
    if (isCategoryMatched) {
      console.log(`Category matched for keywords in category ${category}`);
      return category;
    }
  }

  // return 2 eat if no category is found
  return 2;
};


module.exports = { categorizeText };
