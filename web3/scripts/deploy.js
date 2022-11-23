const { getNamedAccounts, deployments, network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

async function main() {
  const { deploy, log } = deployments;
  const deployer =
    "e1844147471c4d0cf6f530e57d16725f3780d23c9c1537c3f87e61c022db7ac5";
  log("----------------------------------------------------");
  log("Deploying formaCar and waiting for confirmations...");
  const arguments = [
    "Forsadma",
    "car",
    "https://ipfs.io/ipfs/QmVLxtgyGbcL7hpZRnAWBvNwMD8NWAKh9qqGvCXQ1z5JK5/",
    "0x3ED13d767D4B99904230a32AA4D62b78CA2514fb",
  ];
  const Formacar = await deploy("formaCar", {
    from: deployer,
    args: arguments,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`formaCar deployed at ${Formacar.address}`);
  const chainId = network.config.chainId;
  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    await verify(Formacar.address, arguments);
  }
}

main();
