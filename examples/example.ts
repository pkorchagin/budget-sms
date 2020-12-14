const config = require('./config.json');
import {BudgetSMS} from '../build';

const smsId = '1166236';
const message = '"This is example content"';

const sms: BudgetSMS = new BudgetSMS(config).from('380676543210').to('31612345678');

Promise.all([
    sms.checkCredit(),
    sms.send(message),
    sms.HLR(),
    sms.pullDLR(smsId),
    sms.getPricing(),
])
    .then((values: any[]) => {
        console.log(values);
    })
    .catch((error) => console.error(error));
