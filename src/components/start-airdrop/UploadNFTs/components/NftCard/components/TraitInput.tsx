import {
  Button,
  Divider,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react"
import { X } from "phosphor-react"
import { ReactElement } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  nftIndex: number
  traitIndex: number
  unselectTrait: () => void
}

const placeholders = [
  ["eg.: color", "eg.: red"],
  ["eg.: time", "eg.: season 1"],
]

const TraitInput = ({
  nftIndex,
  traitIndex,
  unselectTrait,
}: Props): ReactElement => {
  const { register } = useFormContext()
  const key = useWatch({ name: `nfts.${nftIndex}.traits.${traitIndex}.key` })

  return (
    <HStack>
      <HStack spacing={0}>
        <InputGroup size="sm">
          <Input
            borderRightWidth={0}
            borderRightRadius={0}
            placeholder={placeholders[traitIndex]?.[0] ?? ""}
            {...register(`nfts.${nftIndex}.traits.${traitIndex}.key`)}
          />

          <Divider orientation="vertical" />

          <Input
            borderLeftWidth={0}
            borderLeftRadius={0}
            placeholder={placeholders[traitIndex]?.[1] ?? ""}
            {...register(`nfts.${nftIndex}.traits.${traitIndex}.value`)}
          />
          {key?.length <= 0 && (
            <InputRightAddon p="0" overflow="hidden">
              <Button
                onClick={unselectTrait}
                size="sm"
                variant="ghost"
                borderRadius="0"
                px="2"
                aria-label="Remove property"
                _hover={{ bg: "blackAlpha.50" }}
              >
                <X />
              </Button>
            </InputRightAddon>
          )}
        </InputGroup>
      </HStack>
    </HStack>
  )
}

export default TraitInput
