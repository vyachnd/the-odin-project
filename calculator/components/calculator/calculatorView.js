export default class CalculatorView {
  constructor(module) {
    const self = this;
    self.module = module;
    self.elements = {};

    self.module.events
      .subscribe('userInput', (layout) => self.userInput(layout))
      .subscribe('addHistory', (data) => self.addHistory(data))
      .subscribe('loadHistory', (data) => self.updateInput(data));
  }

  updateInput(data) {
    const self = this;
    const { displayInputText, displayOutputText } = self.elements;
    const answer = self.module.getAnswer(data);

    displayInputText.textContent = self.module.inputToString(data);
    displayOutputText.textContent = typeof answer === 'boolean' ? '' : answer;
  }

  addHistory(data) {
    const self = this;
    const { calculatorHistory } = self.elements;
    const answer = self.module.getAnswer(data);
    const inputText = self.module.inputToString(data);

    const historyEl = document.createElement('div');
    historyEl.className = 'history';

    historyEl.innerHTML = `
      <div class="history__output"><span class="output__text">${answer}</span></div>
      <div class="history__input"><span class="input__text">${inputText}</span></div>
    `;

    calculatorHistory.append(historyEl);

    self.module.events.publish('onAddHistory', { el: historyEl, data });
  }

  userInput(layout) {
    const self = this;

    self.updateInput(self.module.input);
    layout.element.classList.add('button_pressed');
  }

  render() {
    const self = this;
    const { node, layout } = self.module;
    let { container } = self.elements;

    if (!(node instanceof HTMLElement)) {
      throw new Error('Can\'t render, bad node');
    }

    if (!container || !(container instanceof HTMLElement)) {
      container = document.createElement('div');
      container.className = 'calculator';
      self.elements.container = container;
      node.prepend(container);
    } else {
      container.innerHTML = '';
    }

    /* eslint-disable indent */
    container.innerHTML = `
      <div class="calculator__panel">
        <div class="panel__display">
          <div class="display__output"><span class="output__text"></span></div>
          <div class="display__input"><span class="input__text">${self.module.inputToString()}</span></div>
        </div>

        <div class="panel__button">
          ${layout.map(({ keyName, customCls = [] }) => {
            const cls = ['button'];

            cls.push(...customCls);

            return `
              <div class="${[cls.join(' ')]}" data-key="${keyName}">
                <span class="button__text">${keyName}</span>
              </div>`;
          }).join('')}
        </div>
      </div>

      <div class="calculator__history"></div>
    `;
    /* eslint-enable indent */

    self.elements.panelDisplay = container.querySelector('.panel__display');
    self.elements.displayInputText = self.elements.panelDisplay.querySelector('.input__text');
    self.elements.displayOutputText = self.elements.panelDisplay.querySelector('.output__text');
    self.elements.panelButton = container.querySelector('.panel__button');
    self.elements.buttons = self.elements.panelButton.querySelectorAll('.button');
    self.elements.calculatorHistory = container.querySelector('.calculator__history');

    self.module.events.publish('render');
  }
}
