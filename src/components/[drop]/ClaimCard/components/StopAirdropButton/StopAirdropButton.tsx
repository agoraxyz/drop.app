import CtaButton from "components/common/CtaButton"
import useIsActive from "hooks/useIsActive"
import { ReactElement, useMemo } from "react"
import useContractId from "./hooks/useContractId"
import useStopAirdrop from "./hooks/useStopAirdrop"

type Props = {
  roleId: string
  serverId: string
  tokenAddress: string
  urlName: string
  platform: string
}

const StopAirdropButton = ({
  roleId,
  serverId,
  tokenAddress,
  urlName,
  platform,
}: Props): ReactElement => {
  const { isLoading, response, onSubmit } = useStopAirdrop()
  const successfullyStopped = !!response
  const { isActive } = useIsActive(platform, roleId, tokenAddress)
  const contractId = useContractId(tokenAddress)

  const loadingText = useMemo(() => {
    if (isLoading) return "Stopping airdrop"
    return "Loading"
  }, [isLoading])

  return (
    <CtaButton
      colorScheme="yellow"
      disabled={!isActive || successfullyStopped}
      flexShrink={0}
      size="sm"
      isLoading={isLoading || contractId === undefined}
      loadingText={loadingText}
      onClick={() =>
        onSubmit({ serverId, roleId, contractId, urlName, platform: "DISCORD" })
      }
    >
      {successfullyStopped ? "Success" : "Stop"}
    </CtaButton>
  )
}

export default StopAirdropButton