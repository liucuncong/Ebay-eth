import Web3 from "web3";
import './styles/index.css'
import EcommerceStoreArtifact from "../../build/contracts/EcommerceStore.json";
import { default as contract } from 'truffle-contract';
import $ from 'jquery';
import ipfsAPI from 'ipfs-api';

const ipfs = ipfsAPI({
  ip: 'localhost',
  port: '5001',
  protocol: 'http'
})


const ecommerceStoreContract = contract(EcommerceStoreArtifact)
let ecommerceStoreInstance

const App = {

  start: async function () {
    // Bootstrap the MetaCoin abstraction for Use.
    console.log('init !!!!!')

    ecommerceStoreContract.setProvider(window.web3.currentProvider)
    ecommerceStoreInstance = await ecommerceStoreContract.deployed()

    let accounts = await web3.eth.getAccounts()
    console.log('accounts[0] :', accounts[0])


    // let res = await ecommerceStoreInstance.addProductToStore(
    //   '衣服', '服装', 'imagelink111', 'descLink222', 2018, 2019, 10, 0, {
    //     from: accounts[0]
    //   })


    // console.log('res :', res)

    // let res2 = await ecommerceStoreInstance.getProductById(1)

    // console.log('res2 product info :', res2)

    renderProducts()

    if ($('#product-details').length > 0) {
      // 注意不是个函数
      // ?id=2
      // 1. 通过url得到产品id
      let id = getProductId()

      // 2. 通过id得到产品详情 //call()方式
      renderProductDetail(id)
    } // product-details

    $('#bidding').submit(function (event) {
      // 1. 理想出价, 转成bignumber处理
      let bidAmount = $('#bid-amount').val()
      // 2. 迷惑价格
      let bidSend = $('#bid-send-amount').val()
      // 3. 秘密字符串
      let secretText = $('#secret-text').val()
      // let secretText = 'xxx'
      // 4. 产品id
      let productId = $('#product-id').val()

      console.log('in bid, productId:', productId)

      let bigNumberAmount = web3.utils.toBN(bidAmount)
      console.log('bigNumberAmount:', bigNumberAmount.toNumber())

      console.log('bidAcmount byte :', typeof bidAmount) //string

      let bytesHash = web3.utils.soliditySha3(bidAmount, secretText)
      console.log('hash str:', bytesHash)

      let bytesHash1 = web3.utils.soliditySha3(bigNumberAmount.toNumber(), secretText)
      console.log('hash1 num:', bytesHash1)
      //
      web3.eth.getAccounts().then(accounts => {

        // console.log('accounts :', accounts)
        // ecommerceStoreInstance.bid(parseInt(productId), bigNumberAmount.toNumber(), secretText, {
        ecommerceStoreInstance.bid(parseInt(productId), bytesHash, {
          from: accounts[0],
          value: bidSend

        }).then(result => {
          ecommerceStoreInstance.testHash(bigNumberAmount.toNumber(), secretText).then(r => {
            // ecommerceStoreInstance.testHash(bidAmount, secretText).then(r => {
            console.log('hash1 :', r)
          })
          console.log('bid result :', result)
          location.reload(true)

        }).catch(e => {
          console.log('bid err :', e)

        })
      })

      event.preventDefault()
    }) //bidding


    $('#revealing').submit(function (event) {

      let actualAmount = $('#actual-amount').val()
      let secretText = $('#reveal-secret-text').val()
      let productId = $('#product-id').val()

      let bigNumberAmount = web3.utils.toBN(actualAmount)
      console.log('bigNumberAmount:', bigNumberAmount.toNumber())

      ecommerceStoreInstance.testHash(bigNumberAmount.toNumber(), secretText).then(res => {
        console.log('testHash : ', res)
      })

      web3.eth.getAccounts().then(accounts => {

        ecommerceStoreInstance.revealBid(parseInt(productId), bigNumberAmount.toNumber(), secretText, {
          from: accounts[0]

        }).then(result => {

          console.log('revealBid successfully : ', result)
          location.reload(true)

        }).catch(e => {
          console.log('revealBid failed : ', e)
        })
      })
      // 防止form跳转
      event.preventDefault()
    }) // revealing

    $('#finalize-auction').submit(function (event) {

      let productId = $('#product-id').val()

      web3.eth.getAccounts().then(accounts => {

        ecommerceStoreInstance.finalaizeAuction(parseInt(productId), {
          from: accounts[0]

        }).then(result => {

          alert('finlize-auction successfully!')
          location.reload(true)
          console.log('finlize-auction successfully : ', result)

        }).catch(e => {
          alert('finlize-auction failed!')
          console.log('finalize-auction failed : ', e)
        })
      })
      event.preventDefault()
    }) // finalize-auction

    // 	  1. 向卖家付款：
    //    1. 获取产品id
    //    2. 调用giveToSeller方法
    $('#release-funds').click(function (event) {
      let id = getProductId()

      web3.eth.getAccounts().then(accounts => {

        ecommerceStoreInstance.giveToSeller(id, {
          from: accounts[0]

        }).then(result => {
          alert('向卖家投票成功!')
          location.reload(true)

        }).catch(e => {
          alert('向卖家投票失败!')
        })

      })
      event.preventDefault()
    }) // #release-funds

    // 2. 向买家退款：
    //    1. 获取产品id
    //    2. 调用giveToBuyer方法
    $('#refund-funds').click(function (event) {
      let id = getProductId()

      web3.eth.getAccounts().then(accounts => {

        ecommerceStoreInstance.giveToBuyer(id, {
          from: accounts[0]
        }).then(result => {
          alert('向买家投票成功!')
          location.reload(true)

        }).catch(e => {
          alert('向买家投票失败!')

        })
      })

      event.preventDefault()
    }) // refund-funds

    $('#add-item-to-store').submit(function (event) {
      // 获取到表单的字符串数据
      let reqInfo = $('#add-item-to-store').serialize()
      console.log('reqInfo: ', reqInfo)

      // 将数据转换成json格式
      let parameters = JSON.parse(`{"${reqInfo.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`)
      console.log('json parameters info : ', parameters)
      let decodeParas = {}
      // 对数据进行解码，编程非url类型的, 最后放在一个字典中
      Object.keys(parameters).forEach(key => {
        decodeParas[key] = decodeURIComponent(decodeURI(parameters[key]))
      })

      console.log('decode params :', decodeParas)
      saveProduct(reader, decodeParas) //添加商品函数，指定图片信息和文本信息
      event.preventDefault()
    })

    let reader
    $('#product-image').change(function (event) {
      const file = event.target.files[0]
      reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
    })

  } //start

} //App

