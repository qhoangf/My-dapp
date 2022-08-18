import styles from "../../styles/Nft.module.css"
import Image from 'next/image'
import {useState} from 'react'

export default function firstpost() {
  const [value, setValue] = useState("BNB");

  function logValue() {
    console.log(value);
  }


  return (
    <div>
      <select 
      value={value}
      onChange={e=>{setValue(e.target.value)}}>
        <option value="BNB">BNB</option>
        <option value="BOI">BOI</option>
      </select>

      <button onClick={logValue}>submit</button>
    </div>
  )
}
