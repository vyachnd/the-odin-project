export default class GameView {
  constructor(module) {
    this.module = module;
    this.elements = {};

    this.module
      .on('choiceCard', (result) => this.update(result))
      .on('resetGame', () => this.resetGame());
  }

  hideModal() {
    const { modal } = this.elements;
    modal.container.classList.remove('game__modal_show');
    modal.container.classList.add('game__modal_hide');
  }

  showModal(message) {
    const { modal } = this.elements;

    modal.container.classList.remove('game__modal_hide');
    modal.container.classList.add('game__modal_show');
    modal.title.textContent = message;
  }

  resetGame() {
    const { gameLogic } = this.module;
    const { playerUser, playerComputer, info } = this.elements;

    info.title.textContent = 'Make a move!';
    info.subtitle.textContent = `Get ${gameLogic.maxPoints} points to win!`;
    playerUser.score.textContent = gameLogic.getUser().score;
    playerComputer.score.textContent = gameLogic.getComp().score;

    this.hideModal();
  }

  update(result) {
    const { playerUser, playerComputer, info } = this.elements;
    const { gameWinner = {}, roundWinner = {} } = result;
    const { gameLogic } = this.module;

    if (roundWinner.player) {
      info.title.textContent = `${roundWinner.player.name} win!`;
      info.subtitle.textContent = roundWinner.message;

      if (roundWinner.player === gameLogic.getUser()) {
        playerUser.score.textContent = roundWinner.player.score;
      } else {
        playerComputer.score.textContent = roundWinner.player.score;
      }
    } else {
      info.title.textContent = 'DRAW';
      info.subtitle.textContent = roundWinner.message;
    }

    if (gameWinner.player) {
      this.showModal(gameWinner.message);
    }
  }

  render() {
    const { node, gameLogic } = this.module;
    let { container } = this.elements;

    if (!(node instanceof HTMLElement)) {
      throw Error('No node!');
    }

    if (!container) {
      container = document.createElement('div');
      container.setAttribute('id', 'game');

      node.prepend(container);

      this.elements.container = container;
    }

    container.innerHTML = `
      <div class="wrapper">
        <div class="container">
          <h1 class="game__title">ROCK PAPER SCISSORS</h1>

          <div class="game__score">
            <div id="player-score" class="score">
              <span class="score__player">${gameLogic.getUser().name}</span>
              <span class="score__count">${gameLogic.getUser().score}</span>
            </div>

            <div id="computer-score" class="score">
              <span class="score__player">${gameLogic.getComp().name}</span>
              <span class="score__count">${gameLogic.getComp().score}</span>
            </div>
          </div>

          <div class="game__info">
            <span class="info__title">Make a move!</span>
            <span class="info__subtitle">Get ${gameLogic.maxPoints} points to win!</span>
          </div>

          <div class="game__cards">
            <div id="card-rock" class="card">
              <svg class="card__icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M43.575 7.49999C41.0531 7.46249 39 9.48749 39 12H38.25V9.07499C38.25 6.60937 36.2906 4.54687 33.825 4.49999C31.3031 4.46249 29.25 6.48749 29.25 8.99999V12H28.5V7.57499C28.5 5.10937 26.5406 3.04687 24.075 2.99999C21.5531 2.96249 19.5 4.98749 19.5 7.49999V12H18.75V9.07499C18.75 6.60937 16.7906 4.54687 14.325 4.49999C11.8031 4.46249 9.75 6.48749 9.75 8.99999V21.75L9 21.0844V16.575C9 14.1094 7.04062 12.0469 4.575 12C2.05312 11.9625 0 13.9875 0 16.5V22.725C0 25.2937 1.09688 27.7406 3.01875 29.4562L13.4906 38.7656C14.4469 39.6187 15 40.8469 15 42.1312V42.7594C15 44.0062 16.0031 45.0094 17.25 45.0094H39.75C40.9969 45.0094 42 44.0062 42 42.7594V42.4875C42 41.2875 42.2438 40.0969 42.7031 38.9906L47.2969 28.0875C47.7656 26.9812 48 25.7906 48 24.5906V12.075C48 9.60937 46.0406 7.53749 43.575 7.49999Z"
                  fill="currentColor"
                />
              </svg>
              <span class="card__title">ROCK</span>
            </div>

            <div id="card-paper" class="card">
              <svg class="card__icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M41.3232 12.0006C39.2209 11.9604 37.5 13.7212 37.5 15.8241V24H36.75V7.4803C36.75 5.37749 35.0291 3.61668 32.9268 3.6569C30.8895 3.69589 29.25 5.35958 29.25 7.40624V24H28.5V3.82405C28.5 1.72124 26.7791 -0.0395736 24.6768 0.00064512C22.6395 0.0396451 21 1.70333 21 3.74999V24H20.25V7.57405C20.25 5.47124 18.5291 3.71043 16.4268 3.75065C14.3895 3.78964 12.75 5.45333 12.75 7.49999V29.6242L9.783 25.5443C8.56491 23.8694 6.21966 23.499 4.54453 24.7172C2.86969 25.9354 2.49938 28.2806 3.71747 29.9556L15.4926 46.1467C15.91 46.7208 16.4574 47.1879 17.0899 47.51C17.7224 47.8321 18.4221 48 19.1318 48H37.6559C39.7441 48 41.558 46.5634 42.0363 44.5307L44.5214 33.9688C44.8393 32.6176 44.9999 31.2342 44.9999 29.8461V15.75C45 13.7033 43.3605 12.0396 41.3232 12.0006Z"
                  fill="currentColor"
                />
              </svg>
              <span class="card__title">PAPER</span>
            </div>

            <div id="card-scissors" class="card">
              <svg class="card__icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20.25 41.25C20.25 39.1789 21.929 37.5 24 37.5V36.75H21C18.929 36.75 17.25 35.0711 17.25 33C17.25 30.9289 18.929 29.25 21 29.25H24V28.5H4.5C2.01469 28.5 0 26.4853 0 24C0 21.5147 2.01469 19.5 4.5 19.5H24V18.2276L7.35459 11.6895C5.04141 10.7807 3.90291 8.16873 4.81163 5.85564C5.72034 3.54245 8.33231 2.40404 10.6455 3.31276L28.4901 10.322L30.8218 7.40729C31.9755 5.96532 34.0072 5.57776 35.6107 6.49407L46.1107 12.4941C46.6846 12.8221 47.1617 13.296 47.4935 13.8678C47.8252 14.4396 48 15.0889 48 15.75V38.25C48 39.9902 46.8028 41.5018 45.1089 41.9004L32.3589 44.9004C32.0774 44.9666 31.7892 45 31.5 45H24C21.929 45 20.25 43.3211 20.25 41.25Z"
                  fill="currentColor"
                />
              </svg>
              <span class="card__title">SCISSORS</span>
            </div>
          </div>

          <div class="game__modal">
            <h2 class="modal__title"></h2>
            <button type="button" class="modal__btn">PLAY AGAIN</button>
          </div>
        </div>
      </div>
    `;

    const playerScore = container.querySelector('#player-score');
    const computerScore = container.querySelector('#computer-score');
    const gameCards = container.querySelector('.game__cards');
    const gameInfo = container.querySelector('.game__info');
    const gameModal = container.querySelector('.game__modal');

    Object.assign(this.elements, {
      playerUser: {
        name: playerScore.getElementsByClassName('score__player')[0],
        score: playerScore.getElementsByClassName('score__count')[0],
      },

      playerComputer: {
        name: computerScore.getElementsByClassName('score__player')[0],
        score: computerScore.getElementsByClassName('score__count')[0],
      },

      cards: {
        rock: gameCards.querySelector('#card-rock'),
        paper: gameCards.querySelector('#card-paper'),
        scissors: gameCards.querySelector('#card-scissors'),
      },

      info: {
        title: gameInfo.querySelector('.info__title'),
        subtitle: gameInfo.querySelector('.info__subtitle'),
      },

      modal: {
        container: gameModal,
        title: gameModal.querySelector('.modal__title'),
        btn: gameModal.querySelector('.modal__btn'),
      },
    });

    this.module.emit('onRender');
  }
}
