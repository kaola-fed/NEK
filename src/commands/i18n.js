const log = require('../core/util/log');
const I18n = require('../core/i18n');

exports.command = 'i18n [options]';

exports.desc = 'run must command';
exports.builder = {
    p: {
        alias: '',
        demand: true,
        describe: '当前项目根目录名称',
        type: 'string',
    }
}

exports.handler = async (argv) => {
    const { p: projectName } = argv;
    
    try {
        const i18n = new I18n(projectName);
        i18n.run();
    } catch (error) {
        log.red(error);
    }
};