async function saveProduct(reader, parameters) {
  // 将图片与数据添加到ipfs
  console.log('image info :', reader)
  let imageHash = await saveImageToIpfs(reader)
  console.log('ipfs imageHash : ', imageHash)
  let descHash = await saveDescInfoToIpfs(parameters['product-description'])
  console.log('ipfs descHash : ', descHash)
  // 将哈希等添加到区块链

  //parameters包含：名字，类别，价格等，图片哈希，文本哈希
  saveProductToBlockChain(parameters, imageHash, descHash)
}

function saveImageToIpfs(imageData) {
  return new Promise((resolve, reject) => {
      const buffer = Buffer.from(imageData.result)

      ipfs.add(buffer).then(response => {
          console.log('ipfs add response : ', response)
          resolve(response[0].hash)
      }).catch(e => {
          reject(e)
      })
  })
}

// 存储的数据是产品的描述信息，而不是所有的参数！
function saveDescInfoToIpfs(productDescInfo) {
  return new Promise((resolve, reject) => {
      // 注意编码格式为utf-8
      const buffer = Buffer.from(productDescInfo, 'utf-8')

      ipfs.add(buffer).then(response => {
          console.log('ipfs add desc response : ', response)
          // 注意是reponse[0].hash
          resolve(response[0].hash)
      }).catch(e => {
          reject(e)
      })
  })
}

function saveProductToBlockChain(parameters, imageHash, descHash) {

  let name = parameters['product-name']
  let category = parameters['product-category']
  let startPrice = parameters['product-price']
  let condition = parameters['product-condition']
  let startTime = parameters['product-auction-start']
  let duration = parameters['product-auction-end']
  console.log('startTime :', startTime)
  console.log('Date.parse(startTime) :', Date.parse(startTime))

  let startTimeInSeconds = Date.parse(startTime) / 1000
  let durationInSeconds = duration * 24 * 60 * 60
  let endTimeInSeconds = startTimeInSeconds + durationInSeconds
  // let priceInEther = web3.toWei(startPrice, 'ether')

  web3.eth.getAccounts().then(accounts => {

      ecommerceStoreInstance.addProductToStore(name, category, imageHash, descHash,
          startTimeInSeconds, endTimeInSeconds, startPrice, condition, {
              from: accounts[0]

          }).then(result => {
          console.log('addProductToStore result : ', result)

      }).catch(e => {
          console.log('addProductToStore failed:', e)
      })
  })
}



