import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccount, WagmiProvider } from 'wagmi'
import { config } from '../wagmiConfig'
import TransfersList from './components/TransfersList'
import { Account } from './components/Account'
import { WalletOptions } from './components/WalletOptions'
// import { Profile } from './components/Profile'

const queryClient = new QueryClient()

function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* <Profile /> */}

      <div className="min-h-screen bg-gray-100 p-4 text-gray-900">
        <h1 className="text-2xl font-bold mb-4">ERC-20 Transfer Viewer</h1>
        <ConnectWallet />
        <TransfersList />
      </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App