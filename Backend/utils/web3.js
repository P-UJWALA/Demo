require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

let provider, wallet, contract;

const init = async () => {
  if (contract) return contract;

  // 1. Connect to Ganache
  const url = process.env.ETH_PROVIDER_URL;
  if (!url) throw new Error("ETH_PROVIDER_URL missing in .env");
  provider = new ethers.JsonRpcProvider(url); // ethers v6

  // 2. Load wallet for transactions
  const pk = process.env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY missing in .env");
  wallet = new ethers.Wallet(pk, provider);

  // 3. Load ABI
  const abiPath = process.env.CONTRACT_ABI_PATH || path.join(__dirname, "../deployed/FishRegistry.abi.json");
  const raw = JSON.parse(fs.readFileSync(abiPath, "utf-8"));
  const abi = raw.abi || raw.contracts?.['FishRegistry.sol']?.abi || raw;

  // 4. Load contract address
  const address = process.env.CONTRACT_ADDRESS;
  if (!address) throw new Error("CONTRACT_ADDRESS missing in .env");

  // 5. Connect to contract
  contract = new ethers.Contract(address, abi, wallet);
  return contract;
};

// Register a batch
const registerBatchOnChain = async (batchId, ownerAddress, metadataHash) => {
  const c = await init();
  const tx = await c.registerBatch(batchId, ownerAddress, metadataHash);
  return await tx.wait();
};

// Transfer ownership
const transferOwnershipOnChain = async (batchId, newOwnerAddress) => {
  const c = await init();
  const tx = await c.transferOwnership(batchId, newOwnerAddress);
  return await tx.wait();
};

// Get batch details
const getBatchDetailsOnChain = async (batchId) => {
  const c = await init();
  return await c.getBatchDetails(batchId);
};

module.exports = {
  init,
  registerBatchOnChain,
  transferOwnershipOnChain,
  getBatchDetailsOnChain
};
