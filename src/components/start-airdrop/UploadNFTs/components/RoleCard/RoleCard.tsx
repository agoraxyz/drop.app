import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Select } from "components/common/ChakraReactSelect"
import { NftsField } from "components/start-airdrop/SubmitButton/hooks/useStartAirdrop"
import Image from "next/image"
import { Plus, TrashSimple } from "phosphor-react"
import { ReactElement, useCallback, useMemo } from "react"
import {
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import useRoles from "../../hooks/useRoles"
import TraitInput from "./components/TraitInput"

type Props = {
  nftIndex: number
  removeNft: () => void
}

const RoleCard = ({ nftIndex, removeNft }: Props): ReactElement => {
  const { register, setValue } = useFormContext()
  const nfts = useWatch({ name: "nfts" })
  const nft = useWatch({ name: `nfts.${nftIndex}` })
  const { errors } = useFormState()
  const serverId = useWatch({ name: "serverId" })
  const roles = useRoles(serverId)

  const {
    fields: traitFields,
    append,
    remove,
  } = useFieldArray({
    name: `nfts.${nftIndex}.traits`,
  })

  const pickedRoles = useMemo(
    () =>
      Object.values(nfts as NftsField).reduce(
        (acc, curr) => [...acc, ...(curr.roles ?? [])],
        []
      ),
    [nfts]
  )

  const filteredRoleEntries = useMemo(
    () => Object.entries(roles ?? {}).filter(([id]) => !pickedRoles.includes(id)),
    [pickedRoles, roles]
  )

  const handleSelectChange = useCallback(
    (items) => {
      setValue(
        `nfts.${nftIndex}.roles`,
        items.map(({ value }) => value)
      )
    },
    [setValue, nftIndex]
  )

  const addTrait = useCallback(
    () =>
      append({
        key: "",
        value: "",
      }),
    [append]
  )

  return (
    <VStack
      backgroundColor="primary.200"
      borderRadius="3xl"
      overflow="hidden"
      spacing={0}
    >
      <Box
        height={200}
        width="full"
        position="relative"
        overflow="hidden"
        minHeight="150"
      >
        <Image
          src={nft.preview}
          alt="Uploaded NFT image"
          layout="fill"
          objectFit="cover"
        />
      </Box>
      <Progress
        width="full"
        value={nft.progress * 100}
        colorScheme="yellow"
        size="xs"
        backgroundColor="transparent"
      />

      <VStack p={5}>
        <FormControl isInvalid={errors.nfts?.[nftIndex]?.name?.message?.length > 0}>
          <HStack>
            <Input
              placeholder="name"
              size="sm"
              {...register(`nfts.${nftIndex}.name`, {
                required: "Please give a name for this NFT",
              })}
            />
            <IconButton
              size="sm"
              variant="ghost"
              borderRadius="full"
              aria-label="Unselect nft"
              color="red.600"
              icon={<TrashSimple />}
              onClick={removeNft}
            />
          </HStack>
          {errors.nfts?.[nftIndex]?.name?.message?.length > 0 && (
            <FormErrorMessage>{errors.nfts[nftIndex].name.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Properties</FormLabel>

          <VStack>
            {traitFields.map((field, traitIndex) => (
              <TraitInput
                key={`${nftIndex}-${field.id}`}
                nftIndex={nftIndex}
                traitIndex={traitIndex}
                unselectTrait={() => remove(traitIndex)}
              />
            ))}

            <Button onClick={addTrait} width="full" size="sm" leftIcon={<Plus />}>
              <Text fontSize="xs">Add property</Text>
            </Button>
          </VStack>
        </FormControl>

        <Divider />

        {roles && (
          <FormControl>
            <FormLabel>Roles to drop to</FormLabel>

            <Select
              size="sm"
              placeholder="Select roles"
              isMulti
              onChange={handleSelectChange}
              options={filteredRoleEntries.map(([id, name]) => ({
                img: "",
                label: name,
                value: id,
              }))}
            />
          </FormControl>
        )}
      </VStack>
    </VStack>
  )
}

export default RoleCard