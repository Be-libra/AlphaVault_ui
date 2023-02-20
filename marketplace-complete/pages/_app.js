import "../styles/globals.css"
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b px-12 py-6">
        <p className="text-xl">NFT Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <p className="mr-4 text-blue-500">
              Home
            </p>
          </Link>
          <Link href="/create-item">
            <p className="mr-4 text-blue-500">
              Create NFT
            </p>
          </Link>
          <Link href="/my-nfts">
            <p className="mr-4 text-blue-500">
              My NFTSs
            </p>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
