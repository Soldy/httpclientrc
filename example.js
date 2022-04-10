'use strict';

const $http = new (require('./index.js')).base();

const _example = async function(){
     let out = await $http.request({
        host     : '127.0.0.1',
        path     : '/',
        protocol : 'http',
        method   : 'GET'
    });
    console.log(out);
}


_example();
