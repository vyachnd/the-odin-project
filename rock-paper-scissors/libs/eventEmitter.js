export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    if (typeof callback !== 'function') {
      throw Error('Callback should be a function!');
    }

    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);

    return this;
  }

  emit(eventName, args) {
    if (!this.events[eventName]) {
      return false;
    }

    this.events[eventName].map((callback) => callback(args));

    return true;
  }
}
