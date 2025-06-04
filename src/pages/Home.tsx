import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-4 grid-rows-4 gap-4 w-screen h-screen p-8">
        <div className="shadow-sm shadow-blue-400">1</div>
        <div className="col-span-2 shadow-sm shadow-blue-400 flex items-center justify-center h-full">
          <Link
            to="/trade"
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-blue-400"
          >
            Registra tu primera operación
          </Link>
        </div>
        <div className="col-start-4 shadow-sm shadow-blue-400">4</div>
        <div className="row-start-2 shadow-sm shadow-blue-400">5</div>
        <div className="row-start-2 shadow-sm shadow-blue-400">6</div>
        <div className="row-start-2 shadow-sm shadow-blue-400">7</div>
        <div className="row-start-2 shadow-sm shadow-blue-400">8</div>
        <div className="shadow-sm shadow-blue-400">9</div>
        <div className="shadow-sm shadow-blue-400">10</div>
        <div className="row-start-3 shadow-sm shadow-blue-400">11</div>
        <div className="shadow-sm shadow-blue-400">12</div>
        <div className="shadow-sm shadow-blue-400">13</div>
        <div className="shadow-sm shadow-blue-400">14</div>
        <div className="row-start-4 shadow-sm shadow-blue-400">15</div>
        <div className="shadow-sm shadow-blue-400">16</div>
      </div>
    </>
  );
}
