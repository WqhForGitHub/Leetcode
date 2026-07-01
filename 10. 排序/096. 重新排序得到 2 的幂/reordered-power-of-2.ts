// ============================================================
// 096. 重新排序得到 2 的幂
// ============================================================
// LeetCode 869. Reordered Power of 2
// 判断正整数 n 的各位数字重新排列后是否能组成某个 2 的幂。
// 重排必须使用 n 的所有数字（不能有前导零）。

// 方法1：数字排序签名 + 与所有 2 的幂比较（推荐，O(log n) 时间，O(log n) 空间）
// 将 n 的数字升序排序得到签名串；枚举所有位数不超过 n 的 2 的幂，
// 同样取签名串比较。n <= 10^9 最多 10 位，2 的幂枚举到 2^33 即可覆盖。
function reorderedPowerOf2(n: number): boolean {
  const target = digitSignature(n);
  // 2^33 = 8589934592（10 位），覆盖 n 最多 10 位的情况
  for (let e = 0; e <= 33; e++) {
    if (digitSignature(2 ** e) === target) return true;
  }
  return false;
}

function digitSignature(x: number): string {
  return x.toString().split("").sort().join("");
}

// 方法2：数字频次数组比较（O(log n) 时间，O(1) 空间）
// 用长度 10 的频次数组表示数字构成，逐位比较。
function reorderedPowerOf2Freq(n: number): boolean {
  const target = digitFreq(n);
  for (let e = 0; e <= 33; e++) {
    if (freqEqual(digitFreq(2 ** e), target)) return true;
  }
  return false;
}

function digitFreq(x: number): number[] {
  const freq = new Array(10).fill(0);
  for (const ch of x.toString()) {
    freq[Number(ch)]++;
  }
  return freq;
}

function freqEqual(a: number[], b: number[]): boolean {
  for (let i = 0; i < 10; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 096. 重新排序得到 2 的幂 =====");
console.log("签名法 1:", reorderedPowerOf2(1)); // 期望 true
console.log("签名法 10:", reorderedPowerOf2(10)); // 期望 false
console.log("签名法 46:", reorderedPowerOf2(46)); // 期望 true (46 -> 64)
console.log("签名法 242:", reorderedPowerOf2(242)); // 期望 false (3 位 2 的幂 128/256/512 均不匹配 {2,2,4})
console.log("频次法 1:", reorderedPowerOf2Freq(1)); // 期望 true
console.log("频次法 10:", reorderedPowerOf2Freq(10)); // 期望 false
console.log("频次法 46:", reorderedPowerOf2Freq(46)); // 期望 true
console.log("频次法 242:", reorderedPowerOf2Freq(242)); // 期望 false

export {};
