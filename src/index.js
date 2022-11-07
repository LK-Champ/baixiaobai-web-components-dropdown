
import './button.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
  .dropdown {
    box-sizing: border-box;
    padding: 3px 8px 8px;
    cursor: pointer;
  }

  .dropdown.open .dropdown-list {
    display: flex;
    flex-direction: column;
  }

  .label {
    display: block;
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: normal;
    line-height: 16px;
  }

  button {
    width: 100%;
    position: relative;
    padding-right: 45px;
    padding-left: 8px;
    font-size: 16px;
    font-weight: 600;
    text-align: left;
    white-space: nowrap;
  }

  .dropdown-list-container {
    position: relative;
  }

  .dropdown-list {
    position: absolute;
    min-width: 200px;
    display: none;
    max-height: 500px;
    overflow-y: auto;
    margin: 4px 0 0;
    padding: 0;
    background-color: #ffffff;
    list-style: none;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }

  .dropdown-list li {
    display: flex;
    align-items: center;
    margin: 4px 0;
    padding: 0 7px;
    border-right: none;
    border-left: none;
    border-width: 0;
    font-size: 16px;
    flex-shrink: 0;
    height: 40px;
  }

  .dropdown-list li:not(.selected) {
    box-shadow: none;
  }

  .dropdown-list li.selected {
    color: #66b1ff;
    font-weight: 700;
    z-index: 99;
  }

  .dropdown-list li:hover {
    color: #66b1ff;
    background-color: #ecf5ff;
  }

  .dropdown-list li:active,
  .dropdown-list li:hover,
  .dropdown-list li.selected {
    border-right: none;
    border-left: none;
    border-width: 1px;
  }

  .dropdown-list li:focus {
    border-width: 2px;
  }

  .dropdown-list li:disabled {
    color: rgba('0,0,0', 0.6);
    font-weight: 300;
  }
  </style>
  <div class="dropdown">
    <span class="label">Label</span>
    <my-button></my-button>
    <div class="dropdown-list-container">
      <ul class="dropdown-list"></ul>
    </div>
  </div>
`;

class Dropdown extends HTMLElement {
  constructor() {
    super();

    this._ropdownRoot = this.attachShadow({ mode: 'open' });
    this._ropdownRoot.appendChild(template.content.cloneNode(true));
    this.$label = this._ropdownRoot.querySelector('.label');
    this.$button = this._ropdownRoot.querySelector('my-button');
    this.$dropdown = this._ropdownRoot.querySelector('.dropdown');
    this.$dropdownList = this._ropdownRoot.querySelector('.dropdown-list');

    this.open = false;

    this.$button.addEventListener(
      'onCustomClick',
      this.toggleOpen.bind(this)
    );
  }

  toggleOpen(event) {
    this.open = !this.open;

    this.open
      ? this.$dropdown.classList.add('open')
      : this.$dropdown.classList.remove('open');
  }

  static get observedAttributes() {
    return ['label', 'option', 'options'];
  }

  get label() {
    return this.getAttribute('label');
  }

  set label(value) {
    this.setAttribute('label', value);
  }

  get option() {
    return this.getAttribute('option');
  }

  set option(value) {
    this.setAttribute('option', value);
  }

  get options() {
    return JSON.parse(this.getAttribute('options'));
  }

  set options(value) {
    this.setAttribute('options', JSON.stringify(value));
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }

  render() {
    if (!Array.isArray(this.options)) {
      console.warn('Options must be an array...');
      return;
    }

    this.$label.innerHTML = this.label;
    this.$button.setAttribute(
      'text',
      (
        this.options.find(
          (item) => item.value === parseInt(this.option)
        ) ||
        (this.options && this.options[0])
      ).label
    );

    this.$dropdownList.innerHTML = '';

    this.options.forEach((item) => {
      let option = item;
      let $option = document.createElement('li');

      if (this.option && this.option == option.value) {
        $option.classList.add('selected');
      }

      $option.addEventListener('click', () => {
        this.option = option.value;
        this.toggleOpen();
        this.dispatchEvent(
          new CustomEvent('onOptionChange', { detail: { ...option, option, options: this.options } })
        );
      });

      $option.innerHTML = option.label;
      this.$dropdownList.appendChild($option);
    });
  }
}

window.customElements.define('web-dropdown', Dropdown);
