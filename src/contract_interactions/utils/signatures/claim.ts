const claimSignature = (
  chainId: number,
  serverId: string,
  platform: string,
  address: string,
  hashedUserId: string,
  roleId: string,
  tokenAddress: string
): Promise<string> =>
  fetch("/api/get-signature/claim", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chainId,
      serverId,
      platform,
      address,
      hashedUserId,
      roleId,
      tokenAddress,
    }),
  }).then((response) =>
    response.json().then((body) => {
      if (response.ok) return body.signature
      throw new Error(JSON.stringify(body.errors))
    })
  )

export default claimSignature
