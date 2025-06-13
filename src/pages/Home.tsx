import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-5 grid-rows-6 gap-4 w-screen h-screen px-6 pb-20 pt-4">
        <div className="col-span-2 inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-center text-white">Lista de trades realizados</div>
        <div className="col-span-2 col-start-4 row-start-1 inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-center text-white">
          calculadora here
        </div>
        <div className="col-span-5 col-start-1 row-start-2 inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-center">
          3
        </div>
        <div className="row-span-2 col-start-1 row-start-3 inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-center">
          4
        </div>
        <div className="row-span-2 col-start-2 row-start-3 inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-center">
          5
        </div>
        <div className="row-span-2 col-start-3 row-start-3 inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-center">
          6
        </div>
        <div className="row-span-2 col-start-4 row-start-3 inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-center">
          7
        </div>
        <div className="row-span-2 col-start-5 row-start-3 inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-center">
          8
        </div>
        <div className="row-span-2 col-start-1 row-start-5 inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-center">
          9
        </div>
        <div className="row-span-2 col-start-2 row-start-5 inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-center">
          10
        </div>
        <div className="row-span-2 col-start-3 row-start-5 inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-center">
          11
        </div>
        <div className="row-span-2 col-start-4 row-start-5 inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-center">
          12
        </div>
        <div className="row-span-2 col-start-5 row-start-5 inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-center">
          13
        </div>
        <div className="col-start-3 row-start-1  flex items-center justify-center p-6 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
          {/* <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"></div> */}
          <Link
            to="/trade"
            className="px-8 py-4 bg-blue-700 text-white rounded-md text-lg font-semibold shadow-md shadow-emerald-400 hover:bg-violet-700 hover:shadow-lg hover:shadow-blue-400 transition duration-300 ease-in-out text-center"
          >
            Registra tu primera operación
          </Link>
        </div>
      </div>
    </>
  );
}
