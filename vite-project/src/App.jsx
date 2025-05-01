import { useEffect, useState } from "react";


const App = () => {

  const [data,setData] = useState([]);
  const fetchData = async() => {
    const data = await fetch("http://localhost:3001/api/data");
    const json = await data.json();
    console.log(json)
    setData(json)
}

  useEffect( () => {
    fetchData();
  },[])

  return (

    <div  >
      {/* nav title */}
      <div>
        <h1 className="font-bold text-2xl m-4">Title</h1>
      </div>
    {/* filters and buttons */}
    <div className="text-center p-5 mx-20 my-10">
      <label className="m-2 font-bold">From</label>
        <input type="date" className="border-black border-2"></input>

        <label className="m-2 font-bold">To</label>
        <input type="date" className="border-black border-2"></input>

        <button className="bg-green-500 mx-6 px-4 py-2 rounded-lg text-white">Download</button>
    </div>
      
    {/* testing random data */}
    <div class="max-h-96 overflow-auto border border-gray-300 rounded text-center mx-20">
  <table class="min-w-full text-sm text-left text-gray-700">
    <thead class="bg-gray-100 sticky top-0">
      <tr>
        <th class="px-4 py-2">Date & Time</th>
        <th class="px-4 py-2">Transactions</th>
        <th class="px-4 py-2">Amount</th>
      </tr>
    </thead>
    <tbody>
      {
        data.map((data, index) => 
          <tr class="border-b" key={index}>
            
            <td class="px-4 py-2">{data.Date}</td>
            <td class="px-4 py-2">{data.Transaction}</td>
            <td class="px-4 py-2">{data.Amount}</td>
          </tr>
        )
	    }
        
      
      
        </tbody>
      </table>
    </div>

  </div>
    
  )
}

export default App;