import styles from "../../styles/Nft.module.css"
import Image from 'next/image'
import { useState } from 'react'

export default function firstpost() {
  const [value, setValue] = useState("BNB");

  function logValue() {
    console.log(value);
  }


  return (
    <div className={styles.createNft}>
      <section className={styles.mainsection}>
        <div className="columns">
          <div className="column is-2">
            <div className={styles.maincontainer}>
              <div className="title is-4 has-text-white has-text-centered mb-5">
                Create NFT Tokens
              </div>
              <div>
                <div className="title is-6 has-text-white-ter mb-4">Choosing your Token</div>
                <select className="select is-fullwidth mb-4"
                  value={value}
                  onChange={e => { setValue(e.target.value) }}>
                  <option value="BNB">BNB</option>
                  <option value="BOI">BOI</option>
                </select>
              </div>

              <div className="button is-success mt-4 is-fullwidth" onClick={logValue}>Create NOW!</div>
            </div>
          </div>
          <div className="column"></div>
        </div>
      </section >
    </div >
  )
}
