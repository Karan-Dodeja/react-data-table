import { useState } from "react";
import { ColumnData, sortType } from "../../types";

interface DataTableProps {
  data: ColumnData;
  searchBar?: boolean;
  excelExport?: boolean;
  pagination?: boolean;
  removeRows?: boolean;
  pageSizeControl?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  searchBar = false,
  excelExport = false,
  pagination = false,
  removeRows = false,
  pageSizeControl = false,
}) => {
  const columns = Object.keys(data.columns);
  const rowCount = Math.max(
    ...columns.map((column) => data[column].values.length)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState<sortType | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  return <div></div>;
};

export default DataTable;
