'use client';

import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";
import { ReactNode } from "react";

export function MetaMaskProvider({ children }: { children: ReactNode }) {
  return (
    <MetaMaskUIProvider
      sdkOptions={{
        dappMetadata: {
          name: "HEAD",
          url: typeof window !== 'undefined' ? window.location.href : '',
        },
        checkInstallationImmediately: false,
        useDeeplink: false,
      }}
    >
      {children}
    </MetaMaskUIProvider>
  );
}