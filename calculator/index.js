import Calculator from './components/calculator/index.js';

const appContent = document.querySelector('.app__content');

if (appContent instanceof HTMLElement) {
  (() => new Calculator({
    node: appContent,
  }))();
}
