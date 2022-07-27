export default class PubSub {
  constructor() {
    const self = this;
    self.events = {};
  }

  subscribe(eventName, callback) {
    const self = this;

    if (!self.events[eventName]) {
      self.events[eventName] = [];
    }

    self.events[eventName].push(callback);

    return self;
  }

  publish(eventName, args) {
    const self = this;

    if (!self.events[eventName]) {
      return false;
    }

    self.events[eventName].forEach((callback) => callback(args));

    return true;
  }
}