function renderProducts() {
  // 1. 获取所有的产品数量
  ecommerceStoreInstance.productIndex().then(productIndex => {
    // 注意！！
    console.log('productIndex:', productIndex)
    for (let i = 1; i <= productIndex; i++) {
      // 2. 获取每个产品的信息
      ecommerceStoreInstance.getProductById(i).then(productInfo => {
        let { 0: id, 1: name, 2: category, 3: imageLink, 4: descLink, 5: auctionStartTime, 6: auctionEndTime, 7: startPrice, 8: status } = productInfo
        // 3. 每个产品创建一个node，填充数据，
        // console.table(productInfo)
        let node = $('<div/>')
        // 图片显示,我的ipfs默认端口为8848，可以去home目录下.ipfs/config中修改
        node.append(`<img src="http://localhost:8848/ipfs/${imageLink}" width="150px"/>`)
        // 名字
        node.append(`<div>${name}</div>`)
        // 类别
        node.append(`<div>${category}</div>`)
        // 竞拍起始时间
        let startT = new Date(auctionStartTime * 1000)
        node.append(`<div>${startT}</div>`)
        // 竞拍结束时间
        let endT = new Date(auctionEndTime * 1000)
        node.append(`<div>${endT}</div>`)
        // 竞拍起始价格
        // 注意！！！
        // 旧版本：web3.fromWei
        // 新版本：web3.utils.fromWei(number [, unit])
        let price = window.web3.utils.fromWei(startPrice.toString(), 'ether')
        node.append(`<div>${price}</div>`)
        // 按钮detail
        node.append(`<a href="product.html?id=${id.c[0]}">Details</a>`)

        // 4.组合append到id="product-list中
        $('#product-list').append(node)
      })
    }
  })
}


function getProductId() {
  console.log('search :', window.location.search)  //  ?id=1&name='duke'

  let urlParams = new URLSearchParams(window.location.search)
  console.log('urlParams', urlParams)

  let id = urlParams.get('id')  //id : 1
  console.log('id :', id)
  return id
}

