// ============================================================
// 127. 最小化舍入误差以满足目标
// ============================================================
// LeetCode 1058. Minimize Rounding Error to Meet Target
// 给定价格字符串数组 prices 与目标 target，每个价格必须向下或向上取整，
// 使取整后之和等于 target，并使总舍入误差最小。返回最小误差字符串（3 位小数），
// 若不可能返回 "-1"。

// 将价格字符串解析为：整数部分 intPart 与小数部分（千分位）frac1000
function parsePrice(s: string): { intPart: number; frac1000: number } {
  const dot = s.indexOf(".");
  if (dot === -1) {
    return { intPart: parseInt(s, 10), frac1000: 0 };
  }
  const intPart = parseInt(s.substring(0, dot), 10);
  let fracStr = s.substring(dot + 1);
  while (fracStr.length < 3) fracStr += "0";
  return { intPart, frac1000: parseInt(fracStr.slice(0, 3), 10) };
}

function formatError(error1000: number): string {
  const intErr = Math.floor(error1000 / 1000);
  const fracErr = error1000 % 1000;
  return `${intErr}.${fracErr.toString().padStart(3, "0")}`;
}

// 方法1：贪心 + 按小数部分排序（推荐，时间 O(n log n)，空间 O(n)）
// 设 base = 所有价格向下取整之和。每个带小数的价格取整可使其贡献 +0 或 +1。
// 需要恰好 c = target - base 个价格向上取整。c 必须在 [0, m] 内，m 为带小数价格数。
// 对带小数的价格，向上取整误差 = 1 - f，向下取整误差 = f。
// 总误差 = F + sum_S(1 - 2f)，要最小化则 S 选 f 最大的 c 个。
function minRoundingError(prices: string[], target: number): string {
  let base = 0;
  const fracs: number[] = [];
  for (const s of prices) {
    const { intPart, frac1000 } = parsePrice(s);
    base += intPart;
    if (frac1000 > 0) fracs.push(frac1000);
  }
  const m = fracs.length;
  const c = target - base;
  if (c < 0 || c > m) return "-1";

  fracs.sort((a, b) => b - a); // 小数部分降序
  let error1000 = 0;
  for (let i = 0; i < m; i++) {
    if (i < c) {
      error1000 += 1000 - fracs[i]; // 向上取整
    } else {
      error1000 += fracs[i]; // 向下取整
    }
  }
  return formatError(error1000);
}

// 方法2：动态规划（时间 O(m^2)，空间 O(m)，m 为带小数价格数）
// dp[j] = 处理若干价格后，恰有 j 个向上取整时的最小误差（千分位）。
function minRoundingError2(prices: string[], target: number): string {
  let base = 0;
  const fracs: number[] = [];
  for (const s of prices) {
    const { intPart, frac1000 } = parsePrice(s);
    base += intPart;
    if (frac1000 > 0) fracs.push(frac1000);
  }
  const m = fracs.length;
  const c = target - base;
  if (c < 0 || c > m) return "-1";

  const INF = Number.POSITIVE_INFINITY;
  let dp = new Array<number>(m + 1).fill(INF);
  dp[0] = 0;
  for (const f of fracs) {
    const ndp = new Array<number>(m + 1).fill(INF);
    for (let j = 0; j <= m; j++) {
      if (dp[j] === INF) continue;
      // 向下取整
      if (dp[j] + f < ndp[j]) ndp[j] = dp[j] + f;
      // 向上取整
      if (j + 1 <= m && dp[j] + (1000 - f) < ndp[j + 1]) {
        ndp[j + 1] = dp[j] + (1000 - f);
      }
    }
    dp = ndp;
  }
  if (dp[c] === INF) return "-1";
  return formatError(dp[c]);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 127. 最小化舍入误差以满足目标 =====");
console.log("方法1:", minRoundingError(["0.700", "2.800", "4.900"], 8)); // 期望: "1.000"
console.log("方法1:", minRoundingError(["1.500", "2.500", "3.500"], 10)); // 期望: "-1"
console.log("方法1:", minRoundingError(["1.500", "2.500", "3.500"], 9)); // 期望: "1.500"
console.log("方法2:", minRoundingError2(["0.700", "2.800", "4.900"], 8)); // 期望: "1.000"
console.log("方法2:", minRoundingError2(["1.500", "2.500", "3.500"], 10)); // 期望: "-1"
console.log("方法2:", minRoundingError2(["1.500", "2.500", "3.500"], 9)); // 期望: "1.500"

export {};
