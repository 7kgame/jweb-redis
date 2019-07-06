"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jbean_1 = require("jbean");
const BEAN_PREFIX = 'redis.';
const DEFAULT_DAO_BEAN = 'primary';
class RedisRepository {
    constructor(entityClz) {
        this.useDefaultDao = false;
        this.entityClz = entityClz;
    }
    getDao(master) {
        master = master || false;
        const filter = function (target) {
            if (!target || !target.ins || typeof target.ins.isMaster !== 'function') {
                return false;
            }
            return target.ins.isMaster() === master;
        };
        let bean = null;
        if (!this.useDefaultDao) {
            const jwebPackage = this.constructor && this.constructor[jbean_1.CTOR_JWEB_PACKAGE_KEY];
            bean = jbean_1.BeanFactory.getBeanByPackage(jwebPackage, filter, BEAN_PREFIX);
        }
        if (!bean) {
            this.useDefaultDao = true;
            bean = jbean_1.BeanFactory.getBean(BEAN_PREFIX + DEFAULT_DAO_BEAN);
        }
        return bean;
    }
    set(key, val) {
        return this.getDao(true).sendCommand('set', key, val);
    }
    get(key, decoder) {
        if (decoder) {
            return this.getDao().sendCommand('get', key, decoder);
        }
        else {
            return this.getDao().sendCommand('get', key);
        }
    }
    expire(key, seconds) {
        return this.getDao(true).sendCommand('expire', key, seconds);
    }
    del(...key) {
        return this.getDao(true).sendCommand.call(this, 'del', ...key);
    }
    sendCommand(cmd, ...args) {
        let master = false;
        if (args && args.length > 0) {
            if (typeof args.slice(-1)[0] === 'boolean') {
                master = args.pop();
            }
        }
        const dao = this.getDao(master);
        return dao.sendCommand.call(dao, cmd, ...args);
    }
    getClient(master) {
        return this.getDao(master).getClient();
    }
}
exports.default = RedisRepository;
