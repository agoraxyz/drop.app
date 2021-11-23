const startAirdropSignature = (
  serverId: string,
  account: string,
  chainId: number,
  urlName: string,
  platform: string,
  roleIds: string[]
): Promise<string> =>
  fetch("/api/get-signature/start-airdrop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      serverId,
      address: account,
      chainId,
      url: urlName,
      platform,
      roleIds,
    }),
  }).then((response) =>
    response.json().then((body) => {
      if (response.ok) return body.signature
      throw new Error(JSON.stringify(body.errors))
    })
  )

export default startAirdropSignature
