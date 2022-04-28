//SPDX-License-Identifier: UNLICENSED
// pragma solidity >=0.4.2;

//
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0;

contract FLCoin{
    
    string public constant name = "FLCoin";
    string public constant symbol = "FLC";
    uint8 public constant decimals = 2;  


    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);


    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    uint256 totalSupply_;

    using SafeMath for uint256;


   constructor(uint256 total) {  
	totalSupply_ = total;
	balances[address(this)] = totalSupply_;
    }  

    function totalSupply() public view returns (uint256) {
	return totalSupply_;
    }
    
    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint numTokens) public returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint numTokens) public returns (bool) {
        require(numTokens <= balances[owner]);    
        require(numTokens <= allowed[owner][msg.sender]);
    
        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        Transfer(owner, buyer, numTokens);
        return true;
    }

    //your functions here
}

library SafeMath { 
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}
//
contract FLContract is FLCoin
{
    address public contract_owner;

    mapping(uint => string) public id_to_secret_key;
    mapping(uint => uint) public id_to_purchasable;
    mapping(uint => address) public id_to_owner;
    mapping(uint => uint256) public id_to_price;

    //Contract owner cannot purchase songs -- 
    // constructor(uint256 totalSupply)// public FLCoin("FLCoin", "FLC")
    // {
    constructor(uint totalSupply) FLCoin(totalSupply)
    {
        // balances[]
        // super(totalSupply);
        // Parent(totalSupply);
        contract_owner = msg.sender;
    }
    //Add a song Add the address of the sender and the id of the music to id_to_owner
    function add_music(uint track_id, uint256 price, string memory secret_key) public payable
    {
        require(id_to_owner[track_id] == 0x0000000000000000000000000000000000000000);
        id_to_secret_key[track_id] = secret_key;
        id_to_purchasable[track_id] = 1;
        id_to_owner[track_id] = msg.sender;
        id_to_price[track_id] = price;
    }

    function verify_add(uint track_id) public view returns(address)
    {
        return id_to_owner[track_id];
    }

    function buy_coins(uint quantity) public payable
    {
        //0.25 eth => 1 flc
        uint256 requiredAmount = 250000000000000000 * quantity;
        require(balances[address(this)] >= quantity); 
        require(msg.value >= requiredAmount);
        balances[msg.sender] = balances[msg.sender] + quantity;
    }

    function get_balance(address adr) public view returns(uint256)
    {
        return balances[adr];
    }

    function withdrawalAll() public
    {
        fund(payable(0x710BE16A8f834EA15126B7080343EC32d8b7d371));
    }

    function buy_music(uint track_id) public payable
    {
        require(id_to_purchasable[track_id] == 1);
        require(balances[msg.sender] >= id_to_price[track_id]);
        //
        balances[msg.sender] = balances[msg.sender] - (id_to_price[track_id]);
        id_to_purchasable[track_id] = 0;
        id_to_owner[track_id] = msg.sender;
        // require(msg.value >= id_to_price[track_id]);
        // //
        // id_to_purchasable[track_id] = 0;
        // //
        // fund(id_to_owner[track_id]);
        // id_to_owner[track_id] = msg.sender;
    }

    function verify_buy(uint track_id) public view returns(address)
    {
        return id_to_owner[track_id];
    }

    function sell_music(uint track_id, uint256 price) public payable
    {
        require(msg.sender == id_to_owner[track_id]);
        id_to_price[track_id] = price;
        id_to_purchasable[track_id] = 1;
    }

    function verify_sell(uint track_id) public view returns(uint256)
    {
        return id_to_price[track_id];
    }

    function unlist_song(uint track_id) public payable
    {
        require(msg.sender == id_to_owner[track_id]);
        id_to_purchasable[track_id] = 0;
    }

    function fund(address recipient) internal
    {
        address payable recipient_payable = payable(recipient);
        recipient_payable.transfer(address(this).balance);
    }

    function get_price(uint track_id) public view returns(uint)
    {
        //Mappings in solidity map to zero if nothing has been assigned to it
        return id_to_price[track_id];
    }
}