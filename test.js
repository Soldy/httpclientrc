#!/usr/bin/nodejs
'use strict';

const nanoTest  = new (require('nanoTest')).test({
    'progress_bar' : false,
    'debug_print' : 'short'
});

const $microrc  = new (require('microrc')).base();
const $http = new (require('./index.js')).base();



nanoTest.add(
    'start microrc',
    {
        'function': $microrc.start,
        'options' :[
            function(req, post){
                return post;
            }
        ]
    },
    '!error'
);
nanoTest.add(
    'query',
    {
        'function': $http.request,
        'options' :[{
             host     : '127.0.0.1',
             port     : 8888,
             path     : '/',
             protocol : 'http',
             method   : 'GET'
        }]
    },
    '!error'
);
nanoTest.add(
    'stop microrc',
    {
        'function': $microrc.stop,
        'options' :[]
    },
    '!error'
);
nanoTest.run();
