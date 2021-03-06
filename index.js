"use strict";

var uuid = require('node-uuid');


module.exports = function Splunk(config){
    // config -> { namespace: 'something', timestamp: true }

    return {
        txid: function(){
            return uuid.v4();
        },
        log: function(obj){
            var msg = config.timestamp ? 'ts=' + (new Date()).toISOString() + ' ': '';
            msg += config.namespace ? 'ns=' + config.namespace + ' ' : '';
            msg += 'env=' + process.env.NODE_ENV;
            delete obj.contextConfig;
            for(var key in obj){
                if(obj.hasOwnProperty([key])) {
                    var value = obj[key];
                    if(value === null || value === undefined) continue;
                    if(typeof value != 'object'){
                        value = '' + value;
                        value = value.replace(/\n|\r/g, ' ');
                    }
                    else {
                        try {
                            value = JSON.stringify(value);
                        } catch(e){
                            value = 'some recursive object';
                        }
                    }
                    if(/[ "]/.test(value))
                        value = '"' + value.replace(/"/g, '\\"') + '"';
                    msg += ' ' + key + '=' + value;
                }
            }
            try{
                console.log('METRIC ' + msg);
            } catch(e){
                console.log('error', e);
            }
        }
    };
};
