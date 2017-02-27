const FreeMarkerParser = require('./parsers/freemarker');
const HtmlParser = require('./parsers/html');
const JavascriptParser = require('./parsers/javascript');
const EntryParser = require('./parsers/entry');

class TemplateFactory {

  static create(type, meta, force) {
    if (type === 'freemarker') {
      return new FreeMarkerParser(meta, force);
    } else if (type === 'html') {
      return new HtmlParser(meta, force);
    } else if (type === 'entry') {
      return new EntryParser(meta, force);
    }
    return new JavascriptParser(meta, force);
  }
}

module.exports = TemplateFactory;
