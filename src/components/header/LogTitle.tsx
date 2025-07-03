import { Link } from "react-router-dom";
import toro from "../../assets/toro.png";

const LogTitle = () => {
  return (
    <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Link to="/">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg hover:shadow-yellow-400/30 transition-all duration-200 p-0.5 sm:p-1">
            <img
              src={toro}
              alt="LØNNSOM Logo"
              className="w-full h-full object-contain "
            />
          </div>
        </Link>
        <Link to="/">
          <h1 className="text-base sm:text-xl font-bold text-white truncate hover:text-yellow-100 transition-colors">
            <span className="">LØNNSOM </span>
            {/* <span className="sm:hidden">L</span> */}
            <span className="text-yellow-400"> Tracker</span>
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default LogTitle;
