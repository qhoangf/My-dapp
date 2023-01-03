import Head from 'next/head'
import Image from 'next/image'
// import styles from'../styles/bulma.css'
import utils from '../styles/utils.module.css'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout'
import NavBar from '../components/NavBar'
import { useState, useEffect } from "react";
import nftintro from '../public/images/nftintro.gif'
import nftintro3 from '../public/images/nftintro3.gif'
import blockbitcoin from '../public/images/blockbitcoin.gif'
import metamasklogo from '../public/images/metamasklogo.gif'
import phantomlogo from '../public/images/phantomlogo.png'
import majarlogo from '../public/images/majarlogo.gif'

export default function Home() {
  const [isWaiting, setIsWaiting] = useState(true);

  const closeModalByBackground = () => {
    let modal = document.getElementById("selectWalletModal");
    modal.classList.remove("is-active");
  };

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
      setIsWaiting(false);
      setLoading(false);
    }
  }

  const openSelectWalletModal = function () {
    let selectWalletModal = document.getElementById("selectWalletModal");
    selectWalletModal.classList.add("is-active");
  }

  const connectMetamaskWallet = function () {
    setIsWaiting(true);
    connectWalletHandler();
    setLoading(true);
  }

  const setLoading = function (bool) {
    let loadingModal = document.getElementById("loadingModal");
    let contentModal = document.getElementById("contentModal");

    if (bool) {
      loadingModal.classList.remove("is-hidden");
      contentModal.classList.add("is-hidden");
    } else {
      loadingModal.classList.add("is-hidden");
      contentModal.classList.remove("is-hidden");
    }
  }

  const rollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(function () {
      let selectWalletModal = document.getElementById("selectWalletModal");
      selectWalletModal.classList.add("is-active");
    }, 1000)
  }

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <section className='section set-section1-background'>
        <div className='columns'>
          <div className='column has-text-centered m-6 p-0 has-border-frame-10px-primary' style={{
              "border": "10px solid",
              "border-image-slice": "1 !important",
              "border-image-source": "linear-gradient(to left bottom, #6a5af9, #3b85ac, #479bc7) !important",
              "border-bottom": "none",
          }}>
            <Image src={nftintro} height={650} width={800} />
          </div>
          <div className='column has-text-left p-6 mt-6 mr-6 mb-6'>
            <div className='title is-1 has-text-weight-bold has-text-white mb-5'>Your NFT journey <br></br> starts here.</div>
            <div className='title is-5 has-text-white is-line-height-2rem'>
              Guides, practical tips, and support articles for first-<br></br>
              time creators, experienced collectors, and everyone <br></br>
              in between.
            </div>
            <div className='container pt-5'>
              <div className='button startTradingNow has-text-weight-bold is-size-5' onClick={openSelectWalletModal}>
                Start Trading NOW!
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='section set-section2-background'>
        <div className='columns'>
          <div className='column has-text-left p-6 m-6'>
            <div className='title is-1 has-text-weight-bold has-text-white mb-5 has-text-right'>Explore all the items<br></br> on Marketplace.</div>
            <div className='title is-5 has-text-white is-line-height-2rem is-flex is-justify-content-right'>
              <div className='has-text-left'>
                <p>● &nbsp; Create your token</p>
                <p>● &nbsp; Discover the NFTs</p>
                <p>● &nbsp; Collect the rewards</p>
              </div>
            </div>
          </div>
          <div className='column has-text-centered m-6 p-0'>
            <Image src={nftintro3} height={650} width={800} />
          </div>
        </div>
      </section>

      <section className='section set-section3-background'>
        <div className='has-text-centered p-6 m-6'>
          <div className='title is-1 has-text-white'>Using the Blockchains Platforms</div>
          <div className='pt-5'>
            <Image src={blockbitcoin} height={450} width={750} />
          </div>
        </div>
      </section>

      <section className='section set-section4-background'>
        <div className='columns'>
          <div className='column has-text-centered m-6 p-0'>
            <div className='title is-3 has-text-white'>About the Blockchain</div>
            <div className='pt-5'>
              <iframe width="600" height="350" src="https://www.youtube.com/embed/qOVAbKKSH10" allowfullscreen></iframe>
            </div>
          </div>
          <div className='column has-text-centered m-6 p-0  '>
            <div className='title is-3 has-text-white'>About the Crypto Wallets</div>
            <div className='pt-5'>
              <iframe width="600" height="350" src="https://www.youtube.com/embed/d8IBpfs9bf4" allowfullscreen></iframe>
            </div>
          </div>
        </div>
        <div className='has-text-centered mt-5 mb-5'>
          <div className='button glow-on-hover' onClick={rollToTop}>JOIN WITH US NOW!</div>
        </div>
      </section>

      <div className="modal" id='selectWalletModal' >
        <div className="modal-background" onClick={closeModalByBackground}></div>
        <div className="modal-content has-background-white has-border-rounded-10px">
          <div id="contentModal">
            <div className='container p-6'>
              <div className='title is-4 has-text-centered'>Choose your wallet</div>
              <div className='is-size-7 has-text-centered'>
                <span>If you don't have a wallet, you can select a provider and create one now. </span>
                <a className='has-text-info is-underlined' target='__blank' href='https://metamask.io/'>Learn more</a>
                <span> one of our wallet</span>
              </div>
              <hr></hr>
              <div className='wallet-container'>
                <div className='columns wallet-child' onClick={connectMetamaskWallet}>
                  <div className='column is-2 has-text-centered'>
                    <Image src={metamasklogo} height={60} width={85} />
                  </div>
                  <div className='column margin-block-auto'>
                    <div className='is-flex is-justify-content-space-between margin-block-auto'>
                      <div className='title is-6 m-0'>Metamask</div>
                      <div className='title is-7 has-text-grey m-0'>Recommended</div>
                    </div>
                  </div>
                </div>
                <div className='columns wallet-child'>
                  <div className='column is-2 has-text-centered'>
                    <Image src={phantomlogo} height={60} width={110} />
                  </div>
                  <div className='column margin-block-auto'>
                    <div className='is-flex is-justify-content-space-between margin-block-auto'>
                      <div className='title is-6 m-0'>Phantom</div>
                      <div className='title is-7 has-text-grey m-0'></div>
                    </div>
                  </div>
                </div>
                <div className='columns wallet-child'>
                  <div className='column is-2 has-text-centered'>
                    <Image src={majarlogo} height={60} width={110} />
                  </div>
                  <div className='column margin-block-auto'>
                    <div className='is-flex is-justify-content-space-between margin-block-auto'>
                      <div className='title is-6 m-0'>Maiar Wallet</div>
                      <div className='title is-7 has-text-grey m-0'></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="loadingModal" className='is-hidden'>
            <div class="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>

      <footer className='has-text-centered is-size-7 p-2 footerindex'>
        © 2022 BH-Marketplace - Developed by <b>Nguyen Ho Quoc Bao</b> and <b>Nguyen Quoc Hoang</b>
      </footer>
    </>
  )
}
