import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import crowdfundingArtifact from "./CrowdfundingABI.json";
import rewardTokenArtifact from "./RewardTokenABI.json";

const crowdfundingABI = crowdfundingArtifact.output.abi;
const rewardTokenABI = rewardTokenArtifact.output.abi;

// Replace with your deployed addresses
const crowdfundingAddress = import.meta.env.VITE_CROWDFUNDING_ADDRESS
const rewardTokenAddress = import.meta.env.VITE_REWARD_ADDRESS

export default function CrowdfundingApp() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [rewardToken, setRewardToken] = useState(null);
  const [totalRaised, setTotalRaised] = useState("0");
  const [contribution, setContribution] = useState("0");
  const [rwdBalance, setRwdBalance] = useState("0");
  const [amount, setAmount] = useState("");

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask not found!");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    setContract(new ethers.Contract(crowdfundingAddress, crowdfundingABI, signer));
    setRewardToken(new ethers.Contract(rewardTokenAddress, rewardTokenABI, signer));
  };

  // Load stats including RWD balance
  const loadData = async () => {
    if (!contract || !rewardToken || !account) return;

    const raised = await contract.totalRaised();
    setTotalRaised(ethers.formatEther(raised));

    const contrib = await contract.contributions(account);
    setContribution(ethers.formatEther(contrib));

    const balance = await rewardToken.balanceOf(account);
    const decimals = await rewardToken.decimals();
    setRwdBalance(ethers.formatUnits(balance, decimals));
  };

  // Fund project
  const fundProject = async () => {
    if (!amount) return alert("Enter amount");
    const tx = await contract.fund({ value: ethers.parseEther(amount) });
    await tx.wait();
    await loadData(); // immediately update balances
  };

  // Withdraw (owner only)
  const withdraw = async () => {
    const tx = await contract.withdraw();
    await tx.wait();
    await loadData();
  };

  useEffect(() => {
    if (account) loadData();
  }, [account, contract]);

  return (
    <div className="">
      <h1 className="">🚀 Crowdfunding DApp</h1>

      {!account ? (
        <button onClick={connectWallet} className="bg-blue-500 text-white px-4 py-2 rounded">
          Connect Wallet
        </button>
      ) : (
        <div>
          <p><b>Connected:</b> {account}</p>
          <p><b>Total Raised:</b> {totalRaised} ETH</p>
          <p><b>Your Contribution:</b> {contribution} ETH</p>
          <p><b>Your RWD Balance:</b> {rwdBalance} RWD</p>

          <input
            type="text"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-full my-2"
                    style={{border: "none", outline: "1px solid gray", marginRight: 10, padding: 5, borderRadius: "5px"}}
          />
          <button onClick={fundProject} className="bg-green-500 text-white px-4 py-2 rounded">
            Fund Project
          </button>

          <button onClick={withdraw} className="bg-red-500 text-white px-4 py-2 rounded ml-2">
            Withdraw (Owner only)
          </button>
        </div>
      )}
    </div>
  );
}
