// FileRegistry.sol
pragma solidity ^0.8.0;

contract FileRegistry {
    struct File {
        string filename;
        string storjPath;
        uint256 size;
        string mimeType;
        address owner;
        uint256 timestamp;
        mapping(address => bool) accessList;
    }

    mapping(bytes32 => File) public files;

    event FileUploaded(bytes32 indexed fileHash, string filename, address owner);
    event FileDeleted(bytes32 indexed fileHash, address deleter);
    event FileAccessUpdated(bytes32 indexed fileHash, address user, bool hasAccess);
    event FileTransferred(bytes32 indexed fileHash, address from, address to);
    event FileAccessed(bytes32 indexed fileHash, address accessor);

    function uploadFile(bytes32 _fileHash, string memory _filename, string memory _storjPath, uint256 _size, string memory _mimeType) public {
        require(files[_fileHash].owner == address(0), "File already exists");
        
        File storage newFile = files[_fileHash];
        newFile.filename = _filename;
        newFile.storjPath = _storjPath;
        newFile.size = _size;
        newFile.mimeType = _mimeType;
        newFile.owner = msg.sender;
        newFile.timestamp = block.timestamp;
        newFile.accessList[msg.sender] = true;
        
        emit FileUploaded(_fileHash, _filename, msg.sender);
    }

    function deleteFile(bytes32 _fileHash) public {
        require(files[_fileHash].owner == msg.sender, "Only owner can delete the file");
        
        delete files[_fileHash];
        
        emit FileDeleted(_fileHash, msg.sender);
    }

    function updateFileAccess(bytes32 _fileHash, address _user, bool _hasAccess) public {
        require(files[_fileHash].owner == msg.sender, "Only owner can update access");
        
        files[_fileHash].accessList[_user] = _hasAccess;
        
        emit FileAccessUpdated(_fileHash, _user, _hasAccess);
    }

    function transferFile(bytes32 _fileHash, address _newOwner) public {
        require(files[_fileHash].owner == msg.sender, "Only owner can transfer the file");
        
        files[_fileHash].owner = _newOwner;
        files[_fileHash].accessList[_newOwner] = true;
        
        emit FileTransferred(_fileHash, msg.sender, _newOwner);
    }

    function getFile(bytes32 _fileHash) public view returns (string memory, string memory, uint256, string memory, address, uint256, bool) {
        File storage file = files[_fileHash];
        require(file.accessList[msg.sender], "You don't have access to this file");
        
        emit FileAccessed(_fileHash, msg.sender);
        
        return (file.filename, file.storjPath, file.size, file.mimeType, file.owner, file.timestamp, true);
    }

    function checkFileAccess(bytes32 _fileHash, address _user) public view returns (bool) {
        return files[_fileHash].accessList[_user];
    }
}