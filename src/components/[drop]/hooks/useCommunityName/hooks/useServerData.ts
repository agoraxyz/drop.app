import { Platform } from "contract_interactions/types"
import useSWR from "swr"

export type ServerData = {
  id: string
  name: string
  icon: string
}

const getServerData = (_: string, serverId: string): Promise<ServerData> =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/discord/server/${serverId}`).then(
    (response) =>
      response
        .json()
        .then((body) =>
          response.ok
            ? body
            : body.code === "BOT_IS_NOT_MEMBER"
            ? null
            : Promise.reject(body)
        )
  )

const useServerData = (
  serverId: string,
  fallbackName: string,
  platform: Platform
): ServerData => {
  const shouldFetch = serverId?.length > 0 && platform === "DISCORD"
  const { data } = useSWR(
    shouldFetch ? ["serverData", serverId] : null,
    getServerData,
    {
      fallbackData: {
        name: fallbackName,
        id: serverId,
        icon: "",
      },
      revalidateOnMount: true,
    }
  )

  return data
}

export { getServerData }
export default useServerData
