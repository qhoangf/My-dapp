import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/Marketplace.module.css";

export default function Marketplace() {
  const urlApiEndpoit = process.env.API + "getNftData-lib";
  const [nfts, setNfts] = useState([]);
  const [type, setType] = useState();

  useEffect(() => {
    async function getData() {
      const request = await fetch(urlApiEndpoit);
      const req = await request.json();
      setNfts(req.data);
    }
    getData();
  }, []);

  return (
    <div className={styles.container}>
      <div className="title is-size-5 p-4 mb-0 has-text-white">Marketplace</div>
      <div className="columns is-multiline">
        {nfts.map((item) => {
          return (
            <Link href={item.contract_address + "/" + item.tokenid}>
              <div className="column is-4">
                <div className={styles.nftcard}>
                  <img src={item.image} />
                  <p className={styles.name}>{item.name}</p>
                  <div className={styles.price}>
                    <p>Price: {item.price}</p>
                    {item["typecoin"] == "BNB" ? (
                      <Image src="/images/bnbcoin.png" width={15} height={17} />
                    ) : (
                      <Image src="/images/boilogo.png" width={15} height={17} />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
