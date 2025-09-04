What This Crowdfunding dApp Does

Smart Contracts (On-Chain Logic)

Crowdfunding contract

Accepts ETH contributions from anyone.

Keeps track of how much each user contributed.

Automatically gives rewards in tokens (RWD) to contributors.

Allows only the project owner to withdraw the total funds raised.

RewardToken contract (ERC20 token)

A custom token (RWD) that acts as a reward for contributors.

1 ETH = 100 RWD (minted automatically when funding).

Ownership of the token is transferred to the Crowdfunding contract so it alone can mint new tokens fairly.

Frontend (React + Ethers.js)

Users can connect their MetaMask wallet to the dApp.

Shows:

Connected wallet address.

Total ETH raised so far.

User’s personal contribution amount.

User’s reward balance (RWD tokens earned).

Provides actions:

Contribute ETH to the project.

Withdraw funds (only visible/usable by the contract owner).

Security & Ownership

Only the Crowdfunding contract can mint reward tokens.

Only the project owner (the deployer of Crowdfunding) can withdraw raised ETH.

All contributions and rewards are stored transparently on-chain, so users can trust the system.
