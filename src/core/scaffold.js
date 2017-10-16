const request = require('request-promise');
const path = require('path');

const rc = require('./util/rc');
const log = require('./util/log');
const download = require('download');

class Scaffold {
    constructor(options){
        this.options = options;
    }

    async run(){
        const { init, add, del , keyword, url, list} = this.options;
        if (list) {
            this.list();
        }
        if (add) {
            if(!keyword || !url) {
                log.red('use nek scaffold -a -k [keyword] -u [url] to add a map.');
                process.exit(1);
            }
            this.add(keyword, url);
        }
        if (del) {
            if(!keyword){
                log.red('use nek scaffold -d -k [keyword] to delete an existed map,\nor use `nek scaffold -l to check all map list`.');
                process.exit(1);
            }
            this.remove(keyword);
        }
        if (init) {
            if(keyword) {
                this.getTpl(keyword);
            }else{
                question('init', (options) => {
                    this.getTpl();
                });
            }
        }
    }

    async add(keyword, url){
        const exist = await request(`${rc.api}/scaffold/exist?keyword=${keyword}`, { json: true });
        if(exist){
            log.red(`keyword[${keyword}] exist, please use another.`);
            process.exit(1);
        }
        const result = await request(`${rc.api}/scaffold/add?keyword=${keyword}&url=${url}`, { json: true });
        if(result.ok){
            log.green(`keyword[${keyword}] mapped to url[${url}].`);
        }
    }

    async remove(keyword){
        const exist = await request(`${rc.api}/scaffold/exist?keyword=${keyword}`, { json: true });
        if(!exist){
            log.red('keyword do not exist, use `nek scaffold -l to check all map list`.');
            process.exit(1);
        }
        const result = await request(`${rc.api}/scaffold/remove?keyword=${keyword}`, { json: true });
        if(result.ok){
            log.green(`keyword[${keyword}] removed.`);
        }
    }

    async list(){
        const map = await request(`${rc.api}/scaffold/map`, { json: true });
        const list = map.map(function(value){
            return { keyword: value.keyword, url: value.url};
        });
        console.log(list);
    }

    async getTpl(keyword){
        const result = await request(`${rc.api}/scaffold/getUrl?keyword=${keyword}`, { json: true });
        const file = await download(result.url, 'dist');
    }
}

module.exports = Scaffold;