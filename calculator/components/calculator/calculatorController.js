export default class CalculatorController {
  constructor(module, view) {
    const self = this;
    self.module = module;
    self.view = view;

    self.module.events
      .subscribe('render', () => self.onRender())
      .subscribe('onAddHistory', ({ el, data }) => self.onAddHistory(el, data));
  }

  onUserInput(layout) {
    const self = this;

    self.module.userInput(layout);
  }

  onAddHistory(el, data) {
    const self = this;

    el.addEventListener('click', () => self.module.loadHistory(data));
  }

  onRender() {
    const self = this;
    const { elements } = self.view;
    const { layout } = self.module;
    const { panelButton, buttons } = elements;

    panelButton.addEventListener('contextmenu', (e) => e.preventDefault());
    buttons.forEach((btn) => {
      const dataKey = btn.dataset.key;
      const btnLayout = layout.filter(({ keyName }) => keyName === dataKey)[0];

      btnLayout.element = btn;

      btn.addEventListener('click', () => self.onUserInput(btnLayout));
    });

    document.addEventListener('keydown', ({ code, shiftKey }) => {
      layout.forEach((btnLayout) => {
        btnLayout.hotkeys.forEach(({ code: hotkeyCode, isShift = false }) => {
          if ((shiftKey && isShift) && (code === hotkeyCode)) {
            self.onUserInput(btnLayout);
          } else if ((!shiftKey && !isShift) && (code === hotkeyCode)) {
            self.onUserInput(btnLayout);
          }
        });
      });
    });

    document.addEventListener('animationend', ({ target, animationName }) => {
      if (animationName === 'button-pressed') {
        target.classList.remove('button_pressed');
      }
    });

    return elements;
  }
}
