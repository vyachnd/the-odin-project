import CalculatorModule from './calculatorModule.js';
import CalculatorView from './calculatorView.js';
import CalculatorController from './calculatorController.js';

export default class Calculator {
  constructor(params) {
    const self = this;
    self.module = new CalculatorModule(params);
    self.view = new CalculatorView(self.module);
    self.controller = new CalculatorController(self.module, self.view);

    self.view.render();
  }
}
