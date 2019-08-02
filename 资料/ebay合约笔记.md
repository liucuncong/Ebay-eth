# 竞拍规则

次高价竞拍（盲拍）



竞标阶段：

\1. 每一个人都可以参与竞拍

\2. 每个人每次竞拍的时候，输入3个数据：

  A. 理想出价：5eth，    

  B. 迷惑价格: 10eth（真实要转给合约的钱）

  C. 密文：迷惑其他竞争者的一段文字

在程序里面处理，sha（理想价格 + 密文）得到哈希串，传给合约





揭标流程：

\1. 每一个参与竞标的人都要在揭标阶段来揭标，否则这个钱就浪费了。

  a. 理想价格：5eth

  B. 密文



\2. 揭标的时候，会有一个流程：

​	最终会选择出最高出价人，将所有竞争失败的人的钱退回

\3. 同时选择出次高价格（最终的成交价是次高价），B：5eth，将差价8-5=3退回给B





终结竞拍阶段：

\1. 任何一个非卖家，买家的人充当第三方仲裁人。（公正的，可以使用抵押金来保证，做仲裁人可以得到仲裁费用）

\2. 将这笔钱（5eth）转到一个第三方的合约。

\3. 有三方投票（买家，卖家，仲裁人）

\4. 获得2票的人得到合约里的钱。

\5. 整个竞拍结束

   A: 产品交易成交：买家得到商品，卖家得到钱，仲裁人得到酬金

   B: 交易失败，买家得到退款





# 定义产品结构

只有基本信息，尚不完整

```js
    struct Product {
        uint id;   //产品id：每添加一个，id自动加一
        string name; //产品名字
        string category; //产品类别
        string imageLink; //产品图片的ipfs哈希
        string descLink;  //差评描述信息ipfs哈希


        // 起拍价格，竞拍价格不小起拍价格
        // 起拍时间
        // 竞拍阶段结束时间
        // 产品竞拍状态：Open，sold，unsold
        // 产品的情况：新，旧
        uint startPrice;
        uint auctionStartTime;
        uint auctionEndTime;

        ProductStatus status;
        ProductCondition condition;
    }
    
    enum ProductStatus {Open, Sold, Unsold}
    enum ProductCondition {Used, New}
 
```



# 添加商品函数

```js
    function addProductToStore(string _name, string _category, string _imageLink, string _descLink, uint _startTime, uint _endTime, uint _startPrice, uint condition) public {
        productIndex++; //id++
        
        Product memory product = Product({
            id : productIndex,
            name : _name,
            category : _category,
            imageLink : _imageLink,
            descLink : _descLink,
            
            startPrice : _startPrice,
            auctionStartTime : _startTime,
            auctionEndTime : _endTime,
 
            status : ProductStatus.Open,
            condition : ProductCondition(condition)
        });
        
        
        productIdToOwner[productIndex] = msg.sender;
        stores[msg.sender][productIndex] = product;
    }
```

==注意两个结构==

```js
    //定义一个存储所有商品的结构 stores
    mapping(address => mapping(uint => Product)) stores;
    
    //定义一个存储商品与卖家对应结构
    mapping(uint=> address) productIdToOwner;
```



# 获取商品函数

```js
    //根据产品id，返回产品详情
    function getProductById(uint _productId) public view returns (uint, string, string, string, string, uint, uint, uint, uint){
        address owner = productIdToOwner[_productId];
        Product memory product = stores[owner][_productId];
        
        return (
            product.id, product.name, product.category, product.imageLink, product.descLink,
            product.auctionStartTime, product.auctionEndTime, product.startPrice, uint(product.status)
        );
    }
```



# 竞标结构定义

```js
    // 竞标的结构：
    // 	1. 产品ID
    // 	2. 转账（迷惑）价格，注意，不是理想价格
    // 	3. 揭标与否
    // 	4. 竞标人
    
    struct Bid {
        uint productId;  
        uint price;
        bool isRevealed;
        address bidder;
    }
```



# 补充Product，添加竞标信息

完整Product如下:

