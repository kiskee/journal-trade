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
      <div className="grid grid-cols-2 grid-rows-2  justify-items-center ss:flex  ss:flex-row ss:gap-4 sm:gap-8 items-center w-full content-center justify-center px-2">
        {pairs.map(({ coin }) => (
          <div key={coin} className="">
            <span className="text-blue-600 text-sm ss:text-xl text-center">{coin}: </span>
            <SingleSocket coin={coin} />
          </div>
        ))}
      </div>
    </>
  );
};

export default LivePrices;
