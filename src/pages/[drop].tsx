import { Alert, AlertIcon, Circle, Grid, HStack, Text } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
import AuthenticateButton from "components/start-airdrop/SubmitButton/components/AuthenticateButton"
import useRoles from "components/start-airdrop/UploadNFTs/hooks/useRoles"
import ClaimCard from "components/[drop]/ClaimCard"
import DropProvider from "components/[drop]/DropProvider"
import useCommunityName from "components/[drop]/hooks/useCommunityName/useCommunityName"
import useDropIcon from "components/[drop]/hooks/useDropIcon/useDropIcon"
import { Chains, RPC } from "connectors"
import getDropRolesData, {
  DropWithRoles,
} from "contract_interactions/getDropRolesData"
import getDropUrlNames from "contract_interactions/getDropUrlNames"
import useHasAccess from "hooks/useHasAccess"
import useIsAuthenticated from "hooks/useIsAuthenticated"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import { ReactElement, useMemo } from "react"
import shortenHex from "utils/shortenHex"

type Props = {
  drop: DropWithRoles
}

const DropPage = ({ drop }: Props): ReactElement => {
  const {
    roles,
    tokenAddress,
    dropName,
    serverId,
    platform,
    communityImage,
    communityName: initialCommunityName,
    hasAccess: initialHasAccess,
  } = drop

  const rolesForEmptyCheckFallback = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(roles).map(([roleId, roleData]) => [roleId, roleData.name])
      ),
    [roles]
  )

  const rolesForEmptyCheck = useRoles(
    serverId,
    platform,
    true,
    rolesForEmptyCheckFallback
  )

  const hasAccess = useHasAccess(serverId, platform, initialHasAccess)

  const communityName = useCommunityName(serverId, initialCommunityName, platform)
  const isAuthenticated = useIsAuthenticated(platform)
  const icon = useDropIcon(serverId, communityImage, platform)

  // Not using useCallback here, since there is a possible 'null' return value, indicating no alert message
  const dropAlert = useMemo(() => {
    if (!hasAccess)
      return `It's no longer possible to claim in this drop, since the bot has been kicked from the ${
        platform === "DISCORD" ? "server" : "group"
      }`
    if (platform === "DISCORD" && Object.keys(rolesForEmptyCheck ?? {}).length <= 0)
      return "It's no longer possible to claim in this drop, since the roles associated with this drop have been deleted on this server"
    return null
  }, [hasAccess, platform, rolesForEmptyCheck])

  return (
    <Layout title={dropName}>
      <DropProvider drop={drop}>
        <HStack justifyContent="space-between">
          <HStack spacing={20}>
            <HStack spacing={5}>
              {icon?.length > 0 && (
                <Circle overflow="hidden">
                  <Image
                    src={icon}
                    alt={`Icon of ${communityName} sever`}
                    width={40}
                    height={40}
                  />
                </Circle>
              )}
              <Text>{communityName}</Text>
            </HStack>

            <HStack>
              <Text>Contract address:</Text>
              <Link
                target="_blank"
                colorScheme="yellow"
                href={`${
                  RPC[process.env.NEXT_PUBLIC_CHAIN].blockExplorerUrls[0]
                }address/${tokenAddress}`}
              >
                {shortenHex(tokenAddress)}
              </Link>
            </HStack>
          </HStack>

          {isAuthenticated === false && <AuthenticateButton size="sm" />}
        </HStack>

        {dropAlert === null ? (
          <Grid mt={20} gridTemplateColumns="repeat(3, 1fr)" gap={5}>
            {Object.entries(roles).map(([roleId, role]) => (
              <ClaimCard roleId={roleId} role={role} key={roleId} />
            ))}
          </Grid>
        ) : (
          <Alert mt={10} status="info" alignItems="center">
            <AlertIcon />
            {dropAlert}
          </Alert>
        )}
      </DropProvider>
    </Layout>
  )
}

const getStaticProps: GetStaticProps = async ({ params }) => {
  const { drop: urlName } = params

  try {
    const drop = await getDropRolesData(
      Chains[process.env.NEXT_PUBLIC_CHAIN],
      urlName as string
    )

    if (!drop) throw Error()

    return {
      props: { drop },
      revalidate: 10,
    }
  } catch {
    return {
      notFound: true,
      revalidate: 10,
    }
  }
}

const getStaticPaths: GetStaticPaths = async () => {
  const urlNames = await getDropUrlNames(Chains[process.env.NEXT_PUBLIC_CHAIN])

  const paths = urlNames
    .filter((urlName) => urlName.length > 0)
    .map((drop) => ({
      params: { drop },
    }))

  return {
    paths,
    fallback: "blocking",
  }
}

export { getStaticProps, getStaticPaths }
export default DropPage
