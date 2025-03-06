import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-md shadow-md">
      {ensAvatar && (
        <img
          alt="ENS Avatar"
          src={ensAvatar}
          className="w-16 h-16 rounded-full mb-4"
        />
      )}
      {address && (
        <div className="text-lg font-semibold text-gray-800 mb-4">
          {ensName ? `${ensName} (${address})` : address}
        </div>
      )}
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
      >
        Disconnect
      </button>
    </div>
  )
}
