import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import { contractAddress, contractabi, wlAdresses } from "./constant.js";
const { keccak256 } = ethers.utils;

//Создаем меркл руут для добавления в контракт
function getRootHash(adresses) {
  const leafNodes = adresses.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, {
    sortPairs: true,
  });
  const roothash = merkleTree.getRoot().toString("Hex");
  console.log("0x" + roothash);
}
//Создаем пруф для вл минта
function getProof(signerAddress) {
  const leafNodes = adresses.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, {
    sortPairs: true,
  });
  const roothash = merkleTree.getRoot().toString("Hex");
  const hashedAddress = keccak256(signerAddress);
  let proof = merkleTree.getHexProof(hashedAddress);
  return proof;
}

//Возврашает количество сминченных нфт на вайтлисте
async function wlMinted() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractabi, signer);
  let wlMinted = await contract.wlMintedAlready();
  return wlMinted;
}

async function mintWL() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const accounts = await ethereum.request({ method: "eth_accounts" });
  const contract = new ethers.Contract(contractAddress, contractabi, signer);
  let proof = getProof(accounts[0]);
  let transactionResponse = contract.mintWL(proof);
}

async function mintPublic() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractabi, signer);
  let transactionResponse = contract.mintPublic(amount, { value: 3 });
}
getRootHash(wlAdresses);
