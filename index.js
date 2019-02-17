'use strict';

// load AWS SDK module, which is always included in the runtime environment
const AWS = require('aws-sdk');
const UTA = {
  token: process.env.uta_api_token
};

// define our target API as a "service"
const svc = new AWS.Service({

    // the API base URL
    endpoint: 'http://api.rideuta.com/SIRI/SIRI.svc',

    // don't parse API responses
    // (this is optional if you want to define shapes of all your endpoint responses)
    convertResponseTypes: false,

    // and now, our API endpoints
    apiConfig: {
        metadata: {
            protocol: 'rest-xml' // API returns XML
        },
        operations: {

            // GetStop stuff
            GetStop: {
                http: {
                    method: 'GET',
                    // note the placeholder in the URI
                    requestUri: 'StopMonitor'
                },
                input: {
                    type: 'structure',
                    required: [ 'auth', 'stopid', 'minutesout' ],
                    members: {
                        'auth': {
                            // send authentication header in the HTTP request header
                            location: 'uri',
                            locationName: 'usertoken',
                            sensitive: true
                        },
                        'stopid': {
                            // all kinds of validators are available
                            type: 'string',
                            // include it in the call URI
                            location: 'uri',
                            // this is the name of the placeholder in the URI
                            locationName: 'stopid'
                        },
                        'minutesout' : {
                            type : 'integer',
                            location : 'uri',
                            locationName : 'minutesout'
                        }
                    }
                },
                /*
                output: {
                    type: 'structure',
                    members:  {
                        'ResponseTimestamp' : {
                            location : 'body',
                            locationName : 'ResponseTimestamp'
                        }
                    }
                }
                */
            }
        }
    }
});

// disable AWS region related login in the SDK
svc.isGlobalEndpoint = true;

// and now we can call our target API!
exports.handler = function(event, context, callback) {

    // note how the methods on our service are defined after the operations
   //ontext.succeed('hello world');
    svc.getStop({
            auth: UTA.token,
            stopid: 'FR301084',
            minutesout : 600,
        }, (err, data) => {

            if (err) {
                console.error('>>> operation error:', err);
                return callback(err);
            }

            console.log('it worked');
            console.log(UTA.token);
            console.log(data);
            callback();
    });
};
