
const Config = {
  name: "PFP",
  address: "0x54e94F18Ddd14946d071EC5AF77183971549A819",
  chainId: 1
}
/*
const Config = {
  name: "NAME",
  address: "0x701facad49e0349ad5b782a2a785db705fc265e4",
  chainId: 4
}
*/
class Token {
  constructor(el, contract, items) {
    this.el = el
    this.contract = contract
    this.items = items.reverse()
  }
  async render() {
    this.el.innerHTML = this.items.map((item) => {
      return `<a data-tokenid='${item}' class='item'><img></a>`
    }).join("")
    this.el.querySelectorAll(".item").forEach((el) => {
      let tokenId = el.getAttribute("data-tokenid")
      this.draw(el, tokenId)
    })
  }
  async draw(el, tokenId) {
    let tokenURI = await this.contract.methods.tokenURI(tokenId).call()
    //let meta = await fetch("https://ipfs.io/ipfs/" + tokenURI.replace("ipfs://", "")).then((r) => {
    let meta = await fetch("https://" + tokenURI.replace("ipfs://", "") + ".ipfs.dweb.link").then((r) => {
      return r.json()
    })
    el.querySelector("img").setAttribute("src", "https://" +  meta.image.replace("ipfs://", "") + ".ipfs.dweb.link")
    el.setAttribute("href", "https://twitter.com/" + meta.name.slice(1))
    el.setAttribute("target", "_blank")
  }
}
const init = async (web3) => {
  const f1 = new F1()
  try {
    await f1.init({ web3 })
    let collection = await f1.collection(Config)
    let tokenIds = await collection.contract.getPastEvents("Transfer", {
      fromBlock: 0,
      toBlock: "latest"
    }).then((items) => {
      return items.map((item) => {
        return item.returnValues.tokenId
      })
    })
    console.log(tokenIds)

    if (tokenIds && tokenIds.length > 0) {
      let token = new Token(
        document.querySelector(".container .items"),
        collection.contract,
        tokenIds
      )
      await token.render()
    } else {
      document.querySelector(".container .items").innerHTML = "You are not connected to Ethereum. Please connect your wallet."
    }
  } catch (e) {
    console.log(e)
    document.querySelector(".container .items .loading").innerHTML = "You are not connected to Ethereum.<br><br>Please connect your wallet."
  }
}

document.addEventListener("DOMContentLoaded", async () => {

  let web3
  if (window.ethereum) {
    web3 = new Web3(window.ethereum)
    await init(web3)
  } else {
    document.querySelector(".items .loading").innerHTML = "Please connect to an Ethereum Wallet<br><br><button id='connect'>Connect</button>"
    document.querySelector("#connect").addEventListener("click", async (e) => {
      console.log("connect")
      const web3Modal = new Web3Modal.default({
        network: "mainnet", // optional
    //    cacheProvider: true, // optional
        providerOptions: {
          walletconnect: {
            display: {
              name: "Mobile"
            },
            package: WalletConnectProvider.default,
            options: {
              infuraId: "767750972a99441ea5d276ed16d7eef0",
            }
          }
        }
      });
      const clear = await web3Modal.clearCachedProvider();
      const provider = await web3Modal.connect();
      web3 = new Web3(provider);
      await init(web3)
    })
  }


  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault()
    e.stopPropagation()
    let username = document.querySelector("#username").value.trim()
    if (username.length === 0) {
      alert('please enter a twitter username');
      return;
    }
    document.querySelector("#generating").classList.remove("hidden")
    document.querySelector("input[type=submit]").classList.add("hidden")
    let addr = document.querySelector("#receiver").value.trim()
    console.log("addr", addr)
    if (/.*\.eth$/i.test(addr)) {
      console.log("yes")
      let address = await web3.eth.ens.getAddress(addr)
      console.log("address", address)
      //alert("ENS resolved to " + address)
      document.querySelector("#receiver").value = address
    }
    e.target.submit()

  })


  document.querySelector(".mint").addEventListener("click", async (e) => {
    document.querySelector("#type").value = ""
//    if (e.target.closest(".disabled")) return;
    e.target.closest(".row").querySelectorAll(".col").forEach((el) => {
      el.classList.remove("selected")
    })
    document.querySelector(".mint").classList.add("selected")
//    document.querySelector(".selector").classList.add("disabled")
    document.querySelector("form").classList.remove('hidden')
    // same
  })
  document.querySelector(".request").addEventListener("click", async (e) => {
//    if (e.target.closest(".disabled")) return;
    e.target.closest(".row").querySelectorAll(".col").forEach((el) => {
      el.classList.remove("selected")
    })
    document.querySelector(".request").classList.add("selected")
//    document.querySelector(".selector").classList.add("disabled")
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    let _res = await web3.eth.getAccounts()
    let account = _res[0]
    document.querySelector("form").classList.remove('hidden')
    document.querySelector("#type").value = "request"
    document.querySelector("#receiver").value = account
    // connect your address
  })
  document.querySelector(".gift").addEventListener("click", async (e) => {
    document.querySelector("#type").value = ""
//    if (e.target.closest(".disabled")) return;
    e.target.closest(".row").querySelectorAll(".col").forEach((el) => {
      el.classList.remove("selected")
    })
    document.querySelector(".gift").classList.add("selected")
//    document.querySelector(".selector").classList.add("disabled")
    document.querySelector("form").classList.remove('hidden')
    document.querySelector("#receiver").classList.remove("hidden")
    // enter address
  })

/*
  fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=ethereum`).then((r) => {
    return r.json()
  }).then((r) => {
    return r[0].current_price
  }).then((r) => {
    document.querySelector("#calc").innerHTML = "($" + Math.floor(100 * (r * 0.005))/100 + " + gas fee)"
  })
  */



})
