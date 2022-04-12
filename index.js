/*
 *  @Soldy\temprc\2022.03.07\GPL3
 */
'use strict';
const https = require('https');
const http = require('http');
const $setuprc = (require('setuprc')).base;
const $clonerc = new (require('clonerc')).base();

const clientBase = function(options){
    this.request = async function(options){
        _setup.reset();
        _setup.setup(options);
        if(_setup.get('protocol') === 'http')
            return await _request('http');
        return await _request('https');
    };
    const _setup = new $setuprc({
        'host':{
            'type'    : 'string',
            'default' : '127.0.0.1'
        },
        'path':{
            'type'    : 'string',
            'default' : '/'
        },
        'protocol':{
            'type'    : 'select',
            'list'    : [
                'http',
                'https'
            ],
            'default' : 'https'
        },
        'port':{
            'type'    : 'integer',
            'default' : 443
        },
        'method':{
            'type'    : 'select',
            'list'    : [
                'GET',
                'POST',
                'PUT',
                'DELETE',
                'CONNECT',
                'OPTIONS',
                'TRACE',
                'PATCH'
            ],
            'default' : 'GET'
        }
    });
    const _header = function(headers){
        let out = {};
        for(let i in options.headers){
            if(typeof headers[i] !== 'undefined')
                out[i]= $clonerc.clone(
                    headers[i]
                );
        }
        return out;

    }
    const _options = function(){
        return {
            method : _setup.get('method'),
            host   : _setup.get('host'),
            path   : _setup.get('path'),
            port   : _setup.get('port')
        };
    }
    const _protocols = {http,https}
    const _request = async function(protocol){
        const data = await (new Promise(function(resolve, reject) {
            let req = _protocols[protocol].request(_options(), function(resp){
                let data = '';
                resp.on('data', function(chunk){
                    data += chunk;
                });
                resp.on('end', function(){
                    resolve({
                        headers:resp.headers,
                        status_code:resp.statusCode,
                        response:data
                    });
                });
                resp.on("error", (err) => {
                    reject(err);
                });
            }).on("error", (err) => {
                console.log(err);
                reject(err);
            });
            req.end();
        }));
        return data;
    };
}


exports.base = clientBase;

