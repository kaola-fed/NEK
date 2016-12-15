import FreeMarkerParser from './parsers/freemarker';
import HtmlParser from './parsers/html';
import JavascriptParser from './parsers/javascript';
import EntryParser from './parsers/entry';

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

export default TemplateFactory;
