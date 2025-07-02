import { useEffect, useState } from "react";
import { Newspaper, Filter } from "lucide-react";
import ModuleService from "@/services/moduleService";
import NewsCard from "./NewsCard";
import { Button } from "../ui/button";

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

const NewsSkeleton = () => (
  <div className="bg-neutral-800/50 border-l-4 border-neutral-700 border-y border-r border-neutral-700 rounded-lg p-4 flex gap-4 items-start animate-pulse">
    <div className="w-16 flex-shrink-0">
      <div className="h-6 bg-neutral-700 rounded w-full mb-1"></div>
      <div className="h-4 bg-neutral-700 rounded w-3/4 mx-auto"></div>
    </div>
    <div className="flex-grow">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neutral-700 rounded-full"></div>
          <div className="w-12 h-5 bg-neutral-700 rounded"></div>
        </div>
        <div className="w-24 h-6 bg-neutral-700 rounded-full"></div>
      </div>
      <div className="h-5 bg-neutral-700 rounded w-full mb-4"></div>
      <div className="grid grid-cols-3 gap-2">
        <div className="h-12 bg-neutral-700/50 rounded-md"></div>
        <div className="h-12 bg-neutral-700/50 rounded-md"></div>
        <div className="h-12 bg-neutral-700/50 rounded-md"></div>
      </div>
    </div>
  </div>
);

const News = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNews = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await ModuleService.news.today();
        const items = response.data.results.data;
        const sortedItems = items.sort((a: NewsItem, b: NewsItem) => {
          const dateA = new Date(a.Date.replace(/\./g, "-").replace(" ", "T")).getTime();
          const dateB = new Date(b.Date.replace(/\./g, "-").replace(" ", "T")).getTime();
          return dateA - dateB;
        });
        setNewsData(sortedItems);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="bg-black border-4 border-yellow-600 shadow-2xl shadow-yellow-600 rounded-2xl w-full max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Newspaper className="w-8 h-8 text-yellow-500" />
          <div>
            <h2 className="text-2xl font-bold text-white">Noticias Económicas</h2>
            <p className="text-sm text-neutral-400">Eventos clave del día</p>
          </div>
        </div>
        <Button variant="outline" className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700">
          <Filter size={16} className="mr-2"/>
          Filtros
        </Button>
      </div>

      {/* Content */}
      <div className="max-h-[60vh] overflow-y-auto pr-3 -mr-3 space-y-4 
                  scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent scrollbar-thumb-rounded-full">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <NewsSkeleton key={i} />)
        ) : newsData.length > 0 ? (
          newsData.map((item, index) => (
            <NewsCard key={index} item={item} />
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-neutral-400">No hay noticias económicas para hoy.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
