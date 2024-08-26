import Nodemailer, { SentMessageInfo, SendMailOptions } from 'nodemailer';
import { Request, Response } from 'express';
export default function handler(req: Request, res: Response): void {
    const { email, code } = req.query;
    const transporter = Nodemailer.createTransport({
        // host: 'smtp.gmail.com',
        // port: 465,
        // service: 'gmail',
        // secure: true,
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_AUTH
        }
    });
    const mailOptions: SendMailOptions = {
        from: process.env.GMAIL_USER,
        to: email as string,
        subject: 'Trademark today verfication',
        html: `<div width="100%" style="margin:0;background-color:#f0f2f3">

        <div style="margin:auto;max-width:600px;padding-top:50px" class="m_-8293280590268341754email-container">
    
    
    
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center"
                id="m_-8293280590268341754logoContainer"
                style="background:#252f3d;border-radius:3px 3px 0 0;max-width:600px">
                <tbody>
                    <tr>
                        <td style="background:#373f86;border-radius:3px 3px 0 0;padding:10px;text-align:center; display:flex; justify-content:center; align-items:center;">
                            <img src="https://trademarktoday.com.au/trademarktoday_logo.png" width="145" height="60" alt="tmtoday logo" border="0"
                                style="font-family:sans-serif;font-size:15px;line-height:140%;color:#555555" class="CToWUd"
                                data-bit="iit">
                                <h3 style="margin:0; padding:0 20px; color:white; font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif; font-style:italic;">Trade Mark Today</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
    
    
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center"
                id="m_-8293280590268341754emailBodyContainer"
                style="border:0px;border-bottom:1px solid #d6d6d6;max-width:600px">
                <tbody>
                    <tr>
                        <td
                            style="background-color:#fff;color:#444;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px">
                            <h1 style="font-size:20px;font-weight:bold;line-height:1.3;margin:0 0 15px 0">Verify your email
                                address</h1>
                            <p style="margin:0;padding:0">Thanks for starting the new <b>Trade Mark Today</b> account creation
                                process. We want
                                to make sure it's really you. Please enter the following verification code when prompted. If
                                you don’t want to create an account, you can ignore this message.</p>
                            <p style="margin:0;padding:0"></p>
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="background-color:#fff;color:#444;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px;padding-top:0;text-align:center">
                            <div style="font-weight:bold;padding-bottom:15px">Verification code</div>
                            <div style="color:#000;font-size:36px;font-weight:bold;padding-bottom:15px">${code}</div>
                            <div>(This code is valid for 10 minutes)</div>
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="background-color:#fff;border-top:1px solid #e0e0e0;color:#777;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:14px;line-height:140%;padding:25px 35px">
                            <p style="margin:0 0 15px 0;padding:0 0 0 0">Trade Mark Today&trade; will never email you and ask
                                you to disclose or verify your password, credit card, or banking account number.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
    
    
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" align="center"
                id="m_-8293280590268341754footer" style="max-width:600px">
                <tbody>
                    <tr>
                        <td
                            style="color:#777;font-family:'Amazon Ember','Helvetica Neue',Roboto,Arial,sans-serif;font-size:12px;line-height:16px;padding:20px 30px;text-align:center">
                            This message was produced and distributed by trademarktoday.com.au, Inc.,<br/> Sydney, Australia. ©
                            2022, Trade Mark Today., Inc. <br/>All rights reserved. 
                            Trade Mark Today is just now not a
                            registered<br/>
                            Trade Mark Today&trade;,
                            Inc. View our privacy policy
                        </td>
                    </tr>
                </tbody>
            </table>
    
    
        </div>
    </div>`
    };
    transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
        if (error) {
            console.log(error);
            res.status(200).json({ message: error })
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: info.response })
        }
    });
    //{"message":"250 2.0.0 OK  1687813731 hn8-20020a05600ca38800b003fa722e8b48sm11760285wmb.32 - gsmtp"}
}