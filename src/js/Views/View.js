import icons from 'url:../../img/icons.svg';

export default class View {
  data;

  render(data, render = true) {
    // console.log(data);
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this.data = data;
    const markUp = this._generateMarkUp();

    if (!render) return markUp;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  update(data) {
    this.data = data;
    const newMarkUp = this._generateMarkUp();

    const DOM = document.createRange().createContextualFragment(newMarkUp);

    const newDOM = Array.from(DOM.querySelectorAll('*'));
    const curDom = Array.from(this._parentElement.querySelectorAll('*'));

    newDOM.forEach((newEl, i) => {
      const curEl = curDom[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner(parentEl) {
    const markUp = `
      <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderError(message = this._errorMessage) {
    const markUp = `
      <div class="error">
      <div>
      <svg>
      <use href="${icons}#icon-alert-triangle"></use>
      </svg>
       </div>
       <p>${message}</p>
       </div>`;

    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderMessage(message = this._message) {
    const markUp = `
      <div class="message">
      <div>
      <svg>
      <use href="${icons}#icon-smile"></use>
      </svg>
       </div>
       <p>${message}</p>
       </div>`;

    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  clear() {
    this._parentElement.innerHTML = '';
  }

  addHandlerRender(method) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, method));
  }
}
