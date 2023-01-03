import styles from "./layout.module.css";
import Head from 'next/head'
import Image from 'next/image'
import utils from '../styles/utils.module.css'
import Link from 'next/link'
import NavBar from "./NavBar";



export default function Layout({ children }) {
    return (
        <div>
            <NavBar />
            {children}
        </div>
    )
        
}