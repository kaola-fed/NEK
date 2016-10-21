import FreeMarkerParser from './parsers/freemarker';
import HtmlParser from './parsers/html';
import JavascriptParser from './parsers/javascript';

class TemplateFactory {

  static create(type) {
    if (type === 'freemarker') {
      return new FreeMarkerParser();
    } else if (type === 'html') {
      return new HtmlParser();
    }
    return new JavascriptParser();
  }
}

export default TemplateFactory;
