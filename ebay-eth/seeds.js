EcommerceStore = artifacts.require("./EcommerceStore.sol");

module.exports = function(callback) {
 //Math.round() 函数返回一个数字四舍五入后最接近的整数。... x = Math.round(20.49); //20
  current_time = Math.round(new Date() / 1000);
    
   amt_1 = 1//web3.toWei(1, 'ether');
    
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('天梭男111', '手表', 'QmReMAp8UXR5r4Rgi35Ade9uK2D3v3M1LEcHMjfBYXYZ91', 'QmbWwss8TGmLbE3NZawbzRqPst15d7FEUSCDfN6stkgQg1', current_time, current_time + 80, 2*amt_1, 0).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('天梭男222', '手表', 'QmdHS2pDnQwqDMtvXEzZc77uW7Fm3hWkHTcVPNs2YbGoun', 'QmbWwss8TGmLbE3NZawbzRqPst15d7FEUSCDfN6stkgQg1', current_time, current_time + 10000, 3*amt_1, 1).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('天梭女333', '手表', 'QmVp1Lx8raRcDkr2VCzct8ujXgfNgZHber1FcFZjwfFxXH', 'QmbWwss8TGmLbE3NZawbzRqPst15d7FEUSCDfN6stkgQg1', current_time, current_time + 1000, amt_1, 0).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.addProductToStore('天梭男444', '手表', 'QmQ2D3siQd1zcwwq1LjHv4xnF2ZA29Gvw41VgHShw8N2ES', 'QmbWwss8TGmLbE3NZawbzRqPst15d7FEUSCDfN6stkgQg1', current_time, current_time + 86400, 4*amt_1, 1).then(function(f) {console.log(f)})});
  EcommerceStore.deployed().then(function(i) {i.productIndex.call().then(function(f){console.log(f)})});
}