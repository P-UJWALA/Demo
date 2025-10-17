const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

let provider, wallet, contract;

const init = async () => {
  if (contract) return contract;
  const url = process.env.ETH_PROVIDER_URL;
  if (!url) throw new Error('ETH_PROVIDER_URL missing in .env');
  provider = new ethers.JsonRpcProvider(url); // ethers v6
  // if you need to send transactions, use a private key
  const pk = process.env.PRIVATE_KEY;
  if (pk) wallet = new ethers.Wallet(pk, provider);
  const abiPath = process.env.CONTRACT_ABI_PATH || path.join(__dirname, '../blockchain/build/contracts/FishRegistry.json');
  const raw = JSON.parse(fs.readFileSync(abiPath));
  const abi = raw.abi || raw.contracts?.['FishRegistry.sol']?.abi || raw;
  const address = process.env.CONTRACT_ADDRESS;
  if (!address) throw new Error('CONTRACT_ADDRESS missing in .env');
  contract = new ethers.Contract(address, abi, wallet || provider);
  return contract;
};

const registerBatchOnChain = async (batchId, ownerAddress, metadataHash) => {
  const c = await init();
  if (!wallet) throw new Error('PRIVATE_KEY required to send txs');
  const tx = await c.registerBatch(batchId, ownerAddress, metadataHash);
  const receipt = await tx.wait();
  return receipt;
};

const transferOwnershipOnChain = async (batchId, newOwnerAddress) => {
  const c = await init();
  if (!wallet) throw new Error('PRIVATE_KEY required to send txs');
  const tx = await c.transferOwnership(batchId, newOwnerAddress);
  const receipt = await tx.wait();
  return receipt;
};

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
