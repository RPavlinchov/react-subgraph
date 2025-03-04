import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../wagmiConfig'
import { Profile } from './components/Profile'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Profile />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App