// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./ERC223ReceivingContract.sol";

/**
 * @title TokenVesting
 * @dev A token holder contract that can release its token balance gradually like a
 * typical vesting scheme, with a cliff and vesting period. Optionally revocable by the
 * owner.
 */
contract TokenVesting is Ownable {
    using SafeMath for uint256;

    IERC20 public token;

    event Released(uint256 amount, address beneficiary);
    event Revoked();

    uint256 public start;

    address public from;
    uint256 public value;
    bytes data;

    struct Beneficiary {
        uint256 amount;
        uint256 lastAmountCalculatedTime;
        uint256 releasedToken;
    }

    mapping(address => Beneficiary) public benefiaciaryDetails;

    bool public revocable;

    address payable public FOUNDER_WALLET;
    address payable public ADVISOR_ADDRESS;
    address payable public TEAM_ADDRESS;
    uint256 public DURATION;

    constructor(
        address _founderWallet,
        address _advisorAddress,
        address _teamAddress,
        address _token,
        uint256 _duration
    ) {
        FOUNDER_WALLET = payable(_founderWallet);
        ADVISOR_ADDRESS = payable(_advisorAddress);
        TEAM_ADDRESS = payable(_teamAddress);
        token = IERC20(_token);
        DURATION = block.timestamp.add(_duration);
        start = block.timestamp;

        tokenVesting(FOUNDER_WALLET, 120000000 * 1e18);
        tokenVesting(ADVISOR_ADDRESS, 16000000 * 1e18);
        tokenVesting(TEAM_ADDRESS, 400000 * 1e18);
    }

    /**
     * @dev Creates a vesting contract that vests its balance of any ERC20 token to the
     * _beneficiary, gradually in a linear fashion until _start + _duration. By then all
     * of the balance will have vested.
     * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
     * @param _amount amount of each beneficiary
     */
    function tokenVesting(address _beneficiary, uint256 _amount) internal {
        require(_beneficiary != address(0));

        Beneficiary memory beneficiary;

        beneficiary.amount = _amount;
        beneficiary.lastAmountCalculatedTime = block.timestamp;
        beneficiary.releasedToken = 0;

        benefiaciaryDetails[_beneficiary] = beneficiary;
    }

    /**
     * @notice Transfers vested tokens to beneficiary or msg.sender.
     */
    function withdraw() public {
        uint256 unreleased = releasableAmount(msg.sender);

        require(unreleased > 0);

        token.transfer(msg.sender, unreleased);

        benefiaciaryDetails[msg.sender].releasedToken = unreleased;

        emit Released(unreleased, msg.sender);
    }

    //   /**
    //    * @notice Allows the owner to revoke the vesting. Tokens already vested
    //    * remain in the contract, the rest are returned to the owner.
    //    * @param token ERC20 token which is being vested
    //    */
    //   function revoke(ERC20Basic token) public onlyOwner {
    //     require(revocable);
    //     require(!revoked[token]);

    //     uint256 balance = token.balanceOf(this);

    //     uint256 unreleased = releasableAmount(token);
    //     uint256 refund = balance.sub(unreleased);

    //     revoked[token] = true;

    //     token.safeTransfer(owner, refund);

    //     Revoked();
    //   }

    /**
     * @dev Calculates the amount that has already vested but hasn't been released yet.
     * @param _beneficiary address of beneficiary
     */
    function releasableAmount(address _beneficiary)
        public
        view
        returns (uint256)
    {
        return vestedAmount(_beneficiary);
    }

    /**
     * @dev Calculates the amount that has already vested.
     * @param _beneficiary address of beneficiary
     */
    function vestedAmount(address _beneficiary)
        internal
        view
        returns (uint256)
    {
        uint256 totalBalance = benefiaciaryDetails[_beneficiary].amount;

        if (totalBalance == 0) {
            return 0;
        }

        uint256 noOfPeriodsPassed = block.timestamp.sub(start).div(60);

        uint256 totalAmount = totalBalance.mul(noOfPeriodsPassed).div(
            DURATION.sub(start).div(60)
        );
        return
            totalAmount.sub(benefiaciaryDetails[_beneficiary].releasedToken);
    }

    function tokenFallback(
        address _from,
        uint256 _value,
        bytes memory _data
    ) public {
        from = _from;
        value = _value;
        data = _data;
    }
}
