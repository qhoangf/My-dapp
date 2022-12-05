import Image from "next/image"
import styles from "../styles/Navbar.module.css"
import Link from "next/link"
import { useState, useEffect } from "react"
import { marketplaceAddress, marketplaceABI } from "../contract";
import Web3 from 'web3';

let web3 = new Web3(Web3.givenProvider)

export default function NavBar() {
  const [proceeds, setProceeds] = useState();
  const [waiting, setWaiting] = useState(false);
  const [proceedsErc20, setProceedsErc20] = useState();
  const marketplaceContract = new web3.eth.Contract(marketplaceABI, marketplaceAddress)

  const [isClosed, setIsClosed] = useState(true)
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet  exists!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length != 0) {
      const account = accounts[0]
      console.log("Found an authorized account: ", account)
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  }

  const [currentAccount, setCurrentAccount] = useState(null);

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!")
    }

    try {
      const account = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log("Found an account! Address: ", account[0])
      setCurrentAccount(account[0])
    } catch (error) {
      alert(error)
    }
  }

  const ConnectButton = () => {
    return (
      <button
        className={styles.btn}
        onClick={connectWalletHandler}>Connect To Metamask
      </button>
    )
  }

  async function withdraw() {
    if (proceeds > 0) {
      setWaiting(true)
      const req = await marketplaceContract.methods.withdrawProceeds().send({ from: currentAccount })
        .catch(e => {
          alert(e.message)
          setWaiting(false)
        })
      if (req) {
        alert('Withdraw successful!')
        setProceeds(0)
        setWaiting(false)
        closeWithdrawPopup()
      }
    } else {
      alert("Do not have enough token to withdraw")
    }
  }

  async function withdrawErc20() {
    if (proceedsErc20 > 0) {
      setWaiting(true)
      const req = await marketplaceContract.methods.withdrawProceedsErc20().send({ from: currentAccount })
        .catch(e => {
          alert(e.message)
          setWaiting(false)
        })
      if (req) {
        alert('Withdraw successful!')
        setProceedsErc20(0)
        setWaiting(false)
        closeWithdrawPopup()
      }
    } else {

      alert("Do not have enough token to withdraw")
    }
  }

  function showPopup() {
    var modal = document.getElementById('myModalWallet')
    if (isClosed == true) {
      modal.style.display = "block"
      setIsClosed(false)
    } else {
      modal.style.display = "none"
      setIsClosed(true)
    }
  }

  function showWithdrawPopup() {
    var modal = document.getElementById("myModalWithdraw")
    modal.style.display = 'block'
  }

  function closeWithdrawPopup() {
    var modal = document.getElementById('myModalWithdraw')
    modal.style.display = "none"
  }

  function closePopup() {
    var modal = document.getElementById('myModalWallet')
    modal.style.display = "none"
    setIsClosed(true)
  }

  async function getProceeds() {
    if (currentAccount) {
      const check = await marketplaceContract.methods.getProceeds(currentAccount).call()
      setProceeds(web3.utils.fromWei(check, 'ether'))
      const checkErc20 = await marketplaceContract.methods.getProceedsErc20(currentAccount).call()
      setProceedsErc20(web3.utils.fromWei(checkErc20, 'ether'))
    }
  }

  useEffect(() => {
    checkWalletIsConnected()
    getProceeds()
  }, [currentAccount])

  const WalletAddress = () => {
    let char = []
    for (let i = 0; i < currentAccount.length; i++) {
      char.push(currentAccount[i])
    }
    const chardisplay = [char[0], char[1], "...", char[char.length - 4], char[char.length - 3], char[char.length - 2], char[char.length - 1], char[char.length]]
    return (
      <div className={styles.dropdownAdd}>
        <button className={styles.navbarAddress}>{chardisplay}</button>
        <div className={styles.dropdownAddress}>
          <button onClick={showPopup}>Wallet</button>
          <br></br>
          <button>Logout</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarHead}>
        <Link href="/">
          <Image className={styles.exchangelogo}
            priority
            src="/images/exchangelogo.png"
            width={140}
            height={50}
            alt="logo"
          />
        </Link>
        {/* <div className={styles.navbarMenu}>
                <Link href="/">
                    <a className={styles.navbarItem}>Home</a>
                </Link>
                <Link href="/posts/first-post">
                    <a className={styles.navbarItem}>Exchange</a>
                </Link>
                <div className={styles.dropdown}>
                  <button className={styles.dropbtn}>NFT</button>
                  <div className={styles.dropdowncontent}>
                    <a href="/posts/MintNFT">Mint NFT</a>
                    <a href="/posts/YourNFT">Your NFT</a>
                    <a href="/posts/Marketplace">Marketpalce</a>
                  </div>
                </div>
            </div> */}
      </div>
      <div className="is-flex">
        <div className={styles.navbarMenu}>
          <Link href="/posts/first-post">
            <a className={styles.navbarItem}>Exchange</a>
          </Link>
          <div className={styles.dropdown}>
            <div className={styles.navbarItem}>NFT</div>
            <div className={styles.dropdowncontent}>
              <Link href="/posts/MintNFT">
                <div className={styles.dropdownitems}>Mint NFT</div>
              </Link>
              <Link href="/posts/YourNFT">
                <div className={styles.dropdownitems}>Your NFT</div>
              </Link>
              <Link href="/posts/Marketplace">
                <div className={styles.dropdownitems}>Marketpalce</div>
              </Link>
            </div>
          </div>
        </div>
        {currentAccount ? <WalletAddress /> : <ConnectButton />}
      </div>
      <div id='myModalWallet' className={styles.modal}>
        <button className={styles.close} onClick={closePopup}></button>
        <div className={styles.modalcontent}>
          <div className={styles.modalbody}>
            <div className={styles.modalhead}>
              <p className={styles.total}>Total balance</p>
              <p>{proceeds} BNB </p>
              <p>{proceedsErc20} BOI </p>
            </div>
            <button className={styles.withdrawbtn} onClick={showWithdrawPopup}>Withdraw</button>
          </div>
        </div>
      </div>
      <div id='myModalWithdraw' className={styles.modalWithdraw}>
        <div className={styles.modalWithdrawcontent}>
          <div className={styles.modalhead}>
            <h2>Choose token want to withdraw</h2>
            {!waiting ?
              <>
                <div className={styles.typecoin} onClick={withdraw}>
                  <Image
                    priority
                    src="/images/bnbcoin.png"
                    width={30}
                    height={30} />
                  <p> BNB </p>
                </div>
                <div className={styles.typecoin} onClick={withdrawErc20}>
                  <Image
                    priority
                    src="/images/boilogo.png"
                    width={30}
                    height={30} />
                  <p> BOI </p>
                </div>
                <button type="button" className={styles.cancelbtn} onClick={closeWithdrawPopup}>Cancel</button>
              </> :
              <>
                <p>Withdraw is process...</p>
                <button disabled className={styles.waitingbtn}> Waiting... </button>
              </>}
          </div>
        </div>
      </div>
    </div>
  )
}
