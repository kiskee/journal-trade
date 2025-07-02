import SingleSocket from "./SingleSocket";

const LivePrices = () => {
  const pairs = [
    { coin: "XAU_USD" },
    { coin: "BTC_USD" },
    { coin: "EUR_USD" },
    { coin: "USD_JPY" },
  ];
  return (
    <>
      <div className="grid grid-cols-2 grid-rows-2 justify-items-center ss:flex ss:flex-row ss:gap-4 sm:gap-8 items-center w-screen content-center justify-center px-2 border-b-2 border-yellow-600/50 shadow-md shadow-yellow-600/30 py-1 bg-gradient-to-r from-black via-neutral-900 to-black">
        {pairs.map(({ coin }) => (
          <div
            key={coin}
            className="bg-yellow-600/10 rounded-lg px-2 py-1 border border-yellow-600/20 hover:border-yellow-500/40 transition-colors"
          >
            <span className="text-yellow-400 text-sm ss:text-xl text-center font-medium">
              {coin}:{" "}
            </span>
            <SingleSocket coin={coin} />
          </div>
        ))}
      </div>
    </>
  );
};

export default LivePrices;
