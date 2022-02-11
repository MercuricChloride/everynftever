import { formatEther } from '@ethersproject/units';
import { Select } from 'antd';
import { useDexTokenList } from 'eth-hooks/dapps';
import { TEthersProvider } from 'eth-hooks/models';
import { BigNumber, ethers } from 'ethers';
import React, { FC, useContext, useState } from 'react';

import { Address, AddressInput } from 'eth-components/ant';
import { Menu, Dropdown, List, InputNumber, Button, Input, Form, Typography, Card, Row, Col, Divider } from 'antd';
import { useContractExistsAtAddress, useGasPrice } from 'eth-hooks';
import { transactor } from 'eth-components/functions';
import { EthComponentsSettingsContext } from 'eth-components/models';
import { useEthersContext } from 'eth-hooks/context';
import { useAppContracts } from '~~/config/contractContext';
import DropdownButton from 'antd/lib/dropdown/dropdown-button';
import { contractsByNetworkName } from '~~/functions';
import { ThemeSwitcher } from '~~/components/common';

const { Option } = Select;
const { Title, Text } = Typography;

export interface ILandingProps {
  yourCurrentBalance: BigNumber | undefined;
  mainnetProvider: TEthersProvider | undefined;
  price: number;
  address: string;
}

export const Landing: FC<ILandingProps> = (props) => {
  const { yourCurrentBalance, mainnetProvider, price, address } = props;
  const [contractAddress, setContractAddress] = useState<string>("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");
  const [tokenId, setTokenId] = useState<number>();
  const ethersContext = useEthersContext();
  const EveryNFT = useAppContracts('EveryNFT', ethersContext.chainId);
  const [gasPrice] = useGasPrice(ethersContext.chainId, 'fast');
  const ethComponentsSettings = useContext(EthComponentsSettingsContext);
  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice);


  const [value, setValue] = useState(0);

  const addressObject: string[] = [
    "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    "0xba30E5F9Bb24caa003E9f2f0497Ad287FDF95623",
    "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    "0x57a204AA1042f6E66DD7730813f4024114d74f37",
    "0xED5AF388653567Af2F388E6224dC7C4b3241C544",
    "0x8943C7bAC1914C9A7ABa750Bf2B6B09Fd21037E0",
    "0x5a0D4479AEd030305a36a1FB516346D533E794Fb",
    "0x2acAb3DEa77832C09420663b0E1cB386031bA17B",
    "0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B",
    "0x60E4d786628Fea6478F785A6d7e704777c86a7c6"
  ]

  function onChange(e: number) {
    setValue(e);
    if (e == 10) return;
    setContractAddress(addressObject[e]);
  }

  async function onFinish() {
    await tx?.(EveryNFT?.mintToken(contractAddress, BigNumber.from(tokenId), { value: ethers.utils.parseEther("0.01") }));
  }


  return (
    <div>
      <div style={{ margin: 32 }}>
        <Row justify='center'>
          <Col lg={12} xs={20}>
            <Card>
              <Title level={3}>Mint any NFT ever</Title>
              {/* <Address address={contractAddress} /> */}
              <Form
                name='Mint your nft'
                onFinish={onFinish}
              >
                <Form.Item
                  name="contract_address">
                  <Select defaultValue={0} onChange={onChange} style={{ maxWidth: 600 }}>
                    <Option value={0}>Bored Ape Yacht Club</Option>
                    <Option value={1}>Bored Ape Kennel Club</Option>
                    <Option value={2}>Doodles</Option>
                    <Option value={3}>CyberKongz</Option>
                    <Option value={4}>Azuki</Option>
                    <Option value={5}>Lazy Lions</Option>
                    <Option value={6}>Moshi Mochi</Option>
                    <Option value={7}>Dead Fellaz</Option>
                    <Option value={8}>Clone X</Option>
                    <Option value={9}>Mutant Ape Yacht Club</Option>
                    <Option value={10}>Custom Contract</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  {value === 10 ? <div><Row justify='center'>Input Contract Address Below</Row><Row justify='center'><AddressInput ensProvider={mainnetProvider} placeholder='Enter Address' address={contractAddress} onChange={setContractAddress} /></Row></div> : null}
                </Form.Item>
                <Form.Item
                  name="tokenId">
                  <Row justify='center'>Token ID</Row>
                  <br />
                  <Row justify='center'><InputNumber placeholder='Input Token Id' onChange={async (e: number) => {
                    setTokenId(e);
                  }} /></Row>
                </Form.Item>
                <Form.Item>
                  <Button type='primary' htmlType="submit">Mint</Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col lg={12} xs={20}>
            <Card>
              <Title level={3}>How to use this app:</Title>
              <Title level={4}>1: Decide what contract to mint from and either select it or paste it's address in (IE BAYC)</Title>
              <Title level={4}>2: Decide which token you want to mint and input it(IE BAYC #69)</Title>
              <Title level={4}>3: Click mint to get your NFT!</Title>
              <Title level={4}>4: Admire your new shiny NFT on opensea <a href="https://opensea.io/collection/everynft">HERE</a></Title>
            </Card>
          </Col>
        </Row>
        <Divider />
        <Row justify='center'>
          <Col lg={12} xs={20}>
            <Title>This contract contains every NFT that has been created on the blockchain, and every NFT that will ever be created.</Title>
            <br />
            <Title level={3}>You may ask, "how is this even possible?"</Title>
            <Text>The ERC-721 standard(the contract standard for non fungible tokens) defines a function for handling metadata. IE the "image" your nft represents. Any JPEG NFT or anything similar
              that is made contains a specfic function called the tokenURI function. Which returns metadata for a specific tokenID. Such as the exact monkey for BAYC #69. Because this is a public function and anyone can read this data,
              I created a NFT contract that allows minting of an NFT in which the metadata is read directly from a parent contract which is defined when you mint it. </Text>
            <br />
            <br />
            <Title level={3}>Ok I guess that makes sense, but why make this?</Title>
            <Text>The reason I made this was because of a common misconception within the NFT space. People often buy NFT's so they "own" the art. And while sure they do "own it", the real value of an NFT comes from being a verified participant of the community defined by contract. Not from owning publicly available JPEGs "on" the blockchain. Side point, 99% aren't actually stored on chain.</Text>
            <Title level={5}>So go crazy! Mint all those bored apes and doodles, use them as your twitter PFP or render them within a metaverse painting! Because you "own" this art on chain according to this contract, but you will never be a part of the original group! You will be a part of this group though :)</Title>
          </Col>
        </Row>
        <Divider />
      </div>
      <ThemeSwitcher />
    </div>
  );
};
