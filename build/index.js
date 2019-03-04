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
    options: {}
};
class RedisDao {
    constructor(options) {
        this.options = {};
        if (!options) {
            throw new Error('redis config is missing');
        }
        for (let k in defaultOptions) {
            if (typeof options[k] !== 'undefined') {
                this.options[k] = options[k];
            }
            else {
                this.options[k] = defaultOptions[k];
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
}
exports.default = RedisDao;
