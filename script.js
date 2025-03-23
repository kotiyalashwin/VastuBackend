"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load the Excel file
const workbook = xlsx_1.default.readFile(
  path_1.default.join(__dirname, "./src/data/vastu_data.xlsx")
);
// Function to extract data from a sheet
const getSheetData = (sheetName) => {
  const sheet = workbook.Sheets[sheetName];
  return xlsx_1.default.utils.sheet_to_json(sheet);
};
// Extract relevant sheets
const vastuData = {
  bedroom: getSheetData("BedRoom"),
  kitchen: getSheetData("Kitchen"),
  toilet: getSheetData("Toilet"),
  dining: getSheetData("Dining Area"),
  poojaghar: getSheetData("Pooja Ghar"),
};

const remedieData = getSheetData("Remedies");

fs_1.default.writeFileSync(
  "vastu_remedies.json",
  JSON.stringify(remedieData, null, 2)
);

// Save to JSON file
fs_1.default.writeFileSync(
  "vastu_data.json",
  JSON.stringify(vastuData, null, 2)
);
console.log("JSON file created successfully!");
