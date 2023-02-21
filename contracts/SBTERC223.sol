// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./ERC223ReceivingContract.sol";

contract SBTERC223 is ERC20, ERC20Burnable, Pausable, AccessControl, Ownable {

    using SafeMath for uint256;

    constructor(uint256 initialSupply) ERC20("SBTERC223", "SBTERC223") {
        _mint(msg.sender, initialSupply);
    }

    function transfer(
        address _to,
        uint256 _value,
        bytes memory _data
    ) public {
        uint256 codeLength;

        assembly {
            codeLength := extcodesize(_to)
        }

        _balances[msg.sender] = _balances[msg.sender].sub(_value);
        _balances[_to] = _balances[_to].add(_value);
        // Check to see if receiver is contract
        if (codeLength > 0) {
            ERC223ReceivingContract receiver = ERC223ReceivingContract(_to);
            receiver.tokenFallback(msg.sender, _value, _data);
        }
        emit Transfer(msg.sender, _to, _value);
    }

    function transfer(address _to, uint256 _value)
        public
        override
        returns (bool)
    {
        uint256 codeLength;
        bytes memory empty;

        assembly {
            codeLength := extcodesize(_to)
        }

        _balances[msg.sender] = _balances[msg.sender].sub(_value);
        _balances[_to] = _balances[_to].add(_value);
        // Check to see if receiver is contract
        if (codeLength > 0) {
            ERC223ReceivingContract receiver = ERC223ReceivingContract(_to);
            receiver.tokenFallback(msg.sender, _value, empty);
        }
        emit Transfer(msg.sender, _to, _value);
    }
}
