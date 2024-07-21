import { CheckmarkOutline, CloseOutline } from "react-ionicons";
import { ColumnData } from "../types";

export const data: ColumnData = {
  Name: {
    values: [
      "John Dow",
      "Jane Smith",
      "John Dow",
      "Jane Smith",
      "John Dow",
      "Jane Smith",
      "John Dow",
      "Jane Smith",
      "John Dow",
      "Jane Smith",
      "John Dow",
      "Jane Smith",
      "John Dow",
      "Jane Smith",
      "John Dow",
      "Jane Smith",
      "John Dow",
      "Jane Smith",
      "John Dow",
      "Jane Smith",
      "John Dow",
    ],
    classNames: (value: string | boolean | number) =>
      value === "Jane Smith" ? "text-green-400 font-medium" : "text-white",
  },
  Age: {
    values: [
      "24",
      "28",
      "24",
      "28",
      "24",
      "28",
      "24",
      "28",
      "24",
      "28",
      "24",
      "28",
      "24",
      "28",
      "24",
      "28",
      "24",
      "28",
      "24",
      "28",
    ],
  },
  Email: {
    values: [
      "abc@gmail.com",
      "def@gmail.com",
      "abc@gmail.com",
      "def@gmail.com",
      "abc@gmail.com",
      "def@gmail.com",
      "abc@gmail.com",
      "def@gmail.com",
      "abc@gmail.com",
      "def@gmail.com",
      "abc@gmail.com",
      "def@gmail.com",
      "abc@gmail.com",
      "def@gmail.com",
      "abc@gmail.com",
      "def@gmail.com",
      "abc@gmail.com",
      "def@gmail.com",
      "abc@gmail.com",
      "def@gmail.com",
    ],
    classNames: (value: string | boolean | number) =>
      typeof value === "string" && value.includes("john")
        ? "text-green-400 font -medium"
        : "text-white",
  },
  Role: {
    values: [
      "CEO",
      "COO",
      "CEO",
      "COO",
      "CEO",
      "COO",
      "CEO",
      "COO",
      "CEO",
      "COO",
      "CEO",
      "COO",
      "CEO",
      "COO",
      "CEO",
      "COO",
      "CEO",
      "COO",
      "CEO",
      "COO",
    ],
  },
  Salary: {
    values: [
      25000, 17000, 25000, 17000, 25000, 17000, 25000, 17000, 25000, 17000,
      25000, 17000, 25000, 17000, 25000, 17000, 25000, 17000, 25000, 17000,
    ],
    renderValue: (value: string | boolean | number) => {
      if (typeof value === "number") {
        return (
          <div
            className={`font-medium ${
              value > 8000 ? "text-green-400 " : "text-red-400"
            }`}
          >
            ${value.toLocaleString()}
          </div>
        );
      }
    },
  },
  Active: {
    values: [
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
    ],
    renderBoolean: (value: boolean) =>
      value ? (
        <CheckmarkOutline
          cssClasses={"!text-green-400"}
          width="30px"
          height="30px"
        />
      ) : (
        <CloseOutline cssClasses={"!text-red-400"} width="30px" height="30px" />
      ),
  },
};
