# 在truffle中执行脚本

exec  seeds.js

保存如下内容到文件seeds.js

```js
EcommerceStore = artifacts.require("./EcommerceStore.sol");

module.exports = function(callback) {
 //Math.round() 函数返回一个数字四舍五入后最接近的整数。... x = Math.round(20.49); //20
  current_time = Math.round(new Date() / 1000);
    
  amt_1 = web3.toWei(1, 'ether');
    
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('天梭男111', '手表', 'QmReMAp8UXR5r4Rgi35Ade9uK2D3v3M1LEcHMjfBYXYZ91', 'QmbWwss8TGmLbE3NZawbzRqPst15d7FEUSCDfN6stkgQg1', current_time, current_time + 70, 2*amt_1, 0).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('天梭男222', '手表', 'QmdHS2pDnQwqDMtvXEzZc77uW7Fm3hWkHTcVPNs2YbGoun', 'QmbWwss8TGmLbE3NZawbzRqPst15d7FEUSCDfN6stkgQg1', current_time, current_time + 10000, 3*amt_1, 1).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('天梭女333', '手表', 'QmVp1Lx8raRcDkr2VCzct8ujXgfNgZHber1FcFZjwfFxXH', 'QmbWwss8TGmLbE3NZawbzRqPst15d7FEUSCDfN6stkgQg1', current_time, current_time + 1000, amt_1, 0).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('天梭男444', '手表', 'QmQ2D3siQd1zcwwq1LjHv4xnF2ZA29Gvw41VgHShw8N2ES', 'QmbWwss8TGmLbE3NZawbzRqPst15d7FEUSCDfN6stkgQg1', current_time, current_time + 86400, 4*amt_1, 1).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.productIndex.call().then(function(f){console.log(f)})});
}
```



# 添加product.html

1. （与index.html平级目录）

2. 在webpack.config.js中添加product.html信息，注意，一定要重启程序`npm run dev`

   ```js
       plugins: [
           // Copy our app's index.html to the build folder.
           new CopyWebpackPlugin([
               {from: './app/index.html', to: 'index.html'},
               {from: './app/product.html', to: 'product.html'}
           ])
       ],
   ```


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>去中心化电商平台</title>
    <!-- <link rel="stylesheet" type='text/css' href="stylesheets/app.css"> -->
    <!-- <script type="text/javascript" src="javascripts/jquery-1.12.4.min.js"></script> -->
    <script type="text/javascript" src="app.js"></script>
    <base href="/">
</head>
<body>
<div class="top_header">
    <h2>电子商店</h2>
</div>

<div class="center_wrap" id="product-details">
    <div class="left_goods_show" id="product-image">
        <!-- <左侧显示图片> -->
    </div>
    <div id="product-name"></div>
    <div id="product-auction-end"></div>
    <div id="product-desc" class="right_goods_data">
        <h2>产品描述信息</h2>
        <!-- 右侧显示描述 -->
    </div>

    <div class="right_goods_data">
        <h3 id="product-name"><!-- 天梭TISSOT-杜鲁尔系列 T099.407.36.038.00 机械男表 --></h3>
        <h4>起拍价格:<span id="product-price"></span></h4>
        <h4>当前竞标人数:<span id="product-bids"></span></h4>
        <form class="form_pannel" id="bidding">
            <h5>你的竞标</h5>
            <div class="form_group">
                <label>竞标价格：</label>
                <input type="text" placeholder="竞标价格>起拍价格" name="bid-amount" id="bid-amount">
            </div>
            <div class="form_group">
                <label>迷惑价格（转账）：</label>
                <input type="text" placeholder="迷惑价格>竞标价格" name="bid-send-amount" id="bid-send-amount">
            </div>
            <div class="form_group">
                <label>密文：</label>
                <input type="text" placeholder="随机密文" name="secret-text" id="secret-text">
            </div>
            <input type="hidden" name="product-id" id="product-id"/>
            <input type="submit" value="提交竞标" class="input_sub">
        </form>
        <form class="form_pannel" id="revealing">
            <h5>揭标按钮</h5>
            <div class="form_group">
                <label>竞标价格:</label>
                <input type="text" placeholder="竞标价格>起拍价格" name="actual-amount" id="actual-amount">
            </div>
            <div class="form_group">
                <label>密文:</label>
                <input type="text" placeholder="随机密文" name="reveal-secret-text" id="reveal-secret-text">
            </div>
            <input type="hidden" name="product-id" id="product-id"/>
            <input type="submit" value="开始揭标" class="input_sub">
        </form>
        <form id="finalize-auction">
            <input type="hidden" name="product-id" id="product-id"/>
            <input type="submit" class="finalize" value="Finalize Auction">
        </form>
    </div>

</div>

<div class="center_wrap">
    <div class="left_con">
        <h3>产品类别</h3>
        <ul class="left_menu" id="categories">
            <!-- <li><a href="#">electricity</a></li>
            <li><a href="#">fashion</a></li>
            <li><a href="#">furniture</a></li>
            <li><a href="#">jewellery</a></li>
            <li><a href="#">precious metal</a></li> -->
        </ul>
        <a href="index.html" class="add_goods noradius">回到主页</a>
        <a href="list-item.html" class="add_goods">添加新商品</a>
    </div>
    <div class="right_con">
        <h4 class="list_title notop"><span>拍卖详情</span></h4>
        <div id="product-status">
        </div>
        <div id="escrow-info">
            <div id="buyer"></div>
            <div id="seller"></div>
            <div id="arbiter"></div>
            <div id="release-count"></div>
            <div id="refund-count"></div>
            <button id="release-funds" class="btn form-submit">向卖家付款</button>
            <button id="refund-funds" class="btn form-submit">向买家退款</button>
        </div>
    </div>
