import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import utils from '../styles/utils.module.css'
import Link from 'next/link'
import Layout, {siteTitle} from '../components/layout'
import NavBar from '../components/NavBar'

export default function Home() {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      
    </>
  )
}
