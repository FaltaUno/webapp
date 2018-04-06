module.exports.interpolation = {
  escapeValue: false, // not needed for react!!
  formatSeparator: ",",
  format: (value, format, lng) => {
    if (format === "strong") return `<strong>${value}</strong>`;
    if (format === "uppercase") return value.toUpperCase();
    return value;
  }
};
module.exports.namespaces = ["common", "match"];
