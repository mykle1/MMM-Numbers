/* Magic Mirror
 * Module: MMM-Numbers
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getNumbers: function(url) {
        request({
            url: "http://numbersapi.com/random/" + this.config.type,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.stringify(body);
                // console.log(result);
                this.sendSocketNotification('NUMBERS_RESULT', result);
            }
        });
    },



    socketNotificationReceived: function(notification, payload) {
        if (notification === 'CONFIG') {
            this.config = payload;
        } else if (notification === 'GET_NUMBERS') {
            this.getNumbers(payload);
        }
    }
});
