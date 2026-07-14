// ============================================================
// 168. 蜡烛之间的盘子
// ============================================================
// LeetCode 2055. Plates Between Candles
// 字符串 s 由 '*'（盘子）和 '|'（蜡烛）组成。
// 每次查询 [left, right]，求该范围内两根蜡烛之间的盘子数。

// 方法1：前缀和 + 二分查找
function platesBetweenCandles(s: string, queries: number[][]): number[] {
  const n = s.length;
  // 记录每根蜡烛的位置
  const candles: number[] = [];
  // prefix[i] = s[0..i-1] 中盘子的数量
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i];
    if (s[i] === "|") {
      candles.push(i);
    } else {
      prefix[i + 1]++;
    }
  }

  const result: number[] = [];
  for (const [left, right] of queries) {
    // 二分找第一个 >= left 的蜡烛
    let lo = 0;
    let hi = candles.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (candles[mid] < left) lo = mid + 1;
      else hi = mid;
    }
    const l = lo;
    // 二分找最后一个 <= right 的蜡烛
    lo = 0;
    hi = candles.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (candles[mid] <= right) lo = mid + 1;
      else hi = mid;
    }
    const r = lo - 1;
    if (l < r) {
      // 盘子数 = prefix[candles[r]+1] - prefix[candles[l]]
      result.push(prefix[candles[r] + 1] - prefix[candles[l]]);
    } else {
      result.push(0);
    }
  }
  return result;
}

// 方法2：预计算最近蜡烛位置
function platesBetweenCandlesPre(s: string, queries: number[][]): number[] {
  const n = s.length;
  const prefix = new Array(n + 1).fill(0);
  const leftCandle = new Array(n).fill(-1);
  const rightCandle = new Array(n).fill(n);

  let last = -1;
  for (let i = 0; i < n; i++) {
    if (s[i] === "|") last = i;
    leftCandle[i] = last;
    prefix[i + 1] = prefix[i] + (s[i] === "*" ? 1 : 0);
  }
  last = n;
  for (let i = n - 1; i >= 0; i--) {
    if (s[i] === "|") last = i;
    rightCandle[i] = last;
  }

  const result: number[] = [];
  for (const [left, right] of queries) {
    const l = rightCandle[left]; // 第一个 >= left 的蜡烛
    const r = leftCandle[right]; // 最后一个 <= right 的蜡烛
    if (l < r) {
      result.push(prefix[r + 1] - prefix[l]);
    } else {
      result.push(0);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 168. 蜡烛之间的盘子 =====");
console.log(
  "二分 **|**|**|**,[[2,5],[5,9]]:",
  platesBetweenCandles("**|**|**|**", [
    [2, 5],
    [5, 9],
  ]),
); // [5, 4]
console.log(
  "预计算 **|**|**|**,[[2,5],[5,9]]:",
  platesBetweenCandlesPre("**|**|**|**", [
    [2, 5],
    [5, 9],
  ]),
); // [5, 4]

export {};
