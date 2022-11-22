const { ethers } = require("hardhat");
const {
  MerkleTree,
} = require("/home/tamaztamaz/NFTNFT/node_modules/merkletreejs/dist/index.js");
const keccak256 = require("/home/tamaztamaz/NFTNFT/node_modules/keccak256/dist/keccak256.js");
const { setTimeout } = require("timers/promises");

const whitelistAddress = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
];
const leafNodes = whitelistAddress.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, {
  sortPairs: true,
});
const roothash = merkleTree.getRoot().toString("Hex");

/* const hashedAddress = keccak256("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
let proof = merkleTree.getHexProof(hashedAddress); */

const provider = new ethers.providers.getDefaultProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/HmhxDKbD_E6eAnDuRRtR_mm8wN89zwNr"
); //сюда нужна вставить провайдера сети в которой должне работать скрипт
let listOfPRrivateKeys = [];

const contractAddrees = ""; // адрес развернутого контракта
const contractABI = ""; //ABI контракта
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

async function mintForBots() {
  for (let i = 0; i < listOfPRrivateKeys.length; i++) {
    let privateKey = new ethers.Wallet(listOfPRrivateKeys[i]);
    let Signer = privateKey.connect(provider);
    const contract = new ethers.Contract(contractAddrees, contractABI, Signer);
    let hashedAddress = keccak256(Signer.address);
    let proof = merkleTree.getHexProof(hashedAddress);
    await contract.mintWl(proof);
    let a = getRandomArbitrary(1000, 10000);
    await setTimeout(a);
  }
}

mintForBots();
