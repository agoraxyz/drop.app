import { Box, Flex, Img, SimpleGrid, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import DropProvider, { useDrop } from "components/[drop]/DropProvider"
import { DropWithRoles } from "contract_interactions/getDropRolesData"
import { motion } from "framer-motion"
import { useMemo } from "react"

type Props = {
  drop: DropWithRoles
}

const WrappedDropCard = ({ drop }: Props) => (
  <DropProvider drop={drop}>
    <DropCard />
  </DropProvider>
)

const DropCard = (): JSX.Element => {
  const { hasAccess, urlName, roles, dropName, communityImage } = useDrop()

  const imageGrid = useMemo((): Array<{ imageHash: string; roleName: string }> => {
    const roleValues = Object.values(roles || {})
    if (!roles || roleValues.length === 0) return []

    const uniqueImageHashes = [
      ...new Set(roleValues.map((role) => role.image.split("/").pop())),
    ]

    return uniqueImageHashes.map((imageHash) => ({
      imageHash,
      roleName:
        roleValues.find((role) => role.image.split("/").pop() === imageHash)?.name ??
        "",
    }))
  }, [roles])

  const imageGridColumns = useMemo(
    () =>
      imageGrid.length <= 3
        ? imageGrid.length
        : Math.floor(Math.min(6, imageGrid.length) / 2),
    [imageGrid]
  )

  if (!hasAccess || Object.keys(roles ?? {}).length <= 0) return null

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Link
        href={`/${urlName}`}
        borderRadius="2xl"
        w="full"
        _hover={{ textDecor: "none" }}
      >
        <Card role="group" w="full" h="full" bg="white" justifyContent="center">
          <Flex
            position="relative"
            alignItems="center"
            justifyContent="center"
            height={28}
            bgColor="gray.300"
            overflow="hidden"
          >
            <SimpleGrid
              position="absolute"
              top={0}
              left={0}
              width="full"
              gridTemplateColumns={`repeat(${imageGridColumns}, 1fr)`}
              gap={0}
            >
              {imageGrid.map((role, i) => (
                <Flex key={i} width="full" height={imageGrid.length <= 3 ? 28 : 14}>
                  <Img
                    src={`https://ipfs.fleek.co/ipfs/${role.imageHash}`}
                    alt={`Image of ${role.roleName} role`}
                    width="full"
                    height="full"
                    objectFit="cover"
                  />
                </Flex>
              ))}
            </SimpleGrid>
          </Flex>
          <SimpleGrid
            position="relative"
            mt={-16}
            px={{ base: 5, sm: 6 }}
            py="7"
            gridTemplateColumns="5rem 1fr"
            gap={4}
          >
            <Box
              boxSize={20}
              bgColor="gray.300"
              rounded="full"
              borderWidth={4}
              borderColor="white"
              overflow="hidden"
            >
              <Img
                src={communityImage}
                objectFit="cover"
                width="full"
                height="full"
              />
            </Box>
            <Text
              as="span"
              mt={11}
              fontFamily="display"
              fontWeight="bold"
              fontSize="xl"
              maxW="full"
              isTruncated
            >
              {dropName}
            </Text>

            {/* <GridItem colSpan={2}>
              <Wrap>
                <Tag>Sample tag</Tag>
              </Wrap>
            </GridItem> */}
          </SimpleGrid>
        </Card>
      </Link>
    </motion.div>
  )
}

export default WrappedDropCard
