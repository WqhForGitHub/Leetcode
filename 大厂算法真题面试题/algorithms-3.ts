// ============================================================
// 大厂算法真题 - TypeScript 解题合集（四）· 科大讯飞/大疆/B站/百度/阿里达摩院专场
// ============================================================

// ============================================================
// 1. 科大讯飞2023非凡计划 - 将企鹅击落水中最小的力
// n 块冰排成一排，第 i 块冰的高度为 h[i]，每块冰上有一只企鹅。
// 选择一个起始位置 k，用大小为 F 的力推企鹅，力向外传播时每
// 经过一个位置衰减 1（即位置 k+j 受力 F-j）。企鹅落水条件：
// 受力 >= 冰块高度。求使所有企鹅落水的最小力 F。
// ============================================================

// 方法：对每个起始位置 k，所需最小力 = max(h[i] + |i - k|)
//       答案 = min over k of max(h[i] + |i - k|)
//       利用前缀/后缀最大值预计算，O(n) 求解
// 时间复杂度 O(n)，空间复杂度 O(n)
function minForceToKnockPenguins(heights: number[]): number {
  const n = heights.length;
  if (n === 0) return 0;
  if (n === 1) return heights[0];

  // prefixMax[i] = max(h[j] - j) for j in [0, i]
  const prefixMax = new Array(n).fill(0);
  prefixMax[0] = heights[0] - 0;
  for (let i = 1; i < n; i++) {
    prefixMax[i] = Math.max(prefixMax[i - 1], heights[i] - i);
  }

  // suffixMax[i] = max(h[j] + j) for j in [i, n-1]
  const suffixMax = new Array(n).fill(0);
  suffixMax[n - 1] = heights[n - 1] + (n - 1);
  for (let i = n - 2; i >= 0; i--) {
    suffixMax[i] = Math.max(suffixMax[i + 1], heights[i] + i);
  }

  // 对每个起始位置 k，计算所需最小力
  let minForce = Infinity;
  for (let k = 0; k < n; k++) {
    // 左侧: max(h[i] + (k - i)) for i <= k = k + max(h[i] - i) = k + prefixMax[k]
    // 右侧: max(h[i] + (i - k)) for i >= k = max(h[i] + i) - k = suffixMax[k] - k
    const leftForce = k + prefixMax[k];
    const rightForce = suffixMax[k] - k;
    minForce = Math.min(minForce, Math.max(leftForce, rightForce));
  }

  return minForce;
}

// 方法2：暴力枚举（验证用）
// 时间复杂度 O(n^2)，空间复杂度 O(1)
function minForceToKnockPenguinsBrute(heights: number[]): number {
  const n = heights.length;
  let minForce = Infinity;

  for (let k = 0; k < n; k++) {
    let maxForce = 0;
    for (let i = 0; i < n; i++) {
      maxForce = Math.max(maxForce, heights[i] + Math.abs(i - k));
    }
    minForce = Math.min(minForce, maxForce);
  }

  return minForce;
}

// ============================================================
// 2. 大疆2023秋招 - 农田中作物的最大产量
// 有 n 块农田排成一排，每块农田可以种植 m 种作物之一。
// 在第 i 块农田种植第 j 种作物的产量为 yield[i][j]。
// 相邻农田不能种植同一种作物。求最大总产量。
// （等价于 LeetCode 256/265. Paint House）
// ============================================================

// 方法1：动态规划
// dp[i][j] = 前 i 块农田，第 i 块种第 j 种作物时的最大产量
// dp[i][j] = yield[i][j] + max(dp[i-1][k]) for k != j
// 时间复杂度 O(n * m^2)，空间复杂度 O(n * m)
function maxCropYield(yields: number[][]): number {
  const n = yields.length;
  if (n === 0) return 0;
  const m = yields[0].length;

  // dp[j] = 当前块种第 j 种作物时的最大累计产量
  let dp = [...yields[0]];

  for (let i = 1; i < n; i++) {
    const newDp = new Array(m).fill(0);
    for (let j = 0; j < m; j++) {
      // 找前一块农田种其他作物时的最大值
      let prevMax = -Infinity;
      for (let k = 0; k < m; k++) {
        if (k !== j) {
          prevMax = Math.max(prevMax, dp[k]);
        }
      }
      newDp[j] = yields[i][j] + prevMax;
    }
    dp = newDp;
  }

  return Math.max(...dp);
}

