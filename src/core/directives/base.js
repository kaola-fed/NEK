const fs = require('fs');

class BaseDirective {
  constructor(filepath) {
    this.filePath = filepath;
    this.content = null;
  }

  set content(content) { this._content = content; }

  get content() {
    if (this._content) return this._content;
    if (!this.exists()) return null;

    return fs.readFileSync(this.filePath, 'utf8');
  }

  exists() {
    return fs.existsSync(this.filePath);
  }

  writeFile(content) {
    fs.writeFile(this.filePath, content);
  }

  update() {
    return true;
  }
}

module.exports = BaseDirective;
