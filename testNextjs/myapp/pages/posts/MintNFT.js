import { contractABI, contractAddress } from "../../contract";
import { useEffect, useState } from "react";
import styles from "../../styles/MintNft.module.css"
import Link from "next/link";
import Web3 from 'web3';
import { create } from 'ipfs-http-client';
require('dotenv').config()

//const ipfsClient = require('ipfs-http-client');

const projectId = "2C7X7vue5KDYw7KVenWosKbx4YR";   // <---------- your Infura Project ID

const projectSecret = "84ff25515749b85607d737d519645d56";  // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});
const web3 = new Web3(Web3.givenProvider);

export default function MintNFT(){
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [rows, setRows] = useState([]);
    const [rowsMinted, setRowsMinted] = useState([]);
    const [count, setCount] = useState();
    const [currentAccount, setCurrentAccount] = useState(null);
    
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    
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

    
    const onSubmit = async (err) =>{
        err.preventDefault();
        //get mint Price
        const mintPrice = await contract.methods.mintPrice().call();
        console.log(mintPrice)
        //gt balance of wallet address want to mint NFT
        const balanceOf = await web3.eth.getBalance(currentAccount);
        console.log(balanceOf)

        const maxMint = await contract.methods.getMaxMint(currentAccount).call();
        let result = Number(maxMint);
        console.log("the result is: " + result)
        if(Number(maxMint) < 10){
            if(Number(balanceOf) > Number(mintPrice)){
                // Attempt to save image to IPFS
                const added = await client.add(file)
                console.log(added.path)
                const url = `https://cryptoviet.infura-ipfs.io/ipfs/${added.path}`
                
                const metadata = {
                    name,
                    description,
                    image: url,
                };
                const file2 = await client.add(JSON.stringify(metadata))
                const metadataurl = `https://cryptoviet.infura-ipfs.io/ipfs/${file2.path}`
                console.log(metadataurl)
                
                // Interact with smart contract
                
                const response = await contract.methods.safeMintNft(metadataurl).send({ from: currentAccount, value: mintPrice });
                // Get token id
                const tokenId = response.events.Transfer.returnValues.tokenId;
                // Display alert
                alert(
                `NFT successfully minted. Contract address - ${contractAddress} and Token ID - ${tokenId}`
                );
                result++;
                setCount(result)
            }else{
                alert("You don't have enough ETH to mint NFT, check your balance!")
            }
        }else{
            alert("You have reached the maximum of NFT minting")
        }
    }
    async function StatusMint(){
        let rowMinted=[];
        let row=[];
        if(currentAccount){
            const maxMint = await contract.methods.getMaxMint(currentAccount).call();
            setCount(Number(maxMint))
            for(let i=0;i<Number(maxMint);i++){
                rowMinted.push(" ")
            }
            setRowsMinted(rowMinted)
            for(let i = 0; i< 10 - Number(maxMint); i++){
                row.push(" ")
            }
            setRows(row)
        }else{
            return
        }
    }

    function NotConnected(){
        return(
            <h1 className={styles.head}>please connect wallet</h1>
            
        )
    }

    const displayMintNFT = () =>{
        return(
            <div className={styles.container}>
                <form onSubmit={onSubmit}>
                    <div className={styles.head}>
                        <h1>Mint NFT</h1>
                    </div>
                    <div className={styles.content}>
                        <p className={styles.text}>Name Of Your NFT</p>
                        <input className={styles.input} type="text"  placeholder="Name of NFT" value={name} onChange={(e) => setName(e.target.value)}/>
                        <p className={styles.text}>Description</p>
                        <input className={styles.input} type="text" placeholder="Description" value={description} onChange = {(e) => setDescription(e.target.value)}/>
                        <p className={styles.text}>Image of Your NFT</p>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                    {currentAccount ? displayStatus(): <NotConnected />}
                    <div className={styles.button}>
                        <button type="submit" className={styles.mintbtn}>Mint NFT</button>
                        <button className={styles.mintbtn}>
                            <Link href="/">
                                <a>Back to Home</a>
                            </Link>
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    const displayStatus = ()=>{
        if(!currentAccount){
            return console.log("null")
        }else{
            return(
                <div className={styles.maxMint}>
                    <p className={styles.statusText}>NFT Mint {count}/10</p>
                    <div className={styles.status}>
                        <ul>
                            {rowsMinted.map(item =>{
                                return(
                                    <li className={styles.statusMinted}>{item}</li>
                                )
                            })}
                            {rows.map(item =>{
                                return(
                                    <li className={styles.statusNotMintYet}>{item}</li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            )
        }
    }

    useEffect(() => {
        
        if(currentAccount){
            StatusMint()
        }else{
            connectWalletHandler()
        }
    },[currentAccount,count])
    return(
        <div>
            {currentAccount ? displayMintNFT(): <NotConnected />}
        </div>
    )
}