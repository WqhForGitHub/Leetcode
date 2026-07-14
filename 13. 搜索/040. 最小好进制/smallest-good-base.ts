// ============================================================
// 040. 最小好进制
// ============================================================
// LeetCode 483. Smallest Good Base
// 对于以字符串表示的整数 n，返回最小的基数 k，使得 n 在 k 进制下全为 1。

// 方法1：枚举位数 + 二分查找基数
function smallestGoodBase(n: string): string {
  const num = BigInt(n);
  // 最多有 log2(n) + 1 位
  const maxLen = BigInt(n).toString(2).length;
  for (let m = maxLen; m >= 2; m--) {
    // 在基数 k 下，m 个 1 的值 = (k^m - 1) / (k - 1) = num
    // 二分查找 k
    let lo = 2n;
    let hi = BigInt(Math.floor(Math.pow(Number(num), 1 / (m - 1)))) + 1n;
    while (lo <= hi) {
      const mid = (lo + hi) / 2n;
      const sum = geometricSum(mid, BigInt(m));
      if (sum === num) return mid.toString();
      if (sum < num) lo = mid + 1n;
      else hi = mid - 1n;
    }
  }
  return (num - 1n).toString();
}

function geometricSum(base: bigint, m: bigint): bigint {
  let sum = 0n;
  let power = 1n;
  for (let i = 0n; i < m; i++) {
    sum += power;
    power *= base;
  }
  return sum;
}

// 方法2：数学推导（二项式逼近）
function smallestGoodBaseMath(n: string): string {
  const num = BigInt(n);
  const maxLen = BigInt(n).toString(2).length;
  for (let m = maxLen; m >= 2; m--) {
    // k ≈ n^(1/(m-1))
    const k = 1n;
    // 用 BigInt 近似开方
    let lo = 2n;
    let hi = num;
    while (lo < hi) {
      const mid = (lo + hi) / 2n;
      let sum = 0n;
      let cur = 1n;
      for (let i = 0; i < m; i++) {
        sum += cur;
        if (sum > num) break;
        cur *= mid;
      }
      if (sum === num) return mid.toString();
      if (sum < num) lo = mid + 1n;
      else hi = mid;
    }
  }
  return (num - 1n).toString();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 040. 最小好进制 =====");
console.log("二分 '13':", smallestGoodBase("13")); // "3"
console.log("二分 '4681':", smallestGoodBase("4681")); // "8"
console.log("二分 '1000000000000000000':", smallestGoodBase("1000000000000000000")); // "999999999999999999"

export {};
