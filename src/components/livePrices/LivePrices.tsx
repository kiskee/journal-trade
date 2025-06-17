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
      <div className="w-full overflow-hidden whitespace-nowrap ">
        <div className="animate-scroll inline-block">
          {[...Array(3)].flatMap((_, i) =>
            pairs.map(({ coin }, idx) => (
              <span
                key={`${coin}-${i}-${idx}`}
                className="inline-flex items-center mx-6 text-blue-600 text-lg sx:text-xl font-semibold"
              >
                {coin}: <SingleSocket coin={coin} />
              </span>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default LivePrices;
