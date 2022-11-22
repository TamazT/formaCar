const {
  MerkleTree,
} = require("/home/tamaztamaz/NFTNFT/node_modules/merkletreejs/dist/index.js");
const keccak256 = require("/home/tamaztamaz/NFTNFT/node_modules/keccak256/dist/keccak256.js");

const whitelistAddress = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
];

const leafNodes = whitelistAddress.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, {
  sortPairs: true,
});
const roothash = merkleTree.getRoot().toString("Hex");
console.log("0x" + roothash);
const hashedAddress = keccak256("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
let proof = merkleTree.getHexProof(hashedAddress);
console.log(proof);
