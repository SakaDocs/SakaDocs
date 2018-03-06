// We need this to build our post string
var querystring = require('querystring');
var https = require('https');
// Africa'stalking logins
var username = 'saka';
var apikey = '1d6ff349214d3eaaa309040e862e2575668871379436ade353506385fddc7e9a';



exports.sendMessage = function (to, message, req, res) {

    // Define the recipient numbers in a comma separated string
    // Numbers should be in international format as shown
    var to = to;

    // And of course we want our recipients to know what we really do
    var message = message;

    // Build the post string from an object

    var post_data = querystring.stringify({
        'username': username,
        'to': to,
        'message': message
    });
    var post_options = {
        host: 'api.sandbox.africastalking.com',
        path: '/version1/messaging',
        method: 'POST',

        rejectUnauthorized: false,
        requestCert: true,
        agent: false,

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length,
            'Accept': 'application/json',
            'apikey': apikey
        }
    };

    var post_req = https.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            var jsObject = JSON.parse(chunk);
            console.log(jsObject)
            var recipients = jsObject.SMSMessageData.Recipients;
            if (recipients.length > 0) {
                for (var i = 0; i < recipients.length; ++i) {
                    var logStr = 'number=' + recipients[i].number;
                    logStr += ';cost=' + recipients[i].cost;
                    logStr += ';status=' + recipients[i].status; // status is either "Success" or "error message"
                    console.log(logStr);
                }
            } else {
                console.log('Error while sending: ' + jsObject.SMSMessageData.Message);
            }
        });
    });

    // Add post parameters to the http request
    post_req.write(post_data);

    post_req.end();
}