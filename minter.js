const f0 = new F0()
const { key, address } = f0.parseURL(location.href)
const template = Handlebars.compile(document.querySelector("#template").innerHTML);
const mintTemplate = Handlebars.compile(document.querySelector("#mint-template").innerHTML);
document.addEventListener("DOMContentLoaded", async () => {
  await window.ethereum.send('eth_requestAccounts');
  let c = await fetch("box.json").then((r) => {
    return r.json()
  })
  try {
    await f0.init({
      web3: new Web3(window.ethereum),
      contract: address,
      network: c.network
    })
    let invite = await f0.invite(key)
    let placeholder = await f0.placeholder()
    const name = await f0.name()
    const symbol = await f0.symbol()
    const nextId = await f0.nextId()
    const config = await f0.config()
    let items = []
    for(let i=1; i<=invite.condition.converted.limit; i++) {
      items.push(i)
    }
    document.querySelector(".box").innerHTML = template({
      image: placeholder.converted.image,
      title: `${name} (${symbol})`,
      items: items.map((item) => { return { count: item } }),
      max: invite.condition.converted.limit,
      price: `${invite.condition.converted.eth} ETH`,
      current: nextId,
      supply: config.converted.supply,
      account: f0.account,
      key: key,
    })
    NiceSelect.bind(document.querySelector("select"))
    document.querySelector("#mint").addEventListener("click", async (e) => {
      document.querySelector(".minter").classList.add("hidden")
      document.querySelector(".loading").classList.remove("hidden")
      let count = parseInt(document.querySelector("#count").value)
      if (count === 0) {
        alert("Please enter a number greater than 0")
      } else {
        let tokens = await f0.mint(key, count)
        document.querySelector(".loading").classList.add("hidden")
        document.querySelector(".console").innerHTML = mintTemplate({
          items: tokens.map((token) => {
            return {
              opensea: token.links.opensea,
              rarible: token.links.rarible,
              tokenId: token.tokenId
            }
          })
        })
      }
    })
  } catch (e) {
    document.querySelector(".box").innerHTML = `<h1>${e.message.toLowerCase()}</h1>`
  }
})
