import styles from "../styles/Nft.module.css"
import Image from 'next/image'
import { useState, useEffect } from 'react'
import HorizontalTimeline from "react-horizontal-timeline";
import { useRouter } from 'next/router';
import { Stepper, Button, Group } from '@mantine/core';
import { Carousel } from '@mantine/carousel';

export default function firstpost() {
  // CREATE USE STATE
  const [active, setActive] = useState(0);
  const [address, setCheckAddress] = useState("");
  const [finalstep, setFinalStep] = useState(false);

  const [checkbox, setCheckedCheckbox] = useState(false);

  const [srcNftImgValue, setSrcNftImg] = useState("");
  const [nameNftValue, setNameNft] = useState("");

  const [iscompleted, setTransactionProcess] = useState(false)

  // CREATE FUNCTION 
  const nextStep = () => setActive((currentStep) => {
    console.log(currentStep);
    switch (currentStep) {
      case 0:
        if (checkbox != false && address != "") {
          currentStep = (currentStep < 3 ? currentStep + 1 : currentStep);
          setCheckedCheckbox(false);
        } else {
          alert("Please input the address and agree with the policy first!");
        }
        return currentStep;
      case 1:
        if (srcNftImgValue && nameNftValue) {
          currentStep = (currentStep < 3 ? currentStep + 1 : currentStep);
        } else {
          alert("Please choose the NFT!");
        }
        return currentStep;
      case 2:
        setFinalStep(true);
      default:
        currentStep = (currentStep < 3 ? currentStep + 1 : currentStep)
        return currentStep
    };
  });

  const prevStep = () => setActive((currentStep) => (currentStep > 0 ? currentStep - 1 : currentStep));

  useEffect(() => {
    let nftChosenCardList = document.querySelectorAll(".nftChosenCard");
    nftChosenCardList.forEach(card => {
      card.onclick = function () {
        let srcNftImg = card.querySelector(".srcNftImg").getAttribute("src");
        let nameNft = card.querySelector(".nameNft").innerText;

        alert(`${nameNft} is chosen!`);

        setSrcNftImg(srcNftImg);
        setNameNft(nameNft);
      }
    });
  })

  function processTransaction() {
    if (active == 3) {
      setTimeout(function () {
        setTransactionProcess(true);
      }, 2000);
    }
  }

  let setLoadingTransaction = () => {
    return (
      <>
        <div>
          <div className="has-text-centered title is-size-5 mt-3">Transaction is in process...</div>
          <div className="has-text-centered">
            <button className="button is-large is-loading" style={{ border: "none" }}>Loading</button>
          </div>
        </div>
        <div>
          {processTransaction()}
        </div>
      </>
    )
  };

  let setCompletedTransaction = () => {
    return (
      <>
        <div className="has-text-centered title is-size-5 mb-0 mt-3">Completed, Successful transaction!</div>
        <div className="has-text-centered">
          <img src="https://static.vecteezy.com/system/resources/previews/002/743/514/original/green-check-mark-icon-in-a-circle-free-vector.jpg" width={100}></img>
        </div>
      </>
    )
  };

  function renderCaroudselSlide() {
    let nftArray = [
      { "name": "NFT 1", "imgsrc": "https://bulma.io/images/placeholders/1280x960.png" },
      { "name": "NFT 2", "imgsrc": "https://bulma.io/images/placeholders/1280x960.png" },
      { "name": "NFT 3", "imgsrc": "https://bulma.io/images/placeholders/1280x960.png" },
      { "name": "NFT 4", "imgsrc": "https://bulma.io/images/placeholders/1280x960.png" },
    ]

    let renderedHtml = nftArray.map((nftInfo) =>
      <Carousel.Slide className="">
        <div className="card nftChosenCard">
          <div className="card-image">
            <div className="image is-4by3">
              <img className="srcNftImg" src={nftInfo.imgsrc}></img>
            </div>
          </div>
          <div className="card-content p-2 nameNft">
            {nftInfo.name}
          </div>
        </div>
      </Carousel.Slide>
    );

    return renderedHtml;
  }

  return (
    <div>
      <div className={styles.exchangebackground}>
        <div className="box" style={{ width: "40rem", marginLeft: "auto", marginRight: "auto", borderRadius: "15px", marginBlock: "auto" }}>
          <div style={{ margin: "0 auto" }}>
            <Stepper active={active} onStepClick={setActive} breakpoint="sm">
              <Stepper.Step label="First step" description="Choose address" disabled>
                <div className="has-text-centered title is-size-5 mt-3">
                  Choosing Receiver address
                </div>
                <div>
                  <input className="input" placeholder="Type receiver address here" onInput={(event) => setCheckAddress(event.target.value)}></input>
                  <div className="is-flex mt-4">
                    <input className="mr-1" id="step1ConfirmButton" type='checkbox'
                      onChange={(event) => setCheckedCheckbox(event.target.checked)}
                      style={{ width: "1rem", height: "1rem", marginBlock: "auto" }}></input>

                    <span className="has-text-danger has-text-weight-bold is-italic is-size-7">
                      Please enter the correct address of the recipient. If the address is wrong, your NFT will be lost forever.
                    </span>
                  </div>
                </div>
              </Stepper.Step>
              <Stepper.Step label="Second step" description="Choose NFT" disabled>
                <div className="has-text-centered title is-size-5 mt-3">
                  Choose NFT to transfer
                </div>
                <Carousel
                  withIndicators
                  height={200}
                  slideSize="33.333333%"
                  slideGap="md"
                  breakpoints={[
                    { maxWidth: 'md', slideSize: '50%' },
                    { maxWidth: 'sm', slideSize: '100%', slideGap: 0 },
                  ]}
                  loop
                  align="start">
                  {renderCaroudselSlide()}
                </Carousel>
              </Stepper.Step>
              <Stepper.Step label="Final step" description="Review information" disabled>
                <div className="has-text-centered title is-size-5 mt-3">
                  Review again chosen NFT
                </div>
                <div>
                  <div className="columns">
                    <div className="column is-4">
                      <div className="image is-4by3">
                        <img src={srcNftImgValue}></img>
                      </div>
                    </div>
                    <div className="column">
                      <div className="is-size-7 has-text-danger is-italic has-text-weight-bold">
                        Please check again your information and confirm by clicking Next
                      </div>

                      <div>Your receiver address will be: <span className="has-text-info has-text-weight-bold">{address}</span></div>
                      <div>Your chosen NFT name: <span className="has-text-info has-text-weight-bold">{nameNftValue}</span> </div>
                    </div>
                  </div>
                </div>
              </Stepper.Step>
              <Stepper.Completed disabled>
                <div>
                  {iscompleted ? setCompletedTransaction() : setLoadingTransaction()}
                </div>
              </Stepper.Completed>
            </Stepper>
            {!finalstep ?
              <Group position="center" mt="xl">
                <Button className="backButton" variant="default" onClick={prevStep}>Back</Button>
                <Button className="nextButton" onClick={nextStep}>Next</Button>
              </Group>
              : <></>}
          </div>
        </div>
      </div>
    </div >
  )
}