```js
    struct Product {
        
        
        //第一部分：基本信息
        uint id;   //产品id：每添加一个，id自动加一
        string name; //产品名字
        string category; //产品类别
        string imageLink; //产品图片的ipfs哈希
        string descLink;  //差评描述信息ipfs哈希


        // 起拍价格，竞拍价格不小起拍价格
        // 起拍时间
        // 竞拍阶段结束时间
        // 产品竞拍状态：Open，sold，unsold
        // 产品的情况：新，旧
        uint startPrice;
        uint auctionStartTime;
        uint auctionEndTime;

        ProductStatus status;
        ProductCondition condition;
        
        //第二部分：竞标信息
        uint totalBids; //所有的竞标数量
        
        //一个商品，所有人都可以竞标，并且，同一个人可以多次竞标
        //Byes32是理想价格与密文生成的的哈希值
        mapping(address => mapping(bytes32 => Bid)) bids;
        
        
        //第三部分：揭标信息
        uint highestBid;   //最高出价
        address highestBidder; //最高出价人
        uint secondHighestBid; //次高价
    }
```



# 竞标函数

```js
    
    // 竞标函数：
    //正常是传理想价格和密文的哈希过来，为了简化，先直接传过来，方便测试
    // 1. 创建一个竞标（产品id，理想价格，密文）
    // 2. 找到Product，将竞标放入bids结构中
    // mapping(address => mapping(bytes32 => Bid)) bids;
    
    function bid(uint _productId, uint _idealPrice, string _secret) public payable {
        
        bytes memory bytesInfo = abi.encodePacked(_idealPrice, _secret);
        bytes32 bytesHash = keccak256(bytesInfo);
        
        address owner = productIdToOwner[_productId];
        
        //注意，一定是storage类型，否则无法改变sotres内的产品信息
        Product storage product = stores[owner][_productId];
        
        //限定竞标价格不小于起拍价格
        require(msg.value >= product.startPrice);
        
        product.totalBids++;
        Bid memory bidLocal = Bid(_productId, msg.value, false, msg.sender);
        product.bids[msg.sender][bytesHash] = bidLocal; 
    }
    
    //返回某一个竞标的详情
    function getBidById(uint _productId, uint _idealPrice, string _secret) public view returns (uint, uint, bool, address) {
       
        Product storage product = stores[productIdToOwner[_productId]][_productId];
        
        bytes memory bytesInfo = abi.encodePacked(_idealPrice, _secret);
        bytes32 bytesHash = keccak256(bytesInfo);

        Bid memory bidLocal = product.bids[msg.sender][bytesHash];
        
        return (bidLocal.productId, bidLocal.price, bidLocal.isRevealed, bidLocal.bidder);
    }
```



# 揭标流程图

