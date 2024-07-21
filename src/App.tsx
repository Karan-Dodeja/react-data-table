import React from "react";
import DataTable from "./components/DataTable";
import { data } from "./data";

function App() {
  return (
    <div className="w-full md:px-24 px-5 py-8">
      <DataTable
        data={data}
        searchBar
        excelExport
        pageSizeControl
        pagination
        removeRows
      />
    </div>
  );
}

export default App;
