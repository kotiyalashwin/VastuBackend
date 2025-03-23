import xlsx from "xlsx";
import fs from "fs";
import path from "path";

// Load the Excel file
const workbook = xlsx.readFile(path.join(__dirname, "./data/vastu_data.xlsx"));

// Function to extract data from a sheet
const getSheetData = (sheetName: string) => {
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
};

// Extract relevant sheets
const vastuData = {
  bedroom: getSheetData("BedRoom"),
  kitchen: getSheetData("Kitchen"),
  toilet: getSheetData("Toilet"),
};

// Save to JSON file
fs.writeFileSync("vastu_data.json", JSON.stringify(vastuData, null, 2));

console.log("JSON file created successfully!");
