import Calculator from "@/components/calculator/Calculator";

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center gap-6 p-4 pt-8">
        <h1 className="text-5xl text-white text-center">
          {" "}
          Resgistra tus operaciones en tu journal personal{" "}
        </h1>
        <Link
          to="/trade"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg text-lg font-semibold text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Registra tu primera operación
        </Link>
        <div className=" border-blue-600 p-8 rounded-md border-4 shadow-xl shadow-blue-800 flex flex-col items-center">
          <h1 className="text-3xl text-blue-600 text-center pb-6">
            {" "}
            Calculadora de Lotajes{" "}
          </h1>
          <h1 className="text-2xl text-white text-center">
            {" "}
            Calcula Rapidamente tus lotajes{" "}
          </h1>
          <Calculator />
        </div>
      </div>
    </>
  );
}
