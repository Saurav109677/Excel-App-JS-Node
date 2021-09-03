let address = "B2";
let colId = Number(address.substring(1))-1;
let rowId = address.charCodeAt(0)-65;

console.log(colId,rowId);