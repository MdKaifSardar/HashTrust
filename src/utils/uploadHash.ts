import { getContract } from "@/utils/contract";

export async function uploadHash(hash: string): Promise<{ success: boolean; txHash?: string; error?: string; message?: string }> {
  try {
    const contract = getContract();
    const tx = await contract.storeHash(hash);
    await tx.wait();
    return {
      success: true,
      txHash: tx.hash,
      message: "Hash successfully uploaded to the blockchain.",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Blockchain transaction failed.",
      message: err?.message || "Failed to upload hash to the blockchain.",
    };
  }
}
