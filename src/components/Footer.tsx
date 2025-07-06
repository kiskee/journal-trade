import { BarChart3, FileText, TrendingUp, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className=" text-white py-8">
      <div className="container mx-auto px-4">
        {/* Links de navegación */}
        <div className="flex flex-col md:flex-row justify-center items-center mb-6">
          <div className="flex gap-6 text-sm mb-4 md:mb-0">
            <Link to="/inicio" className="hover:text-gray-300 transition">
              <button className="flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg text-yellow-200 hover:text-yellow-100 hover:bg-yellow-600/20 transition-colors text-sm cursor-pointer">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden xl:inline">Dashboard</span>
              </button>
            </Link>
            <Link to="/portfolio" className="hover:text-gray-300 transition">
              <button className="flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg text-yellow-200 hover:text-yellow-100 hover:bg-yellow-600/20 transition-colors text-sm cursor-pointer">
                <Wallet className="w-4 h-4" />
                <span className="hidden xl:inline">Portfolio</span>
              </button>
            </Link>
            <Link to="/analytics" className="hover:text-gray-300 transition">
              <button className="flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg text-yellow-200 hover:text-yellow-100 hover:bg-yellow-600/20 transition-colors text-sm cursor-pointer">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden xl:inline">Analytics</span>
              </button>
            </Link>
            <Link to="/notes">
              <button className="flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg text-yellow-200 hover:text-yellow-100 hover:bg-yellow-600/20 transition-colors text-sm cursor-pointer">
                <FileText className="w-4 h-4" />
                <span className="hidden xl:inline">Notas</span>
              </button>
            </Link>
            {/* <Link to="/strategies">
              <button className="flex items-center space-x-2 px-2 xl:px-3 py-2 rounded-lg text-yellow-200 hover:text-yellow-100 hover:bg-yellow-600/20 transition-colors text-sm cursor-pointer">
                <Brain className="w-4 h-4" />
                <span className="hidden xl:inline">Estrategias</span>
              </button>
            </Link> */}
            <Link to="/trade" className="hover:text-gray-300 transition">
              <button className="px-3 xl:px-4 py-2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500 text-black rounded-lg font-medium transition-all duration-200 text-sm cursor-pointer shadow-lg hover:shadow-yellow-500/25">
                <span className="hidden xl:inline">New Entry</span>
                <span className="xl:hidden">New</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Derechos reservados */}
        <p className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} LØNNSOM Journal. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}

{
  /* Íconos sociales */
}
{
  /* <div className="flex gap-4 pl-10">
            <a
              href="https://web.facebook.com/people/EMAS-Pro-Trader/61575051064922/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://www.instagram.com/emasprotrader/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              <FaInstagram size={20} />
            </a>
          </div> */
}