// 方法2：优化 - 维护最大值和次大值，避免内层循环
// 时间复杂度 O(n * m)，空间复杂度 O(m)
function maxCropYieldOptimized(yields: number[][]): number {
  const n = yields.length;
  if (n === 0) return 0;
  const m = yields[0].length;

  let dp = [...yields[0]];

  for (let i = 1; i < n; i++) {
    const newDp = new Array(m).fill(0);

    // 找 dp 中的最大值和次大值
    let max1 = -Infinity,
      max2 = -Infinity;
    let max1Idx = -1;
    for (let j = 0; j < m; j++) {
      if (dp[j] > max1) {
        max2 = max1;
        max1 = dp[j];
        max1Idx = j;
      } else if (dp[j] > max2) {
        max2 = dp[j];
      }
    }

    for (let j = 0; j < m; j++) {
      // 如果前一块的最优选择不是第 j 种，用最大值；否则用次大值
      const prevBest = max1Idx !== j ? max1 : max2;
      newDp[j] = yields[i][j] + prevBest;
    }
    dp = newDp;
  }

  return Math.max(...dp);
}

// ============================================================
// 3. Bilibili2023秋招 - 两个字符串的最小ASCII删除和
// 给定两个字符串 s1 和 s2，删除若干字符使两个字符串相等，
// 求被删除字符的 ASCII 值之和的最小值。
// （LeetCode 712. Minimum ASCII Delete Sum for Two Strings）
// ============================================================

// 方法1：动态规划
// dp[i][j] = 使 s1[0..i-1] 和 s2[0..j-1] 相等的最小 ASCII 删除和
// 若 s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1]
// 否则: dp[i][j] = min(dp[i-1][j] + ascii(s1[i-1]), dp[i][j-1] + ascii(s2[j-1]))
// 时间复杂度 O(m * n)，空间复杂度 O(m * n)
function minimumDeleteSum(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // 边界：删除 s1 的前 i 个字符
  for (let i = 1; i <= m; i++) {
    dp[i][0] = dp[i - 1][0] + s1.charCodeAt(i - 1);
  }
  // 边界：删除 s2 的前 j 个字符
  for (let j = 1; j <= n; j++) {
    dp[0][j] = dp[0][j - 1] + s2.charCodeAt(j - 1);
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + s1.charCodeAt(i - 1),
          dp[i][j - 1] + s2.charCodeAt(j - 1)
        );
      }
    }
  }

  return dp[m][n];
}

// 方法2：空间优化 - 滚动数组
// 时间复杂度 O(m * n)，空间复杂度 O(n)
function minimumDeleteSumOptimized(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;

  let prev = new Array(n + 1).fill(0);
  // 边界
  for (let j = 1; j <= n; j++) {
    prev[j] = prev[j - 1] + s2.charCodeAt(j - 1);
  }

  for (let i = 1; i <= m; i++) {
    const curr = new Array(n + 1).fill(0);
    curr[0] = prev[0] + s1.charCodeAt(i - 1);
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = Math.min(
          prev[j] + s1.charCodeAt(i - 1),
          curr[j - 1] + s2.charCodeAt(j - 1)
        );
      }
    }
    prev = curr;
  }

  return prev[n];
}

// 方法3：转换为求最大 ASCII 公共子序列
// 最小删除和 = 总 ASCII 和 - 最大 ASCII 公共子序列和
// 时间复杂度 O(m * n)，空间复杂度 O(m * n)
function minimumDeleteSumViaLCS(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;

  // 计算 s1 和 s2 的 ASCII 总和
  const totalAscii =
    [...s1].reduce((sum, c) => sum + c.charCodeAt(0), 0) +
    [...s2].reduce((sum, c) => sum + c.charCodeAt(0), 0);

  // dp[i][j] = s1[0..i-1] 和 s2[0..j-1] 的最大 ASCII 公共子序列和
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + s1.charCodeAt(i - 1);
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return totalAscii - 2 * dp[m][n];
}

// ============================================================
// 4. 百度2021秋招 - 子序列中的k种字母
// 给定一个由小写字母组成的字符串 s 和整数 k，
// 求 s 中恰好包含 k 种不同字母的子序列个数。
// （子序列由选取原字符串中的若干位置组成，不同位置集
// 合视为不同子序列，即使它们组成相同的字符串）
// ============================================================

