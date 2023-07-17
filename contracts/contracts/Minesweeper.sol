pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "./libs/helpers/Errors.sol";

contract Minesweeper is Initializable, ReentrancyGuardUpgradeable, OwnableUpgradeable {

    address public _admin;
    address public _paramsAddress;
    address public _erc20Token;

    function initialize(
        address admin,
        address paramAddress,
        address erc20Token
    ) initializer public {
        _admin = admin;
        _paramsAddress = paramAddress;
        _erc20Token = erc20Token;

        __ReentrancyGuard_init();
        __Ownable_init();
    }

    function changeAdmin(address newAdm) external {
        require(msg.sender == _admin && newAdm != Errors.ZERO_ADDR, Errors.ONLY_ADMIN_ALLOWED);

        if (_admin != newAdm) {
            _admin = newAdm;
        }
    }

    function changeParam(address newAddr) external {
        require(msg.sender == _admin && newAddr != Errors.ZERO_ADDR, Errors.ONLY_ADMIN_ALLOWED);

        if (_paramsAddress != newAddr) {
            _paramsAddress = newAddr;
        }
    }

    function changeERC20Token(address newAddr) external {
        require(msg.sender == _admin && newAddr != Errors.ZERO_ADDR, Errors.ONLY_ADMIN_ALLOWED);

        if (_erc20Token != newAddr) {
            _erc20Token = newAddr;
        }
    }
}
