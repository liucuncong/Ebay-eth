# 清理工程，部署合约并测试

下载truffle内置工程，第一件事就是查看web3的版本

```js
import '../styles/app.css'
import {default as Web3} from 'web3'
import {default as contract} from 'truffle-contract'
import EcommerceStoreArtifact from '../../build/contracts/EcommerceStore.json'

const ecommerceStoreContract = contract(EcommerceStoreArtifact)
let ecommerceStoreInstance

const App = {
    start: async function () {
        // Bootstrap the MetaCoin abstraction for Use.
        console.log('init !!!!!')

        ecommerceStoreContract.setProvider(window.web3.currentProvider)

        ecommerceStoreInstance = await ecommerceStoreContract.deployed()

        let accounts = await web3.eth.getAccounts()

        let res = await ecommerceStoreInstance.addProductToStore(
            '衣服', '服装', 'imagelink111', 'descLink222', 2018, 2019, 10, 0, {
                from: accounts[0]
            })

        console.log('res :', res)

        res = await ecommerceStoreInstance.getProductById(1)
        console.log('res product info :', res)
    }
}

window.App = App

window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        console.warn('Injected web3')
        window.web3 = new Web3(web3.currentProvider)
    } else {
        console.warn('local web3 found!')
        window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
    }

    App.start()
})

```



index.html

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Decentralized Ecommerce Store</title>
    <script type="text/javascript" src="app.js"></script>
    <base href="/">
</head>
<body>
<div class="top_header">
    <h2>Ecommerce Store</h2>
</div>

<div class="center_wrap">
    <div class="left_con">
        <h3>Categories</h3>
        <ul class="left_menu" id="categories">
        </ul>
        <a href="list-item.html" class="add_goods">List Item</a>
    </div>
    <div class="right_con">
        <div class="breadcrumb">当前位置：首页>商品列表</div>
        <h4 class="list_title"><span>Products To Buy</span></h4>
        <ul class="goods_list" id="product-list">
        </ul>

        <h4 class="list_title"><span>Products in Reveal Stage</span></h4>
        <ul class="goods_list" id="product-reveal-list">
        </ul>

    </div>
</div>

<div class="footer">
    Copyright &copy; Mybid.com 2018,All Rights Reserved.
</div>
</body>
</html>


```



app.css

```js
body, ul, h1, h2, h3, h4, h5, textarea {
    margin: 0px;
    padding: 0px;
}

ul {
    list-style: none;
}

.top_header {
    border-top: 10px solid #28292e;
    background: #2d5883;
    height: 100px;
}

.top_header h2 {
    width: 1000px;
    line-height: 100px;
    color: #fff;
    margin: 0px auto;
    font-weight: normal;
    font-size: 36px;
    font-family: Arial;
    /* background:url(../images/banner_bg.jpg) right center no-repeat #2d5883; */
}

.center_wrap {
    width: 1000px;
    overflow: hidden;
    margin: 20px auto 0px;
}

.left_con {
    width: 220px;
    float: left;
}

.left_con h3 {
    line-height: 40px;
    color: #fff;
    text-align: center;
    background: #2d5883;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.left_menu li {
    width: 218px;
    line-height: 40px;
    border: 1px solid #ddd;
    margin-top: 10px;
    text-align: center;
}

.left_menu li a {
    text-decoration: none;
    font-size: 14px;
    color: #666;
}

.left_menu li a:hover {
    color: #4fc8fd;
    font-weight: bold;
}

.add_goods {
    width: 220px;
    line-height: 40px;
    background: #2d5883;
    display: block;
    text-align: center;
    color: #fff;
    text-decoration: none;
    margin-top: 10px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}

.noradius {
    border-radius: 0px;
}

.right_con {
    width: 760px;
    float: right;
}

.breadcrumb {
    font-size: 14px;
    color: #333;
}

.list_title {
    border-bottom: 1px solid #ddd;
    height: 40px;
    margin-top: 10px;
    color: #666;
    font-size: 18px;
    overflow: hidden;
}

.list_title span {
    display: block;
    text-indent: 15px;
    border-left: 5px solid #4cc4f9;
    margin-top: 10px;
}

.goods_list {
    width: 780px;
    margin-top: 10px;
    overflow: hidden;
}

.goods_list li {
    width: 178px;
    height: 240px;
    border: 1px solid #ddd;
    float: left;
    margin-right: 13px;
    margin-bottom: 15px;
}

.goods_list li img {
    display: block;
    width: 170px;
    margin: 0px auto;
}

.goods_list li h5 {
    font-weight: normal;
    text-align: center;
    color: #333;
    font-size: 12px;
    margin-top: 5px;
}

.detail {
    display: block;
    text-align: center;
    text-decoration: none;
    font-size: 14px;
    margin-top: 5px;
    color: #4cc4f9;
}

.footer {
    line-height: 90px;
    margin-top: 20px;
    border-top: 1px solid #ddd;
    text-align: center;
    font-size: 14px;
    color: #333;
}

