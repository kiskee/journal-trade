import { useEffect, useState, type JSX } from "react";
import {
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import ModuleService from "@/services/moduleService";

interface NewsItem {
  Outcome: string;
  Quality: string;
  Currency: string;
  Forecast: number;
  Previous: number;
  Actual: number;
  Date: string;
  Strength: string;
  Name: string;
}

// interface NewsResponse {
//   date: string;
//   id: string;
//   data: NewsItem[];
// }

type StrengthType = "Strong Data" | "Weak Data" | "Data Not Loaded";
type QualityType = "Good Data" | "Data Not Loaded";
type CurrencyType = "USD" | "GBP" | "EUR" | "JPY";

const News = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initial = async (): Promise<void> => {
      try {
        const response = await ModuleService.news.today();
        const items = response.data.results.data;
        setNewsData(items);
        //console.log(mockResults.data)
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    initial();
  }, []);

  // [...newsData]
  //             .sort((a, b) => {
  //               const dateA = new Date(
  //                 new Date(
  //                   a.Date.replace(/\./g, "-").replace(" ", "T")
  //                 ).getTime() -
  //                   8 * 60 * 60 * 1000
  //               );
  //               const dateB = new Date(
  //                 new Date(
  //                   b.Date.replace(/\./g, "-").replace(" ", "T")
  //                 ).getTime() -
  //                   8 * 60 * 60 * 1000
  //               );
  //               return dateA.getTime() - dateB.getTime(); // ascendente
  //             })

  const getStrengthColor = (strength: string): string => {
    switch (strength as StrengthType) {
      case "Strong Data":
        return "bg-green-100 text-green-800 border-green-200";
      case "Weak Data":
        return "bg-red-100 text-red-800 border-red-200";
      case "Data Not Loaded":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getQualityIcon = (quality: string): JSX.Element => {
    switch (quality as QualityType) {
      case "Good Data":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "Data Not Loaded":
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
  };

  const getCurrencyFlag = (currency: string): string => {
    const flags: Record<CurrencyType, string> = {
      USD: "🇺🇸",
      GBP: "🇬🇧",
      EUR: "🇪🇺",
      JPY: "🇯🇵",
    };
    return flags[currency as CurrencyType] || "🌍";
  };

  if (loading) {
    return (
      <div className="w-full h-full border-2 border-amber-400 shadow-md shadow-amber-400 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-amber-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i: number) => (
              <div key={i} className="h-20 bg-amber-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-250 h-full border-2 border-amber-400 shadow-md shadow-amber-400 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Financial News Today
          </h2>
          <div className="text-white text-sm">
            {new Date().toLocaleDateString("es-ES")}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {newsData.map((item: NewsItem, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {getCurrencyFlag(item.Currency)}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {item.Currency}
                  </span>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(
                      new Date(
                        item.Date.replace(/\./g, "-").replace(" ", "T")
                      ).getTime() -
                        8 * 60 * 60 * 1000
                    ).toLocaleTimeString("es-CO", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "America/Bogota",
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getQualityIcon(item.Quality)}
                  <span
                    className={`px-2 py-1 rounded-full text-xs border ${getStrengthColor(
                      item.Strength
                    )}`}
                  >
                    {item.Strength}
                  </span>
                </div>
              </div>

              <h3 className="font-medium text-gray-900 mb-2">{item.Name}</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Forecast:</span>
                  <span className="font-medium ml-1">{item.Forecast}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Previous:</span>
                  <span className="font-medium ml-1">{item.Previous}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Actual:</span>
                  <span className="font-medium ml-1">{item.Actual}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Quality:</span>
                  <span className="font-medium ml-1 text-xs">
                    {item.Quality}
                  </span>
                </div>
              </div>

              {item.Outcome !== "Data Not Loaded" && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                  <strong>Outcome:</strong> {item.Outcome}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-2 border-t">
        <p className="text-sm text-gray-600 text-center">
          {newsData.length} eventos económicos para hoy
        </p>
      </div>
    </div>
  );
};

export default News;
