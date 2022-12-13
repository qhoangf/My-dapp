import { contractABI, contractAddress } from "../../../contract";
import { useEffect, useState } from 'react';
import Web3 from "web3"
import axios from 'axios'
import styles from "../../../styles/YourNFT.module.css"
import Link from "next/link";
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';

let web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')

export default function YourNFT() {
    const [datas, setDatas] = useState([])
    let item = []
    const contract = new web3.eth.Contract(contractABI, contractAddress)
    const [currentAccount, setCurrentAccount] = useState(null);
    const [flag, setFlag] = useState(false);

    const getNftData = async () => {
        if (!currentAccount) {
            return
        } else {
            const nftBalance = await contract.methods.balanceOf(currentAccount).call()
            for (let i = 0; i < nftBalance; i++) {
                const tokenId = await contract.methods.tokenOfOwnerByIndex(currentAccount, i).call()
                const result = await contract.methods.tokenURI(tokenId).call()
                let data = await axios.get(result)
                let meta = data.data
                meta.tokenid = tokenId;
                meta.owned = currentAccount;
                item.push(meta)
            }
            setDatas(item)
            setFlag(true)
        }
    }

    const connectWalletHandler = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Please install Metamask!")
        }

        try {
            const account = await ethereum.request({ method: 'eth_requestAccounts' })
            console.log("Found an account! Address: ", account[0])
            setCurrentAccount(account[0])
        } catch {

        }
    }

    const notConnected = () => {
        return (
            <div className={styles.warningcontainer}>
                <h1 className={styles.warningcontent} >You are not connecting to the wallet. Please connect before using this function!</h1>
            </div>
        )
    }

    const displayNft = () => {
        if (!currentAccount) {
            return console.log('null')
        } else if (flag) {
            console.log(datas)
            return (
                <div style={{background: "linear-gradient(135deg, #203447, #0900478c, #000847, #0900478c)", minHeight: "calc(100vh - 64px)", maxHeight: "100%" }}>
                    <h1 className="title is-size-4 has-text-white has-text-weight-bold pt-6 mb-0 has-text-centered">
                        <div>NFTs BAG</div>
                        <div className="is-size-7">(Total: {datas.length})</div>
                    </h1>
                    <div className="columns is-multiline" style={{ width: "100%" }}>
                        {datas.map(item => {
                            return (
                                <Link href={"0x72bE3b77d298c42954611D624064917e8EA96B17/" + item.tokenid} key={item.tokenid}>
                                    <a className="column is-4 p-6">
                                        <Card shadow="sm" p="lg" radius="md" withBorder style={{borderColor: "#000000"}}>
                                            <Card.Section>
                                                <Image
                                                    src={item.image}
                                                    height={160}
                                                />
                                            </Card.Section>

                                            <Group position="apart" mt="md" mb="xs">
                                                <Text weight={500}>{item.name}</Text>
                                                <Badge color="pink" variant="light">
                                                    On Bag
                                                </Badge>
                                            </Group>

                                            <Text size="sm" color="dimmed">
                                                <div className="has-text-weight-bold">Description:</div>
                                                <div>{item.description}</div>
                                                <div className="has-text-weight-bold">Address:</div>
                                                <div>0x72bE3b77d298c42954611D624064917e8EA96B17</div>
                                            </Text>

                                            <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                                                See Details
                                            </Button>
                                        </Card>
                                    </a>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )

        }
    }

    useEffect(() => {
        if (currentAccount) {
            getNftData()
        } else {
            connectWalletHandler()
        }
    }, [currentAccount])
    return (
        <div className={styles.body}>
            {currentAccount ? displayNft() : notConnected()}
        </div>
    )
}