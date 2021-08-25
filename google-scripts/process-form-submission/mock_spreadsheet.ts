export class MockSpreadSheet {
  sheet1: Sheet;
  constructor() {
    this.sheet1 = new Sheet("form-submission");
  }
  getSheetByName(name: string) {
    if (name === "form-submission") return this.sheet1;
  }
}
class Sheet {
  data: string[];
  constructor(name: string) {
    this.data = ["Timestamp", "Id", "", "Firstname", "Lastname"];
  }
  // getLastRow() {
  //   return this.data.length;
  // }
  //   getRange(startRow: number, startCol: number, rangeRow: number, rangeCol = 1) {
  //     const rows = this.data.slice(startRow - 1, startRow - 1 + rangeRow);
  //     let rangedRows: string[] = [];
  //     rows.forEach((row) => {
  //       let rangedCols = row.slice(startCol - 1, startCol - 1 + rangeCol);
  //       rangedRows.push(rangedCols);
  //     });
  //     return new Range(rangedRows);
  //   }
}
// class Range {
//   data: string[];
//   constructor(rows: string[]) {
//     this.data = rows;
//   }
//   getValue() {
//     return this.data[0][0];
//   }
//   getValues() {
//     return this.data;
//   }
//   setValues(values: any) {
//     console.log(values);
//   }
// }
