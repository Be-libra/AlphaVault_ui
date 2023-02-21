// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


abstract contract ERC223ReceivingContract { 
    function tokenFallback(address _from, uint _value, bytes calldata _data) public virtual;
}