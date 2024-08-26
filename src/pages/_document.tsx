import { generateNonce } from '@/types/utils';
import Document, { Html, Head, Main, NextScript, DocumentProps } from 'next/document';
const MyDocument = () => {
    const nonce = generateNonce();
    return (
        <Html lang="en">
            <Head nonce={nonce}>
                <meta charSet="utf-8" />
                <meta httpEquiv="Content-Security-Policy"
                    content={`script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://checkout.stripe.com https://maps.googleapis.com https://js.stripe.com https://apis.google.com https://www.googletagmanager.com https://www.google-analytics.com`}
                />
                {/* <meta http-equiv="Content-Security-Policy"
                    content={`script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://js.stripe.com https://apis.google.com https://www.googletagmanager.com`}
                /> */}
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

export default MyDocument;