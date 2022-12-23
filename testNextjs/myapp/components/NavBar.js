import Image from "next/image";
import image from "../public/images/exchangeLogo2NoBackground.png";
import styles from "../styles/Navbar.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { marketplaceAddress, marketplaceABI } from "../contract";
import { Autocomplete } from '@mantine/core';
import { Input } from '@mantine/core';
import { IconSearch } from '@tabler/icons';

import {
  useAddress,
  useNetworkMismatch,
  useMetamask,
  useDisconnect,
} from "@thirdweb-dev/react";
import Web3 from "web3";

let web3 = new Web3(Web3.givenProvider);

export default function NavBar() {
  const [proceeds, setProceeds] = useState();
  const [waiting, setWaiting] = useState(false);
  const [proceedsErc20, setProceedsErc20] = useState();
  const address = useAddress();
  const isMismatched = useNetworkMismatch();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const marketplaceContract = new web3.eth.Contract(
    marketplaceABI,
    marketplaceAddress
  );

  const [isClosed, setIsClosed] = useState(true);

  const ConnectButton = () => {
    return (
      <button className={styles.btn} onClick={connectWithMetamask}>
        Connect To Metamask
      </button>
    );
  };

  async function withdraw() {
    if (proceeds > 0) {
      setWaiting(true);
      const req = await marketplaceContract.methods
        .withdrawProceeds()
        .send({ from: address })
        .catch((e) => {
          alert(e.message);
          setWaiting(false);
        });
      if (req) {
        alert("Withdraw successful!");
        setProceeds(0);
        setWaiting(false);
        closeWithdrawPopup();
      }
    } else {
      alert("Do not have enough token to withdraw");
    }
  }

  async function withdrawErc20() {
    if (proceedsErc20 > 0) {
      setWaiting(true);
      const req = await marketplaceContract.methods
        .withdrawProceedsErc20()
        .send({ from: address })
        .catch((e) => {
          alert(e.message);
          setWaiting(false);
        });
      if (req) {
        alert("Withdraw successful!");
        setProceedsErc20(0);
        setWaiting(false);
        closeWithdrawPopup();
      }
    } else {
      alert("Do not have enough token to withdraw");
    }
  }

  function showPopup() {
    var modal = document.getElementById("myModalWallet");
    if (isClosed == true) {
      modal.style.display = "block";
      setIsClosed(false);
    } else {
      modal.style.display = "none";
      setIsClosed(true);
    }
  }

  function showWithdrawPopup() {
    var modal = document.getElementById("myModalWithdraw");
    modal.style.display = "block";
  }

  function closeWithdrawPopup() {
    var modal = document.getElementById("myModalWithdraw");
    modal.style.display = "none";
  }

  function closePopup() {
    var modal = document.getElementById("myModalWallet");
    modal.style.display = "none";
    setIsClosed(true);
  }

  async function getProceeds() {
    if (address) {
      const check = await marketplaceContract.methods
        .getProceeds(address)
        .call();
      setProceeds(web3.utils.fromWei(check, "ether"));
      const checkErc20 = await marketplaceContract.methods
        .getProceedsErc20(address)
        .call();
      setProceedsErc20(web3.utils.fromWei(checkErc20, "ether"));
    }
  }

  useEffect(() => {
    if (address && isMismatched === false) {
      getProceeds();
    }
  }, [address]);

  const WalletAddress = () => {
    let char = [];
    for (let i = 0; i < address.length; i++) {
      char.push(address[i]);
    }
    const chardisplay = [
      char[0],
      char[1],
      "...",
      char[char.length - 4],
      char[char.length - 3],
      char[char.length - 2],
      char[char.length - 1],
      char[char.length],
    ];
    return (
      <div className={styles.dropdownAdd}>
        <button className={styles.navbarAddress}>{chardisplay}</button>
        <div className={styles.dropdownAddress}>
          <button onClick={showPopup}>Wallet</button>
          <br></br>
          <button onClick={disconnect}>Logout</button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarHead}>
        <Link href="/">
          <Image
            className={`${styles.exchangelogo}`}
            priority
            src={image}
            width={135}
            height={50}
            alt="logo"
            style={{
              cursor: "pointer",
            }}
          />
        </Link>
        <Input
          className={`${styles.customizeAutocompleteInput} ml-6`}
          icon={<IconSearch />}
          placeholder="Wallet address searching..."
        />
      </div>
      <div className="is-flex">
        <div className={styles.navbarMenu}>
          <Link href="/exchange">
            <a className={styles.navbarItem}>Exchange</a>
          </Link>
          <div className={styles.dropdown}>
            <div className={styles.navbarItem}>NFT</div>
            <div className={styles.dropdowncontent}>
              <Link href="/MintNFT">
                <div className={styles.dropdownitems}>Mint NFT</div>
              </Link>
              <Link href="/YourNFT">
                <div className={styles.dropdownitems}>Your NFT</div>
              </Link>
              <Link href="/Marketplace">
                <div className={styles.dropdownitems}>Marketpalce</div>
              </Link>
            </div>
          </div>
        </div>
        {address ? <WalletAddress /> : <ConnectButton />}
      </div>
      <div id="myModalWallet" className={styles.modal}>
        <button className={styles.close} onClick={closePopup}></button>
        <div className={styles.modalcontent}>
          <div className={styles.modalbody}>
            <div className={styles.modalhead}>
              <p className={styles.total}>Total balance</p>
              <p>{proceeds} BNB </p>
              <p>{proceedsErc20} BOI </p>
            </div>
            <button className={styles.withdrawbtn} onClick={showWithdrawPopup}>
              Withdraw
            </button>
          </div>
        </div>
      </div>
      <div id="myModalWithdraw" className={styles.modalWithdraw}>
        <div className={styles.modalWithdrawcontent}>
          <div className={styles.modalhead}>
            <h2>Choose token want to withdraw</h2>
            {!waiting ? (
              <>
                <div className={styles.typecoin} onClick={withdraw}>
                  <Image
                    priority
                    src="/images/bnbcoin.png"
                    width={30}
                    height={30}
                  />
                  <p> BNB </p>
                </div>
                <div className={styles.typecoin} onClick={withdrawErc20}>
                  <Image
                    priority
                    src="/images/boilogo.png"
                    width={30}
                    height={30}
                  />
                  <p> BOI </p>
                </div>
                <button
                  type="button"
                  className={styles.cancelbtn}
                  onClick={closeWithdrawPopup}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>Withdraw is process...</p>
                <button disabled className={styles.waitingbtn}>
                  {" "}
                  Waiting...{" "}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
