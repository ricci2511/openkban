import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head />
            <body className="bg-background font-sans antialiased">
                <Main />
                <div id="portal-root" />
                <NextScript />
            </body>
        </Html>
    );
}
