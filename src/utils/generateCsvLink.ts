function generateCsvLink(csv: string) {
  let csvContent = "data:text/csv;charset=utf-8," + csv;

  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}

export { generateCsvLink };
