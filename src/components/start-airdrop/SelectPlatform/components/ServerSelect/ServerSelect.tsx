import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  Select,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { Check } from "phosphor-react"
import { ReactElement, useCallback, useEffect, useMemo, useState } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import useChannels from "./hooks/useChannels"

const INVITE_REGEX = /^https:\/\/discord.gg\/([a-z0-9]+)$/i

const ServerSelect = (): ReactElement => {
  const router = useRouter()
  const { isReady } = useRouter()
  const { register, setValue } = useFormContext()
  const platform = useWatch({ name: "platform" })

  const inviteLink = useWatch<{ inviteLink: string }>({
    name: "inviteLink",
  })
  const { errors } = useFormState()

  const [{ serverId, channels }, loading] = useChannels(
    errors.inviteLink?.message?.length > 0 ? "" : inviteLink
  )

  useEffect(() => {
    if (serverId?.length > 0) setValue("serverId", serverId)
  }, [setValue, serverId])

  const isBotAdded = useMemo(
    () => Object.keys(channels ?? {})?.length > 0 && serverId?.length > 0,
    [channels, serverId]
  )

  const shouldAddBot = useMemo(
    () => channels === null && serverId === null,
    [channels, serverId]
  )

  const validateInviteLink = useCallback(
    async (value) => {
      if (platform !== "DISCORD") return true
      if (!INVITE_REGEX.test(value)) return "Not a valid invite"
      const inviteCode = value.match(INVITE_REGEX)[1]
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/discord/verify-invite/${inviteCode}`
      )
      if (!response.ok) return "Not a valid invite"
      return true
    },
    [platform]
  )

  const [fromQuery, setFromQuery] = useState<string>("")
  useEffect(() => {
    if (router.isReady && router.query.inviteCode)
      setFromQuery(router.query.inviteCode as string)
  }, [setFromQuery, router])
  useEffect(() => {
    setValue("platform", "DISCORD")
    setValue("inviteLink", `https://discord.gg/${fromQuery}`)
  }, [setValue, fromQuery])

  return (
    <Grid gridTemplateColumns="repeat(3, 1fr)" gap={5} p={5}>
      <FormControl isInvalid={errors.inviteLink}>
        <FormLabel>1. Paste invite link</FormLabel>
        <Input
          {...register("inviteLink", {
            disabled: !isReady,
            required: platform === "DISCORD" && "This field is required.",
            validate: validateInviteLink,
          })}
        />
        <FormErrorMessage>
          {errors.inviteLink?.message ?? "Invalid invite"}
        </FormErrorMessage>
      </FormControl>

      <FormControl isDisabled={!isBotAdded && !shouldAddBot}>
        <FormLabel>2. Add bot to server</FormLabel>
        {!isBotAdded ? (
          <Button
            colorScheme="darkerGray"
            h="10"
            w="full"
            {...(shouldAddBot
              ? {
                  as: "a",
                  href: `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`,
                  target: "_blank",
                }
              : {})}
            isLoading={loading}
            disabled={!shouldAddBot}
          >
            Add bot
          </Button>
        ) : (
          <Button h="10" w="full" disabled rightIcon={<Check />}>
            Bot added
          </Button>
        )}
      </FormControl>

      <FormControl isDisabled={!isBotAdded} isInvalid={errors.channel}>
        <FormLabel>3. Select channel</FormLabel>
        <Select
          {...register("channel", {
            required: platform === "DISCORD" && "Please select a channel",
          })}
        >
          <option value="">Select a channel</option>
          {Object.entries(channels ?? {}).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>

        <FormErrorMessage>{errors?.channel?.message}</FormErrorMessage>
      </FormControl>
    </Grid>
  )
}

export default ServerSelect
