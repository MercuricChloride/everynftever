import React, { FC, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import '~~/styles/main-page.css';
import { useContractReader, useBalance, useEthersAdaptorFromProviderOrSigners, useGasPrice } from 'eth-hooks';
import { useDexEthPrice } from 'eth-hooks/dapps';

import { GenericContract } from 'eth-components/ant/generic-contract';
import { FaucetHintButton } from './components/common/FaucetHintButton';

import { useEventListener } from 'eth-hooks';
import { MainPageMenu, MainPageContracts, MainPageFooter, MainPageHeader } from './components/main';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { useBurnerFallback } from '~~/components/main/hooks/useBurnerFallback';
import { useScaffoldHooksExamples as useScaffoldHooksExamples } from './components/main/hooks/useScaffoldHooksExamples';
import { useEthersContext } from 'eth-hooks/context';
import { NETWORKS } from '~~/models/constants/networks';
import {
  useAppContracts,
  useAppContractsActions,
  useConnectAppContracts,
  useLoadAppContracts,
} from '~~/config/contractContext';
import { asEthersAdaptor } from 'eth-hooks/functions';
import { USE_BURNER_FALLBACK, MAINNET_PROVIDER, FAUCET_ENABLED } from '~~/config/appConfig';
import { Landing } from './components/pages/landing/Landing';
import { Typography, Divider } from 'antd';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * See config/appConfig.ts for configuration, such as TARGET_NETWORK
 * See MainPageContracts.tsx for your contracts component
 * See contractsConnectorConfig.ts for how to configure your contracts
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 *
 * For more
 */

/**
 * The main component
 * @returns
 */
export const Main: FC = () => {
  // -----------------------------
  // Providers, signers & wallets
  // -----------------------------
  // 🛰 providers
  // see useLoadProviders.ts for everything to do with loading the right providers
  const scaffoldAppProviders = useScaffoldAppProviders();

  // 🦊 Get your web3 ethers context from current providers
  const ethersContext = useEthersContext();

  // if no user is found use a burner wallet on localhost as fallback if enabled
  useBurnerFallback(scaffoldAppProviders, USE_BURNER_FALLBACK);

  const { Title } = Typography;
  // -----------------------------
  // Load Contracts
  // -----------------------------
  // 🛻 load contracts
  useLoadAppContracts();
  // 🏭 connect to contracts for mainnet network & signer
  const [mainnetAdaptor] = useEthersAdaptorFromProviderOrSigners(MAINNET_PROVIDER);
  useConnectAppContracts(mainnetAdaptor);
  // 🏭 connec to  contracts for current network & signer
  useConnectAppContracts(asEthersAdaptor(ethersContext));

  // -----------------------------
  // Hooks use and examples
  // -----------------------------
  // 🎉 Console logs & More hook examples:
  // 🚦 disable this hook to stop console logs
  // 🏹🏹🏹 go here to see how to use hooks!
  useScaffoldHooksExamples(scaffoldAppProviders);

  // -----------------------------
  // These are the contracts!
  // -----------------------------

  // init contracts
  const EveryNFT = useAppContracts('EveryNFT', ethersContext.chainId);
  const mainnetDai = useAppContracts('DAI', NETWORKS.mainnet.chainId);

  // keep track of a variable from the contract in the local React state:

  // -----------------------------
  // .... 🎇 End of examples
  // -----------------------------
  // 💵 This hook will get the price of ETH from 🦄 Uniswap:
  const [ethPrice] = useDexEthPrice(scaffoldAppProviders.mainnetAdaptor?.provider, scaffoldAppProviders.targetNetwork);

  // 💰 this hook will get your balance
  const [yourCurrentBalance] = useBalance(ethersContext.account);

  const [route, setRoute] = useState<string>('');
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  return (
    <div className="App">
      <MainPageHeader scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />

      {/* Routes should be added between the <Switch> </Switch> as seen below */}
      <BrowserRouter>
        <MainPageMenu route={route} setRoute={setRoute} />
        <Switch>
          <Route exact path="/">
            <Landing
              address={ethersContext?.account ?? ''}
              yourCurrentBalance={yourCurrentBalance}
              mainnetProvider={scaffoldAppProviders.mainnetAdaptor?.provider}
              price={ethPrice}
            />
          </Route>
          <Route path="/contracts">
            <MainPageContracts scaffoldAppProviders={scaffoldAppProviders} />
          </Route>
        </Switch>
      </BrowserRouter>

      <Divider />

      <div style={{ margin: 40 }}>
        <Title level={3}> Minted one or got some thoughts? Reach out on <a href="https://twitter.com/blind_nabler">twitter</a> and join the <a href="https://t.me/everynftever">Telegram!</a> </Title>
      </div>
    </div>
  );
};
