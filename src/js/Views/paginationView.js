import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const gotoPage = +btn.dataset.goto;
      console.log(gotoPage);

      handler(gotoPage);
    });
  }

  _generateMarkUp() {
    const _currentPage = this.data.page;

    const numPages = Math.ceil(
      this.data.results.length / this.data.resultPerPage
    );

    if (_currentPage === 1 && numPages > 1) {
      return `
      <button data-goto ="${
        _currentPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${_currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    if (_currentPage === numPages && numPages > 1) {
      return `
      <button data-goto ="${
        _currentPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${_currentPage - 1}</span>
          </button>`;
    }

    if (_currentPage < numPages) {
      return `
         <button data-goto ="${
           _currentPage - 1
         }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${_currentPage - 1}</span>
          </button>
        <button data-goto ="${
          _currentPage + 1
        }" class="btn--inline pagination__btn--next">
           <span>Page ${_currentPage + 1}</span>
           <svg class="search__icon">
           <use href="${icons}#icon-arrow-right"></use>
           </svg>
        </button>

`;
    }
    return '';
  }
}

export default new PaginationView();
