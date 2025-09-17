import { useState } from "react";
import { detectLiveness } from "../../lib/actions/livenessDetector.actions";

export function useLivenessDetector() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkLiveness = async (file: File | Blob | null) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!file) throw new Error("No file provided");

      // Directly call detectLiveness with the File/Blob
      const res = await detectLiveness(file);
      setResult(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Liveness detection failed");
      setResult(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, error, checkLiveness };
}
