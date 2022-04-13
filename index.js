/*
 *  @Soldy\httpclientrc\2022.03.07\GPL3
 */
'use strict';
const https = require('https');
const http = require('http');
const $setuprc = (require('setuprc')).base;
const $clonerc = new (require('clonerc')).base();
/*
 * @prototype
 */
const clientBase = function(options_, headers_){
    /*
     *  @param {object}
     *  @public
     *  @return {object}
     */
    this.request = async function(options, data){
        _setup.reset();
        _setup.setup(options);
        if(_setup.get('protocol') === 'http')
            return await _request('http', data);
        return await _request('https', data);
    };
    /*
     *  @private
     *  @var {object}
     */
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
    /*
     *  @private
     *  @var {object}
     */
    let _pre_setup = {}
    /*
     *  @private
     *  @var {object}
     */
    let _current_headers = {}
    /*
     *  @private
     *  @var {object}
     */
    const _default_headers = {
        'Accept-Charset' : 'utf-8',
        'Content-Type'   : 'application/json',
        'Connection'     : 'keep-alive',
        'User-Agent'     : 'httpclientrc 0.0'

    };
    /*
     *  @private
     *  @var {object}
     */
    const _known_headers = [ 
        'Accept-Charset',
        'Connection',
        'Content-Type',
        'Content-Length',
        'User-Agent'
    ];

    /*
     *  @private
     *  @return {object}
     */
    const _header = function(){
        let out = {};
        for(let i in _default_headers){
            if(typeof _default_headers[i] !== 'undefined')
                out[i]= $clonerc.clone(
                    _default_headers[i]
                );
        }
        for(let i in _current_headers){
            if(typeof _current_headers[i] !== 'undefined')
                out[i]= $clonerc.clone(
                    _current_headers[i]
                );
        }
        return out;
    };
    /*
     *  @param {object}
     *  @private
     */
    const _setHeader = function(headers){
        let out = {};
        for(let i in headers){
            if(typeof headers[i] !== 'undefined')
                out[i]= $clonerc.clone(
                    headers[i]
                );
        }
        _current_headers =  out;
    };
    /*
     *  @private
     *  @return {object}
     */
    const _options = function(){
        return {
            method  : _setup.get('method'),
            host    : _setup.get('host'),
            path    : _setup.get('path'),
            headers : _header(),
            port    : _setup.get('port')
        };
    };
    /*
     * @private
     */
    const _protocols = {http,https}
    /*
     *  @param {string}
     *  @private
     *  @return {object}
     */
    const _request = async function(protocol, post_data){
        if (typeof post_data !== 'undefined' )
            _current_headers['content-length'] =  post_data.length;
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
            if (typeof post_data !== 'undefined' )
                req.write(post_data);
            req.end();
        }));
        return data;
    };

    // constructor
    if(typeof options_ !== 'undefined')
        _pre_setup = options_;
    if(typeof headers_ !== 'undefined')
        setHeaders(headers_);
}


exports.base = clientBase;

