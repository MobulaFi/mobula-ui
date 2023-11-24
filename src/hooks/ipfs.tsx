import { useEffect, useState } from "react";

export const useIPFS = () => {
  const [ipfs, setIPFS] = useState<any>();

  const mountIPFS = async () => {
    const ipfsBuffer = (await import("ipfs-api")).default({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: `Basic ${Buffer.from(
          "2DLLzdU8wEpTunsHRcXNvZmkfPY" +
            ":" +
            "28d164f3b68deade8ed60d77fb111ee6"
        ).toString("base64")}`,
      },
    });
    try {
      setIPFS(ipfsBuffer);
    } catch (e) {
      console.error("Failed to mount IPFS", e);
    }
  };

  useEffect(() => {
    mountIPFS();
  }, []);

  return ipfs;
};
