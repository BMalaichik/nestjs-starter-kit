const NodeEnvironment = require('jest-environment-node');

class AppCustomEnvironment extends NodeEnvironment {
    constructor(config, context) {
        super(config, context);
    }

    async setup() {
        this.global.APP = global.APP;
        this.global.SERVER = global.SERVER;
    }

    async teardown() {
        delete this.global.APP;
        delete this.global.SERVER;
    }
}


module.exports = AppCustomEnvironment;
