import { Response } from 'got';

const got = require('got');

interface IConfig {
    username: string,
    userid: string,
    handle: string,
    [key: string]: string
}

export class BudgetSMS {

    readonly endPoints = {
        hlr: 'hlr',
        sendSMS: 'sendsms', // 'testsms'
        checksms: 'checksms',
        getpricing: 'getpricing',
        checkcredit: 'checkcredit',
    };

    readonly apiUrl = 'https://api.budgetsms.net';

    readonly _config;

    private _from: string;

    private _to: string;

    constructor(config: IConfig) {
        this._config = config;
        return this;
    }

    public from(phone: string) {
        this._from = phone;
        return this;
    }

    public to(phone: string) {
        this._to = phone;
        return this;
    }

    protected doRequest = async (search: string) => {
        try {
            return await got(this.apiUrl + search);
        } catch (error) {
            return error;
        }
    };

    protected prepareURI = (
        endPoint: string,
        params: object = this._config,
    ): string => {
        let path = `/${endPoint}/?`;
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                path += key + '=' + encodeURIComponent(params[key]) + '&';
            }
        }
        return path;
    };

    static prepareResponse = (response: Response<any>) => {
        if (response?.body) {
            if (response.body.indexOf('ERR') === 0) {
                return {
                    code: response.body.substr(4),
                    message: BudgetSMS.decodeError(response.body.substr(4)),
                };
            } else {
                if (response.body.indexOf('OK') === 0) {
                    return response.body.substr(3);
                } else {
                    return response.body;
                }
            }
        } else {
            return response;
        }
    };

    public send = async (message: string) =>
        BudgetSMS.prepareResponse(
            await this.doRequest(
                this.prepareURI(this.endPoints.sendSMS, {
                    ...this._config,
                    to: this._to,
                    from: this._from,
                    msg: message,
                }),
            ),
        );

    /**
     * This call will fetch the current credit in your account
     */
    public checkCredit = async () =>
        Number(
            BudgetSMS.prepareResponse(
                await this.doRequest(this.prepareURI(this.endPoints.checkcredit)),
            ),
        );

    /**
     * It is possible to fetch the DLR status for a single SMS message,
     * sent through the HTTP API. Although fetching DLR statuses through this call
     * is possible, the preferred method is making use of Push DLR.
     */
    public pullDLR = async (smsId: string) => {
        const code = BudgetSMS.prepareResponse(
            await this.doRequest(
                this.prepareURI(this.endPoints.checksms, {
                    ...this._config,
                    smsid: smsId,
                }),
            ),
        );
        return {code, status: BudgetSMS.decodeStatusDLR(code)};
    };

    public pushDLR = async () => {
        // TODO: ..
    };

    /**
     * This allows you to fetch detailed information on mobile numbers worldwide.
     * It will return the actual MCC and MNC of a subscriber. This will also work
     * with subscribers who are ported to another operator.
     */
    public HLR = async () =>
        BudgetSMS.prepareResponse(
            await this.doRequest(
                this.prepareURI(this.endPoints.hlr, {...this._config, to: this._to}),
            ),
        );

    /*
     * This call will fetch the current pricing in account
     */
    public getPricing = async () =>
        JSON.parse(
            BudgetSMS.prepareResponse(
                await this.doRequest(this.prepareURI(this.endPoints.getpricing)),
            ),
        );

    static decodeError(code: string): string {
        let message;
        switch (code) {
            case '1001':
                message = 'Not enough credits to send messages';
                break;
            case '1002':
                message = 'Identification failed. Wrong credentials';
                break;
            case '1003':
                message = 'Account not active, contact BudgetSMS';
                break;
            case '1004':
                message =
                    'This IP address is not added to this account. No access to the API';
                break;
            case '1005':
                message = 'No handle provided';
                break;
            case '1006':
                message = 'No UserID provided';
                break;
            case '1007':
                message = 'No Username provided';
                break;
            case '2001':
                message = 'SMS message text is empty';
                break;
            case '2002':
                message = 'SMS numeric senderid can be max. 16 numbers';
                break;
            case '2003':
                message = 'SMS alphanumeric sender can be max. 11 characters';
                break;
            case '2004':
                message = 'SMS senderid is empty or invalid';
                break;
            case '2005':
                message = 'Destination number is too short';
                break;
            case '2006':
                message = 'Destination is not numeric';
                break;
            case '2007':
                message = 'Destination is empty';
                break;
            case '2008':
                message = 'SMS text is not OK (check encoding?)';
                break;
            case '2009':
                message =
                    'Parameter issue (check all mandatory parameters, encoding, etc.)';
                break;
            case '2010':
                message = 'Destination number is invalidly formatted';
                break;
            case '2011':
                message = 'Destination is invalid';
                break;
            case '2012':
                message = 'SMS message text is too long';
                break;
            case '2013':
                message = 'SMS message is invalid';
                break;
            case '2014':
                message = 'SMS CustomID is used before';
                break;
            case '2015':
                message = 'Charset problem';
                break;
            case '2016':
                message = 'Invalid UTF-8 encoding';
                break;
            case '2017':
                message = 'Invalid SMSid';
                break;
            case '3001':
                message =
                    'No route to destination. Contact BudgetSMS for possible solutions';
                break;
            case '3002':
                message = 'No routes are setup. Contact BudgetSMS for a route setup';
                break;
            case '3003':
                message =
                    'Invalid destination. Check international mobile number formatting';
                break;
            case '4001':
                message = 'System error, related to customID';
                break;
            case '4002':
                message =
                    'System error, temporary issue. Try resubmitting in 2 to 3 minutes';
                break;
            case '4003':
                message = 'System error, temporary issue.';
                break;
            case '4004':
                message = 'System error, temporary issue. Contact BudgetSMS';
                break;
            case '4005':
                message = 'System error, permanent';
                break;
            case '4006':
                message = 'Gateway not reachable';
                break;
            case '4007':
                message = 'System error, contact BudgetSMS';
                break;
            case '5001':
                message = 'Send error, Contact BudgetSMS with the send details';
                break;
            case '5002':
                message = 'Wrong SMS type';
                break;
            case '5003':
                message = 'Wrong operator';
                break;
            case '6001':
                message = 'Unknown error';
                break;
            case '7001':
                message = 'No HLR provider present, Contact BudgetSMS.';
                break;
            case '7002':
                message = 'Unexpected results from HLR provider';
                break;
            case '7003':
                message = 'Bad number format';
                break;
            case '7901':
                message = 'Unexpected error. Contact BudgetSMS';
                break;
            case '7902':
                message = 'HLR provider error. Contact BudgetSMS';
                break;
            case '7903':
                message = 'HLR provider error. Contact BudgetSMS';
                break;
            default:
                message = 'Unknown error code ' + code;
        }
        return message;
    }

    static decodeStatusDLR(code: string): string {
        let status;
        switch (code) {
            case '0':
                status = 'Message is sent, no status yet (default)';
                break;
            case '1':
                status = 'Message is delivered';
                break;
            case '2':
                status = 'Message is not sent';
                break;
            case '3':
                status = 'Message delivery failed';
                break;
            case '4':
                status = 'Message is sent';
                break;
            case '5':
                status = 'Message expired';
                break;
            case '6':
                status = 'Message has an invalid destination address';
                break;
            case '7':
                status = 'SMSC error, message could not be processed';
                break;
            case '8':
                status = 'Message not allowed';
                break;
            case '11':
                status =
                    'Message status unknown, usually after 24 hours without update SMSC';
                break;
            case '12':
                status = 'Message status unknown, SMSC received unknown status code';
                break;
            case '13':
                status =
                    'Message status unknown, no status update received from SMSC after 72 hours';
                break;
            default:
                status = 'Unknown status code ' + code;
        }
        return status;
    }
}

