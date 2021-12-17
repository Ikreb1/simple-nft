// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*

██████╗  █████╗ ██╗    ██╗
██╔══██╗██╔══██╗██║    ██║
██║  ██║███████║██║ █╗ ██║
██║  ██║██╔══██║██║███╗██║
██████╔╝██║  ██║╚███╔███╔╝
╚═════╝ ╚═╝  ╚═╝ ╚══╝╚══╝
https://etherscan.io/address/0xf1268733c6fb05ef6be9cf23d24436dcd6e0b35e#code
*/

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

// (hello, world) = (world, hello) <= swaps the values

contract DesperateApeWives is Ownable, ERC721Enumerable, PaymentSplitter {

    uint public constant MAX_WIVES = 10000;
    uint private dawPrice = 0.08 ether;
    uint private walletLimit = 3;
    string public provenanceHash; // Hash of all images/metadata in a pre defined order
    string private _baseURIExtended;
    string private _contractURI;
    bool public _isSaleLive = false; // better to not initalize it as solidity intializes it to false either way
    bool private locked;
    bool private provenanceLock;
    uint private _reserved = 192;

    //Desperate Ape Wives Release Time -
    uint public presaleStart = 1635260400; // October 26th 11AM EST
    uint public presaleEnd = 1635303600;   // October 26th 11PM EST
    uint public publicSale = 1635350400;   // October 27th 12PM EST

    struct Account {
        uint nftsReserved;
        uint walletLimit;
        uint mintedNFTs;
        bool isEarlySupporter;
        bool isWhitelist;
        bool isAdmin;
    }

    mapping(address => Account) public accounts;

    event Mint(address indexed sender, uint totalSupply);
    event PermanentURI(string _value, uint256 indexed _id);

    address[] private team;
    uint[] private teamShares;

    constructor(address[] memory _team, uint[] memory _teamShares, address[] memory _admins)
        ERC721("Desperate ApeWives", "DAW")
        PaymentSplitter(_team, _teamShares)
    {
        _baseURIExtended = "ipfs://QmbmjFdnvbYzvD6QfQzLg75TT6Du3hw4rx5Kh1uuqMqevV/";

        accounts[msg.sender] = Account( 0, 0, 0, true, true, true);

        accounts[_admins[0]] = Account( 12, 0, 0, false, false, true);
        accounts[_admins[1]] = Account( 13, 0, 0, false, false, true);
        accounts[_admins[2]] = Account( 12, 0, 0, false, false, true);
        accounts[_admins[3]] = Account( 13, 0, 0, false, false, true);
        accounts[_admins[4]] = Account( 16, 0, 0, false, false, true);
        accounts[_admins[5]] = Account( 17, 0, 0, false, false, true);
        accounts[_admins[6]] = Account( 17, 0, 0, false, false, true);
        accounts[_admins[7]] = Account( 90, 0, 0, false, false, true);
        accounts[_admins[6]] = Account( 2, 0, 0, false, false, false); // donations account one will go to Good Dollar Donation and one Brest Cancer Donation

        team = _team;
        teamShares = _teamShares;
    }

    // Modifiers

    modifier onlyAdmin() {
        require(accounts[msg.sender].isAdmin == true, "You need to be an admin");
        _;
    }
    /*
    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }
    */

    // End Modifier

    // Setters

    function flipAdmin(address _addr) external onlyOwner {
        accounts[_addr].isAdmin = !accounts[_addr].isAdmin;
    }

    function setProvenanceHash(string memory _provenanceHash) external onlyOwner {
        require(provenanceLock == false, "Provenance is locked");
        provenanceHash = _provenanceHash;
        provenanceLock = true;
    }

    function setBaseURI(string memory _newURI) external onlyAdmin {
        _baseURIExtended = _newURI;
    }

    function setContractURI(string memory _newURI) external onlyAdmin {
        _contractURI = _newURI;
    }

    function deactivateSale() external onlyOwner {
        _isSaleLive = false;
    }

    function activateSale() external onlyOwner {
        _isSaleLive = true;
    }

    function setAccountSupporters(address[] memory _addr, uint8 _walletLimit, bool isEarlySupporter, bool isWhiteList) external onlyAdmin {
        for(uint i = 0; i < _addr.length; i++) {
            accounts[_addr[i]].walletLimit = _walletLimit;
            accounts[_addr[i]].isEarlySupporter = isEarlySupporter;
            accounts[_addr[i]].isWhitelist = isWhiteList;
        }
    }
    /* moving these functions into setAccountSupporters() reduced the contract size by 0.826 KB
        function setEarlySupporters(address[] memory _addr) external onlyAdmin {
            for(uint i = 0; i < _addr.length; i++) {
                accounts[_addr[i]].walletLimit = 10;
                accounts[_addr[i]].isEarlySupporter = true;
            }
        }

        function setEarlySupporters5(address[] memory _addr) external onlyAdmin {
            for(uint i = 0; i < _addr.length; i++) {
                accounts[_addr[i]].walletLimit = 5;
                accounts[_addr[i]].isEarlySupporter = true;
            }
        }

        function setWhitelist(address[] memory _addr) external onlyAdmin {
            for(uint i = 0; i < _addr.length; i++) {
                accounts[_addr[i]].walletLimit = 2;
                accounts[_addr[i]].isWhitelist = true;
            }
        }
    */

    // End Setter

    // Getters

    // For OpenSea
    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    // For Metadata
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIExtended;
    }

    // End Getter

    // Business Logic
