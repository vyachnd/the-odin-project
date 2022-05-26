import EventEmitter from '../../libs/eventEmitter.js';
import Logic from '../../modules/logic.js';

export default class GameModule extends EventEmitter {
  constructor({ node }) {
    super();
    this.node = node || null;
    this.gameLogic = new Logic();
  }

  choiceCard(choice) {
    const result = this.gameLogic.playRound(choice);

    this.emit('choiceCard', result);
  }

  resetGame() {
    this.gameLogic.resetGame();

    this.emit('resetGame');
  }
}
