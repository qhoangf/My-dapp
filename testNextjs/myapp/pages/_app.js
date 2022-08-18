import Layout from '../components/layout'
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  return (
    <Layout>
        <div className="maincontent">
          <Component {...pageProps} />
          
        </div>
    </Layout>
  )
}

export default MyApp
