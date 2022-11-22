const { getNamedAccounts, deployments, network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

async function main() {
  const { deploy, log } = deployments;
  const deployer =
    "1cd6e55af3a99a6b0f33c086f77b680e9169eb5dbc82a2cec763d0c58e30d804";
  log("----------------------------------------------------");
  log("Deploying formaCar and waiting for confirmations...");
  const arguments = ["Formacarc", "car"];
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