![image-20181130112649113](https://ws3.sinaimg.cn/large/006tNbRwgy1fxpxfr2kc2j319m0li44o.jpg)



竞标人演示

```js
名字， 理想价格， 迷惑价格， 密文
张三   30，10， “hello” : 无效竞标
李四： 20， 30， “hello" ：第一个有效揭标人
王五： 30，40，‘hello”：更新最高价和次高价，变成最高竞标人
赵六： 25，40，“hello”：更新次高价
老七： 15，25，“hello”：路人甲，直接退款
```



# 揭标代码

```js
    function revealBid(uint _productId, uint _idealPrice, string _secret) public {
        address owner = productIdToOwner[_productId];
        Product storage product = stores[owner][_productId];
        
        bytes memory bytesInfo = abi.encodePacked(_idealPrice, _secret);
        bytes32 bidId = keccak256(bytesInfo);
        
        //mapping(address => mapping(bytes32 => Bid)) bids;
        
        //一个人可以对同一个商品竞标多次，揭标的时候也要揭标多次, storage类型
        Bid storage currBid = product.bids[msg.sender][bidId];
        
       // require(now > product.auctionStartTime);
        require(!currBid.isRevealed);
        require(currBid.bidder > 0);  //说明找到了这个标

        currBid.isRevealed = true;

        //bid中的是迷惑价格，真实价格揭标时传递进来
        uint confusePrice = currBid.price;

        uint refund = 0;
        
        uint idealPrice = _idealPrice;
        if (confusePrice < idealPrice) {
            //路径1：无效交易
            refund = confusePrice;
        } else {
            if (idealPrice > product.highestBid) {
                if (product.highestBidder == 0) {
                    //当前账户是第一个揭标人
                    //路径2：
                    product.highestBidder = msg.sender;
                    product.highestBid = idealPrice;
                    product.secondHighestBid = product.startPrice;
                    refund = confusePrice - idealPrice;
                } else {
                    //路径3：不是第一个，但是出价是目前最高的，更新最高竞标人，最高价格，次高价格
                    product.highestBidder.transfer(product.highestBid);
                    product.secondHighestBid = product.highestBid;
                    product.highestBid = idealPrice;
                    product.highestBidder = msg.sender;
                    refund = confusePrice - idealPrice;
                }
            } else {
                //路径4：价格低于最高价，但是高于次高价
                if (idealPrice > product.secondHighestBid) {
                    //路径4：更新次高价，然后拿回自己的钱
                    product.secondHighestBid = idealPrice;
                    refund = confusePrice;
                } else {
                    //路径5：路人甲，价格低于次高价，直接退款
                    refund = confusePrice;
                }
            }
        }

        emit revealEvent(_productId, bidId, confusePrice, currBid.price, refund);

        if (refund > 0) {
            msg.sender.transfer(refund);
        }
    }
```



# 查看竞标状态

```js
    function getHighestBidInfo(uint _productId) public view returns(address, uint, uint, uint) {
        address owner = productIdToOwner[_productId];
        Product memory product = stores[owner][_productId];
        return (product.highestBidder, product.highestBid, product.secondHighestBid, product.totalBids);
    }
```



# 终结竞拍

由买家，卖家之外的第三者充当：

```js
        //key是产品id，value：是第三方合约
	mapping(uint => address) public productToEscrow;
    
    function finalaizeAuction(uint _productId) public {
        
        address owner = productIdToOwner[_productId];
        Product storage product = stores[owner][_productId];
        
        address buyer = product.highestBidder;
        address seller = owner;
        address arbiter = msg.sender;
        require(arbiter != buyer && arbiter != seller);
        //require(now > product.auctionEndTime);

        require(product.status == ProductStatus.Open);

        if (product.totalBids == 0) {
            product.status = ProductStatus.Unsold;
        } else {
            product.status = ProductStatus.Sold;
        }
        
		//.value()方式进行外部调用时转钱
        //类比feed.info.value(10).gas(800)(); 
        //这是构造的时候传钱，constructor加上payable关键字
        address escrow = (new Escrow).value(product.secondHighestBid)(buyer, seller, arbiter);
        productToEscrow[_productId] = escrow;
        //退还差价 30- 20 = 10 ， 30是理想出价，20是次高
        buyer.transfer(product.highestBid - product.secondHighestBid);
    }
```



# 仲裁合约初见

```js


contract Escrow {

    // 属性：
    // 1. 买家
    address buyer;
    // 2. 卖家
    address seller;
    // 3. 仲裁人
    address arbiter;
    // 4. 卖家获得的票数
    uint sellerVotesCount;
    // 5. 买家获得的票数
    uint buyerVotesCount;
    
    constructor(address _buyer, address _seller, address _arbiter) public payable {
        buyer = _buyer;
        seller = _seller;
        arbiter = _arbiter;
    }
    
    function getBalance () public view returns (uint) {
        return address(this).balance;
    }
    
    function escrowInfo() public view returns(address, address, address, uint, uint) {
        return (buyer, seller, arbiter, buyerVotesCount, sellerVotesCount);
    }
}
```



# 对仲裁合约添加投票函数

添加状态变量

```js
    bool isSpent = false;
    mapping(address=>bool) addressVotedMap;
```

投票函数

```js
        // 方法：
    //向卖家投票方法
    function giveMoneyToSeller(address caller)  callerRestrict(caller) public {
        require(!isSpent);
        //记录已经投票的状态，如果投过票，就设置为true
        require(!addressVotedMap[caller]);
        addressVotedMap[caller] = true;
        
        //sellerVotesCount++;
        if (++sellerVotesCount == 2 ) {
            isSpent = true;
            seller.transfer(address(this).balance);
        }
    }

    //向买家投票方法
    function giveMoneyToBuyer(address caller) callerRestrict(caller) public {
        require(!isSpent);
        require(!addressVotedMap[caller]);
        addressVotedMap[caller] = true;

        if (++buyerVotesCount == 2) {
            isSpent = true;
            buyer.transfer(address(this).balance);
        }
    }
    
    modifier callerRestrict(address caller ) {
        require(caller == seller || caller == buyer || caller == arbiter);
        _;
    }
```



# 在平台合约中添加投票函数

```js
    function getEscrowInfo(uint _productId) public view returns (address, address, address, uint, uint) {
        address escrow = productToEscrow[_productId];
        Escrow instanceContract = Escrow(escrow);
        return instanceContract.escrowInfo();
    }

    function giveToSeller(uint _productId) public {
        address contractAddr = productToEscrow[_productId];
        Escrow(contractAddr).giveMoneyToSeller(msg.sender);
    }

    function giveToBuyer(uint _productId) public {
        Escrow(productToEscrow[_productId]).giveMoneyToBuyer(msg.sender);
    }
```





# 整体代码

```js
pragma solidity ^0.4.24; 

contract EcommerceStore {
    
    uint256 productIndex;
    
    constructor() public {
        productIndex = 0;
    }
    
    
    //1.  定义商品结构
    // 2. 添加商品函数
    // 3. 根据id获取商品函数
    
    struct Product {
        
        
        //第一部分：基本信息
        uint id;   //产品id：每添加一个，id自动加一
        string name; //产品名字
        string category; //产品类别
        string imageLink; //产品图片的ipfs哈希
        string descLink;  //差评描述信息ipfs哈希


        // 起拍价格，竞拍价格不小起拍价格
        // 起拍时间
        // 竞拍阶段结束时间
        // 产品竞拍状态：Open，sold，unsold
        // 产品的情况：新，旧
        uint startPrice;
        uint auctionStartTime;
        uint auctionEndTime;

        ProductStatus status;
        ProductCondition condition;
        
        //第二部分：竞标信息
        uint totalBids; //所有的竞标数量
        
        //一个商品，所有人都可以竞标，并且，同一个人可以多次竞标
        //Byes32是理想价格与密文生成的的哈希值
        mapping(address => mapping(bytes32 => Bid)) bids;
        
        
        //第三部分：揭标信息
        uint highestBid;   //最高出价
        address highestBidder; //最高出价人
        uint secondHighestBid; //次高价
    }
    
    enum ProductStatus {Open, Sold, Unsold}
    enum ProductCondition {Used, New}
    
    
    //定义一个存储所有商品的结构 stores
    mapping(address => mapping(uint => Product)) stores;
    
    //定义一个存储商品与卖家对应结构
    mapping(uint=> address) productIdToOwner;
    
    function addProductToStore(string _name, string _category, string _imageLink, string _descLink, uint _startTime, uint _endTime, uint _startPrice, uint condition) public {
        productIndex++; //id++
        
        Product memory product = Product({
            id : productIndex,
            name : _name,
            category : _category,
            imageLink : _imageLink,
            descLink : _descLink,
            
            startPrice : _startPrice,
            auctionStartTime : _startTime,
            auctionEndTime : _endTime,
 
            status : ProductStatus.Open,
            condition : ProductCondition(condition),
            
            highestBid: 0,
            highestBidder: 0,
            secondHighestBid: 0,
            totalBids: 0

        });
        
        
        productIdToOwner[productIndex] = msg.sender;
        stores[msg.sender][productIndex] = product;
    }
    
    
    // 竞标的结构：
    // 	1. 产品ID
    // 	2. 转账（迷惑）价格，注意，不是理想价格
    // 	3. 揭标与否
    // 	4. 竞标人
    
    struct Bid {
        uint productId;  
        uint price;  //msg.value
        bool isRevealed;
        address bidder;
    }
    
    // 竞标函数：
    //正常是传理想价格和密文的哈希过来，为了简化，先直接传过来，方便测试
    // 1. 创建一个竞标（产品id，理想价格，密文）
    // 2. 找到Product，将竞标放入bids结构中
    // mapping(address => mapping(bytes32 => Bid)) bids;
    
    function bid(uint _productId, uint _idealPrice, string _secret) public payable {
        
        bytes memory bytesInfo = abi.encodePacked(_idealPrice, _secret);
        bytes32 bytesHash = keccak256(bytesInfo);
        
        address owner = productIdToOwner[_productId];
        
        //注意，一定是storage类型，否则无法改变sotres内的产品信息
        Product storage product = stores[owner][_productId];
        
        //限定竞标价格不小于起拍价格
        require(msg.value >= product.startPrice);
        
        product.totalBids++;
        Bid memory bidLocal = Bid(_productId, msg.value, false, msg.sender);
        product.bids[msg.sender][bytesHash] = bidLocal; 
    }
    
    //返回某一个竞标的详情
    function getBidById(uint _productId, uint _idealPrice, string _secret) public view returns (uint, uint, bool, address) {
       
        Product storage product = stores[productIdToOwner[_productId]][_productId];
        
        bytes memory bytesInfo = abi.encodePacked(_idealPrice, _secret);
        bytes32 bytesHash = keccak256(bytesInfo);

        Bid memory bidLocal = product.bids[msg.sender][bytesHash];
        
        return (bidLocal.productId, bidLocal.price, bidLocal.isRevealed, bidLocal.bidder);
    }
    
        event revealEvent(uint productid, bytes32 bidId, uint idealPrice, uint price, uint refund);
    
    function revealBid(uint _productId, uint _idealPrice, string _secret) public {
        address owner = productIdToOwner[_productId];
        Product storage product = stores[owner][_productId];
        
        bytes memory bytesInfo = abi.encodePacked(_idealPrice, _secret);
        bytes32 bidId = keccak256(bytesInfo);
        
        //mapping(address => mapping(bytes32 => Bid)) bids;
        
        //一个人可以对同一个商品竞标多次，揭标的时候也要揭标多次, storage类型
        Bid storage currBid = product.bids[msg.sender][bidId];
        
       // require(now > product.auctionStartTime);
        require(!currBid.isRevealed);
        require(currBid.bidder > 0);  //说明找到了这个标

        currBid.isRevealed = true;

        //bid中的是迷惑价格，真实价格揭标时传递进来
        uint confusePrice = currBid.price;

        uint refund = 0;
        
        uint idealPrice = _idealPrice;
        if (confusePrice < idealPrice) {
            //路径1：无效交易
            refund = confusePrice;
        } else {
            if (idealPrice > product.highestBid) {
                if (product.highestBidder == 0) {
                    //当前账户是第一个揭标人
                    //路径2：
                    product.highestBidder = msg.sender;
                    product.highestBid = idealPrice;
                    product.secondHighestBid = product.startPrice;
                    refund = confusePrice - idealPrice;
                } else {
                    //路径3：不是第一个，但是出价是目前最高的，更新最高竞标人，最高价格，次高价格
                    product.highestBidder.transfer(product.highestBid);
                    product.secondHighestBid = product.highestBid;
                    product.highestBid = idealPrice;
                    product.highestBidder = msg.sender;
                    refund = confusePrice - idealPrice;
                }
            } else {
                //路径4：价格低于最高价，但是高于次高价
                if (idealPrice > product.secondHighestBid) {
                    //路径4：更新次高价，然后拿回自己的钱
                    product.secondHighestBid = idealPrice;
                    refund = confusePrice;
                } else {
                    //路径5：路人甲，价格低于次高价，直接退款
                    refund = confusePrice;
                }
            }
        }

        emit revealEvent(_productId, bidId, confusePrice, currBid.price, refund);

        if (refund > 0) {
            msg.sender.transfer(refund);
        }
    }
    
    function getHighestBidInfo(uint _productId) public view returns(address, uint, uint, uint) {
        address owner = productIdToOwner[_productId];
        Product memory product = stores[owner][_productId];
        return (product.highestBidder, product.highestBid, product.secondHighestBid, product.totalBids);
    }
    
    
    
    //根据产品id，返回产品详情
    function getProductById(uint _productId) public view returns (uint, string, string, string, string, uint, uint, uint, uint){
        address owner = productIdToOwner[_productId];
        Product memory product = stores[owner][_productId];
        
        return (
            product.id, product.name, product.category, product.imageLink, product.descLink,
            product.auctionStartTime, product.auctionEndTime, product.startPrice, uint(product.status)
        );
    }
    
    
        //key是产品id，value：是第三方合约
	mapping(uint => address) public productToEscrow;
    
    function finalaizeAuction(uint _productId) public {
        
        address owner = productIdToOwner[_productId];
        Product storage product = stores[owner][_productId];
        
        address buyer = product.highestBidder;
        address seller = owner;
        address arbiter = msg.sender;
        require(arbiter != buyer && arbiter != seller);
        //require(now > product.auctionEndTime);

        require(product.status == ProductStatus.Open);

        if (product.totalBids == 0) {
            product.status = ProductStatus.Unsold;
        } else {
            product.status = ProductStatus.Sold;
        }
        
		//.value()方式进行外部调用时转钱
        //类比feed.info.value(10).gas(800)(); 
        //这是构造的时候传钱，constructor加上payable关键字
        address escrow = (new Escrow).value(product.secondHighestBid)(buyer, seller, arbiter);
        productToEscrow[_productId] = escrow;
        //退还差价 30- 20 = 10 ， 30是理想出价，20是次高
        buyer.transfer(product.highestBid - product.secondHighestBid);
    }
    
    function getEscrowInfo(uint _productId) public view returns (address, address, address, uint, uint) {
        address escrow = productToEscrow[_productId];
        Escrow instanceContract = Escrow(escrow);
        return instanceContract.escrowInfo();
    }

    function giveToSeller(uint _productId) public {
        address contractAddr = productToEscrow[_productId];
        Escrow(contractAddr).giveMoneyToSeller(msg.sender);
    }

    function giveToBuyer(uint _productId) public {
        Escrow(productToEscrow[_productId]).giveMoneyToBuyer(msg.sender);
    }
    
}

contract Escrow {

    // 属性：
    // 1. 买家
    address buyer;
    // 2. 卖家
    address seller;
    // 3. 仲裁人
    address arbiter;
    // 4. 卖家获得的票数
    uint sellerVotesCount;
    // 5. 买家获得的票数
    uint buyerVotesCount;
    
    bool isSpent = false;
    
    mapping(address=>bool) addressVotedMap;
    
    constructor(address _buyer, address _seller, address _arbiter) public payable {
        buyer = _buyer;
        seller = _seller;
        arbiter = _arbiter;
    }
    
    function getBalance () public view returns (uint) {
        return address(this).balance;
    }
    
    function escrowInfo() public view returns(address, address, address, uint, uint) {
        return (buyer, seller, arbiter, buyerVotesCount, sellerVotesCount);
    }
    
        // 方法：
    //向卖家投票方法
    function giveMoneyToSeller(address caller)  callerRestrict(caller) public {
        require(!isSpent);
        //记录已经投票的状态，如果投过票，就设置为true
        require(!addressVotedMap[caller]);
        addressVotedMap[caller] = true;
        
        //sellerVotesCount++;
        if (++sellerVotesCount == 2 ) {
            isSpent = true;
            seller.transfer(address(this).balance);
        }
    }

    //向买家投票方法
    function giveMoneyToBuyer(address caller) callerRestrict(caller) public {
        require(!isSpent);
        require(!addressVotedMap[caller]);
        addressVotedMap[caller] = true;

        if (++buyerVotesCount == 2) {
            isSpent = true;
            buyer.transfer(address(this).balance);
        }
    }
    
    modifier callerRestrict(address caller ) {
        require(caller == seller || caller == buyer || caller == arbiter);
        _;
    }
}
```



# 问题：

```js
mapping(address => mapping(uint => Product))  public stores;
```



加上public，会报错，嵌套层次太深

![image-20181130163404466](https://ws1.sinaimg.cn/large/006tNbRwgy1fxq6aqw0bvj30ym0b80vu.jpg)

