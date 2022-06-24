export default class PainterView {
  constructor(module) {
    const self = this;
    self.module = module;
    self.elements = {};
    self.pixelElements = [];

    // Events
    self.module
      .subscribe('toggleMouseEnter', (state) => self.showFieldCursor(state))
      .subscribe('setCursorPosition', ({ x, y }) => self.moveFieldCursor(x, y))
      .subscribe('setPixel', ({ col, row, color }) => self.createPixel(col, row, color))
      .subscribe('removePixel', ({ col, row }) => self.removePixel(col, row))
      .subscribe('setPixelSize', (value) => self.updateSizes(value))
      .subscribe('setToolType', ({ toolType, prevToolType }) => self.changeToolType(toolType, prevToolType))
      .subscribe('setPixelCount', (value) => self.updateSizes(value))
      .subscribe('clearField', () => self.clearField());
  }

  /* eslint no-param-reassign: "off" */
  updateSizes(value) {
    const self = this;
    const { fieldSize, pixelSize } = self.module;
    const { painterField, fieldCursor } = self.elements;
    const maxColRow = Math.floor(fieldSize / pixelSize);

    painterField.style.backgroundSize = `${value}px`;
    fieldCursor.style.width = `${value}px`;
    fieldCursor.style.height = `${value}px`;

    self.pixelElements.forEach((arr, col) => arr.forEach((pixel, row) => {
      const { x, y } = self.module.calculateXY(col, row);

      if (pixel instanceof HTMLElement) {
        if (col >= maxColRow || row >= maxColRow) {
          pixel.style.display = 'none';
        } else if (pixel.style.display) {
          pixel.style.display = null;
        }

        pixel.style.width = `${pixelSize}px`;
        pixel.style.height = `${pixelSize}px`;
        pixel.style.left = `${x}px`;
        pixel.style.top = `${y}px`;
      }
    }));
  }

  showFieldCursor(state) {
    const self = this;
    const { fieldCursor } = self.elements;

    fieldCursor.classList[state ? 'add' : 'remove']('field__cursor_show');
  }

  moveFieldCursor(x, y) {
    const self = this;
    const { fieldCursor } = self.elements;

    fieldCursor.style.left = `${x}px`;
    fieldCursor.style.top = `${y}px`;
  }

  changeToolType(toolType, prevToolType) {
    const self = this;
    const prevToolLabel = self.elements[`${prevToolType}ToolLabel`];
    const toolLabel = self.elements[`${toolType}ToolLabel`];
    const toolRadio = self.elements[`${toolType}ToolRadio`];

    if (prevToolType) {
      prevToolLabel.classList.remove('tool_checked');
    }

    toolLabel.classList.add('tool_checked');
    toolRadio.checked = true;
  }

  createPixel(col, row, color) {
    const self = this;
    const { pixelSize } = self.module;
    const { fieldPixels } = self.elements;

    if (!self.pixelElements[col]) {
      self.pixelElements[col] = [];
    }

    let pixel = self.pixelElements[col][row];
    const { x, y } = self.module.calculateXY(col, row);

    if (pixel) {
      pixel.style.backgroundColor = color;
    } else {
      pixel = document.createElement('div');
      pixel.className = 'pixel';
      pixel.style.backgroundColor = color;
      pixel.style.width = `${pixelSize}px`;
      pixel.style.height = `${pixelSize}px`;
      pixel.style.left = `${x}px`;
      pixel.style.top = `${y}px`;

      self.pixelElements[col][row] = pixel;

      fieldPixels.append(self.pixelElements[col][row]);
    }
  }

  removePixel(col, row) {
    const self = this;

    if (self.pixelElements[col] && self.pixelElements[col][row]) {
      self.pixelElements[col][row].remove();
      self.pixelElements[col][row] = null;
    }

    return false;
  }

  clearField() {
    const self = this;

    self.pixelElements.forEach((arr, col) => arr.forEach((_, row) => {
      self.removePixel(col, row);
    }));
  }

  render() {
    const self = this;
    const {
      node,
      pixelSize,
      toolType,
      isRandomColor,
      pixelCount,
    } = self.module;
    let { container } = self.elements;

    if (!container) {
      container = document.createElement('div');
      container.className = 'painter';
      self.elements.container = container;
      node.prepend(self.elements.container);
    }

    // LEFT SIDE
    self.elements.leftSide = document.createElement('div');
    self.elements.header = document.createElement('header');
    self.elements.heading = document.createElement('h1');
    self.elements.tools = document.createElement('div');

    self.elements.leftSide.classList.add('painter-side', 'painter-side_left');
    self.elements.header.className = 'painter__header';
    self.elements.heading.className = 'header__title';
    self.elements.tools.className = 'painter__tools';

    self.elements.heading.textContent = 'Etch a Sketch';

    self.elements.leftSide.append(self.elements.header);
    self.elements.header.append(self.elements.heading);

    self.elements.leftSide.append(self.elements.tools);

    container.append(self.elements.leftSide);

    // RIGHT SIDE
    self.elements.rightSide = document.createElement('div');
    self.elements.painterField = document.createElement('div');
    self.elements.fieldPixels = document.createElement('div');
    self.elements.fieldCursor = document.createElement('div');

    self.elements.rightSide.classList.add('painter-side', 'painter-side_right');
    self.elements.painterField.className = 'painter__field';
    self.elements.fieldPixels.className = 'field__pixels';
    self.elements.fieldCursor.className = 'field__cursor';

    self.elements.rightSide.append(self.elements.painterField);
    self.elements.painterField.append(self.elements.fieldCursor);
    self.elements.painterField.append(self.elements.fieldPixels);

    container.append(self.elements.rightSide);

    // BRUSH TOOLS
    let toolContainer = document.createElement('div');
    toolContainer.className = 'tool-container';

    self.elements.paintToolLabel = document.createElement('label');
    self.elements.paintToolRadio = document.createElement('input');
    self.elements.paintToolLabel.className = 'tool__label';
    self.elements.paintToolLabel.textContent = 'paint';
    self.elements.paintToolRadio.className = 'tool__radio';
    self.elements.paintToolRadio.type = 'radio';
    self.elements.paintToolRadio.name = 'tool-type';
    self.elements.paintToolLabel.append(self.elements.paintToolRadio);
    toolContainer.append(self.elements.paintToolLabel);

    self.elements.shadingToolLabel = document.createElement('label');
    self.elements.shadingToolRadio = document.createElement('input');
    self.elements.shadingToolLabel.className = 'tool__label';
    self.elements.shadingToolLabel.textContent = 'shading';
    self.elements.shadingToolRadio.className = 'tool__radio';
    self.elements.shadingToolRadio.type = 'radio';
    self.elements.shadingToolRadio.name = 'tool-type';
    self.elements.shadingToolLabel.append(self.elements.shadingToolRadio);
    toolContainer.append(self.elements.shadingToolLabel);

    self.elements.lightingToolLabel = document.createElement('label');
    self.elements.lightingToolRadio = document.createElement('input');
    self.elements.lightingToolLabel.className = 'tool__label';
    self.elements.lightingToolLabel.textContent = 'lighting';
    self.elements.lightingToolRadio.className = 'tool__radio';
    self.elements.lightingToolRadio.type = 'radio';
    self.elements.lightingToolRadio.name = 'tool-type';
    self.elements.lightingToolLabel.append(self.elements.lightingToolRadio);
    toolContainer.append(self.elements.lightingToolLabel);

    self.elements.eraserToolLabel = document.createElement('label');
    self.elements.eraserToolRadio = document.createElement('input');
    self.elements.eraserToolLabel.className = 'tool__label';
    self.elements.eraserToolLabel.textContent = 'eraser';
    self.elements.eraserToolRadio.className = 'tool__radio';
    self.elements.eraserToolRadio.type = 'radio';
    self.elements.eraserToolRadio.name = 'tool-type';
    self.elements.eraserToolLabel.append(self.elements.eraserToolRadio);
    toolContainer.append(self.elements.eraserToolLabel);

    self.elements.tools.append(toolContainer);

    // COLOR TOOLS
    toolContainer = document.createElement('div');
    toolContainer.className = 'tool-container';

    self.elements.colorToolLabel = document.createElement('label');
    self.elements.colorToolColor = document.createElement('input');
    self.elements.colorToolLabel.className = 'tool__label';
    self.elements.colorToolLabel.textContent = 'color';
    self.elements.colorToolColor.className = 'tool__color';
    self.elements.colorToolColor.type = 'color';
    self.elements.colorToolColor.name = 'tool-color';
    self.elements.colorToolLabel.append(self.elements.colorToolColor);
    toolContainer.append(self.elements.colorToolLabel);

    self.elements.colorRandomToolLabel = document.createElement('label');
    self.elements.colorRandomToolCheck = document.createElement('input');
    self.elements.colorRandomToolLabel.className = 'tool__label';
    self.elements.colorRandomToolLabel.textContent = 'random color';
    self.elements.colorRandomToolCheck.className = 'tool__checkbox';
    self.elements.colorRandomToolCheck.type = 'checkbox';
    self.elements.colorRandomToolCheck.name = 'tool-color-random';
    self.elements.colorRandomToolLabel.append(self.elements.colorRandomToolCheck);
    toolContainer.append(self.elements.colorRandomToolLabel);

    self.elements.tools.append(toolContainer);

    // FIELD TOOLS
    toolContainer = document.createElement('div');
    toolContainer.className = 'tool-container';

    self.elements.fieldSizeToolLabel = document.createElement('label');
    self.elements.fieldSizeToolInput = document.createElement('input');
    self.elements.fieldSizeToolLabel.className = 'tool__label';
    self.elements.fieldSizeToolLabel.textContent = 'field size';
    self.elements.fieldSizeToolInput.className = 'tool__input';
    self.elements.fieldSizeToolInput.type = 'input';
    self.elements.fieldSizeToolInput.name = 'field-size';
    self.elements.fieldSizeToolLabel.append(self.elements.fieldSizeToolInput);
    toolContainer.append(self.elements.fieldSizeToolLabel);

    self.elements.tools.append(toolContainer);

    // BOTTOM TOOLS
    toolContainer = document.createElement('div');
    toolContainer.classList.add('tool-container', 'tool-container_bottom');

    self.elements.clearFieldToolButton = document.createElement('button');
    self.elements.clearFieldToolButton.className = 'tool__label';
    self.elements.clearFieldToolButton.textContent = 'clear field';
    self.elements.clearFieldToolButton.className = 'tool__button';
    self.elements.clearFieldToolButton.type = 'button';
    toolContainer.append(self.elements.clearFieldToolButton);

    self.elements.tools.append(toolContainer);

    // Apply states
    self.updateSizes(pixelSize);
    self.changeToolType(toolType);
    self.elements.colorToolColor.value = self.module.getColorAsHex();
    self.elements.colorRandomToolCheck.checked = isRandomColor;
    self.elements.fieldSizeToolInput.value = pixelCount;

    // Events
    self.module.publish('onRender');
  }
}
