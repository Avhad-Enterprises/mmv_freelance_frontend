
import { useEffect, useState } from "react";

const useDecodedToken = () => {
  const [decoded, setDecoded] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const base64Payload = token.split(".")[1];
          const decodedPayload = JSON.parse(atob(base64Payload));
          setDecoded(decodedPayload);
        } catch (err) {
          console.error("Token decode error", err);
          setDecoded(null);
        }
      }
    }
  }, []);

  return decoded;
};

export default useDecodedToken;
