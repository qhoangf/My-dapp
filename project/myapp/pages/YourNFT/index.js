import { contractABI, contractAddress } from "../../contract";
import { useEffect, useState } from "react";
import Web3 from "web3";
import axios from "axios";
import styles from "../../styles/YourNFT.module.css";
import Link from "next/link";
import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import {
  useNetworkMismatch,
  useAddress,
  useMetamask,
} from "@thirdweb-dev/react";
import { getNftData } from "../../components/getNftData";

let web3 = new Web3(
  "https://spring-burned-owl.bsc-testnet.discover.quiknode.pro/2749c0a5351d7ddd7495c37cad3f59d49c93ea50/"
);

export default function YourNFT() {
  const [datas, setDatas] = useState([]);
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const address = useAddress();
  const isMismatched = useNetworkMismatch();
  const connectWithMetamask = useMetamask();

  //   const getNftData = async () => {
  //     let item = [];
  //     const nftBalance = await contract.methods.balanceOf(address).call();
  //     for (let i = 0; i < nftBalance; i++) {
  //       const tokenId = await contract.methods
  //         .tokenOfOwnerByIndex(address, i)
  //         .call();
  //       const result = await contract.methods.tokenURI(tokenId).call();
  //       let data = await axios.get(result);
  //       let meta = data.data;
  //       meta.tokenid = tokenId;
  //       meta.owned = address;
  //       item.push(meta);
  //     }
  //     setDatas(item);
  //   };

  const notConnected = () => {
    return (
      <div className={styles.warningcontainer}>
        <h1 className={styles.warningcontent}>
          You are not connecting to the wallet. Please connect before using this
          function!
        </h1>
      </div>
    );
  };

  const displayNft = () => {
    if (!address) {
      return console.log("null");
    } else {
      return (
        <div
          style={{
            background:
              "linear-gradient(135deg, #203447, #0900478c, #000847, #0900478c)",
            minHeight: "calc(100vh - 64px)",
            maxHeight: "100%",
          }}
        >
          <h1 className="title is-size-4 has-text-white has-text-weight-bold pt-6 mb-0 has-text-centered">
            <div>NFTs BAG</div>
            <div className="is-size-7">(Total: {datas.length})</div>
          </h1>
          <div className="columns is-multiline" style={{ width: "100%" }}>
            {datas.map((item) => {
              return (
                <Link
                  href={
                    "0x72bE3b77d298c42954611D624064917e8EA96B17/" + item.tokenid
                  }
                  key={item.tokenid}
                >
                  <a className="column is-4 p-6">
                    <Card
                      shadow="sm"
                      p="lg"
                      radius="md"
                      withBorder
                      style={{ borderColor: "#000000" }}
                    >
                      <Card.Section>
                        <Image src={item.image} height={160} />
                      </Card.Section>

                      <Group position="apart" mt="md" mb="xs">
                        <Text weight={500}>{item.name}</Text>
                      </Group>

                      <Text size="sm" color="dimmed">
                        <div className="has-text-weight-bold">Description:</div>
                        <div>{item.description}</div>
                        <div className="has-text-weight-bold">Address:</div>
                        <div>0x72bE3b77d298c42954611D624064917e8EA96B17</div>
                      </Text>

                      <Button
                        variant="light"
                        color="blue"
                        fullWidth
                        mt="md"
                        radius="md"
                      >
                        See Details
                      </Button>
                    </Card>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      );
    }
  };

  async function getData() {
    const datas = await getNftData(address);
    console.log(datas);
    setDatas(datas);
  }

  useEffect(() => {
    if (address) {
      if (isMismatched == false) {
        getData();
      }
    } else {
      connectWithMetamask();
    }
  }, [address]);
  return (
    <div className={styles.body}>{address ? displayNft() : notConnected()}</div>
  );
}
