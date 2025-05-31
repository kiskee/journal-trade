import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className=" text-white py-8">
      <div className="container mx-auto px-4">
        {/* Links de navegación */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex gap-6 text-sm mb-4 md:mb-0">
            <Link to="/inicio" className="hover:text-gray-300 transition">
              Inicio
            </Link>
            <Link to="/about" className="hover:text-gray-300 transition">
              Acerca
            </Link>
            <Link to="/services" className="hover:text-gray-300 transition">
              Servicios
            </Link>
            <Link to="/contact" className="hover:text-gray-300 transition">
              Contacto
            </Link>
          </div>

          {/* Íconos sociales */}
          <div className="flex gap-4 pl-10">
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
          </div>
        </div>

        {/* Derechos reservados */}
        <p className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Journal Kiss. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
