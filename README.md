# HEAD - Housing Estate Association Decentralized

![HEAD](public/image.png)


HEAD (Housing Estate Association Decentralized) is a blockchain-based application for managing housing estates. It provides a decentralized platform for property management, resident finance governance, and AI-assisted planning.

## Technologies Used

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Blockchain Interaction**: Viem
- **Authentication**: NextAuth.js with WorldCoin integration

## Smart Contracts


The project so far uses two main smart contracts:

1. `DPMAFactory`: For deploying and managing individual property contracts.
2. `Property`: Represents an individual housing estate and manages its finances and residents.

Smart contract reop: (DPMA Core Contracts)(https://github.com/Abhishekkochar/PMA)

## Scroll testnet contracts

### DPMA factory
[0x2C3A5ad03e766CFF6fa7911eFa184cFe04235382](https://sepolia.scrollscan.com/address/0x2C3A5ad03e766CFF6fa7911eFa184cFe04235382)

### Controller
[0x64934671E64C6d1EEb92eF9085B72bA6aF9c69fB](https://sepolia.scrollscan.com/address/0x64934671E64C6d1EEb92eF9085B72bA6aF9c69fB)

### Mock ERC20
[0x5920257792dbba08dfadd34607b781e3c2cdb3cf](https://sepolia.scrollscan.com/address/0x5920257792dbba08dfadd34607b781e3c2cdb3cf)

### Multiple Tests Deploys Scroll
[Transaction/Calls](https://sepolia.scrollscan.com/address/0x87f603924309889B39687AC0A1669b1E5a506E74)

### ORA PromptNestedInference on Manta Testnet 
[0x93012953008ef9AbcB71F48C340166E8f384e985](https://pacific-explorer.sepolia-testnet.manta.network/address/0x93012953008ef9AbcB71F48C340166E8f384e985?tab=contract)



These contracts are deployed on the (Scroll/Manta) network. Users need a wallet (e.g., MetaMask) connected to the Scroll network to interact with the application.

## Progressing on ...

- Integration with Viem for blockchain interactions
- WorldCoin authentication setup
- Landing page with estate sign-up functionality
- Dashboard page structure
- Contract interaction functions for deploying properties and managing members

## TODO

## Planned Features

- Estate registration and management
- Decentralized finance management for housing estate associations
- Resident onboarding and fee management
- Proposal creation and voting system
- AI-assistant (Homy powered by ORA Onchain-AI Oracle)
- Resident information chatbot for up-to-date estate information and proposal guidance

1. **Smart Contract Integration**
   - [ ] Integrate deployed `DPMAFactory` and `Property` contracts with the frontend
   - [ ] Implement contract interactions for estate management features

2. **Frontend Development**
   - [ ] Complete n connect the estate management dashboard
   - [ ] Implement the proposal creation and voting system UI
   - [ ] Develop a fee management interface for residents

3. **AI Assistant (Homy)**
   - [ ] Implement the AI planning assistant functionality
   - [ ] Create the proposal writing feature
   - [ ] Develop the resident information chatbot interface

## Key Components

- `EstateSignUp`: Component for registering a new housing estate.
- `PropertyManagement`: Component for managing an existing property, including adding members and paying fees.
- `Dashboard`: Overview of the user's estates and management options.
- `AIAssistant`: Component for AI-assisted planning, proposal writing, and resident information queries.

## Blockchain Interaction

The project uses Viem for interacting with the Scroll network. Key functions for contract interactions are located in `src/lib/contractFunctions.ts`.

## Authentication

Authentication is handled through NextAuth.js with WorldCoin integration, providing a secure and privacy-preserving login method.

## AI Assistant (Homy)

Homy, powered by ORA Onchain-AI Oracle, serves as:
- A planning assistant for estate management
- A proposal writer to help formulate and structure estate proposals
- An information chatbot where residents can inquire about up-to-date information regarding their estate

