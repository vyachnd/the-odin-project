import PubSub from '../../libs/pubsub.js';

export default class CalculatorModule {
  constructor({
    node = document.body,
  }) {
    const self = this;
    self.events = new PubSub();
    self.node = node;
    self.layout = [
      {
        keyName: 'C',
        type: 'clear',
        hotkeys: [
          {
            code: 'Backspace',
          },
          {
            code: 'Delete',
          },
        ],
      },
      {
        keyName: 'CE',
        type: 'clear_entity',
        hotkeys: [
          {
            code: 'Escape',
          },
        ],
      },
      {
        keyName: '%',
        callback: (a, b) => {
          if (a === 0 || b === 0) {
            return 'Module from zero';
          }

          return a % b;
        },
        type: 'operator',
        customCls: ['button_operator'],
        hotkeys: [
          {
            isShift: true,
            code: 'Digit5',
          },
        ],
      },
      {
        keyName: '/',
        callback: (a, b) => {
          if (a === 0 || b === 0) {
            return 'Divide by zero';
          }

          return a / b;
        },
        type: 'operator',
        customCls: ['button_operator'],
        hotkeys: [
          {
            code: 'Slash',
          },
          {
            code: 'NumpadDivide',
          },
        ],
      },
      {
        keyName: '7',
        value: '7',
        type: 'operand',
        hotkeys: [
          {
            code: 'Digit7',
          },
          {
            code: 'Numpad7',
          },
        ],
      },
      {
        keyName: '8',
        value: '8',
        type: 'operand',
        hotkeys: [
          {
            code: 'Digit8',
          },
          {
            code: 'Numpad8',
          },
        ],
      },
      {
        keyName: '9',
        value: '9',
        type: 'operand',
        hotkeys: [
          {
            code: 'Digit9',
          },
          {
            code: 'Numpad9',
          },
        ],
      },
      {
        keyName: '*',
        callback: (a, b) => a * b,
        type: 'operator',
        customCls: ['button_operator'],
        hotkeys: [
          {
            isShift: true,
            code: 'Digit8',
          },
          {
            code: 'NumpadMultiply',
          },
        ],
      },
      {
        keyName: '4',
        value: '4',
        type: 'operand',
        hotkeys: [
          {
            code: 'Digit4',
          },
          {
            code: 'Numpad4',
          },
        ],
      },
      {
        keyName: '5',
        value: '5',
        type: 'operand',
        hotkeys: [
          {
            code: 'Digit5',
          },
          {
            code: 'Numpad5',
          },
        ],
      },
      {
        keyName: '6',
        value: '6',
        type: 'operand',
        hotkeys: [
          {
            code: 'Digit6',
          },
          {
            code: 'Numpad6',
          },
        ],
      },
      {
        keyName: '-',
        callback: (a, b) => a - b,
        type: 'operator',
        customCls: ['button_operator'],
        hotkeys: [
          {
            code: 'Minus',
          },
          {
            code: 'NumpadSubtract',
          },
        ],
      },
      {
        keyName: '1',
        value: '1',
        type: 'operand',
        hotkeys: [
          {
            code: 'Digit1',
          },
          {
            code: 'Numpad1',
          },
        ],
      },
      {
        keyName: '2',
        value: '2',
        type: 'operand',
        hotkeys: [
          {
            code: 'Digit2',
          },
          {
            code: 'Numpad2',
          },
        ],
      },
      {
        keyName: '3',
        value: '3',
        type: 'operand',
        hotkeys: [
          {
            code: 'Digit3',
          },
          {
            code: 'Numpad3',
          },
        ],
      },
      {
        keyName: '+',
        callback: (a, b) => a + b,
        type: 'operator',
        customCls: ['button_operator'],
        hotkeys: [
          {
            isShift: true,
            code: 'Equal',
          },
          {
            code: 'NumpadAdd',
          },
        ],
      },
      {
        keyName: '0',
        value: '0',
        type: 'operand',
        customCls: ['button_middle'],
        hotkeys: [
          {
            code: 'Digit0',
          },
          {
            code: 'Numpad0',
          },
        ],
      },
      {
        keyName: '.',
        value: '.',
        type: 'operand',
        hotkeys: [
          {
            code: 'NumpadDecimal',
          },
          {
            code: 'Period',
          },
        ],
      },
      {
        keyName: '=',
        type: 'answer',
        customCls: ['button_answer'],
        hotkeys: [
          {
            code: 'Equal',
          },
          {
            code: 'Enter',
          },
          {
            code: 'NumpadEnter',
          },
        ],
      },
    ];
    self.input = {
      firstNumber: null,
      secondNumber: null,
      operator: null,
    };
    self.history = [];
  }

