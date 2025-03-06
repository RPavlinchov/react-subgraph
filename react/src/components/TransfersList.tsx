import { useState } from 'react';
import { gql, request } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

const walletQuery = gql`
  query Transfers($first: Int!, $skip: Int!, $wallet: String!) {
    transfers(
      first: $first,
      skip: $skip,
      where: { OR: [{ src: $wallet }, { dst: $wallet }] }
    ) {
      id
      src
      dst
      wad
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

const allQuery = gql`
  query AllTransfers($first: Int!, $skip: Int!) {
    transfers(first: $first, skip: $skip) {
      id
      src
      dst
      wad
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

const SUBGRAPH_URL =
  'https://api.studio.thegraph.com/query/106040/subgraph-sepolia/version/latest';

interface Transfer {
  id: string;
  src: string;
  dst: string;
  wad: string;
  blockTimestamp: string;
  transactionHash: string;
  blockNumber: string;
}

const PAGE_SIZE = 10;

export default function TransfersList() {
  const { address } = useAccount();
  const [page, setPage] = useState(0);

  const { data, status, isFetching } = useQuery<{ transfers: Transfer[] }>({
    queryKey: ['transfers', address || 'all', page],
    queryFn: async () => {
      const variables = {
        first: PAGE_SIZE,
        skip: page * PAGE_SIZE,
      };

      if (address) {
        try {
          return await request(SUBGRAPH_URL, walletQuery, {
            ...variables,
            wallet: address.toLowerCase(),
          });
        } catch (error) {
          console.error('Wallet query error, returning empty transfers:', error);
          return { transfers: [] };
        }
      } else {
        return await request(SUBGRAPH_URL, allQuery, variables);
      }
    },
  });

  return (
    <div className="mt-4">
      {(status === 'pending' || isFetching) && (
        <div className="text-center">Loading...</div>
      )}

      {status === 'error' && (
        <div className="text-center text-red-500">
          Error occurred querying the Subgraph
        </div>
      )}
      
      {data && data.transfers.length === 0 && (
        <p className="text-center">No transfers found.</p>
      )}

      <ul>
        {data?.transfers.map((tx) => (
          <li key={tx.id} className="mb-2 p-2 border-b border-gray-300">
            <div>
              <span className="font-semibold">From:</span> {tx.src}
            </div>
            <div>
              <span className="font-semibold">To:</span> {tx.dst}
            </div>
            <div>
              <span className="font-semibold">Value:</span> {tx.wad}
            </div>
            <div className="text-sm text-gray-600">
              TxHash: {tx.transactionHash} – Block Time:{' '}
              {new Date(Number(tx.blockTimestamp) * 1000).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-2">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0 || isFetching}
        >
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={
            !data?.transfers || data.transfers.length < PAGE_SIZE || isFetching
          }
        >
          Next
        </button>
      </div>

    </div>
  );
}
