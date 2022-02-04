document.addEventListener("DOMContentLoaded", async () => {
  const web3 = new Web3(window.ethereum)
  const f0 = new F0();
  await f0.init({
    web3: web3,
    contract: "0x51D636F0Aa2f514651b9382EA3ed9Ea014bbB942",
  })
  document.querySelector("#mint").addEventListener("click", async (e) => {
    document.querySelector("pre").innerHTML = "minting. please sign the transaction and wait..."
    // Mint 2 with public invite
    let tokens = await f0.mint(null, 1)
    document.querySelector("pre").innerHTML = JSON.stringify(tokens, null, 2)
  })
})