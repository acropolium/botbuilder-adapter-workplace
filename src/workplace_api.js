/**
 * This is slightly modified copy of facebook_api from botbuilder-adapter-facebook.
 * In this version request is made with appsecret_proof which is gererated using different algorithm
 * and added appsecret_time param which is required by Facebook Workplace
 */

const request = require('request');
const crypto = require('crypto');

class FacebookAPI {
    constructor(token, secret, api_host = 'graph.facebook.com', api_version = 'v3.2') {
        if (!token) {
            throw new Error('Token is required!');
        }
        this.token = token;
        this.secret = secret;
        this.api_host = api_host;
        this.api_version = api_version;
    }

    async callAPI(path, method = 'POST', payload = {}) {
        const [proof, time] = this.getAppSecretProof(this.token, this.secret);

        let queryString = '?';
        let body = {};

        if (method.toUpperCase() === 'GET') {
            for (const key in payload) {
                queryString = queryString + `${ encodeURIComponent(key) }=${ encodeURIComponent(payload[key]) }&`;
            }
        } else {
            body = payload;
        }

        return new Promise((resolve, reject) => {
            request({
                method: method.toUpperCase(),
                json: true,
                body,
                uri: `https://${ this.api_host }/${ this.api_version }${ path }${ queryString }access_token=${ this.token }&appsecret_proof=${ proof }&appsecret_time=${ time }`
            }, (err, res, body) => {
                if (err) {
                    reject(err);
                } else if (body.error) {
                    reject(body.error.message);
                } else {
                    resolve(body);
                }
            });
        });
    }

    getAppSecretProof(access_token, app_secret) {
        const time = Math.floor(Date.now() / 1000);
        const proof = crypto.createHmac('sha256', app_secret).update(`${access_token}|${time}`).digest('hex');
        return [proof, time];
    }
}

module.exports = FacebookAPI;
