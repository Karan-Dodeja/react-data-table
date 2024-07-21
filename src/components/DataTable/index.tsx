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
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };
  const handleSort = (accessor: string) => {
    let direction: "asc" | "dec" | null = "asc";
    if (sortConfig && sortConfig.key === accessor) {
      if (sortConfig.direction === "asc") {
        direction = "dec";
      } else if (sortConfig && sortConfig.key === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key: accessor, direction });
  };

  return <div></div>;
};

export default DataTable;