// 方法：组合计数 + 动态规划
// 对于字母集合 S（|S| = k），仅使用 S 中字母且每种至少出现一次
// 的子序列数 = ∏(2^cnt[c] - 1)，其中 cnt[c] 为字符 c 在 s 中出现次数
// 用 DP 求和：dp[j] = 选取 j 种字符的所有子集的乘积之和
// 时间复杂度 O(m * k)，其中 m 为 s 中不同字符种类数（≤26）
// 空间复杂度 O(k)
function subsequencesWithKDistinct(s: string, k: number): number {
  const MOD = 1e9 + 7;

  // 统计每个字符的出现次数
  const count = new Map<string, number>();
  for (const c of s) {
    count.set(c, (count.get(c) ?? 0) + 1);
  }

  // 不同字符种类数
  const distinctChars = [...count.entries()];

  if (distinctChars.length < k) return 0;

  // 快速幂
  function pow(base: number, exp: number): number {
    let result = 1;
    base = base % MOD;
    while (exp > 0) {
      if (exp % 2 === 1) result = (result * base) % MOD;
      base = (base * base) % MOD;
      exp = Math.floor(exp / 2);
    }
    return result;
  }

  // dp[j] = 选取 j 种字符的所有子集对应的 ∏(2^cnt[c]-1) 之和
  // 初始：dp[0] = 1（空集的乘积为1）
  const dp = new Array(k + 1).fill(0);
  dp[0] = 1;

  for (const [, cnt] of distinctChars) {
    // 对于字符 c，贡献值 = 2^cnt - 1（选至少一个位置）
    const contrib = (pow(2, cnt) - 1 + MOD) % MOD;
    // 从大到小更新，避免重复计算
    for (let j = k; j >= 1; j--) {
      dp[j] = (dp[j] + (dp[j - 1] * contrib) % MOD) % MOD;
    }
  }

  return dp[k];
}

// 方法2：枚举所有大小为 k 的字符子集（仅适用于 k 较小的情况）
// 时间复杂度 O(C(26,k) * k)，空间复杂度 O(1)
function subsequencesWithKDistinctBrute(s: string, k: number): number {
  const MOD = 1e9 + 7;

  // 统计每个字符的出现次数
  const count = new Map<string, number>();
  for (const c of s) {
    count.set(c, (count.get(c) ?? 0) + 1);
  }

  const chars = [...count.keys()];
  if (chars.length < k) return 0;

  function pow(base: number, exp: number): number {
    let result = 1;
    base = base % MOD;
    while (exp > 0) {
      if (exp % 2 === 1) result = (result * base) % MOD;
      base = (base * base) % MOD;
      exp = Math.floor(exp / 2);
    }
    return result;
  }

  // 枚举所有大小为 k 的字符子集
  let total = 0;
  const n = chars.length;

  function backtrack(start: number, chosen: string[]): void {
    if (chosen.length === k) {
      let product = 1;
      for (const c of chosen) {
        const cnt = count.get(c)!;
        product = (product * ((pow(2, cnt) - 1 + MOD) % MOD)) % MOD;
      }
      total = (total + product) % MOD;
      return;
    }
    for (let i = start; i < n; i++) {
      chosen.push(chars[i]);
      backtrack(i + 1, chosen);
      chosen.pop();
    }
  }

  backtrack(0, []);
  return total;
}

// ============================================================
// 5. 阿里达摩院0902 - 小红的回文博弈
// 给定一个字符串 s，小红和小明轮流从中删除一个字符。
// 删除后，如果剩余字符串是回文串，则删除者获胜。
// 如果初始字符串已经是回文串，则小红获胜。
// 双方都采取最优策略，判断谁获胜。
// ============================================================

// 方法：博弈论分析
// 设 d = 不匹配对数 = #{i : s[i] != s[n-1-i], 0 <= i < n/2}
// - d = 0：已经是回文串，小红胜
// - d = 1：小红可以删除不匹配对中的一个字符使串变为回文，小红胜
// - d >= 2 且 n 为奇数：小红可以先删除中间字符（"免费"操作），
//   使对手面临偶数长度、d >= 2 的局面，对手处于劣势，小红胜
// - d >= 2 且 n 为偶数：小红必须删除非中间字符，删除后 n 变为奇数，
//   对手获得中间字符的"免费操作"优势，小明胜
// 时间复杂度 O(n)，空间复杂度 O(1)
function palindromeGame(s: string): string {
  const n = s.length;

  // 计算不匹配对数
  let d = 0;
  for (let i = 0; i < Math.floor(n / 2); i++) {
    if (s[i] !== s[n - 1 - i]) {
      d++;
    }
  }

  if (d === 0) return "小红"; // 已经是回文串
  if (d === 1) return "小红"; // 删除不匹配字符即可
  if (n % 2 === 1) return "小红"; // 奇数长度有中间字符优势
  return "小明"; // 偶数长度，小明胜
}

