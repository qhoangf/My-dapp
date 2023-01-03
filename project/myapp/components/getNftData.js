import { contractABI, contractAddress } from "../contract";
import Web3 from "web3";
let web3 = new Web3("https://spring-burned-owl.bsc-testnet.discover.quiknode.pro/2749c0a5351d7ddd7495c37cad3f59d49c93ea50/");
import axios from "axios";

const contract = new web3.eth.Contract(contractABI, contractAddress);

export const getNftData = async (address) => {
  let item = [];
  const nftBalance = await contract.methods.balanceOf(address).call();
  for (let i = 0; i < nftBalance; i++) {
    const tokenId = await contract.methods
      .tokenOfOwnerByIndex(address, i)
      .call();
    const result = await contract.methods.tokenURI(tokenId).call();
    let data = await axios.get(result);
    let meta = data.data;
    meta.tokenid = tokenId;
    meta.owned = address;
    item.push(meta);
  }
  return item;
};
