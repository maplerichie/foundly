import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient } from "wagmi";
import { optimismGoerli, optimism } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider, webSocketProvider } = configureChains(
  [process.env.NODE_ENV === "development" ? optimismGoerli : optimism],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Foundly",
  chains,
});

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export { chains };
