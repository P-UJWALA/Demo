const { registerBatchOnChain, getBatchDetailsOnChain } = require("../utils/web3");

(async () => {
  // Register a batch
  const receipt = await registerBatchOnChain(0, "0xabc...123", "QmHash");
  console.log("Batch registered:", receipt.transactionHash);

  // Fetch details
  const batch = await getBatchDetailsOnChain(0);
  console.log("Batch info:", batch);
})();
