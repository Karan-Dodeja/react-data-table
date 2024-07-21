import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { ColumnData, sortType } from "../../types";
import { data } from "./../../data/index";
import {
  CaretDownOutline,
  CaretUpOutline,
  ChevronBackOutline,
  ChevronForwardOutline,
  DownloadOutline,
  SearchOutline,
  TrashOutline,
} from "react-ionicons";

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

  return (
    <div className="max-w-full overflow-x-auto ">
      <div className="flex w-full items-center justify-between mb-5">
        {searchBar ? (
          <div className="flex w-[30%] items-center gap-5 rounded-lg px-3 py-2 bg-[#303030]">
            <SearchOutline cssClasses={"!text-gray-300"} />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full outline-none bg-transparent"
            />
          </div>
        ) : (
          <div></div>
        )}
        <div className="flex items-center gap-5">
          {excelExport && (
            <button
              onClick={exportTableExcel}
              className="rounded-lg bg-[#303030] p-2"
            >
              <DownloadOutline
                width={"26px"}
                height={"26px"}
                cssClasses={"!text-[#99e5be] cursor-pointer"}
              />
            </button>
          )}
          {removeRows && (
            <button
              onClick={handleDaleteSelectedRows}
              className="rounded-lg bg-[#303030] p-2 disabled:opacity-50"
            >
              <TrashOutline
                width={"26px"}
                height={"26px"}
                cssClasses={`${
                  selectedRows.length === 0
                    ? "cursor-default !text-red-300"
                    : "cursor-pointer !text-red-400"
                }`}
              />
            </button>
          )}
        </div>
      </div>
      <div className="table-container">
        <table className="w-full overflow-x-auto max-w-[100vw]">
          <thead>
            <tr className="bg-[#303030] h-[50px]">
              <th className="hidden">Actions</th>
              <th className="font-medium text-gray-300 text-[16px] pl-5">#</th>
              {columns.map((column, index: number) => (
                <th
                  key={index}
                  onClick={() => handleSort(column)}
                  className="font-medium text-gray-300 text-[16px] px-5 curso-pointer"
                >
                  <div className="flex items-center justify-center gap-[1px]">
                    {column}
                    {sortConfig?.key === column ? (
                      sortConfig.direction === "asc" ? (
                        <CaretUpOutline cssClasses={"!fill-blue-400"} />
                      ) : sortConfig.direction === "desc" ? (
                        <CaretDownOutline cssClasses={"!fill-blue-400"} />
                      ) : (
                        <CaretDownOutline cssClasses={"hidden"} />
                      )
                    ) : (
                      <CaretDownOutline cssClasses={"hidden"} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center">
            {paginatedRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`h-[50px] cursor-pointer ${selectedRows.includes(
                  String(rowIndex)
                    ? "bg-[#4d4d4d]"
                    : rowIndex % 2
                    ? "bg-[#242424]"
                    : "bg-[#f1f1f1]"
                )}`}
              >
                <td className="hidden">
                  <input
                    type="check"
                    checked={selectedRows.includes(String(rowIndex))}
                    onChange={() => handleRowSelect(rowIndex)}
                  />
                </td>
                <td className="pl-5">{rowIndex + 1}</td>
                {columns.map((column, index: number) => {
                  const value = row[column];
                  const columnData = data[column];
                  const classNames = columnData.className
                    ? columnData.className(value)
                    : {};
                  const content = columnData.renderValue
                    ? columnData.renderValue(value)
                    : typeof value === "boolean" && columnData.renderBoolean
                    ? columndata.renderBoolean(value)
                    : `${value}`;

                  return (
                    <td
                      key={index}
                      className={`${classNames}`}
                      onClick={() => handleRowSelect(rowIndex)}
                    >
                      <div className="flex items-center justify-center">
                        {content
                          ? content
                          : columnData.renderBoolean
                          ? columnData.renderBoolean(value)
                          : "false"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full mt-5 flex items-center justify-between">
        {pageSizeControl ? (
          <div className="rounded-lg py-[2px] pr-1 bg-[#303030] w-fit text-gray-400">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-transparent outline-none w-[80px] px-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        ) : (
          <div></div>
        )}
        {pagination && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="rounded-lg bg-[#303030] p-2 disabled:opacity-50"
            >
              <ChevronBackOutline cssClasses={"!text-gray-500"} />
            </button>
            <span className="text-sm">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage + 1 === 0}
              className="rounded-lg bg-[#303030] p-2 disabled:opacity-50"
            >
              <ChevronForwardOutline cssClasses={"!text-gray-500"} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
