import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import * as React from "react";
import { WagmiConfig } from "wagmi";
import { Avatar } from "../components/Avatar";
import { chains, client } from "../wagmi";
import "../style/globals.css";

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider coolMode avatar={Avatar} chains={chains}>
        {mounted && <Component {...pageProps} />}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
