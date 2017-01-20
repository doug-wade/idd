export default class Logger {
  constructor({tokens, config}, level) {
    this.level = level;
    this.tokens = tokens[config.language];
  }

  info(token) {
    if (this.level !== 'quiet') {
      console.log(this.tokens[token]);
    }
  }
}
