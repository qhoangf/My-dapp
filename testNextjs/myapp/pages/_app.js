import Layout from "../components/layout";
import "bulma/css/bulma.css";
import "../styles/globals.css";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider desiredChainId={ChainId.BinanceSmartChainTestnet}>
      <Layout>
        <div className="maincontent">
          <Component {...pageProps} />
        </div>
      </Layout>
    </ThirdwebProvider>
  );
}

export default MyApp;
