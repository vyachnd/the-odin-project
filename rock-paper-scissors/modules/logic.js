import Player from './player.js';

export default class Logic {
  #WINS = {
    rock: {
      type: 'scissors',
      message: 'Rock beats scissors!',
    },
    paper: {
      type: 'rock',
      message: 'Paper wraps rock!',
    },
    scissors: {
      type: 'paper',
      message: 'Scissors cut paper!',
    },
  };

  constructor() {
    this.user = new Player('Player');
    this.comp = new Player('Computer');
    this.maxPoints = 5;
    this.isGameEnd = false;
  }

  checkGameWinner() {
    const result = {
      player: null,
      message: null,
    };

    if (this.user.score === this.maxPoints) {
      result.player = this.user;
      result.message = 'You win!';
    } else if (this.comp.score === this.maxPoints) {
      result.player = this.comp;
      result.message = 'You lose!';
    }

    return result;
  }

  checkRoundWinner(playerChoice, computerChoice) {
    const result = {
      player: null,
      message: 'It\'s a draw!',
    };

    if (this.#WINS[playerChoice].type === computerChoice) {
      result.player = this.user;
      result.message = this.#WINS[playerChoice].message;
    } else if (this.#WINS[computerChoice].type === playerChoice) {
      result.player = this.comp;
      result.message = this.#WINS[computerChoice].message;
    }

    return result;
  }

  computerChoice() {
    const rnd = Math.floor(Math.random() * 3);
    const wins = Object.keys(this.#WINS);

    return wins[rnd];
  }

  playRound(playerChoice) {
    if (this.isGameEnd) {
      return {};
    }

    const computerChoice = this.computerChoice();
    const roundWinner = this.checkRoundWinner(playerChoice, computerChoice);
    let gameWinner = null;

    if (roundWinner.player === this.user) {
      this.user.increaseScore();
    } else if (roundWinner.player === this.comp) {
      this.comp.increaseScore();
    }
    gameWinner = this.checkGameWinner();

    if (gameWinner.player) {
      this.isGameEnd = true;
    }

    return { gameWinner, roundWinner };
  }

  getUser() {
    return this.user;
  }

  getComp() {
    return this.comp;
  }

  resetGame() {
    this.user.resetScore();
    this.comp.resetScore();
    this.isGameEnd = false;
  }
}
