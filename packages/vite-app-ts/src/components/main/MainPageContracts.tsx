import React, { FC } from 'react';
import { GenericContract } from 'eth-components/ant/generic-contract';
import { Contract } from 'ethers';
import { useContractLoader } from 'eth-hooks';
import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { useEthersContext } from 'eth-hooks/context';
import { NETWORKS } from '~~/models/constants/networks';
import { useAppContracts } from '~~/config/contractContext';
export interface IMainPageContractsProps {
  scaffoldAppProviders: IScaffoldAppProviders;
}

/**
 * 🎛 this scaffolding is full of commonly used components
    this <GenericContract/> component will automatically parse your ABI
    and give you a form to interact with it locally
 * @param props 
 * @returns 
 */
export const MainPageContracts: FC<IMainPageContractsProps> = (props) => {
  const ethersContext = useEthersContext();
  const mainnetDai = useAppContracts('DAI', NETWORKS.mainnet.chainId);
  const EveryNFT = useAppContracts('EveryNFT', ethersContext.chainId);
  if (ethersContext.account == null) {
    return <></>;
  }

  return (
    <>
      <>
        <GenericContract
          contractName="EveryNFT"
          contract={EveryNFT}
          mainnetAdaptor={props.scaffoldAppProviders.mainnetAdaptor}
          blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
        />
      </>
    </>
  );
};
