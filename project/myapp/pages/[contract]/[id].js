import { useRouter } from "next/router";
import Web3 from "web3";
import {
  contractABI,
  contractAddress,
  marketplaceAddress,
  marketplaceABI,
  ERC20Address,
  ERC20ABI,
} from "../../contract";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Nft.module.css";
import Image from "next/image";
import { ethers } from "ethers";
import Link from "next/link";
import CancelListingPopup from "./cancelListing";
import { useAddress, useNetworkMismatch } from "@thirdweb-dev/react";
import {
  Card,
  Text,
  Badge,
  Button,
  Group,
  ScrollArea,
  Table,
} from "@mantine/core";
import {
  IconStars,
  IconTruckDelivery,
  IconArrowsExchange,
} from "@tabler/icons";
import moment from "moment/moment";

let web3 = new Web3("https://spring-burned-owl.bsc-testnet.discover.quiknode.pro/2749c0a5351d7ddd7495c37cad3f59d49c93ea50/");

export default function Detail() {
  const router = useRouter();
  const [value, setValue] = useState("BNB");
  const tokenId = router.query.id;
  const [contract_address, setContract_address] = useState("");
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const marketplaceContract = new web3.eth.Contract(
    marketplaceABI,
    marketplaceAddress
  );
  const ERC20 = new web3.eth.Contract(ERC20ABI, ERC20Address);
  const [nft, setNft] = useState("");
  const [price, setPrice] = useState(null);
  const [correctNetwork, setCorrectNetwork] = useState(true);
  const address = useAddress();
  const isMismatched = useNetworkMismatch();
  const [isWaiting, setIsWaiting] = useState(true);
  const [nfts, setNfts] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);

  const urlApiEndpoit = process.env.API + "insertNftData-lib";
  const urlApiEndpointGetData = process.env.API + "getNftDataById";
  const urlApiEndpointDeleteData = process.env.API + "deleteNftData-lib";
  const urlApiEndpointUpdateData = process.env.API + "updateNftData-lib";

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function getData() {
    const res = await fetch(urlApiEndpointGetData + `?tokenid=${tokenId}`);
    const req = await res.json();
    const data = req.data;
    if (data.length > 0) {
      const datanft = {
        coupon: data[0]["coupon"],
        price: data[0]["price"],
        owner: data[0]["owner"],
        typecoin: data[0]["typecoin"],
      };
      setNfts(datanft);
    }
  }

  async function getActivity() {
    setLoading(true);
    const response = await axios.get(
      `https://api.covalenthq.com/v1/97/tokens/0x72bE3b77d298c42954611D624064917e8EA96B17/nft_transactions/${tokenId}/?quote-currency=USD&format=JSON&key=ckey_6f3f68a7d56546f082fb27bcc73`
    );
    const data = response.data;
    const { nft_transactions } = data.data.items[0];
    const transferArray = [];
    if (nft_transactions.length > 0) {
      nft_transactions.map((item) => {
        const record = {
          type: "",
          value: item.value,
          typeCoin: "BNB",
          timestamp: "",
          transfer: {},
        };
        if (item.log_events.length === 2) {
          record.type = "Transfer";
          for (let i = 0; i < item.log_events.length; i++) {
            if (item.log_events[i].decoded.name === "Transfer") {
              record.transfer = item.log_events[i].decoded.params;
            }
          }
        } else {
          record.type = "Sale";
          for (let i = 0; i < item.log_events.length; i++) {
            if (
              item.log_events[i].decoded !== null &&
              item.log_events[i].decoded.name === "Transfer"
            ) {
              if (
                item.log_events[i].decoded.params[0].value ===
                "0x0000000000000000000000000000000000000000"
              ) {
                record.type = "Minted";
              }

              if (item.log_events[i].decoded.params[2].name === "value") {
                record.value = item.log_events[i].decoded.params[2].value;
                record.typeCoin = "BOI";
                break;
              }

              record.transfer = item.log_events[i].decoded.params;
            }
          }
        }
        record.timestamp = item.block_signed_at;
        transferArray.push(record);
      });
    }
    console.log(transferArray);
    setActivity(transferArray);
    setLoading(false);
  }

  const displayActivity = () => {
    return (
      <>
        {loading ? (
          <></>
        ) : (
          activity.map((item) => {
            let Icon = IconStars;
            if (item.type === "Minted") {
              Icon = IconStars;
            } else if (item.type === "Transfer") {
              Icon = IconArrowsExchange;
            } else {
              Icon = IconTruckDelivery;
            }
            return (
              <tr>
                <td>
                  {item.type === "Minted" ? (
                    <Group>
                      <Icon size={5} stroke={1.5} />{" "}
                      <Text size="sm">Minted</Text>
                    </Group>
                  ) : item.type === "Transfer" ? (
                    <Group>
                      <Icon size={5} stroke={1.5} />{" "}
                      <Text size="sm">Transfer</Text>
                    </Group>
                  ) : (
                    <Group>
                      <Icon size={5} stroke={1.5} /> <Text size="sm">Sale</Text>
                    </Group>
                  )}
                </td>
                <td>
                  {item.type === "Transfer" ? (
                    ""
                  ) : (
                    <Group>
                      <Text size="sm">
                        {web3.utils.fromWei(item.value, "ether")}
                      </Text>

                      <Text size="sm" c="dimmed">
                        {item.typeCoin === "BNB" ? "BNB" : "BOI"}
                      </Text>
                    </Group>
                  )}
                </td>
                <td>
                  <Text size="sm">
                    {item.type === "Minted"
                      ? "NullAddress"
                      : item.transfer[0].value}
                  </Text>
                </td>
                <td>
                  <Text size="sm">{item.transfer[1].value}</Text>
                </td>
                <td>
                  <Text size="sm">{moment(item.timestamp).fromNow()}</Text>
                </td>
              </tr>
            );
          })
        )}
      </>
    );
  };

  const getNFTDataByTokenId = async () => {
    const total = await contract.methods.totalSupply().call();
    if (tokenId <= Number(total)) {
      const result = await contract.methods.tokenURI(tokenId).call();
      let data = await axios.get(result);
      let meta = data.data;
      const ownerItem = await contract.methods
        .ownerOf(tokenId)
        .call()
        .then((res) => {
          meta.owned = res;
        });
      meta.tokenid = tokenId;
      meta.contract = contractAddress;
      setNft(meta);
      //console.log(nfts['price'])
      // if(nfts){
      //     const saleDetail = document.getElementById('saleDetail')
      //     saleDetail.style.display = "block"
      //     const sellBtn = document.getElementById('sellBtn')
      //     sellBtn.style.display = "none"
      // }
    } else {
      window.location.href = "/404";
    }
  };

  useEffect(() => {
    setContract_address(router.query.contract);
    if (tokenId && isMismatched === false) {
      getData();
      getNFTDataByTokenId();
      getActivity();
    }
  }, [address, contract_address, tokenId]);

  const showPopup = () => {
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
    setIsChange(false);
  };

  const showPopupChange = () => {
    const modal = document.getElementById("myModalChange");
    modal.style.display = "block";
    setIsChange(true);
  };

  const showPopupCancel = () => {
    const modal = document.getElementById("myModalCancel");
    modal.style.display = "block";
  };

  const closePopup = () => {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    const modalChange = document.getElementById("myModalChange");
    modalChange.style.display = "none";
    const modalWaiting = document.getElementById("myModalWaiting");
    modalWaiting.style.display = "none";
  };

  async function changePrice() {
    const object = {
      Tokenid: tokenId,
      spender: address,
      price: price,
      timestamp: Date.now(),
    };
    const hash = ethers.utils.hashMessage(JSON.stringify(object));
    const signature = await ethereum
      .request({
        method: "personal_sign",
        params: [hash, address],
      })
      .catch((e) => {
        alert(e.message);
        setIsWaiting(false);
      });
    if (signature) {
      const coupon = hash + signature;
      const nftData = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenid: Number(nft["tokenid"]),
          price: price,
          coupon: coupon,
        }),
      };
      const response = await fetch(urlApiEndpointUpdateData, nftData);
      const res = await response.json();
      const modalWaiting = document.getElementById("myModalWaiting");
      modalWaiting.style.display = "none";
      const modalFinished = document.getElementById("myModalFinished");
      modalFinished.style.display = "block";
    }
  }

  async function changePriceToSell() {
    setIsWaiting(true);
    const modal = document.getElementById("myModalChange");
    modal.style.display = "none";
    const modalWaiting = document.getElementById("myModalWaiting");
    modalWaiting.style.display = "block";

    const check = await contract.methods.ownerOf(tokenId).call();
    if (Number(check) == Number(address)) {
      changePrice();
    } else {
      alert("You are not the owner of this token");
    }
  }

  async function grantCoupon() {
    const type = value;
    console.log(type);
    const object = {
      Tokenid: tokenId,
      spender: address,
      price: price,
      typeToken: type,
      timestamp: Date.now(),
    };
    const hash = ethers.utils.hashMessage(JSON.stringify(object));
    const signature = await ethereum
      .request({
        method: "personal_sign",
        params: [hash, address],
      })
      .catch((e) => {
        alert(e.message);
        setIsWaiting(false);
      });
    if (signature) {
      const coupon = hash + signature;
      const nftData = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenid: Number(nft["tokenid"]),
          owner: nft["owned"],
          name: nft["name"],
          image: nft["image"],
          price: price,
          contract_address: nft["contract"],
          coupon: coupon,
          typecoin: type,
        }),
      };
      const response = await fetch(urlApiEndpoit, nftData);
      const res = await response.json();
      const modalWaiting = document.getElementById("myModalWaiting");
      modalWaiting.style.display = "none";
      const modalFinished = document.getElementById("myModalFinished");
      modalFinished.style.display = "block";
    }
  }

  function splitCoupon(coupon) {
    const hash = coupon.slice(0, 66);
    const signature = coupon.slice(66, coupon.length);
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);
    const signatureParts = { r, s, v };
    console.log([hash, signatureParts]);
    return [hash, signatureParts];
  }

  async function buyItemWithErc20(hash, _v, _r, _s, seller, priceToBuy) {
    transaction = await marketplaceContract.methods
      .buyItemWithErc20(
        contractAddress,
        tokenId,
        hash,
        _v,
        _r,
        _s,
        seller,
        priceToBuy
      )
      .send({ from: address })
      .catch((e) => {
        if (e.code === 4001) {
          alert("MetaMask Message Signature: User denied message signature.");
        }
      });

    return transaction;
  }

  async function verify() {
    setLoadingBuy(true);
    let coupon = nfts["coupon"];
    let price = nfts["price"];
    let seller = nfts["owner"];
    let typecoin = nfts["typecoin"];

    //console.log(price)
    const couponParts = splitCoupon(coupon);
    console.log(typecoin);
    const hash = couponParts[0];
    const signature = couponParts[1];
    const _r = signature["r"];
    const _s = signature["s"];
    const _v = signature["v"];
    const priceToBuy = web3.utils.toWei(price.toString(), "ether");
    //console.log()
    try {
      let transaction;
      if (typecoin == "BNB") {
        transaction = await marketplaceContract.methods
          .buyItem(
            contractAddress,
            tokenId,
            hash,
            _v,
            _r,
            _s,
            seller,
            priceToBuy
          )
          .send({ from: address, value: priceToBuy })
          .catch((e) => {
            if (e.code === 4001) {
              alert(
                "MetaMask Message Signature: User denied message signature."
              );
              setLoadingBuy(false);
            }
          });
      } else {
        const checkAllowance = await ERC20.methods
          .allowance(address, marketplaceAddress)
          .call();
        console.log(checkAllowance);
        console.log(priceToBuy);
        if (Number(checkAllowance) >= Number(priceToBuy)) {
          transaction = await marketplaceContract.methods
            .buyItemWithErc20(
              contractAddress,
              tokenId,
              hash,
              _v,
              _r,
              _s,
              seller,
              priceToBuy
            )
            .send({ from: address })
            .catch((e) => {
              if (e.code === 4001) {
                alert(
                  "MetaMask Message Signature: User denied message signature."
                );
                setLoadingBuy(false);
              }
            });
        } else {
          const totalSupply = await ERC20.methods.totalSupply().call();
          if (totalSupply) {
            const approve = await ERC20.methods
              .approve(marketplaceAddress, totalSupply)
              .send({ from: address })
              .catch((e) => {
                alert(e.message);
                setLoadingBuy(false);
              });

            if (approve) {
              transaction = await marketplaceContract.methods
                .buyItemWithErc20(
                  contractAddress,
                  tokenId,
                  hash,
                  _v,
                  _r,
                  _s,
                  seller,
                  priceToBuy
                )
                .send({ from: address })
                .catch((e) => {
                  if (e.code === 4001) {
                    alert(
                      "MetaMask Message Signature: User denied message signature."
                    );
                    setLoadingBuy(false);
                  }
                });
            }
          }
        }
      }

      if (transaction) {
        const deleteNftData = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tokenid: Number(nft["tokenid"]),
          }),
        };
        const request = await fetch(urlApiEndpointDeleteData, deleteNftData);
        const req = await request.json();
        console.log(req.message);
        alert("Buy successful!");
        setLoadingBuy(false);
      }

      //await transaction.wait();
      //displayMessage("00","Transaction confirmed with hash "+transaction.hash);
    } catch (error) {
      console.log(error);
    }
  }

  const listToMarketplace = async () => {
    setIsWaiting(true);
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    const modalWaiting = document.getElementById("myModalWaiting");
    modalWaiting.style.display = "block";

    const check = await contract.methods
      .isApprovedForAll(address, marketplaceAddress)
      .call();
    if (!check) {
      const setApproval = await contract.methods
        .setApprovalForAll(marketplaceAddress, true)
        .send({ from: address })
        .catch((e) => {
          if (e.code === 4001) {
            alert("MetaMask Message Signature: User denied message signature.");
            setIsWaiting(false);
          }
        });
      if (setApproval) {
        grantCoupon();
      } else {
        return;
      }
    } else {
      grantCoupon();
    }
  };

  const btn = () => {
    return (
      <>
        <button
          type="submit"
          className={styles.updatebtn}
          onClick={listToMarketplace}
        >
          Approval agian
        </button>
        <button type="button" className={styles.deletebtn} onClick={closePopup}>
          Cancel
        </button>
      </>
    );
  };

  const btnChange = () => {
    return (
      <>
        <button
          type="submit"
          className={styles.updatebtn}
          onClick={changePriceToSell}
        >
          Approval agian
        </button>
        <button type="button" className={styles.deletebtn} onClick={closePopup}>
          Cancel
        </button>
      </>
    );
  };

  const CancelListing = () => {
    return (
      <div>
        <button
          type="submit"
          className={styles.updatebtn}
          onClick={showPopupChange}
        >
          Change price
        </button>
        <button
          type="submit"
          className={styles.cancelbtn}
          onClick={showPopupCancel}
        >
          Cancel listing
        </button>
      </div>
    );
  };

  const showOffDetail = () => {
    return (
      <div id="saleDetail" className={styles.containerSale}>
        <div className={styles.containerDetailHead}>
          <p>Details</p>
        </div>
        <div className={`${styles.containerDetailBody} p-4`}>
          <div className="pb-2">Blockchain Environtment: </div>
          <div className="title is-size-6 has-text-weight-bold mb-0 pb-2">
            BSC Testnet
          </div>
          <div className="pb-2">Status: </div>
          <div className="title is-size-6 has-text-weight-bold mb-0 pb-2 has-text-success">
            On bag
          </div>
          <div className="pb-2">Owned by: </div>
          <div className="title is-size-6 has-text-weight-bold has-text-info mb-0 pb-2">
            {nft["owned"]}
          </div>
          <div className="pb-2">Contract Address</div>
          <div className="title is-size-6 has-text-weight-bold has-text-info mb-0 pb-4">
            <a href="https://testnet.bscscan.com/address/0x72bE3b77d298c42954611D624064917e8EA96B17">
              {nft.contract}
            </a>
          </div>
        </div>
      </div>
    );
  };

  const saleDetail = () => {
    const sellBtn = document.getElementById("sellBtn");
    sellBtn.style.display = "none";
    return (
      <div id="saleDetail" className={styles.containerSale}>
        <div className={styles.containerDetailHead}>
          <p>Sale Information</p>
        </div>
        <div className={`${styles.containerDetailBody} p-4`}>
          <div className="pb-2">Blockchain Environtment: </div>
          <div className="title is-size-6 has-text-weight-bold mb-0 pb-2">
            BSC Testnet
          </div>
          <div className="pb-2">Status: </div>
          <div className="title is-size-6 has-text-weight-bold has-text-danger mb-0 pb-2">
            On Sale
          </div>
          <div className="pb-2">
            <p>Current price</p>
          </div>
          <div className={styles.detailsSale}>
            {nfts["typecoin"] == "BNB" ? (
              <Image src="/images/bnbcoin.png" width={35} height={10} />
            ) : (
              <Image src="/images/boilogo.png" width={35} height={10} />
            )}
            <h1>{nfts["price"]}</h1>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "0",
            }}
          >
            {Number(nft["owned"]) == Number(address) ? (
              CancelListing()
            ) : (
              <Button
                size="lg"
                m="md"
                radius="md"
                loading={loadingBuy}
                onClick={verify}
              >
                Buy now
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.detailsnftcontainer}>
      <div id="sellBtn" className={styles.sellBtnContainer}>
        {Number(nft["owned"]) == Number(address) ? (
          <button className={styles.sellbtn} onClick={showPopup}>
            SELL
          </button>
        ) : (
          <button className={styles.makeofferbtn} onClick={showPopup}>
            Make offer
          </button>
        )}
      </div>
      <div className="p-6">
        <div id="saleDetail" className={`${styles.containerSale} mb-6`}>
          <div className={styles.containerDetailHead}>
            <p>History Activity</p>
          </div>

          <ScrollArea
            style={{ height: 200 }}
            type="scroll"
            offsetScrollbars
            p="xs"
          >
            <Table
              striped
              fontSize="lg"
              horizontalSpacing="lg"
              verticalSpacing="md"
            >
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Price</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>{displayActivity()}</tbody>
            </Table>
          </ScrollArea>
        </div>
        <div className="columns">
          <div className="column pr-5 is-narrow">
            <div className={styles.nftcontent}>
              <div className={styles.containerDetail}>
                <div className={styles.containerDetailHead}>
                  <p>NFT Product</p>
                  <a
                    href="https://testnet.bscscan.com/token/0x72bE3b77d298c42954611D624064917e8EA96B17"
                    className="title is-size-6 mb-0 has-text-link is-underlined"
                  >
                    Supported by CryptoViet
                  </a>
                </div>
                <div className={styles.containerDetailBody}>
                  <div className="has-text-centered p-2">
                    <img
                      src={nft["image"]}
                      style={{
                        height: "15rem",
                        border: "1px solid #000000",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                  <div className="pl-2 pr-2">
                    <div className="columns mb-3">
                      <div className="column">
                        <div>Name: </div>
                        <div className="title is-size-6 has-text-weight-bold has-text-primary-dark">
                          {nft["name"]}
                        </div>
                      </div>
                      <div className="column">
                        <div>Description: </div>
                        <div className="title is-size-6 has-text-weight-bold has-text-primary-dark">
                          {nft["description"]}
                        </div>
                      </div>
                    </div>
                    <div className="columns mb-3">
                      <div className="column">
                        <div>Token ID: </div>
                        <div className="title is-size-6 has-text-weight-bold has-text-primary-dark">
                          {nft.tokenid}
                        </div>
                      </div>
                      <div className="column">
                        <div>Token Standard: </div>
                        <div className="title is-size-6 has-text-weight-bold has-text-primary-dark">
                          ERC-721
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            {nfts["price"] ? saleDetail() : showOffDetail()}
          </div>
        </div>
      </div>
      <CancelListingPopup />
      <div id="myModal" className={styles.modal}>
        <div className={styles.modalcontent}>
          <div className={styles.modalhead}>
            <p className={styles.price}>Price</p>
            <div className={styles.modalbody}>
              <select
                className={styles.logo}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              >
                <option value="BNB">BNB</option>
                <option value="BOI">BOI</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
          </div>
          <button
            type="submit"
            className={styles.updatebtn}
            onClick={listToMarketplace}
          >
            Confirm listing
          </button>
          <button
            type="button"
            className={styles.deletebtn}
            onClick={closePopup}
          >
            Cancel
          </button>
        </div>
      </div>
      <div id="myModalChange" className={styles.modal}>
        <div className={styles.modalcontent}>
          <div className={styles.modalhead}>
            <p className={styles.price}>Price</p>
            <div className={styles.modalbody}>
              <div className={styles.logo}>
                <Image src="/images/bnbcoin.png" width={20} height={30} />
                <p>BNB</p>
              </div>
              <input
                type="number"
                placeholder="Amount"
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
          </div>
          <button
            type="submit"
            className={styles.updatebtn}
            onClick={changePriceToSell}
          >
            Submit
          </button>
          <button
            type="button"
            className={styles.deletebtn}
            onClick={closePopup}
          >
            Cancel
          </button>
        </div>
      </div>
      <div id="myModalWaiting" className={styles.modal}>
        <div className={styles.modalcontent}>
          <div className={styles.modalhead}>
            <p className={styles.price}>Complete your listing</p>
          </div>
          {isWaiting ? (
            <button disabled className={styles.waitingbtn}>
              Waiting for Approving
            </button>
          ) : !isChange ? (
            btn()
          ) : (
            btnChange()
          )}
        </div>
      </div>
      {!isChange ? (
        <div id="myModalFinished" className={styles.modal}>
          <div className={styles.modalcontentFinished}>
            <div className={styles.modalhead}>
              <p className={styles.price}>Your item has been listed!</p>
            </div>
            <img className={styles.imgFinished} src={nft["image"]} />
            <div>{nft["name"]} has been listed for sale.</div>
            <Link href="/Marketplace">
              <input
                className={styles.viewlistingbtn}
                type="button"
                value="View Listing"
              />
            </Link>
          </div>
        </div>
      ) : (
        <div id="myModalFinished" className={styles.modal}>
          <div className={styles.modalcontentFinished}>
            <div className={styles.modalhead}>
              <p className={styles.price}>Your item has been Update!</p>
            </div>
            <img className={styles.imgFinished} src={nft["image"]} />
            <div>{nft["name"]} has been listed for sale.</div>
            <Link href="/Marketplace">
              <input
                className={styles.viewlistingbtn}
                type="button"
                value="View Listing"
              />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
