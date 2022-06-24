import Painter from './components/painter/index.js';

const appContent = document.querySelector('.app__content');

if (appContent instanceof HTMLElement) {
  (() => new Painter({
    node: appContent,
  }))();
}
