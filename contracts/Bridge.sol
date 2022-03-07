// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;


contract Bridge {

    receive() external payable {}

    function deposit() public payable {}

    function getTotalBalance() public view returns (uint) {
        return address(this).balance;
    }

    function sendViaTransfer(address payable _to, uint256 _amount) public {
        // require(address(this).balance >= _amount, "Not enough Ether balance");
        _to.transfer(_amount);
    }

    function sendViaSend(address payable _to, uint256 _amount) public {
        // require(address(this).balance >= _amount, "Not enough Ether balance");
        bool sent = _to.send(_amount);
        require(sent, "Failed to send Ether");
    }

    function sendViaCall(address payable _to, uint256 _amount) public {
        // require(address(this).balance >= _amount, "Not enough Ether balance");
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }
}
