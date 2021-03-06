import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import startAirdrop from "contract_interactions/startAirdrop"
import { Platform } from "contract_interactions/types"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"

export type NftField = {
  file: File
  traits: Array<{
    key: string
    value: string
  }>
  name: string
  roles: string[]
  hash: string
  progress: number
  preview: string
}

export type StartAirdropData = {
  urlName: string
  channel: string
  assetType: "NFT" | "TOKEN" | "ERC1155"
  assetData: {
    NFT: {
      name: string
      symbol: string
    }
  }
  inviteLink: string
  serverId: string
  nfts: NftField[]
  platform: Platform
  description: string
}

const useStartAirdrop = () => {
  const { chainId, account, library } = useWeb3React<Web3Provider>()
  const router = useRouter()
  const toast = useToast()

  const fetch = async (data: StartAirdropData) => {
    console.log(data)

    return startAirdrop(chainId, account, library.getSigner(account), data, library)
  }

  const onSuccess = (urlName: string) => {
    toast({
      status: "success",
      title: "Airdrop started",
      description: "You will soon be redirected to the created drop's page",
    })
    router.push(`/${urlName}`)
  }

  const onError = (error) => {
    console.log(error)
    toast({
      status: "error",
      title: "Start failed",
      description:
        error.message ||
        "Failed to start airdrop, please double check your gas prices and try again",
    })
  }

  return useSubmit<StartAirdropData, string>(fetch, { onSuccess, onError })
}

export default useStartAirdrop
