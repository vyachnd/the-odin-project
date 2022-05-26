export default class GameController {
  constructor(module, view) {
    this.module = module;
    this.view = view;

    this.module.on('onRender', () => this.onRender());
  }

  onPlayAgainClick() {
    this.module.resetGame();
  }

  onCardClick(cardType) {
    this.module.choiceCard(cardType);
  }

  onRender() {
    const { container, cards, modal } = this.view.elements;

    Object.keys(cards).forEach((cardType) => {
      cards[cardType].addEventListener(
        'click',
        () => this.onCardClick(cardType),
      );
    });

    modal.btn.addEventListener('click', () => this.onPlayAgainClick());

    container.addEventListener('animationend', (event) => {
      const { target, animationName } = event;

      if (animationName === 'hide-modal') {
        target.classList.remove('game__modal_hide');
      }
    });
  }
}
