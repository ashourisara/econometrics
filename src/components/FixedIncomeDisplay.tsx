import { useState, useEffect } from "react";

export default function FixedIncomeDisplay() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/scrape");
        const result = await response.json();

        if (result.error) {
          setError(result.error);
        } else {
          setData(result.fixedIncomeData);
        }
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshCount]);

  if (error) {
    return (
      <div className="error p-4 text-red-600 bg-red-100 rounded-lg transition-all duration-300">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="fixed-income-container max-w-md mx-auto p-6 bg-white rounded-xl shadow-md transition-all duration-500">
      <h2 className="text-[20px] font-bold text-[#555] mb-4 transition-opacity duration-300">
        Fixed Income Funds Data
      </h2>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3 animate-pulse transition-opacity duration-300 py-[20px]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-md"></div>
          ))}
        </div>
      )}

      {/* Content with fade-in animation */}
      <div
        className={`transition-opacity duration-500 ${
          loading ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
        }`}
      >
        {data && (
          <div className="data-grid space-y-2">
            <div className="data-row bg-[#ccf1d5] p-3 rounded-md transition-all hover:scale-[1.01] !px-[10px] !mx-[-10px]">
              <span className="label font-medium">Net Inflow:</span>
              <span className="value text-[#27ae60] font-bold">
                {data.transfer}
              </span>
            </div>
            <div className="data-row p-3 transition-all hover:bg-gray-50 rounded-md">
              <span className="label text-gray-600">Buy Volume:</span>
              <span className="value font-medium">{data.buy}</span>
            </div>
            <div className="data-row p-3 transition-all hover:bg-gray-50 rounded-md">
              <span className="label text-gray-600">Sell Volume:</span>
              <span className="value font-medium">{data.sell}</span>
            </div>
            <div className="data-row p-3 transition-all hover:bg-gray-50 rounded-md">
              <span className="label text-gray-600">Buy/Sell Ratio:</span>
              <span className="value font-medium">{data.ratio}</span>
            </div>
          </div>
        )}
      </div>

      <button
        className={`hover:cursor-pointer mt-6 w-full p-4 bg-[#27ae60] rounded-lg text-white font-bold text-[16px] hover:bg-[#229955] transition-all duration-300 ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
        }`}
        onClick={() => setRefreshCount((prev) => prev + 1)}
        disabled={loading}
      >
        {loading ? "Loading..." : "Refresh Data"}
      </button>
    </div>
  );
}
