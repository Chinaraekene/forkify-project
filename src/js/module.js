import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, POST } from './config';
import { getJSON, sendJSON } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    page: 1,
    results: [],
    resultPerPage: RES_PER_PAGE,
  },
  bookMarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
  };
};
// console.log(state.recipe);

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    state.recipe = createRecipeObject(data);

    if (state.bookMarks.some(bookmark => bookmark.id === id))
      state.recipe.bookMarked = true;
    else state.recipe.bookMarked = false;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const LoadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServing) {
  console.log(state.recipe);
  state.recipe.ingredients.forEach(element => {
    element.quantity = (element.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};
const persistBookMark = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookMarks));
};
export const addBookMark = function (recipe) {
  state.bookMarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;
  persistBookMark();
};

export const deleteBookmark = function (id) {
  const index = state.bookMarks.findIndex(el => el.id === id);
  state.bookMarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookMarked = false;
  persistBookMark();
};

const init = function () {
  const storage = localStorage.getItem('bookmark');
  if (storage) state.bookMarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmark');
};
// clearBookmarks()

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) throw new Error('Wrong ingredient :)');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${POST}`, recipe);
    // state.recipe = createRecipeObject(data);
  } catch (err) {
    throw err;
  }
};
