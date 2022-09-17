import View from './View';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query! Please try Again :)';
  _message = '';
  _generateMarkUp() {
    return this.data.map(result => previewView.render(result, false)).join();
  }
}

export default new ResultView();
