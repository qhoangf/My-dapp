import { contractABI, contractAddress } from "../contract";
import { useEffect, useState } from "react";
import styles from "../styles/MintNft.module.css";
import Link from "next/link";
import Web3 from "web3";
import { create } from "ipfs-http-client";
import { useAddress, useNetworkMismatch } from "@thirdweb-dev/react";
require("dotenv").config();

//const ipfsClient = require('ipfs-http-client');

const projectId = "2C7X7vue5KDYw7KVenWosKbx4YR"; // <---------- your Infura Project ID

const projectSecret = "84ff25515749b85607d737d519645d56"; // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});
const web3 = new Web3(Web3.givenProvider);

export default function MintNFT() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [rowsMinted, setRowsMinted] = useState([]);
  const [count, setCount] = useState();
  const address = useAddress();
  const isMismatched = useNetworkMismatch();

  const contract = new web3.eth.Contract(contractABI, contractAddress);

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const account = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Found an account! Address: ", account[0]);
      setaddress(account[0]);
    } catch { }
  };

  const onSubmit = async (err) => {
    err.preventDefault();
    //get mint Price
    const mintPrice = await contract.methods.mintPrice().call();
    console.log(mintPrice);
    //gt balance of wallet address want to mint NFT
    const balanceOf = await web3.eth.getBalance(address);
    console.log(balanceOf);

    const maxMint = await contract.methods.getMaxMint(address).call();
    let result = Number(maxMint);
    console.log("the result is: " + result);
    if (Number(maxMint) < 10) {
      if (Number(balanceOf) > Number(mintPrice)) {
        // Attempt to save image to IPFS
        const added = await client.add(file);
        console.log(added.path);
        const url = `https://cryptoviet.infura-ipfs.io/ipfs/${added.path}`;

        const metadata = {
          name,
          description,
          image: url,
        };
        const file2 = await client.add(JSON.stringify(metadata));
        const metadataurl = `https://cryptoviet.infura-ipfs.io/ipfs/${file2.path}`;
        console.log(metadataurl);

        // Interact with smart contract

        const response = await contract.methods
          .safeMintNft(metadataurl)
          .send({ from: address, value: mintPrice });
        // Get token id
        const tokenId = response.events.Transfer.returnValues.tokenId;
        // Display alert
        alert(
          `NFT successfully minted. Contract address - ${contractAddress} and Token ID - ${tokenId}`
        );
        result++;
        setCount(result);
      } else {
        alert("You don't have enough ETH to mint NFT, check your balance!");
      }
    } else {
      alert("You have reached the maximum of NFT minting");
    }
  };
  async function StatusMint() {
    let rowMinted = [];
    let row = [];
    if (address) {
      const maxMint = await contract.methods.getMaxMint(address).call();
      setCount(Number(maxMint));
      for (let i = 0; i < Number(maxMint); i++) {
        rowMinted.push(" ");
      }
      setRowsMinted(rowMinted);
      for (let i = 0; i < 10 - Number(maxMint); i++) {
        row.push(" ");
      }
      setRows(row);
    } else {
      return;
    }
  }

  function NotConnected() {
    return (
      <div className={styles.warningcontainer}>
        <h1 className={styles.warningcontent}>
          You are not connecting to the wallet. Please connect before using this
          function!
        </h1>
      </div>
    );
  }

  function setInputTypeFile(e) {
    let file = e.target.files[0];

    let fileNameContainer = document.querySelector(".file-name");
    fileNameContainer.innerHTML = `${file.name}`;

    var url = URL.createObjectURL(file);

    let imagePreview = document.getElementById("imagePreview");
    imagePreview.setAttribute("src", url);
  }

  const displayMintNFT = () => {
    return (
      <div className={styles.displayMintNFT}>
        <form className={styles.formcontainer} onSubmit={onSubmit}>
          <div className={styles.head}>
            <h1 className="title is-3 pt-5 mb-5 has-text-weight-bold has-text-white">
              NFTs Minting
            </h1>
          </div>
          <div className="container">
            <div className="columns">
              <div className="column">
                <div className="p-4">
                  <p className="title is-5 m-2 has-text-white">NFT Image</p>
                  <div className="file has-name is-fullwidth">
                    <label className="file-label">
                      <input
                        className="file-input"
                        type="file"
                        onChange={(e) => {
                          setFile(e.target.files[0]);
                          setInputTypeFile(e);
                        }}
                      />
                      <span className="file-cta has-background-success">
                        <span className="file-icon">
                          <i className="fas fa-upload"></i>
                        </span>
                        <span className="file-label has-text-white has-text-white">
                          Choose a file…
                        </span>
                      </span>
                      <span className="file-name has-text-white">
                        NFT File Path (No file chosen)
                      </span>
                    </label>
                  </div>
                </div>
                <div className="p-4">
                  <p className="title is-5 m-2 has-text-white">NFT Name</p>
                  <input
                    className="input is-fullwidth has-background-info-light has-text-info has-text-weight-bold"
                    type="text"
                    placeholder="Name of NFT"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="p-4">
                  <p className="title is-5 m-2 has-text-white">Description</p>
                  <input
                    className="input is-fullwidth has-background-info-light has-text-info has-text-weight-bold"
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                {address ? displayStatus() : <NotConnected />}
              </div>
              <div className="column">
                <div className="pt-4 pl-4 pr-4">
                  <p className="title is-5 m-2 has-text-white">Preview Image</p>
                </div>
                <figure class="image m-4 is-2by1">
                  <img
                    src="https://phutungnhapkhauchinhhang.com/wp-content/uploads/2020/06/default-thumbnail.jpg"
                    id="imagePreview"
                    style={{ objectFit: "fill" }}
                  />
                </figure>
                <div className={styles.button}>
                  <button type="submit" className={styles.mintbtn}>
                    <span class="text">Mint NFT NOW</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const displayStatus = () => {
    if (!address) {
      return console.log("null");
    } else {
      return (
        <div className="p-4">
          <p className={styles.statusText}>Using NFTs ({count}/10)</p>
          <div className={styles.status}>
            <ul>
              {rowsMinted.map((item) => {
                return <li className={styles.statusMinted}>{item}</li>;
              })}
              {rows.map((item) => {
                return <li className={styles.statusNotMintYet}>{item}</li>;
              })}
            </ul>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (address) {
      if (isMismatched === false) {
        StatusMint();
      }
    }
  }, [address, count]);
  return <div>{address ? displayMintNFT() : <NotConnected />}</div>;
}
