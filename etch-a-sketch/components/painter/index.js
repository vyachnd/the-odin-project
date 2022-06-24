import PainterModule from './painterModule.js';
import PainterView from './painterView.js';
import PainterController from './painterController.js';

export default class Painter {
  constructor(params = {}) {
    const self = this;
    self.module = new PainterModule(params);
    self.view = new PainterView(self.module);
    self.controllers = new PainterController(self.module, self.view);

    self.view.render();
  }
}
