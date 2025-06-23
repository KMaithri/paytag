import { useEffect, useState } from "react";
import DateFormatter from "./DateFormatter";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const App = () => {
  const [isPredicted, setIsPredicted] = useState(false);
  const [isAnalysis, setIsAnalysis] = useState(false);
  const [backupData, setBackupData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [isDownload, setIsDownload] = useState(false);

  useEffect(() => {
    const table = document.getElementById("trans-table");
    if (!table) return;

    const rows = table.querySelectorAll("tbody tr");
    const categoryTotals = {};

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      const type = cells[2]?.textContent.trim();

      // Debit or Credit
      const amountText = cells[3]?.textContent.trim(); // Amount
      const category = cells[4]?.textContent.trim(); // Predicted category

      const amount = parseFloat(amountText);

      // Only consider Debit transactions (i.e., spending)
      if (type.toLowerCase() === "debit" && category) {
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      }
    });

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    setChartData({
      labels,
      datasets: [
        {
          label: "Spending by Category",
          data: values,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#8AFFC1",
            "#D39FFF",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [filteredData]);

  const fetchULData = async () => {
    setIsPredicted(false);
    const data = await fetch(
      "https://upi-cat-api.onrender.com/extract-transactions"
    );
    const json = await data.json();
    setBackupData(json?.data);
    setFilteredData(json?.data);
  };

  const fetchLData = async () => {
    setIsPredicted(true);
    const data = await fetch("https://upi-cat-api.onrender.com/predict-labels");
    const json = await data.json();
    console.log(json);
    setBackupData(json?.data);

    if (
      document.getElementById("from").value === "" &&
      document.getElementById("to").value === ""
    ) {
      setFilteredData(json?.data);
    } else {
      filterData();
    }
  };

  const filterData = () => {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;

    const filteredData = backupData.filter((data) => {
      const curr_date = DateFormatter(data["Date & Time"]);
      return curr_date >= from && curr_date <= to;
    });
    setFilteredData(filteredData);
  };

  const exportReportToExcel = () => {
    setIsDownload(true);
    let table = document.getElementById("trans-table");
    let csv = [];

    for (let row of table.rows) {
      let rowData = [];
      for (let cell of row.cells) {
        // Escape commas and double quotes
        let cellText = cell.textContent.replace(/"/g, '""');
        rowData.push(`"${cellText}"`);
      }
      csv.push(rowData.join(","));
    }

    const csvContent = csv.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "table-data.csv");
    link.click();
  };

  const callSpendAnalysis = () => {
    setIsAnalysis(true);
  };

  return (
    <div>
      {/* nav title */}
      <div>
        <h1 className="font-bold text-2xl m-4">Cash Map</h1>
      </div>
      <div className="text-center p-5 mx-20 my-10">
        <button
          className="bg-blue-500 mx-6 px-4 py-2 rounded-lg text-white hover:bg-blue-800"
          onClick={() => fetchULData()}
        >
          Get Data
        </button>
        {isAnalysis && <p className="m-4 text-orange-600">Analysis is completed successfully, scroll down to view it.</p>}
        {isDownload && <p className="m-4 text-orange-600">You have downloaded the data, open it to view in excel.</p>}
      </div>
      {/* filters and buttons */}
      <div className="text-center p-5 mx-20 my-10">
        <label className="m-2 font-bold">From</label>
        <input
          type="date"
          className="border-black border-2"
          id="from"
          name="from"
        ></input>

        <label className="m-2 font-bold">To</label>
        <input type="date" className="border-black border-2" id="to"></input>
        <button
          className="bg-orange-500 mx-6 px-4 py-2 rounded-lg text-white hover:bg-orange-700"
          onClick={() => filterData()}
        >
          Filter
        </button>
        
        
      </div>
      <div className="text-center p-5 mx-20 my-5">
        <button
          className="bg-green-500 mx-2 px-4 py-2 rounded-lg text-white hover:bg-green-700"
          onClick={() => fetchLData()}
        >
          Predict
        </button>
        <button
          className="bg-green-500 mx-2 px-4 py-2 rounded-lg text-white hover:bg-green-700"
          onClick={() => exportReportToExcel()}
        >
          Download
        </button>
        <button
          className="bg-green-500 mx-2 px-4 py-2 rounded-lg text-white hover:bg-green-700"
          onClick={() => callSpendAnalysis()}
        >
          Spend Analysis
        </button>
      </div>

      <div className="max-h-96 overflow-auto border border-gray-300 rounded text-center mx-20">
        <table
          className="min-w-full text-sm text-left text-gray-700"
          id="trans-table"
        >
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-2">Date & Time</th>
              <th className="px-4 py-2">Transactions</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Amount</th>
              {isPredicted && <th className="px-4 py-2">Predicted Label</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record, index) => (
              <tr className="border-b" key={index}>
                <td className="px-4 py-2">{record["Date & Time"]}</td>
                <td className="px-4 py-2">{record.Transaction}</td>
                <td
                  className={
                    record.Type === "Debit"
                      ? "px-4 py-2 text-red-600 font-bold"
                      : "px-4 py-2 font-bold text-green-600"
                  }
                >
                  {record.Type}
                </td>
                <td className="px-4 py-2">{record.Amount}</td>
                {isPredicted && (
                  <td className="px-4 py-2">{record["Predicted Label"]}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isAnalysis && (
        <div className="w-96 h-96 justify-self-center">
          <h3 className="my-10 text-center">Spending Analysis by Category</h3>
          {chartData?.labels && <Pie data={chartData} />}
        </div>
      )}
    </div>
  );
};

export default App;
