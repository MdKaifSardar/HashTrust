import { ethers } from "ethers";
import HashStorageAbi from "./contracts/HashStorage.json";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

export const getContract = () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, HashStorageAbi.abi, wallet);
  return contract;
};
