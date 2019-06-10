"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const defaultOptions = {
    host: '127.0.0.1',
    port: 6379,
    path: null,
    url: null,
    parser: 'javascript',
    string_numbers: null,
    return_buffers: false,
    detect_buffers: false,
    socket_keepalive: true,
    socket_initialdelay: 0,
    no_ready_check: false,
    enable_offline_queue: false
};
class RedisDao {
    constructor(options) {
        this.options = {};
        if (!options) {
            throw new Error('redis config is missing');
        }
        Object.assign(this.options, defaultOptions);
        for (let k in options) {
            if (typeof this.options[k] !== 'undefined') {
                this.options[k] = options[k];
            }
        }
    }
    connect() {
        if (!this.client) {
            this.client = redis_1.createClient(this.options);
        }
        return this.client;
    }
    getClient() {
        return this.client;
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client) {
                yield this.client.end();
            }
        });
    }
    set(key, val) {
        return this.sendCommand('set', key, val);
    }
    get(key) {
        return this.sendCommand('get', key);
    }
    expire(key, seconds) {
        return this.sendCommand('expire', key, seconds);
    }
    del(...key) {
        return this.sendCommand.call(this, 'del', ...key);
    }
    sendCommand(cmd, ...args) {
        return new Promise((res, rej) => {
            const client = this.getClient();
            if (!client) {
                rej('redis client is empty');
                return;
            }
            client.sendCommand(cmd, args, function (err, data) {
                if (err) {
                    rej(err);
                }
                else {
                    res(data);
                }
            });
        });
    }
}
exports.default = RedisDao;
RedisDao['singleton'] = true;
