[![BudgetSMS logo](https://www.budgetsms.net/images/full-logo.png)](https://www.budgetsms.net/)

#Easy sending of SMS messages

## Installation

```bash
yarn add @korchagin/budget-sms
```
or
```bash
npm install @korchagin/budget-sms
```
## Usage

#### Create a BudgetSMS account and fill in the config parameters below.

#### Example TS
```typescript
const config = {
    "username": "usernameFromBudgetSMS",
    "userid": "useridFromBudgetSMS",
    "handle": "handleFromBudgetSMS"
};
import { BudgetSMS } from '@korchagin/budget-sms';

const to = '31612345678';
const from = '380676543210';
const smsid = '1166236';
const message = '"This is example content"';

const sms: BudgetSMS = new BudgetSMS(config).from(from).to(to);

Promise.all([
    sms.checkCredit(),
    sms.send(message),
    sms.HLR(),
    sms.pullDLR(smsid),
    sms.getPricing(),
]).then((values: any[]) => {console.log(values);}).catch((error) => console.error(error));
```

## License

Copyright (c) 2020, Philip Korchagin <korchagin.philip@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
