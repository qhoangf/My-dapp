import { useState } from 'react'
import { Listbox } from '@headlessui/react'
import styles from "../../styles/Nft.module.css"

const coin = [
  { id: 1, name: 'BNB', unavailable: false },
  { id: 2, name: 'BOI', unavailable: false },
]

export default function MyListbox() {
  const [selectedCoin, setSelectedCoin] = useState(coin[0])

  return (
    <Listbox value={selectedCoin} onChange={setSelectedCoin}>
      <Listbox.Button>{selectedCoin.name}</Listbox.Button>
      <Listbox.Options>
        {coin.map((coin) => (
          <Listbox.Option
            key={coin.id}
            value={coin}
            disabled={coin.unavailable}
          >
            {coin.name}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}