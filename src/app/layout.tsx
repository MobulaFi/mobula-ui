import { WatchlistProvider } from "features/user/watchlist/context-manager";
import { Inter, Poppins } from "next/font/google";
import { cookies, headers } from "next/headers";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GeneralContext } from "../contexts";
import { PortfolioV2Provider } from "../features/user/portfolio/context-manager";
import { UserBalanceProvider } from "../layouts/header/context-manager/balance";
import Layout from "../layouts/layout";
import { ThemeProvider } from "../lib/next-theme";
import "../styles/global.css";
const inter = Inter({
  weight: "400",
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: "400",
});

async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("user-balance")?.value;
  const tradeFilterCookie = cookieStore.get("trade-filter")?.value;
  const userAgent: string = headers().get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent) && !/tablet/i.test(userAgent);
  // isWalletExplorer={pageProps.isWalletExplorer}
  // isPortfolioExplorer={pageProps.isPortfolioExplorer}
  // const portfolio = cookies?.portfolio ? JSON.parse(cookies?.portfolio) : null;

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <title>Mobula | The onchain-native crypto data aggregator</title>
        <meta
          name="description"
          content="Price, volume, liquidity, and market cap of any crypto, in real-time. Track crypto information & insights, buy at best price, analyse your wallets and more."
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta
          name="keywords"
          content="Mobula, Mobula crypto, Mobula Crypto Data Aggregator, crypto, mobula, swap"
        />
        <link rel="icon" type="image/png" href="/mobula/fullicon.png" />
        <meta name="author" content="Mobula" />
        <meta name="copyright" content="Mobula" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:image"
          content="https://mobula.io/metaimage/Generic/others.png"
        />
        <meta
          name="twitter:image"
          content="https://mobula.io/metaimage/Generic/others.png"
        />
        <meta
          itemProp="image"
          content="https://mobula.io/metaimage/Generic/others.png"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
          integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
          integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;1,100;1,200;1,300;1,400;1,500;1,600&family=Ubuntu&display=block"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@100;300;400;500;600;700;800&family=Source+Code+Pro:wght@200;300;400&display=block"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@100;300;400;500;600;700;800&family=Roboto:wght@100;300;400;500;700&family=Source+Code+Pro:wght@200;300;400&display=block"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@100;300;400;500;600;700;800&family=JetBrains+Mono:wght@100;200;300;400;500&family=Roboto:wght@100;300;400;500;700&family=Source+Code+Pro:wght@200;300;400&display=block"
          rel="stylesheet"
        />
        <link rel="manifest" href="../../public/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Mobula" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/mobula/apple.png" />
        {/* <!-- iPhone SE, iPod touch (5th gen and later) --> */}
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="/splash/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="/splash/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png"
        />

        {/* <!-- 9.7" iPads --> */}
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="/splash/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="/splash/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png"
        />

        {/* <!-- 10.2" iPads --> */}
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="/splash/10.2__iPad_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="/splash/10.2__iPad_portrait.png"
        />

        {/* <!-- iPhone 8, iPhone 7, iPhone 6s, iPhone 6, 4.7" iPhone SE --> */}
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="/splash/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="/splash/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png"
        />

        {/* <!-- 10.5" iPads --> */}
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="/splash/10.5__iPad_Air_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="/splash/10.5__iPad_Air_portrait.png"
        />

        {/* <!-- 11" iPads --> */}
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="/splash/11__iPad_Pro__10.5__iPad_Pro_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="/splash/11__iPad_Pro__10.5__iPad_Pro_portrait.png"
        />

        {/* <!-- 12.9" iPads --> */}
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="/splash/12.9__iPad_Pro_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="/splash/12.9__iPad_Pro_portrait.png"
        />

        {/* <!-- iPhone X, XS, 11 Pro --> */}
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          href="/splash/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="/splash/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png"
        />

        {/* <!-- iPhone 11, XR --/> */}
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          href="/splash/iPhone_11__iPhone_XR_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="/splash/iPhone_11__iPhone_XR_portrait.png"
        />
        {/* 
<!-- iPhone 12, 13 --/> */}
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          href="/splash/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="/splash/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png"
        />

        {/* <!-- iPhone 12 Pro Max, 13 Pro Max --/> */}
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
          href="/splash/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="/splash/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png"
        />
        <meta name="theme-color" content="#131827" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <ToastContainer
            toastClassName="bg-light-bg-terciary dark:bg-dark-bg-terciary text-light-font-100 dark:text-dark-font-100
           rounded-xl shadow-md border border-light-border-primary dark:border-dark-border-primary pt-3 px-3"
            bodyClassName="bg-light-bg-terciary dark:bg-dark-bg-terciary text-light-font-100 dark:text-dark-font-100"
          />
          <UserBalanceProvider balanceCookies={userCookie}>
            <GeneralContext>
              <WatchlistProvider watchlist={params.watchlist}>
                <PortfolioV2Provider isMobile={isMobile}>
                  <Layout>{children}</Layout>
                </PortfolioV2Provider>
              </WatchlistProvider>
            </GeneralContext>
          </UserBalanceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
