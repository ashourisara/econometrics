import { useState } from "react";

export default function ExportButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "fixed_income_data.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isLoading}
      className={`hover:cursor-pointer mt-6 w-full p-4 bg-[#27ae60] rounded-lg text-white font-bold text-[16px] hover:bg-[#229955] transition-all duration-300 ${
        isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
      }`}
    >
      {isLoading ? "Exporting..." : "Export to Excel"}
    </button>
  );
}
