import FreeMarkerParser from './parsers/freemarker';
import HtmlParser from './parsers/html';
import JavascriptParser from './parsers/javascript';
import EntryParser from './parsers/entry';

class TemplateFactory {

  static create(type, meta) {
    if (type === 'freemarker') {
      return new FreeMarkerParser(meta);
    } else if (type === 'html') {
      return new HtmlParser(meta);
    } else if (type === 'entry') {
      return new EntryParser(meta);
    }
    return new JavascriptParser(meta);
  }
}

export default TemplateFactory;
