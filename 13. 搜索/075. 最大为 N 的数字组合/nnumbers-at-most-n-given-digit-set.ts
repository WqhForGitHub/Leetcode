// ============================================================
// 075. 最大为 N 的数字组合
// ============================================================
// LeetCode 902. Numbers At Most N Given Digit Set
// 给定数字字符串集合，返回能用这些数字组成的不超过 n 的正整数个数。

// 方法1：数学 + 数位计算
function atMostNGivenDigitSet(digits: string[], n: number): number {
  const s = String(n);
  const k = s.length;
  let count = 0;
  // 位数小于 k 的数
  for (let i = 1; i < k; i++) {
    count += Math.pow(digits.length, i);
  }
  // 位数等于 k 的数
  for (let i = 0; i < k; i++) {
    const curr = s[i];
    let samePrefix = false;
    for (const d of digits) {
      if (d < curr) {
        count += Math.pow(digits.length, k - i - 1);
      } else if (d === curr) {
        samePrefix = true;
        break;
      } else {
        break;
      }
    }
    if (!samePrefix) return count;
  }
  return count + 1; // n 本身也满足
}

// 方法2：二分查找（将 digits 视为自定义进制）
function atMostNGivenDigitSetBinary(digits: string[], n: number): number {
  const sortedDigits = digits.map(Number).sort((a, b) => a - b);
  const s = String(n);
  const k = s.length;
  let result = 0;
  for (let len = 1; len < k; len++) {
    result += Math.pow(sortedDigits.length, len);
  }
  for (let i = 0; i < k; i++) {
    const curr = parseInt(s[i]);
    // 二分找小于 curr 的数字个数
    let lo = 0;
    let hi = sortedDigits.length - 1;
    let lessCount = 0;
    let equal = false;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (sortedDigits[mid] < curr) {
        lessCount = mid + 1;
        lo = mid + 1;
      } else if (sortedDigits[mid] === curr) {
        equal = true;
        break;
      } else {
        hi = mid - 1;
      }
    }
    result += lessCount * Math.pow(sortedDigits.length, k - i - 1);
    if (!equal) return result;
  }
  return result + 1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 075. 最大为 N 的数字组合 =====");
console.log("数学 ['1','3','5','7'],100:", atMostNGivenDigitSet(["1", "3", "5", "7"], 100)); // 20
console.log("数学 ['1','4','9'],1000000000:", atMostNGivenDigitSet(["1", "4", "9"], 1000000000)); // 29523
console.log("数学 ['7'],8:", atMostNGivenDigitSet(["7"], 8)); // 1

export {};
