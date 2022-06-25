import GameComponent from './components/game/index.js';

// Avoid eslint 'no-new' rule :)
(() => new GameComponent({ node: document.body }))();
