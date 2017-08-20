// Imports
import * as crypto from 'crypto';
import * as sendgrid from 'sendgrid';

export class EmailService {

    public sendEmail(toAddress: string, subject: string, html: string): Promise<boolean> {
        return new Promise((resolve, reject) => {

            if (!this.validateEmailAddress(toAddress)) {
                resolve(false);
                return;
            }

            const sendGridApiKey = '260a5841eef8050867e5fcf789494744a5d19f3729b7e20003d06e0c96fb70d888cd2d5ac7ba24253051229fa45156a31185676abf6b40e14b7515313340784a8915e1472f';

            const cipher = crypto.createDecipher('aes-256-ctr', 'BKReoyqSRE');
            let decryptedToken = cipher.update(sendGridApiKey, 'hex', 'utf8');
            decryptedToken += cipher.final('utf8');

            const helper = sendgrid.mail;

            const content = new helper.Content('text/html', html);
            const mail = new helper.Mail(new helper.Email('noreply@openservices.co.za'), subject, new helper.Email(toAddress), content);

            const sg = sendgrid(decryptedToken);
            const request = sg.emptyRequest({
                body: mail.toJSON(),
                method: 'POST',
                path: '/v3/mail/send',
            });

            sg.API(request, (response: any) => {
                resolve(true);
            });
        });
    }

    private validateEmailAddress(emailAddress: string): boolean {
        const emailAddressPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailAddressPattern.test(emailAddress)) {
            return false;
        }

        return true;
    }
}
