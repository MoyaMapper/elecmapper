export const dateFormat = (date = new Date(), format = "yyyy-MM-dd hh:mm:ss") => {
  var z = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };
  format = format.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
    return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
  });

  return format.replace(/(y+)/g, function (v) {
    return date.getFullYear().toString().slice(-v.length)
  });
}