.left_goods_show {
    width: 488px;
    height: 288px;
    border: 1px solid #ddd;
    float: left;
}

.left_goods_show img {
    display: block;
    margin: 0px auto;
}

.right_goods_data {
    width: 490px;
    float: right;
}

.right_goods_data h3 {
    font-size: 18px;
    line-height: 30px;
    font-weight: normal;
}

.right_goods_data h4 {
    font-size: 18px;
    line-height: 30px;
    color: #666;
    margin-top: 10px
}

.form_pannel {
    margin-top: 15px;
    width: 490px;
    background: #f3f3f3;
    padding-bottom: 10px;
}

.form_pannel h5 {
    line-height: 30px;
    font-size: 16px;
    color: #666;
    text-indent: 10px
}

.form_group {
    overflow: hidden;
    margin-bottom: 10px;

}

.form_group label {
    width: 200px;
    float: left;
    text-indent: 10px;
    font-size: 14px;
    line-height: 30px;
    text-align: right;
    margin-right: 10px;
}

.form_group input {
    float: left;
    width: 220px;
    height: 24px;
    outline: none;
    border-radius: 3px;
    text-indent: 5px;
    border: 1px solid #999;
}

.input_sub {
    width: 100px;
    height: 30px;
    border: 0px;
    background: #4878b6;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
    margin-left: 210px;
}

.finalize {
    display: block;
    width: 200px;
    line-height: 30px;
    background: #4878b6;
    text-decoration: none;
    color: #fff;
    border-radius: 3px;
    text-align: center;
    margin-top: 17px;
    border: 0px;
}

.notop {
    margin-top: -5px;
}

.add_form {
    background: #f2f2f2;
    padding: 20px;
    margin-top: 10px;
}

.add_form .form_group {
    margin-bottom: 15px;
}

.add_form .form_group input {
    width: 400px;
}

.add_form .form_group .noborder {
    border: 0px;
}

.add_form .form_group textarea {
    float: left;
    width: 400px;
    height: 100px;
    outline: none;
    border-radius: 3px;
    text-indent: 5px;
    border: 1px solid #999;
}

.add_form .form_group select {
    float: left;
    width: 220px;
    height: 24px;
    outline: none;
    border-radius: 3px;
    text-indent: 5px;
    border: 1px solid #999;
}

.add_btn {
    display: block;
    width: 200px;
    line-height: 30px;
    background: #4878b6;
    text-decoration: none;
    color: #fff;
    border-radius: 3px;
    text-align: center;
    border: 0px;
    margin-left: 210px;
    cursor: pointer;
}

.alert {
    width: 400px;
    line-height: 150px;
    text-align: center;
    font-size: 18px;
    background: #fff;
    border-radius: 10px;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -75px;
    z-index: 9999;
    border: 1px solid #ddd;
    display: none;
}


```

# 渲染产品

```js
function renderProducts() {
    // 1. 获取所有的产品数量
    ecommerceStoreInstance.productIndex().then(productIndex => {
        // 注意！！
        console.log('productIndex:', productIndex)
        for (let i = 1; i <= productIndex; i++) {
            // 2. 获取每个产品的信息
            ecommerceStoreInstance.getProductById(i).then(productInfo => {
                let {0: id, 1: name, 2: category, 3: imageLink, 4: descLink, 5: auctionStartTime, 6: auctionEndTime, 7: startPrice, 8: status} = productInfo
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
                // node.append(`<div>${price}</div>`)
                // 按钮detail
                node.append(`<a href="product.html?id=${id.c[0]}">Details</a>`)

                // 4.组合append到id="product-list中
                $('#product-list').append(node)
            })
        }
    })
}

```



在start中调用

```js
 start: async function () {
        // Bootstrap the MetaCoin abstraction for Use.
        console.log('init !!!!!')

        ecommerceStoreContract.setProvider(window.web3.currentProvider)

        ecommerceStoreInstance = await ecommerceStoreContract.deployed()

        // let accounts = await web3.eth.getAccounts()
        //
        // let res = await ecommerceStoreInstance.addProductToStore(
        //     '衣服', '服装', 'imagelink111', 'descLink222', 2018, 2019, 10, 0, {
        //         from: accounts[0]
        //     })
        //
        // console.log('res :', res)
        //
        // res = await ecommerceStoreInstance.getProductById(1)
        // console.log('res product info :', res)

        renderProducts()
    }
```



安装jquery

```js
npm i jquery --save 
```



在truffle控制台

1. 重新部署合约

2. 添加商品

```
migrate --reset

EcommerceStore.deployed().then(i => i.addProductToStore('天梭男111', '手表', 'QmReMAp8UXR5r4Rgi35Ade9uK2D3v3M1LEcHMjfBYXYZ91', 'QmbWwss8TGmLbE3NZawbzRqPst15d7FEUSCDfN6stkgQg1', 2018, 2019, 1, 0))
```



效果如下：

![image-20181130172352959](https://ws4.sinaimg.cn/large/006tNbRwgy1fxq7ssrs8fj31aq0qm7ar.jpg)