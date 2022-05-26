export default class Player {
  constructor(name) {
    this.name = name || 'Unknown';
    this.score = 0;
  }

  increaseScore() {
    this.score += 1;
  }

  resetScore() {
    this.score = 0;
  }
}
