import { contractABI, contractAddress } from "../../../contract";
import {useEffect, useState} from 'react';
import Web3 from "web3"
import axios from 'axios'
import styles from "../../../styles/YourNFT.module.css"
import Link from "next/link";

let web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')

export default function YourNFT(){
    const [datas, setDatas] = useState([])
    let item = []
    const contract = new web3.eth.Contract(contractABI,contractAddress)
    const [currentAccount, setCurrentAccount] = useState(null);
    const [flag, setFlag] = useState(false);

    const getNftData = async () =>{
        if(!currentAccount){
            return
        } else{
            const nftBalance = await contract.methods.balanceOf(currentAccount).call()
            for(let i = 0; i<nftBalance ; i++){
                const tokenId = await contract.methods.tokenOfOwnerByIndex(currentAccount,i).call()
                const result = await contract.methods.tokenURI(tokenId).call()
                let data = await axios.get(result)
                let meta = data.data
                meta.tokenid= tokenId;
                meta.owned = currentAccount;
                item.push(meta)
            }
            setDatas(item)
            setFlag(true)
        }
    }

    const connectWalletHandler = async () => {
        const {ethereum} = window;
    
        if(!ethereum){
          alert("Please install Metamask!")
        }
    
        try{
          const account = await ethereum.request({method: 'eth_requestAccounts'})
          console.log("Found an account! Address: ", account[0])
          setCurrentAccount(account[0])
        }catch{
          
        }
      }

    const notConnected = () =>{
        return(
            <div>
                <h1 className={styles.head}>Please connect your wallet!</h1>
            </div>
        )
    }

    const displayNft = () =>{
        if(!currentAccount){
            return console.log('null')
        }else if(flag){
            console.log(datas)
            return(
                <div className={styles.nftbody}>
                    <h1 className={styles.title}>YOUR NFT</h1>
                    <div className={styles.nftcontainer}>
                        <div className={styles.nftcontent}>
                            {datas.map(item => {
                                return(
                                    <Link href={"0x72bE3b77d298c42954611D624064917e8EA96B17/" + item.tokenid} key={item.tokenid}>
                                        <a className={styles.container}>
                                            <div className={styles.nftcard}>
                                                <h2 className={styles.nftname}>{item.name}</h2>
                                                <img className={styles.nftimage} src={item.image}/>
                                                <div className={styles.description}>
                                                    <p className={styles.descriptiontext}>Description:</p>
                                                    <p className={styles.datavalue}>{item.description}</p>
                                                    <div className={styles.horizontaldividerblack}></div>
                                                    <p className={styles.descriptiontext}>Contract Address:</p>
                                                    <p className={styles.datavalue}>0x72bE3b77d298c42954611D624064917e8EA96B17</p>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                )
                            })}           
                        </div>
                    </div>
                </div>
            )
            
        }
    }

    useEffect(() => {
        if(currentAccount){
            getNftData()
        }else{
            connectWalletHandler()
        }
    },[currentAccount])
    return(
        <div className={styles.body}>
            {currentAccount ? displayNft(): notConnected()}
        </div>
    )
}