  loadHistory(data) {
    const self = this;

    self.input = { ...data };

    self.events.publish('loadHistory', { ...data });
  }

  addHistory(data) {
    const self = this;

    self.history.push({ ...data });

    self.events.publish('addHistory', { ...data });
  }

  getAnswer(input = this.input) {
    const { firstNumber, secondNumber, operator } = input;

    if (firstNumber && secondNumber && operator) {
      const answer = operator.callback(Number(firstNumber), Number(secondNumber));

      return answer;
    }

    return null;
  }

  applyAnswer() {
    const self = this;
    const answer = self.getAnswer();

    if (typeof answer === 'number') {
      self.addHistory(self.input);
      self.clearInput();

      self.input.firstNumber = answer.toString();
    }
  }

  /* eslint-disable class-methods-use-this */
  clearEntity(str) {
    let newStr = str;

    newStr = newStr.slice(0, newStr.length - 1);

    if (newStr[newStr.length - 1] === '.') {
      newStr = newStr.slice(0, newStr.length - 1);
    }

    return newStr.length > 0 ? newStr : null;
  }
  /* eslint-enable class-methods-use-this */

  clearInput() {
    const self = this;

    self.input.firstNumber = null;
    self.input.secondNumber = null;
    self.input.operator = null;
  }

  /* eslint-disable class-methods-use-this */
  applyInput(value, input) {
    if (value === null && input !== '.') {
      return input;
    }

    if (value === '0' && input !== '.') {
      return input;
    }

    if (value && input === '.') {
      if (!value.includes('.')) {
        return value + input;
      }

      return value;
    }

    if (value === null && input === '.') {
      return value;
    }

    return value + input;
  }
  /* eslint-enable class-methods-use-this */

  inputToString(input = this.input) {
    const { firstNumber, secondNumber, operator } = input;
    let str = '';

    if (firstNumber) {
      str += firstNumber;
    }

    if (operator) {
      str += ` ${operator.type} `;
    }

    if (secondNumber) {
      str += secondNumber;
    }

    return str === '' ? 'Enter expression' : str;
  }

  userInput(layout) {
    const self = this;

    if (layout.type === 'operand') {
      if (self.input.operator === null) {
        self.input.firstNumber = self.applyInput(self.input.firstNumber, layout.value);
      } else {
        self.input.secondNumber = self.applyInput(self.input.secondNumber, layout.value);
      }
    } else if (layout.type === 'operator' && self.input.firstNumber) {
      if (self.input.operator && self.input.secondNumber) {
        self.applyAnswer();
      }

      self.input.operator = {
        type: layout.keyName,
        callback: layout.callback,
      };
    } else if (layout.type === 'answer') {
      self.applyAnswer();
    } else if (layout.type === 'clear') {
      self.clearInput();
    } else if (layout.type === 'clear_entity') {
      if (self.input.secondNumber) {
        self.input.secondNumber = self.clearEntity(self.input.secondNumber);
      } else if (self.input.secondNumber === null && self.input.operator) {
        self.input.operator = null;
      } else if (self.input.firstNumber) {
        self.input.firstNumber = self.clearEntity(self.input.firstNumber);
      }
    }

    self.events.publish('userInput', layout);
  }
}
