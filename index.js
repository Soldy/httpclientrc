/*
 *  @Soldy\temprc\2022.03.07\GPL3
 */
'use strict';
const https = require('https');
const $setuprc = (require('setuprc')).base;
const $clonerc = new (require('clonerc')).base();

const clientBase = async function(options){
    const _setup_json = {
        'hostname':{
            'type'    : 'string',
            'default' : '127.0.0.1'
        },
        'path':{
            'type'    : 'string',
        'address':{
            'type'    : 'string',
            'default' : ''
        },
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
    };
    const _header = function(headers){
        let out = {};
        for(let i in options.headers){
            out[i]= $clonerc.clone(
                headers[i]
            );

        }
        return out;

    }
    const _request = async function(options){
        const data = await (new Promise(function(resolve, reject) {
            http.request(options, (resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    resolve({
                        headers:res.headers
                        status_code:res.statusCode,
                        response:data
                    });
                });
            }).on("error", (err) => {
                reject(err);
            });
        }));
        //const data = await query();
        return data;
    }
}


const client = clientBase();
