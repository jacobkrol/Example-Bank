// returns array of sequential integers, n, start <= n <= end
function getArrRange(start: number, end: number): number[] {
  if (end < start) return [];
  return new Array(end - start).fill(start).map((val, index) => val + index);
}

// returns random alphanumeric string of desired length (default: 20)
export default function getId(length: number = 20): string {
  const digits = getArrRange(48, 57); // 0-9
  const uppercase = getArrRange(65, 90); // A-Z
  const lowercase = getArrRange(97, 122); // a-z
  const charCodes = digits.concat(uppercase).concat(lowercase);
  let id = "";
  for (let n = 0; n < length; n++) {
    const randCode = charCodes[Math.floor(Math.random() * charCodes.length)];
    const randChar = String.fromCharCode(randCode);
    id += randChar;
  }
  return id;
}
