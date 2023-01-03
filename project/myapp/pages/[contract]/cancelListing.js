import { useState } from "react";
import styles from "../../styles/Nft.module.css";
import {
  contractABI,
  contractAddress,
  marketplaceAddress,
  marketplaceABI,
} from "../../contract";
import Web3 from "web3";
import { useRouter } from "next/router";

let web3 = new Web3(Web3.givenProvider);

export default function CancelListing() {
  const router = useRouter();
  const tokenId = router.query.id;
  const [isLoading, setIsLoading] = useState(false);
  const marketplaceContract = new web3.eth.Contract(
    marketplaceABI,
    marketplaceAddress
  );
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const urlApiEndpointGetData = "http://localhost:3000/api/getNftData-lib";
  const urlApiEndpointDeleteData =
    "http://localhost:3000/api/deleteNftData-lib";

  function splitCoupon(coupon) {
    const hash = coupon.slice(0, 66);
    const signature = coupon.slice(66, coupon.length);
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);
    const signatureParts = { r, s, v };
    return [hash, signatureParts];
  }

  async function cancelList() {
    setIsLoading(true);
    const res = await fetch(urlApiEndpointGetData);
    const req = await res.json();
    let coupon;
    const request = req.data;
    request.map((item) => {
      if (item["tokenid"] == tokenId) {
        coupon = item["coupon"];
      }
    });
    const couponParts = splitCoupon(coupon);
    const hash = couponParts[0];
    const signature = couponParts[1];
    const _r = signature["r"];
    const _s = signature["s"];
    const _v = signature["v"];
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length == 0) {
      const account = await ethereum.request({ method: "eth_requestAccounts" });
      accounts[0] = account[0];
    }
    const check = await contract.methods.ownerOf(tokenId).call();
    if (Number(check) == Number(accounts[0])) {
      const requestCancel = await marketplaceContract.methods
        .cancelListing(contractAddress, tokenId, hash, _v, _r, _s)
        .send({ from: accounts[0] })
        .catch((e) => {
          if (e.code == 4001) {
            alert("MetaMask Message Signature: User denied message signature.");
            setIsLoading(false);
          } else {
            alert(e.message);
          }
        });
      if (requestCancel) {
        const deleteNftData = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tokenid: Number(tokenId),
          }),
        };
        const request = await fetch(urlApiEndpointDeleteData, deleteNftData);
        const req = await request.json();
        alert("Cancel listing successful");
        closePopup();
      }
    } else {
      alert("You are not the owner of the token");
    }
  }

  const closePopup = () => {
    var myModalCancel = document.getElementById("myModalCancel");
    myModalCancel.style.display = "none";
  };

  const btn = () => {
    return (
      <>
        <button className={styles.cancelbtn} onClick={closePopup}>
          Go back
        </button>
        <button className={styles.updatebtn} onClick={cancelList}>
          Continue
        </button>
      </>
    );
  };

  const btnWaiting = () => {
    return (
      <>
        <button disabled className={styles.waitingbtn}>
          Go back
        </button>
        <button disabled className={styles.waitingbtn}>
          Waiting
        </button>
      </>
    );
  };
  return (
    <div id="myModalCancel" className={styles.modal}>
      <div className={styles.modalcontent}>
        <div className={styles.modalhead}>
          <p className={styles.price}>Cancel listings?</p>
        </div>
        <div className="p-3">
          <p>
            You will also be asked to confirm this cancelation from your wallet.
          </p>
          <p>This will cancel your listings.</p>
        </div>
        {isLoading == true ? btnWaiting() : btn()}
      </div>
    </div>
  );
}
