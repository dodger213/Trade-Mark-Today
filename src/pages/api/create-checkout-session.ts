import { Request, Response } from 'express';
import stripe from 'stripe';
const stripeInstance = new stripe(process.env.stripeSecretKey as string, { apiVersion: "2022-11-15" });
export default async function handler(req: Request, res: Response) {
    const { price, transactionKey } = req.body;
    try {
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Trade Mark Today Subscription',
                        },
                        unit_amount: price * 100, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // success_url: `https://localhost/payres/success?transactionKey=${transactionKey}`,
            // cancel_url: 'https://localhost/payres/fail?reason=0',
            success_url: `https://trademarktoday.com.au/payres/success?transactionKey=${transactionKey}`,
            cancel_url: 'https://trademarktoday.com.au/payres/fail?reason=0',
        });

        res.status(200).json({ id: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
}