</div>

<div class="footer">
    Copyright &copy; Mybid.com 2018,All Rights Reserved.
</div>

<div class="alert" id="msg"></div>
</body>
</html>
```



# 展示产品详情

1. 根据浏览器地址栏，抓取产品id
2. 调用方法，获取这个产品的详情



## 1. 获取id

```js
function getProductId () {
  console.log('search :', window.location.search)  //  ?id=1&name='duke'

  let urlParams = new URLSearchParams(window.location.search)
 
  let id = urlParams.get('id')  //id : 1
  console.log('id :', id)
  return id
}
```

## 2. 获取产品详情

```js
function renderProductDetail (id) {
    ecommerceStoreInstance.getProductById(id).then(productInfo => {
        let {
            0: id, 1: name, 2: category, 3: imageLink, 4: descLink, 5: auctionStartTime,
            6: auctionEndTime, 7: startPrice, 8: status
        } = productInfo
        console.log('productInfo : ', productInfo)

        //TODO
    })
}
```



## 3.在start中调用

```js
        if ($('#product-details').length > 0) {
            // 注意不是个函数
            // ?id=2
            // 1. 通过url得到产品id
            let id = getProductId()

            // 2. 通过id得到产品详情 //call()方式
            renderProductDetail(id)
        } // product-details
```





# 展示详情到界面

1. 图片

2. 文本：指定哈希返回文本内容，需要使用ipfs-api包



​	

```js

        //显示图片
        $('#product-image').append(`<img src="http://localhost:8848/ipfs/${imageLink}" width="400px"/>`)

        //显示文本
        let content = ''
        // 先不用stream事件，直接使用字符串拼接
        ipfs.cat(descLink).then(file => {
            content += file.toString()
            $('#product-desc').append(`<div>${content}</div>`)
        })

```





# 展示名字，价格，竞拍时间



```js
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
```





格式化输出函数

```js
function displayPrice (price) {
    return window.web3.utils.fromWei(price.toString(), 'ether') + 'ETH'
}

function getCurrentTimeInSeconds () {
    return Math.round(new Date() / 1000)
}

function displayEndHours (seconds) {
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
```





# 处理竞标函数

## 1. 前提：

1. 合约里面bid原型如下：

   ```js
    function bid(uint _productId, uint _idealPrice, string _secret) public payable 
   ```

   此处传递密文和理想价格，我们先按照这种方式传递，不去修改合约，等后面全部调用完成之后，在对合约进行修改，即将理想价格与密文做哈希之后传递给合约（前台后台都要修改）


```js
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
            //
            web3.eth.getAccounts().then(accounts => {

                // console.log('accounts :', accounts)
                ecommerceStoreInstance.bid(parseInt(productId), bigNumberAmount.toNumber(), secretText, {
                    from: accounts[0],
                    value: bidSend

                }).then(result => {
                    ecommerceStoreInstance.testHash(bigNumberAmount.toNumber(), secretText).then(r => {
                        // ecommerceStoreInstance.testHash(bidAmount, secretText).then(r => {
                        console.log('hash1 :', r)
                    })
                    // console.log('bid result :', result)
                    // location.reload(true)

                }).catch(e => {
                    console.log('bid err :', e)

                })
            })

            event.preventDefault()
        }) //bidding

```







# 揭标流程

```js
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
```

# 仲裁函数

```js
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
```



# 在renderProductDetail中补充页面

主要是使用产品状态控制显示

1. 在open状态时分为：竞标揭标，仲裁，分别通过时间来控制
2. 在sold状态时，展示第三方合约详情
3. 在unsold时，直接显示拍卖结束

```js
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
      } else if (currentTime < parseInt(auctionEndTime) + 3600) {
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
          $('#release-count').html(`<p>商品成交，已付款给卖家, 成交价：${web3.fromWei(finalPrice.toString(), 'ether')} ETH`)
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
```

​	

​	

​	



# 投票函数

```js
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


```



# 修改竞标函数，调整代码，传入哈希

```js
web3.utils.soliditySha3()
```

合约调整

```js
    function bid(uint _productId, bytes32 _bytesHash) public payable {

        // bytes memory bytesInfo = abi.encodePacked(_idealPrice, _secret);
        // bytes32 bytesHash = keccak256(bytesInfo);

        address owner = productIdToOwner[_productId];

        //注意，一定是storage类型，否则无法改变sotres内的产品信息
        Product storage product = stores[owner][_productId];

        //限定竞标价格不小于起拍价格
        require(msg.value >= product.startPrice);

        product.totalBids++;
        Bid memory bidLocal = Bid(_productId, msg.value, false, msg.sender);
        product.bids[msg.sender][_bytesHash] = bidLocal;
    }
```



前端调整：

```js
                ecommerceStoreInstance.bid(parseInt(productId), bytesHash, {
                    from: accounts[0],
                    value: bidSend
                })
```



# 解析form 序列化之后的数据

```js
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
            //saveProduct(reader, decodeParas)
            event.preventDefault()
        })
```



图示：

![image-20181201151127922](https://ws3.sinaimg.cn/large/006tNbRwgy1fxr9jn1rqtj317w0jmnbx.jpg)





# 添加商品函数



```js
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
```

saveImageToIpfs

```js

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
```

saveDescInfoToIpfs

```js
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

```





saveProductToBlockChain

```js
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
```

