import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Candle {
  mid: {
    c: string;
  };
}

interface ApiResponse {
  candles: Candle[];
}

interface SingleSocketProps {
  coin: string;
}

const SingleSocket = ({ coin }: SingleSocketProps) => {
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<"up" | "down" | null>(null);
  const prevPrice = useRef<number | null>(null);
  const oandaToken = import.meta.env.VITE_OANDA as string;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchPrice = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `https://api-fxpractice.oanda.com/v3/instruments/${coin}/candles`,
          {
            params: {
              count: 1,
              granularity: "S5",
              price: "M",
            },
            headers: {
              Authorization: `Bearer ${oandaToken}`,
              "Content-Type": "application/json",
              "Accept-Datetime-Format": "RFC3339",
            },
          }
        );

        const candle = response.data?.candles?.[0];
        const currentPrice = parseFloat(candle?.mid?.c);

        if (!isNaN(currentPrice)) {
          if (prevPrice.current !== null && currentPrice !== prevPrice.current) {
            setChange(currentPrice > prevPrice.current ? "up" : "down");
            setTimeout(() => setChange(null), 500); // Reset after 0.5s
          }
          prevPrice.current = currentPrice;
          setPrice(currentPrice);
        }
      } catch (error) {
        console.error("Error al obtener el precio:", error);
      }
    };

    if (coin) {
      fetchPrice();
      interval = setInterval(fetchPrice, 1000);
    }

    return () => clearInterval(interval);
  }, [coin]);

  const getColor = (): string => {
    if (change === "up") return "text-green-500";
    if (change === "down") return "text-red-500";
    return "text-white";
  };

  return (
    <span className={`transition-colors duration-500 ${getColor()}`}>
      {price !== null ? price.toFixed(3) : "--"}
    </span>
  );
};

export default SingleSocket;