function renderProductDetail(id) {
  ecommerceStoreInstance.getProductById(id).then(productInfo => {
    let {
      0: id, 1: name, 2: category, 3: imageLink, 4: descLink, 5: auctionStartTime,
      6: auctionEndTime, 7: startPrice, 8: status
    } = productInfo
    console.log('productInfo : ', productInfo)
    //显示图片
    $('#product-image').append(`<img src="http://localhost:8848/ipfs/${imageLink}" width="400px"/>`)
    //显示文本
    let content = ''
    // 先不用stream事件，直接使用字符串拼接
    ipfs.cat(descLink).then(file => {
      content += file.toString()
      console.log('content', content)
      $('#product-desc').append(`<div>${content}</div>`)
    })

    // - 其他信息
    console.log('startPrice :', startPrice)
    console.log('name :', name)
    console.log('auctionEndTime :', auctionEndTime)

    // 1. 起始价格
    $('#product-price').text(displayPrice(startPrice))
    // 2. 竞拍倒计时（竞拍剩余时间，揭标剩余时间）
    $('#product-auction-end').text(displayEndHours(auctionEndTime))
    // 3. 产品的名称
    $('#product-name').text(name)
    // 4. 保存product-id到这个页面，后面的标签会使用到  duke
    $('#product-id').val(id)



    //++++++++++++++++++++++
    $('#bidding, #revealing, #finalize-auction, #escrow-info').hide()
    let currentTime = getCurrentTimeInSeconds()

    // 产品竞标情况status ： 0--> 进行中  1---> 卖掉  2---> 没卖掉
    // 从这里入手！！
    if (parseInt(status) === 0) {
      console.log('status === 0')
      // Open：还在竞标中，已经揭标
      // 1. 竞标阶段
      // 1. 只显示竞标的表单
      // 2. 揭标阶段
      // 1. 只显示揭标表单
      // 2. 隐藏竞标表单
      if (currentTime < parseInt(auctionEndTime)) {
        // 竞标阶段
        $('#bidding').show()
      } else if (currentTime < parseInt(auctionEndTime) + 36) {
        // 揭标阶段
        $('#revealing').show()
      } else {
        // 仲裁阶段
        $('#finalize-auction').show()
      }
    } else if (parseInt(status) === 1) {
      console.log('status === 1')
      // Sold：卖了，执行了finazlie
      //
      // 1. 执行finalize
      // 1. 只显示finalize按钮
      // 2. 隐藏竞标表单
      // 3. 隐藏揭标表单
      // 4. 显示当前中标的信息（第三方合约信息：买家，卖家，仲裁人，投票情况）
      $('#escrow-info').show()
      let finalPrice
      ecommerceStoreInstance.getHighestBidInfo.call(id).then(info => {
        const { 0: highestBidder, 1: highestBid, 2: secondBid } = info
        finalPrice = secondBid
        $('#product-status').html(`<p>产品状态：揭标已结束，最高价：${displayPrice(highestBid)}, 开始进入仲裁投票阶段!</p>`)
      })

      ecommerceStoreInstance.getEscrowInfo.call(id).then(escroInfo => {
        console.log('escroInfo:', escroInfo)
        // return (buyer, seller, arbiter, buyerVotesCount, sellerVotesCount);
        const { 0: buyer, 1: seller, 2: arbiter, 3: buyerVotesCount, 4: sellerVotesCount } = escroInfo
        $('#buyer').html(`<p>买家：${buyer}</p>`)
        $('#seller').html(`<p>卖家：${seller}</p>`)
        $('#arbiter').html(`<p>仲裁：${arbiter}</p>`)

        if (parseInt(buyerVotesCount) === 2) {
          $('#refund-count').html(`<p>商品未成交，已退款给买家!`)
          $('#product-status').html(`<p>产品状态：拍卖已结束!</p>`)
        } else if (parseInt(sellerVotesCount) === 2) {
          $('#release-count').html(`<p>商品成交，已付款给卖家, 成交价：${web3.utils.fromWei(finalPrice.toString(), 'ether')} ETH`)
          $('#product-status').html(`<p>产品状态：拍卖已结束</p>`)
        } else {
          $('#refund-count').html(`<p>买家获得: ${buyerVotesCount}/3 票`)
          $('#release-count').html(`<p>卖家获得: ${sellerVotesCount}/3 票`)
        }
      })
      //
    } else if (parseInt(status) === 2) {
      console.log('status === 2')
      // Unsold：没卖掉，自始至终没有竞标（或者是有人竞标但是没人揭标，竞标人损失钱，卖家也得不到）
      //
      // 1. 执行finalize发现没人竞标
      $('#product-status').html(`<p>产品状态：拍卖结束，未卖出</p>`)
    }

    //+++++++++++++++++++++++


  })
}


window.App = App

window.addEventListener("load", function () {
  if (typeof web3 !== 'undefined') {
    console.warn('Injected web3')
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn('local web3 found!')
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  }

  App.start();
});

function displayPrice(price) {
  return window.web3.utils.fromWei(price.toString(), 'ether') + 'ETH'
}

function getCurrentTimeInSeconds() {
  return Math.round(new Date() / 1000)
}

function displayEndHours(seconds) {
  let currentTime = getCurrentTimeInSeconds()
  let remainingSeconds = seconds - currentTime

  if (remainingSeconds <= 0) {
    return 'Auction has ended'
  }

  let days = Math.trunc(remainingSeconds / (24 * 60 * 60))

  remainingSeconds -= days * 24 * 60 * 60
  let hours = Math.trunc(remainingSeconds / (60 * 60))

  remainingSeconds -= hours * 60 * 60

  let minutes = Math.trunc(remainingSeconds / 60)

  if (days > 0) {
    return 'Auction ends in ' + days + ' days, ' + hours + ', hours, ' + minutes + ' minutes'
  } else if (hours > 0) {
    return 'Auction ends in ' + hours + ' hours, ' + minutes + ' minutes '
  } else if (minutes > 0) {
    return 'Auction ends in ' + minutes + ' minutes '
  } else {
    return 'Auction ends in ' + remainingSeconds + ' seconds'
  }
}