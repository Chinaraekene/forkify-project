import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class BookMarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No Bookmark Yet:)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkUp() {
    return this.data.map(result => previewView.render(result, false)).join();
  }
}

export default new BookMarksView();
