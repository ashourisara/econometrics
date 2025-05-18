import { useState, useEffect } from 'react';

export default function FixedIncomeDisplay() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/scrape');
        const result = await response.json();
        
        if (result.error) {
          setError(result.error);
        } else {
          setData(result.fixedIncomeData);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshCount]);

  if (loading) {
    return <div className="loading">Loading fixed income data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="fixed-income-container">
      <h2>Fixed Income Fund Inflow</h2>
      {data && (
        <div className="data-grid">
          <div className="data-row">
            <span className="label">Net Inflow:</span>
            <span className="value highlight">{data.transfer}</span>
          </div>
          <div className="data-row">
            <span className="label">Buy Volume:</span>
            <span className="value">{data.buy}</span>
          </div>
          <div className="data-row">
            <span className="label">Sell Volume:</span>
            <span className="value">{data.sell}</span>
          </div>
          <div className="data-row">
            <span className="label">Buy/Sell Ratio:</span>
            <span className="value">{data.ratio}</span>
          </div>
        </div>
      )}
      <button onClick={() => setRefreshCount(prev => prev + 1)}>
        Refresh Data
    </button>
    </div>
  );
}