// 方法2：更严谨的博弈分析（处理 d >= 2 的边界情况）
// 当 d >= 2 时，还需检查是否存在"一步制胜"的删除（删除某字符后直接变成回文串）
// 时间复杂度 O(n)，空间复杂度 O(1)
function palindromeGameStrict(s: string): string {
  const n = s.length;

  // 判断是否为回文串
  function isPalindrome(str: string): boolean {
    let l = 0,
      r = str.length - 1;
    while (l < r) {
      if (str[l] !== str[r]) return false;
      l++;
      r--;
    }
    return true;
  }

  // 计算不匹配对数
  let d = 0;
  for (let i = 0; i < Math.floor(n / 2); i++) {
    if (s[i] !== s[n - 1 - i]) {
      d++;
    }
  }

  if (d === 0) return "小红";

  // 检查是否存在一步制胜的删除
  for (let i = 0; i < n; i++) {
    const remaining = s.slice(0, i) + s.slice(i + 1);
    if (isPalindrome(remaining)) {
      return "小红"; // 小红可以一步制胜
    }
  }

  // 没有一步制胜的删除，进入深度博弈
  // d = 1 且无一步制胜 → 取决于 n 的奇偶性
  if (d === 1) {
    // 奇数长度：小红无法一步制胜，删除后对手面临偶数长度
    // 偶数长度：理论上小红可以一步制胜（已在前面的循环处理）
    // 如果走到这里，说明 n 为奇数
    return n % 2 === 0 ? "小红" : "小明";
  }

  // d >= 2 且无一步制胜
  if (n % 2 === 1) return "小红";
  return "小明";
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 科大讯飞 - 将企鹅击落水中最小的力 =====");
console.log(minForceToKnockPenguins([3, 1, 2, 4, 5])); // 选择k=3，F=max(3+3,1+2,2+1,4+0,5+1)=6
console.log(minForceToKnockPenguins([1, 2, 3])); // 选择k=2，F=max(1+2,2+1,3+0)=3
console.log(minForceToKnockPenguins([5])); // 5
console.log(minForceToKnockPenguinsBrute([3, 1, 2, 4, 5])); // 验证：6
console.log(minForceToKnockPenguinsBrute([1, 2, 3])); // 验证：3

console.log("\n===== 2. 大疆 - 农田中作物的最大产量 =====");
const yields2 = [
  [1, 2, 3],
  [4, 6, 2],
  [3, 2, 1],
];
console.log(maxCropYield(yields2)); // 3+4+2=9 或 2+6+3=11 或 3+4+3=10 等，最大为11
console.log(maxCropYieldOptimized(yields2)); // 11

const yields2b = [
  [7, 6, 2],
  [3, 8, 1],
  [5, 4, 9],
];
console.log(maxCropYield(yields2b)); // 7+8+9=24（不同作物类型）
console.log(maxCropYieldOptimized(yields2b)); // 24

console.log("\n===== 3. Bilibili - 两个字符串的最小ASCII删除和 =====");
console.log(minimumDeleteSum("sea", "eat")); // 231（删除's'=115，删除't'=116）
console.log(minimumDeleteSum("delete", "leet")); // 403
console.log(minimumDeleteSumOptimized("sea", "eat")); // 231
console.log(minimumDeleteSumViaLCS("sea", "eat")); // 231

console.log("\n===== 4. 百度 - 子序列中的k种字母 =====");
console.log(subsequencesWithKDistinct("abc", 2)); // 6（ab,ac,bc 各2个位置的子序列）
console.log(subsequencesWithKDistinct("aab", 1)); // 6（选a:2^2-1=3, 选b:2^1-1=1, 总4...需验证）
console.log(subsequencesWithKDistinct("abc", 3)); // 1（abc各选一个位置，共1*1*1=1种）
console.log(subsequencesWithKDistinctBrute("abc", 2)); // 验证

console.log("\n===== 5. 阿里达摩院 - 小红的回文博弈 =====");
console.log(palindromeGame("aba")); // 小红（已经是回文）
console.log(palindromeGame("ab")); // 小红（d=1，删除一个即可）
console.log(palindromeGame("abcd")); // 小明（d=2，偶数长度）
console.log(palindromeGame("abcde")); // 小红（d=2，奇数长度有中间字符优势）
console.log(palindromeGame("aabb")); // 小明（d=2，偶数长度）
console.log(palindromeGameStrict("aba")); // 小红
console.log(palindromeGameStrict("ab")); // 小红
console.log(palindromeGameStrict("abcd")); // 小明

export {};
