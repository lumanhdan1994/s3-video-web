export const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024,
    sizes = ["Bytes", "KB", "MB", "GB", "TB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const formatDate = (timestamp, template = "DD/MM/YYYY HH:mm:ss") => {
  const date = new Date(timestamp);

  const DD = String(date.getDate()).padStart(2, '0');
  const D = String(date.getDate());
  const MM = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const M = String(date.getMonth() + 1); // Tháng bắt đầu từ 0
  const YYYY = date.getFullYear();
  const YY = String(YYYY).slice(-2);

  const HH = String(date.getHours()).padStart(2, '0');
  const H = String(date.getHours());
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  // Thay thế các token trong template
  return template
    .replace("DD", DD)
    .replace("D", D)
    .replace("MM", MM)
    .replace("M", M)
    .replace("YYYY", YYYY)
    .replace("YY", YY)
    .replace("HH", HH)
    .replace("H", H)
    .replace("mm", mm)
    .replace("ss", ss);
}
