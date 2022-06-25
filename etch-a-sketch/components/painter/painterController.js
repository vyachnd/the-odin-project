const KEY_ENTER = 13;

export default class PainterController {
  constructor(module, view) {
    const self = this;
    self.module = module;
    self.view = view;

    // Events
    self.module.subscribe('onRender', () => self.onRender());
  }

  onMouseEnterOnField() {
    const self = this;
    self.module.toggleMouseEnter(true);
  }

  onMouseLeaveOnField() {
    const self = this;
    self.module.toggleMouseEnter(false);
  }

  onMouseDownOnField({ button, offsetX, offsetY }) {
    const self = this;
    const { col, row } = self.module.calculateColRow(offsetX, offsetY);

    if (button === 0) {
      self.module.setPixel(col, row);
      self.module.toggleMouseDown(true);
    }
  }

  onMouseUpOnField({ button }) {
    const self = this;

    if (button === 0) {
      self.module.toggleMouseDown(false);
    }
  }

  onMouseMoveOnField({ offsetX, offsetY }) {
    const self = this;
    const { col, row } = self.module.calculateColRow(offsetX, offsetY);
    const { isMouseDown, isMouseEnter, cursorPosition } = self.module;

    if ((isMouseDown && isMouseEnter)
      && !(cursorPosition.col === col && cursorPosition.row === row)
    ) {
      self.module.setPixel(col, row);
    }

    self.module.setCursorPosition(col, row);
  }

  onSelectToolType(toolType) {
    const self = this;
    self.module.setToolType(toolType);
  }

  onChangeColor(value) {
    const self = this;
    self.module.setColor(value);
  }

  onCheckColorRandom(checked) {
    const self = this;
    self.module.toggleRandomColor(checked);
  }

  onInputFieldSize(e) {
    const self = this;
    const { maxPixelCount } = self.module;
    const { inputType, data } = e;
    let { value } = e.target;

    if (Number.isNaN(Number(value))
      || inputType === 'insertFromPaste'
    ) {
      e.target.value = Number(value.replace(/[^\d]/g, '')) || 0;
      value = e.target.value;
    }

    if (data === ' ') {
      e.target.value = value.replace(/\s/g, '');
    }

    if (value.match(/^0/g)) {
      e.target.value = 0;

      if (Number(data) && data.match(/[1-9]/)) {
        e.target.value = data;
      }
    }

    if (value > maxPixelCount) {
      e.target.value = maxPixelCount;
    } else if (!value) {
      e.target.value = 0;
    }
  }

  onChangeFieldSize(e) {
    const self = this;
    const { minPixelCount, maxPixelCount, pixelCount } = self.module;
    const { target, keyCode, type } = e;
    const { value } = target;

    if (keyCode === KEY_ENTER) {
      target.value = Math.max(minPixelCount, Math.min(maxPixelCount, value));
      self.module.setPixelCount(Number(value));
      target.blur();
    }

    if (type === 'blur') {
      target.value = pixelCount;
    }
  }

  onClickClearFieldButton() {
    const self = this;
    self.module.clearField();
  }

  onRender() {
    const self = this;
    const {
      painterField,
      paintToolLabel,
      shadingToolLabel,
      lightingToolLabel,
      eraserToolLabel,
      colorToolColor,
      colorRandomToolCheck,
      fieldSizeToolInput,
      clearFieldToolButton,
    } = self.view.elements;

    painterField.addEventListener('mouseenter', () => self.onMouseEnterOnField());
    painterField.addEventListener('mouseleave', () => self.onMouseLeaveOnField());
    painterField.addEventListener('mousedown', (e) => self.onMouseDownOnField(e));
    painterField.addEventListener('mouseup', (e) => self.onMouseUpOnField(e));
    document.body.addEventListener('mouseup', (e) => self.onMouseUpOnField(e));
    painterField.addEventListener('mousemove', (e) => self.onMouseMoveOnField(e));
    painterField.addEventListener('contextmenu', (e) => e.preventDefault());

    paintToolLabel.addEventListener('click', () => self.onSelectToolType('paint'));
    shadingToolLabel.addEventListener('click', () => self.onSelectToolType('shading'));
    lightingToolLabel.addEventListener('click', () => self.onSelectToolType('lighting'));
    eraserToolLabel.addEventListener('click', () => self.onSelectToolType('eraser'));

    colorToolColor.addEventListener('input', ({ target: { value } }) => self.onChangeColor(value));
    colorRandomToolCheck.addEventListener('change', ({ target: { checked } }) => self.onCheckColorRandom(checked));

    fieldSizeToolInput.addEventListener('input', (e) => self.onInputFieldSize(e));
    fieldSizeToolInput.addEventListener('keyup', (e) => self.onChangeFieldSize(e));
    fieldSizeToolInput.addEventListener('blur', (e) => self.onChangeFieldSize(e));

    clearFieldToolButton.addEventListener('click', () => self.onClickClearFieldButton());
  }
}
