
# Decentralized File Storage System

## Project Overview

This project is a decentralized file storage system that leverages blockchain technology and distributed storage solutions. It aims to provide secure, transparent, and efficient file management capabilities.

## Features (In Development)

1. User Authentication
2. File Upload and Storage
3. File Retrieval
4. File Sharing
5. File Transfer
6. File Deletion
7. File History Tracking
8. Blockchain Integration for File Metadata
9. Distributed Storage using Storj

## Tech Stack

- Backend: Node.js with Express.js
- Database: MongoDB
- Blockchain: Ethereum (Sepolia testnet)
- Smart Contracts: Solidity
- Distributed Storage: Storj
- File Handling: Multer
- Authentication: JWT
- Environment Variables: dotenv

## Project Structure

```
backend/
├── config.env
├── contracts/
│   └── FileRegistry.sol
├── controllers/
│   ├── FileController.js
│   └── UserController.js
├── models/
│   ├── File.js
│   └── User.js
├── routes/
│   ├── FileRoutes.js
│   └── UserRoutes.js
├── scripts/
│   └── deploy.js
├── utils/
│   ├── authorization.js
│   ├── blockchainUtils.js
│   └── storj.js
├── db_connection.js
└── server.js
```

## Development Status

This project is currently in active development. Features are being implemented and tested. The current focus is on:

1. Completing and testing all API endpoints
2. Enhancing blockchain integration
3. Improving error handling and security measures
4. Implementing front-end interface (planned)

## API Endpoints

### User Routes
- POST `/user/signup`: Create a new user
- POST `/user/login`: User login
- GET `/user/profile`: Get user profile (authenticated)
- PUT `/user/:id`: Update user profile (authenticated)
- GET `/user/logout`: User logout (authenticated)

### File Routes
- POST `/file/upload`: Upload a file (authenticated)
- GET `/file/:id`: Retrieve a file by ID
- POST `/file/share`: Share a file with another user
- POST `/file/transfer`: Transfer file ownership
- GET `/file/history/:id`: Get file history
- DELETE `/file/:id`: Delete a file

## Smart Contract

The `FileRegistry` smart contract (located in `contracts/FileRegistry.sol`) manages file metadata on the blockchain. It includes functions for:

- Uploading files
- Deleting files
- Updating file access
- Transferring file ownership
- Retrieving file information
- Checking file access permissions

## Blockchain Integration

Blockchain utilities are implemented in `utils/blockchainUtils.js`, providing functions to interact with the smart contract for various file operations.

## Distributed Storage

File storage is handled using Storj, with utility functions in `utils/storj.js` for uploading and retrieving files.

## Database

MongoDB is used for storing user information and additional file metadata. Database connection is managed in `db_connection.js`.

## Authentication and Authorization

JWT-based authentication is implemented, with middleware for checking user authentication and authorization in `utils/authorization.js`.


## Future Enhancements

- Implement file encryption
- Add support for file versioning
- Develop a user-friendly front-end interface
- Implement additional blockchain features (e.g., tokenization)
- Enhance scalability and performance optimizations

## Contributing

As this project is in development, contributions are welcome. Please follow standard GitHub pull request procedures for any contributions.

