import { getContract } from "@/utils/contract";

export async function uploadHash(
  hash: string,
  maxRetries: number = 3
): Promise<{ success: boolean; txHash?: string; error?: string; message?: string }> {
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
      lastError = err;
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s
        const delayMs = attempt * 1000;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || "Blockchain transaction failed after retries.",
    message: lastError?.message || "Failed to upload hash to the blockchain.",
  };
}
