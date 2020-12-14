"use strict";
exports.__esModule = true;
var config = require('./config.json');
var build_1 = require("../build");
var to = '31612345678';
var from = '380676543210';
var smsid = '1166236';
var message = '"This is example content"';
var sms = new build_1.BudgetSMS(config);
sms.from(from).to(to);
Promise.all([
    sms.checkCredit(),
    sms.send(message),
    sms.HLR(to),
    sms.pullDLR(smsid),
])
    .then(function (values) {
    console.log(values);
})["catch"](function (error) { return console.error(error); });
