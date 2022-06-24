import PubSub from '../../libs/pubsub.js';

function convertRGBtoHEX(rgb) {
  const hexColor = Object
    .keys(rgb)
    .map((key) => rgb[key].toString(16).padStart(2, '0')).join('');

  return `#${hexColor}`;
}

function convertHEXtoRGB(hex) {
  const hexArr = (hex[0] === '#' ? hex.slice(1) : hex).match(/.{1,2}/g);

  return {
    r: parseInt(hexArr[0], 16),
    g: parseInt(hexArr[1], 16),
    b: parseInt(hexArr[2], 16),
  };
}

function colorShading(rgb) {
  const shaded = Object
    .keys(rgb)
    .map((key) => Math.max(0, Math.min(255, Math.floor(rgb[key] - rgb[key] * 0.15))));

  return {
    r: shaded[0],
    g: shaded[1],
    b: shaded[2],
  };
}

function colorLighting(rgb) {
  const shaded = Object
    .keys(rgb)
    .map((key) => Math.max(0, Math.min(255, Math.floor(rgb[key] + rgb[key] * 0.15))));

  return {
    r: shaded[0],
    g: shaded[1],
    b: shaded[2],
  };
}

function getRandomColor() {
  const rgb = { r: 0, g: 0, b: 0 };

  Object.keys(rgb).forEach((key) => {
    rgb[key] = Math.floor(Math.random() * (255 + 1));
  });

  return rgb;
}

export default class PainterModule extends PubSub {
  constructor({ node } = {}) {
    super();

    const self = this;
    self.node = node;

    self.fieldSize = 500;
    self.pixelCount = 16;
    self.minPixelCount = 4;
    self.maxPixelCount = 256;
    self.pixelSize = null;
    self.pixels = [];
    self.isMouseEnter = false;
    self.isMouseDown = false;
    self.cursorPosition = { col: 0, row: 0 };
    self.paintColor = null;
    self.isRandomColor = false;
    self.toolType = 'paint';
    self.color = { r: 255, g: 255, b: 255 };
    self.isRandomColor = false;

    if (!(node instanceof HTMLElement)) {
      self.node = document.body;
    }

    self.updatePixelSize();
  }

  updatePixelSize() {
    const self = this;
    self.pixelSize = self.fieldSize / self.pixelCount;
  }

  calculateColRow(x, y) {
    const self = this;
    const { pixelCount, pixelSize } = self;

    return {
      col: Math.max(0, Math.min(pixelCount - 1, Math.floor(x / pixelSize))),
      row: Math.max(0, Math.min(pixelCount - 1, Math.floor(y / pixelSize))),
    };
  }

  calculateXY(col, row) {
    const self = this;
    const { fieldSize, pixelSize } = self;

    return {
      x: Math.max(0, Math.min((fieldSize - pixelSize), (col * pixelSize))),
      y: Math.max(0, Math.min((fieldSize - pixelSize), (row * pixelSize))),
    };
  }

  toggleMouseEnter(state) {
    const self = this;
    self.isMouseEnter = typeof state === 'boolean' ? state : !self.isMouseEnter;

    self.publish('toggleMouseEnter', self.isMouseEnter);
  }

  toggleMouseDown(state) {
    const self = this;
    self.isMouseDown = typeof state === 'boolean' ? state : !self.isMouseDown;
  }

  toggleRandomColor(state) {
    const self = this;
    self.isRandomColor = typeof state === 'boolean' ? state : !self.isRandomColor;
  }

  setCursorPosition(col, row) {
    const self = this;

    self.cursorPosition = { col, row };

    self.publish('setCursorPosition', self.calculateXY(col, row));

    return true;
  }

  setPixel(col, row) {
    const self = this;

    if (!self.pixels[col]) {
      self.pixels[col] = [];
    }

    switch (self.toolType) {
      case 'paint':
        self.pixels[col][row] = self.isRandomColor ? { ...getRandomColor() } : { ...self.color };
        self.publish('setPixel', { col, row, color: convertRGBtoHEX(self.pixels[col][row]) });
        break;
      case 'shading':
        if (self.pixels[col][row]) {
          self.pixels[col][row] = colorShading(self.pixels[col][row]);
          self.publish('setPixel', { col, row, color: convertRGBtoHEX(self.pixels[col][row]) });
        }
        break;
      case 'lighting':
        if (self.pixels[col][row]) {
          self.pixels[col][row] = colorLighting(self.pixels[col][row]);
          self.publish('setPixel', { col, row, color: convertRGBtoHEX(self.pixels[col][row]) });
        }
        break;
      case 'eraser':
        if (self.pixels[col][row]) {
          self.pixels[col][row] = null;
          self.publish('removePixel', { col, row });
        }
        break;
      default:
        return false;
    }

    return true;
  }

  setPixelCount(value) {
    const self = this;

    if (typeof value !== 'number') {
      return false;
    }

    self.pixelCount = Math.max(self.minPixelCount, Math.min(self.maxPixelCount, value));

    self.updatePixelSize();

    self.publish('setPixelCount', self.pixelSize);

    return true;
  }

  setToolType(toolType) {
    const self = this;
    const prevToolType = self.toolType;

    if (prevToolType !== toolType) {
      self.toolType = toolType;
      self.publish('setToolType', { toolType, prevToolType });
    }
  }

  setColor(value) {
    const self = this;
    Object.assign(self.color, convertHEXtoRGB(value));
  }

  getColorAsHex() {
    const self = this;
    return convertRGBtoHEX(self.color);
  }

  clearField() {
    const self = this;
    self.pixels = [];

    self.publish('clearField');
  }
}
