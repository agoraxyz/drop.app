import { Chains } from "connectors"
import airdropContracts from "contracts"
import TransactionError from "utils/errors/TransactionError"

const claims = (
  chainId: number,
  userIdHash: string,
  serverId: string,
  roleId: string,
  tokenAddress: string
): Promise<{ claimed: boolean; approved: boolean }> =>
  airdropContracts[Chains[chainId]]
    .claims(userIdHash, serverId, roleId, tokenAddress)
    .then(([claimed, approved]) => ({ claimed, approved }))
    .catch(() => {
      throw new TransactionError("Failed to read claimed NFTs")
    })

export default claims
