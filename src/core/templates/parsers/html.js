/**
 * HtmlParser的作用:
 * 1. 读取json中
 */
import fs from 'fs';
import Handlebars from 'handlebars';
import { html } from 'js-beautify';

import BaseParser from './base';

class HtmlParser extends BaseParser {
  writePage() {
    const source = fs.readFileSync('./template/template.html', 'utf-8');
    const template = Handlebars.compile(source, { noEscape: true });

    const rst = template(this.json);
    fs.writeFileSync('result.html', html(rst, { indent_size: 2 }));
  }
}

export default HtmlParser;
