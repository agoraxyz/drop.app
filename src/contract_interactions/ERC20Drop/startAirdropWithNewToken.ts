import { TransactionResponse } from "@ethersproject/abstract-provider"
import { BigNumber } from "@ethersproject/bignumber"
import { JsonRpcSigner, Provider } from "@ethersproject/providers"
import { getAirdropContract } from "contracts"

const startAirdropWithNewToken = (
  chainId: number,
  signer: JsonRpcSigner,
  signature: string,
  urlName: string,
  platform: string,
  dropName: string,
  serverId: string,
  roleIds: string[],
  channelId: string,
  tokenName: string,
  tokenSymbol: string,
  startingBalance: BigNumber,
  rewards: BigNumber[],
  provider?: Provider
): Promise<TransactionResponse> =>
  getAirdropContract(chainId, "ERC20", provider)
    .connect(signer)
    .newAirdropFromNewToken(
      signature,
      urlName,
      dropName,
      platform,
      serverId,
      roleIds,
      channelId,
      tokenName,
      tokenSymbol,
      startingBalance,
      rewards
    )

export default startAirdropWithNewToken