/* moving to adminMint reduced contract size by 0.462 KB
    function claimDonations() external onlyAdmin {
        require(totalSupply() + 2 <= (MAX_WIVES - _reserved), "You would exceed the limit");

        _safeMint(donation, 1); // Good Dollar Donation
        _safeMint(donation, 2); // Brest Cancer Donation
        emit Mint(msg.sender, totalSupply());
    }
*/
    function adminMint(uint8 _amount) external onlyAdmin {
        require(accounts[msg.sender].nftsReserved >= _amount, "Reserved supply not enough");
        require(totalSupply() + _amount <= (MAX_WIVES - _reserved), "exceeding the limit");

        accounts[msg.sender].nftsReserved -= _amount;
        _reserved = _reserved - _amount;

        uint id = totalSupply();

        for (uint8 i = 0; i < _amount; i++) {
            id++;
            _safeMint(msg.sender, id);
            emit Mint(msg.sender, totalSupply());
        }
    }

    function airDropMany(address[] memory _addr) external onlyAdmin {
        require(totalSupply() + _addr.length <= (MAX_WIVES - _reserved), "Purchase would exceed max supply");

        // DO MINT
        uint id = totalSupply();

        for (uint8 i = 0; i < _addr.length; i++) {
            id++;
            _safeMint(_addr[i], id);
            emit Mint(msg.sender, totalSupply());
        }
    }

    function mintWife(uint8 _amount) external payable {
        // CHECK BASIC SALE CONDITIONS
        require(_isSaleLive, "Sale must be active");
        require(presaleStart <= block.timestamp, "preSale not started");
        require(_amount > 0, "Must mint at least one token");
        require(totalSupply() + _amount <= (MAX_WIVES - _reserved), "Exceeding max supply");
        require(msg.value >= (dawPrice * _amount), "Value below price");

        if(block.timestamp >= publicSale) {
            require((_amount + accounts[msg.sender].mintedNFTs) <= walletLimit, "you can only mint 3 per wallet");
        } else if(block.timestamp >= presaleEnd) {
            require(false, "Public sale hasn't started");
        } else if(block.timestamp >= presaleStart) {
            require(accounts[msg.sender].isWhitelist || accounts[msg.sender].isEarlySupporter, "you need to be on Whitelist");
            require((_amount + accounts[msg.sender].mintedNFTs) <= accounts[msg.sender].walletLimit, "Wallet Limit Reached");
        }

        // DO MINT
        uint id = totalSupply();

        for (uint8 i = 0; i < _amount; i++) {
            id++;
            accounts[msg.sender].mintedNFTs++;
            _safeMint(msg.sender, id);
            emit Mint(msg.sender, totalSupply());
        }

    }

    function releaseFunds() external onlyAdmin {
        for (uint i = 0; i < team.length; i++) {
            release(payable(team[i]));
        }
    }
}

    // helper
    // can also just use open zeppelins address.sol which implements isContract 
    // EXTCODESIZE returns 0 if it is called from the constructor of a contract. 
    // So if you are using this in a security sensitive setting, you would have 
    // to consider if this is a problem.
    /*
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;

        assembly {
            size := extcodesize(account)
        }

        return size > 0;
    }
    */

