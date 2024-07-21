import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { ColumnData, sortType } from "../../types";
import { data } from "./../../data/index";

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

  const exportTableExcel = () => {
    const exportData = rows.map((row) => {
      const exportRow: { [key: string]: string | boolean } = {};
      columns.forEach((column) => {
        if (row[column]) {
          exportRow[column] = row[column] as string | boolean;
        } else {
          exportRow[column] = "FALSE";
        }
      });
      return exportRow;
    });
    const workSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workSheet, workbook, "Sheet1");
    XLSX.writeFile(workbook, "data.xls");
  };

  const handleRowSelect = (rowINdex: number) => {
    const selectedRowIndex = selectedRows.indexOf(String(rowINdex));
    if (selectedRowIndex === -1) {
      setSelectedRows([...selectedRows, String(rowINdex)]);
    } else {
      const updatedSelectRows = [...selectedRows];
      updatedSelectRows.splice(selectedRowIndex);
      setSelectedRows(updatedSelectRows);
    }
  };

  const handleDaleteSelectedRows = () => {
    const updatedData = { ...data };
    selectedRows.forEach((rowIndexString) => {
      const rowIndex = parseInt(rowIndexString, 10);
      columns.forEach((column) => {
        updatedData[column].values.splice(rowIndex, 1);
      });
    });
    setSelectedRows([]);
  };

  const rows = useMemo(() => {
    return Array.from({ length: rowCount }, (_, index) => {
      return columns.reduce((acc, column) => {
        acc[column] = data[column].values[index] || "";
        return acc;
      }, {} as { [key: string]: string | boolean | number });
    });
  }, [data, columns, rowCount]);

  const sortedRows = useMemo(() => {
    if (!sortConfig || !sortConfig.direction) {
      return rows;
    }
    return [...rows].sort((a, b) => {
      const aValue = a[sortConfig.key] as string;
      const bValue = b[sortConfig.key] as string;
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [rows, sortConfig]);

  const filteredRows = useMemo(() => {
    return sortedRows.filter((row) =>
      columns.some((column) =>
        String(row[column])
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase())
      )
    );
  }, [sortedRows, searchTerm, columns]);

  const paginatedRows = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentpage, pageSize]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);

  return <div></div>;
};

export default DataTable;
