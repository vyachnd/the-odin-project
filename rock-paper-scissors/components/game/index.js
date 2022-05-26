import GameModule from './gameModule.js';
import GameView from './gameView.js';
import GameController from './gameController.js';

export default class GameComponent {
  constructor(params) {
    this.module = new GameModule(params);
    this.view = new GameView(this.module);
    this.controller = new GameController(this.module, this.view);

    this.view.render();
  }
}
