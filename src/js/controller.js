import * as model from './module.js';
import recipeView from './Views/RecipeView.js';
import searchView from './Views/SearchView';
import ResultView from './Views/ResultView.js';
import PaginationView from './Views/ResultView.js';
import bookmarkView from './Views/bookmarkView.js';
import AddRecipeView from './Views/AddRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import RecipeView from './Views/RecipeView.js';
import { async } from 'regenerator-runtime';
import paginationView from './Views/paginationView.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    ResultView.update(model.getSearchResultPage());

    bookmarkView.update(model.state.bookMarks);

    recipeView.renderSpinner();
    //1) loading Recipe

    await model.loadRecipe(id);

    //2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    RecipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    //Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    ResultView.renderSpinner();
    // load Search Result
    await model.LoadSearchResult(query);

    ResultView.render(model.getSearchResultPage(1));

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
controlSearchResult();

const controlPagination = function (goto) {
  ResultView.render(model.getSearchResultPage(goto));

  paginationView.render(model.state.search);
};

const controlServerings = function (newServerings) {
  model.updateServings(newServerings);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const ControlAddBookMark = function () {
  if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookMarks);
};

const Controlbookmarks = function () {
  bookmarkView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);
  } catch (err) {
    console.error(err);
  }
};

bookmarkView.addHandlerRender(Controlbookmarks);
recipeView.addHandlerAddBookMark(ControlAddBookMark);
recipeView.addHandlerRender(controlRecipe);
searchView.addHandlerSearch(controlSearchResult);
paginationView.addHandlerClick(controlPagination);
recipeView.addHandlerUpdatedServings(controlServerings);
AddRecipeView.addHandlerUpload(controlAddRecipe);
