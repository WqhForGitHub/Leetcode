// ============================================================
// 动态规划面试题 - TypeScript 解题合集
// 主题：爬楼梯 / 斐波那契数列 / 最大子序和 / 最长上升子序列 /
//       约瑟夫环 / 编辑距离 / 不同路径 / 最长重复子数组 /
//       最长连续递增序列 / 零钱兑换 / 完全平方数 /
//       最长回文子序列 / 整数拆分 / 最大正方形 / 最小路径和 /
//       三角形最小路径和 / 最大乘积子数组 / 打家劫舍 /
//       打家劫舍II / 打家劫舍III / 正则表达式匹配 / 石子合并
// ============================================================

// ============================================================
// 1. 爬楼梯
// LeetCode 70. Climbing Stairs
//
// 每次可以爬 1 或 2 个台阶，爬到第 n 阶有多少种方法？
//
// 核心思路：
//   dp[i] = dp[i-1] + dp[i-2]，到达第 i 阶的方法数等于
//   从第 i-1 阶跨 1 步 + 从第 i-2 阶跨 2 步
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)（滚动变量优化）
// ============================================================

// 方法1：动态规划 - 滚动变量（推荐）
function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev1 = 1, prev2 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev1 = prev2;
    prev2 = curr;
  }
  return prev2;
}

// 方法2：动态规划 - 数组
function climbStairsDP(n: number): number {
  if (n <= 2) return n;
  const dp: number[] = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// 方法3：矩阵快速幂 — O(log n)
function climbStairsMatrix(n: number): number {
  if (n <= 2) return n;
  // [[1,1],[1,0]]^k 的 [0][0] 即 F(k+1)
  const multiply = (a: number[][], b: number[][]): number[][] => {
    return [
      [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
      [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
    ];
  };
  let result: number[][] = [[1, 0], [0, 1]]; // 单位矩阵
  let base: number[][] = [[1, 1], [1, 0]];
  let power = n - 1;
  while (power > 0) {
    if (power % 2 === 1) result = multiply(result, base);
    base = multiply(base, base);
    power = Math.floor(power / 2);
  }
  return result[0][0];
}

// ============================================================
// 2. 斐波那契数列
// LeetCode 509. Fibonacci Number
//
// F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)
//
// 核心思路：经典 DP，自底向上迭代避免递归重复计算
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：滚动变量（推荐）
function fib(n: number): number {
  if (n <= 1) return n;
  let prev1 = 0, prev2 = 1;
  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev1 = prev2;
    prev2 = curr;
  }
  return prev2;
}

// 方法2：带备忘录的递归
function fibMemo(n: number): number {
  const memo = new Map<number, number>();
  function helper(n: number): number {
    if (n <= 1) return n;
    if (memo.has(n)) return memo.get(n)!;
    const result = helper(n - 1) + helper(n - 2);
    memo.set(n, result);
    return result;
  }
  return helper(n);
}

// 方法3：通项公式（Binet's Formula）
function fibFormula(n: number): number {
  const sqrt5 = Math.sqrt(5);
  return Math.round((Math.pow((1 + sqrt5) / 2, n) - Math.pow((1 - sqrt5) / 2, n)) / sqrt5);
}

// ============================================================
// 3. 最大子序和
// LeetCode 53. Maximum Subarray
//
// 找出数组中连续子数组的最大和
//
// 核心思路：
//   dp[i] 表示以 nums[i] 结尾的最大子数组和
//   dp[i] = max(dp[i-1] + nums[i], nums[i])
//   即：要么延续前面的子数组，要么从当前元素重新开始
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：Kadane 算法 - 滚动变量（推荐）
function maxSubArray(nums: number[]): number {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(currentSum + nums[i], nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}

// 方法2：动态规划 - 数组
function maxSubArrayDP(nums: number[]): number {
  const dp: number[] = new Array(nums.length);
  dp[0] = nums[0];
  let maxSum = dp[0];
  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
    maxSum = Math.max(maxSum, dp[i]);
  }
  return maxSum;
}

// 方法3：前缀和
function maxSubArrayPrefixSum(nums: number[]): number {
  let maxSum = nums[0];
  let minPrefix = 0;
  let prefixSum = 0;
  for (const num of nums) {
    prefixSum += num;
    maxSum = Math.max(maxSum, prefixSum - minPrefix);
    minPrefix = Math.min(minPrefix, prefixSum);
  }
  return maxSum;
}

// ============================================================
// 4. 最长上升子序列
// LeetCode 300. Longest Increasing Subsequence
//
// 找出数组中最长严格递增子序列的长度
//
// 核心思路：
//   方法1：dp[i] = 以 nums[i] 结尾的 LIS 长度
//          dp[i] = max(dp[j] + 1)，其中 j < i 且 nums[j] < nums[i]
//   方法2：贪心 + 二分，维护一个递增的 tails 数组
//
// 时间复杂度：O(n^2) / O(n log n)
// 空间复杂度：O(n)
// ============================================================

// 方法1：动态规划 — O(n^2)
function lengthOfLIS(nums: number[]): number {
  const n = nums.length;
  const dp: number[] = new Array(n).fill(1);
  let maxLen = 1;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
  }
  return maxLen;
}

// 方法2：贪心 + 二分查找 — O(n log n)（推荐）
function lengthOfLISBinary(nums: number[]): number {
  const tails: number[] = []; // tails[i] = 长度为 i+1 的上升子序列的最小末尾
  for (const num of nums) {
    let left = 0, right = tails.length;
    // 二分查找第一个 >= num 的位置
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    if (left === tails.length) {
      tails.push(num); // num 比所有末尾都大，扩展长度
    } else {
      tails[left] = num; // 替换，使末尾更小更优
    }
  }
  return tails.length;
}

// ============================================================
// 5. 约瑟夫环
// LeetCode 1823. Find the Winner of the Circular Game
// / 剑指 Offer 62. 圆圈中最后剩下的数字
//
// n 个人围成一圈，从 0 开始每次删除第 m 个人，求最后剩下的人的编号
//
// 核心思路：
//   f(n, m) = (f(n-1, m) + m) % n
//   递推含义：n-1 问题的解映射回 n 问题时，需偏移 m 位再对 n 取模
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：动态规划 - 迭代（推荐）
function lastRemaining(n: number, m: number): number {
  let result = 0; // f(1, m) = 0
  for (let i = 2; i <= n; i++) {
    result = (result + m) % i;
  }
  return result;
}

// 方法2：动态规划 - 数组
function lastRemainingDP(n: number, m: number): number {
  const dp: number[] = new Array(n + 1);
  dp[1] = 0;
  for (let i = 2; i <= n; i++) {
    dp[i] = (dp[i - 1] + m) % i;
  }
  return dp[n];
}

// 方法3：模拟（链表/数组）— O(nm)，仅用于理解
function lastRemainingSimulate(n: number, m: number): number {
  const list: number[] = [];
  for (let i = 0; i < n; i++) list.push(i);
  let idx = 0;
  while (list.length > 1) {
    idx = (idx + m - 1) % list.length;
    list.splice(idx, 1);
  }
  return list[0];
}

// ============================================================
// 6. 编辑距离
// LeetCode 72. Edit Distance
//
// 将 word1 转换成 word2 所需的最少操作数（插入、删除、替换）
//
// 核心思路：
//   dp[i][j] = word1[0..i-1] 转换为 word2[0..j-1] 的最少操作数
//   若 word1[i-1] === word2[j-1]：dp[i][j] = dp[i-1][j-1]
//   否则：dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
//         分别对应删除、插入、替换
//
// 时间复杂度：O(m * n)
// 空间复杂度：O(min(m, n))（滚动数组优化）
// ============================================================

// 方法1：二维动态规划（推荐，便于理解）
function minDistance(word1: string, word2: string): number {
  const m = word1.length, n = word2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // 边界：word1 空 -> word2 需插入 j 次；word2 空 -> word1 需删除 i 次
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // 字符相同，无需操作
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // 删除 word1[i-1]
          dp[i][j - 1] + 1,     // 插入 word2[j-1]
          dp[i - 1][j - 1] + 1  // 替换
        );
      }
    }
  }
  return dp[m][n];
}

// 方法2：滚动数组空间优化 — O(min(m,n))
function minDistanceOptimized(word1: string, word2: string): number {
  if (word1.length < word2.length) [word1, word2] = [word2, word1]; // 确保 word2 更短
  const m = word1.length, n = word2.length;
  let prev: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    const curr: number[] = new Array(n + 1);
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + 1);
      }
    }
    prev = curr;
  }
  return prev[n];
}

// ============================================================
// 7. 不同路径
// LeetCode 62. Unique Paths
//
// 从左上角到右下角，只能向右或向下走，有多少条不同路径？
//
// 核心思路：
//   dp[i][j] = dp[i-1][j] + dp[i][j-1]
//   到达 (i,j) 的路径数 = 从上方来的 + 从左方来的
//
// 时间复杂度：O(m * n)
// 空间复杂度：O(n)（滚动数组优化）
// ============================================================

// 方法1：动态规划 - 二维数组
function uniquePaths(m: number, n: number): number {
  const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(1));
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
}

// 方法2：滚动数组 — O(n) 空间（推荐）
function uniquePathsOptimized(m: number, n: number): number {
  const dp: number[] = new Array(n).fill(1);
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] = dp[j] + dp[j - 1]; // dp[j]=上方，dp[j-1]=左方
    }
  }
  return dp[n - 1];
}

// 方法3：组合数学 — C(m+n-2, m-1)
function uniquePathsComb(m: number, n: number): number {
  const total = m + n - 2;
  const k = Math.min(m - 1, n - 1);
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (total - i) / (i + 1);
  }
  return Math.round(result);
}

// ============================================================
// 8. 最长重复子数组
// LeetCode 718. Maximum Length of Repeated Subarray
//
// 找出两个数组中公共的、长度最长的子数组（连续）
//
// 核心思路：
//   dp[i][j] = 以 nums1[i-1] 和 nums2[j-1] 结尾的最长公共子数组长度
//   若 nums1[i-1] === nums2[j-1]：dp[i][j] = dp[i-1][j-1] + 1
//   否则：dp[i][j] = 0（子数组必须连续）
//
// 时间复杂度：O(m * n)
// 空间复杂度：O(n)（滚动数组优化）
// ============================================================

// 方法1：二维动态规划
function findLength(nums1: number[], nums2: number[]): number {
  const m = nums1.length, n = nums2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  let maxLen = 0;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (nums1[i - 1] === nums2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        maxLen = Math.max(maxLen, dp[i][j]);
      }
      // 不相等时 dp[i][j] = 0（已初始化）
    }
  }
  return maxLen;
}

// 方法2：滚动数组 — O(n) 空间（推荐）
function findLengthOptimized(nums1: number[], nums2: number[]): number {
  const m = nums1.length, n = nums2.length;
  let dp: number[] = new Array(n + 1).fill(0);
  let maxLen = 0;

  for (let i = 1; i <= m; i++) {
    const curr: number[] = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (nums1[i - 1] === nums2[j - 1]) {
        curr[j] = dp[j - 1] + 1;
        maxLen = Math.max(maxLen, curr[j]);
      }
    }
    dp = curr;
  }
  return maxLen;
}

// ============================================================
// 9. 最长连续递增序列
// LeetCode 674. Longest Continuous Increasing Subsequence
//
// 找出数组中最长连续递增子序列的长度
//
// 核心思路：
//   dp[i] = 以 nums[i] 结尾的最长连续递增子序列长度
//   若 nums[i] > nums[i-1]：dp[i] = dp[i-1] + 1
//   否则：dp[i] = 1
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：滚动变量（推荐）
function findLengthOfLCIS(nums: number[]): number {
  let maxLen = 1, currLen = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      currLen++;
      maxLen = Math.max(maxLen, currLen);
    } else {
      currLen = 1;
    }
  }
  return maxLen;
}

// 方法2：贪心 - 双指针
function findLengthOfLCISTwoPointer(nums: number[]): number {
  let maxLen = 0;
  let left = 0;
  for (let right = 0; right < nums.length; right++) {
    if (right > 0 && nums[right] <= nums[right - 1]) {
      left = right; // 不递增则重置起点
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

// ============================================================
// 10. 不同路径 II
// LeetCode 63. Unique Paths II
//
// 网格中有障碍物，从左上角到右下角有多少条不同路径？
//
// 核心思路：
//   有障碍物的格子路径数为 0，其余同 Unique Paths
//   dp[i][j] = obstacleGrid[i][j] === 1 ? 0 : dp[i-1][j] + dp[i][j-1]
//
// 时间复杂度：O(m * n)
// 空间复杂度：O(n)
// ============================================================

// 方法1：动态规划 - 滚动数组（推荐）
function uniquePathsWithObstacles(obstacleGrid: number[][]): number {
  const m = obstacleGrid.length, n = obstacleGrid[0].length;
  if (obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1) return 0;

  const dp: number[] = new Array(n).fill(0);
  dp[0] = 1;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (obstacleGrid[i][j] === 1) {
        dp[j] = 0;
      } else if (j > 0) {
        dp[j] = dp[j] + dp[j - 1];
      }
      // j === 0 时 dp[j] 保持上一行的值（从上方来）
    }
  }
  return dp[n - 1];
}

// 方法2：二维数组
function uniquePathsWithObstacles2D(obstacleGrid: number[][]): number {
  const m = obstacleGrid.length, n = obstacleGrid[0].length;
  if (obstacleGrid[0][0] === 1) return 0;

  const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  dp[0][0] = 1;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (obstacleGrid[i][j] === 1) {
        dp[i][j] = 0;
        continue;
      }
      if (i === 0 && j === 0) continue;
      const fromTop = i > 0 ? dp[i - 1][j] : 0;
      const fromLeft = j > 0 ? dp[i][j - 1] : 0;
      dp[i][j] = fromTop + fromLeft;
    }
  }
  return dp[m - 1][n - 1];
}

// ============================================================
// 11. 零钱兑换
// LeetCode 322. Coin Change
//
// 给定不同面额的硬币和总金额，求凑成总金额所需的最少硬币数
//
// 核心思路：
//   dp[i] = 凑成金额 i 所需的最少硬币数
//   dp[i] = min(dp[i - coin] + 1)，对每个硬币面额 coin
//
// 时间复杂度：O(amount * n)，n 为硬币种类数
// 空间复杂度：O(amount)
// ============================================================

// 方法1：动态规划 - 完全背包（推荐）
function coinChange(coins: number[], amount: number): number {
  const dp: number[] = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// 方法2：BFS — 按层搜索最少硬币数
function coinChangeBFS(coins: number[], amount: number): number {
  if (amount === 0) return 0;
  const visited: boolean[] = new Array(amount + 1).fill(false);
  const queue: number[] = [0];
  visited[0] = true;
  let steps = 0;

  while (queue.length > 0) {
    const size = queue.length;
    steps++;
    for (let i = 0; i < size; i++) {
      const curr = queue.shift()!;
      for (const coin of coins) {
        const next = curr + coin;
        if (next === amount) return steps;
        if (next < amount && !visited[next]) {
          visited[next] = true;
          queue.push(next);
        }
      }
    }
  }
  return -1;
}

// ============================================================
// 12. 完全平方数
// LeetCode 279. Perfect Squares
//
// 给定整数 n，求和为 n 的最少完全平方数数量
//
// 核心思路：
//   dp[i] = min(dp[i - j*j] + 1)，其中 j*j <= i
//   对每个 i，尝试减去一个完全平方数后取最小值
//
// 时间复杂度：O(n * sqrt(n))
// 空间复杂度：O(n)
// ============================================================

// 方法1：动态规划（推荐）
function numSquares(n: number): number {
  const dp: number[] = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j * j <= i; j++) {
      dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
    }
  }
  return dp[n];
}

// 方法2：BFS — 按层搜索
function numSquaresBFS(n: number): number {
  if (n === 0) return 0;
  // 预计算所有 <= n 的完全平方数
  const squares: number[] = [];
  for (let i = 1; i * i <= n; i++) squares.push(i * i);

  const visited: boolean[] = new Array(n + 1).fill(false);
  const queue: number[] = [n];
  visited[n] = true;
  let level = 0;

  while (queue.length > 0) {
    const size = queue.length;
    level++;
    for (let i = 0; i < size; i++) {
      const curr = queue.shift()!;
      for (const sq of squares) {
        const next = curr - sq;
        if (next === 0) return level;
        if (next > 0 && !visited[next]) {
          visited[next] = true;
          queue.push(next);
        }
      }
    }
  }
  return n; // 最坏情况：n 个 1
}

// 方法3：数学 — 四平方和定理（拉格朗日）
// 任何正整数最多可表示为 4 个完全平方数之和
function numSquaresMath(n: number): number {
  // 判断是否为完全平方数
  const isPerfectSquare = (x: number): boolean => {
    const s = Math.floor(Math.sqrt(x));
    return s * s === x;
  };

  // 情况1：本身是完全平方数
  if (isPerfectSquare(n)) return 1;

  // 情况4：n = 4^a * (8b + 7) 形式时返回 4（Legendre 三平方定理）
  let temp = n;
  while (temp % 4 === 0) temp = Math.floor(temp / 4);
  if (temp % 8 === 7) return 4;

  // 情况2：是否可表示为两个平方数之和
  for (let i = 1; i * i <= n; i++) {
    if (isPerfectSquare(n - i * i)) return 2;
  }

  // 情况3：其余均为 3
  return 3;
}

// ============================================================
// 13. 最长回文子序列
// LeetCode 516. Longest Palindromic Subsequence
//
// 找出字符串中最长回文子序列的长度
//
// 核心思路：
//   dp[i][j] = s[i..j] 中最长回文子序列的长度
//   若 s[i] === s[j]：dp[i][j] = dp[i+1][j-1] + 2
//   否则：dp[i][j] = max(dp[i+1][j], dp[i][j-1])
//   需从小区间向大区间推导，或从后往前遍历
//
// 时间复杂度：O(n^2)
// 空间复杂度：O(n^2) / O(n)
// ============================================================

// 方法1：区间 DP - 二维数组
function longestPalindromeSubseq(s: string): number {
  const n = s.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // 单个字符是长度为 1 的回文
  for (let i = 0; i < n; i++) dp[i][i] = 1;

  // 从后往前遍历，保证 dp[i+1][j-1], dp[i+1][j], dp[i][j-1] 已计算
  for (let i = n - 2; i >= 0; i--) {
    for (let j = i + 1; j < n; j++) {
      if (s[i] === s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[0][n - 1];
}

// 方法2：转化为 LCS 问题 — 最长回文子序列 = s 与 reverse(s) 的最长公共子序列
function longestPalindromeSubseqLCS(s: string): number {
  const reversed = s.split("").reverse().join("");
  return longestCommonSubsequence(s, reversed);
}

// LCS 辅助函数
function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length, n = text2.length;
  let prev: number[] = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    const curr: number[] = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    prev = curr;
  }
  return prev[n];
}

// ============================================================
// 14. 整数拆分
// LeetCode 343. Integer Break
//
// 将正整数 n 拆分为至少两个正整数的和，使这些整数的乘积最大化
//
// 核心思路：
//   dp[i] = 将 i 拆分后得到的最大乘积
//   dp[i] = max(j * (i-j), j * dp[i-j])，对 j 从 1 到 i-1
//   j*(i-j)：只拆成两份；j*dp[i-j]：继续拆分 i-j
//
// 时间复杂度：O(n^2)
// 空间复杂度：O(n)
// ============================================================

// 方法1：动态规划
function integerBreak(n: number): number {
  const dp: number[] = new Array(n + 1).fill(0);
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    for (let j = 1; j < i; j++) {
      dp[i] = Math.max(dp[i], j * (i - j), j * dp[i - j]);
    }
  }
  return dp[n];
}

// 方法2：数学 — 尽量拆成 3，余 1 则把 3+1 换成 2+2
function integerBreakMath(n: number): number {
  if (n <= 3) return n - 1;
  const quotient = Math.floor(n / 3);
  const remainder = n % 3;
  if (remainder === 0) return Math.pow(3, quotient);
  if (remainder === 1) return Math.pow(3, quotient - 1) * 4; // 3+1 -> 2+2
  return Math.pow(3, quotient) * 2; // remainder === 2
}

// ============================================================
// 15. 最大正方形
// LeetCode 221. Maximal Square
//
// 在由 '0' 和 '1' 组成的矩阵中，找到只包含 '1' 的最大正方形面积
//
// 核心思路：
//   dp[i][j] = 以 (i,j) 为右下角的最大正方形边长
//   若 matrix[i][j] === '1'：dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
//   否则：dp[i][j] = 0
//
// 时间复杂度：O(m * n)
// 空间复杂度：O(n)（滚动数组优化）
// ============================================================

// 方法1：动态规划 - 二维数组
function maximalSquare(matrix: string[][]): number {
  const m = matrix.length, n = matrix[0].length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  let maxSide = 0;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (matrix[i - 1][j - 1] === "1") {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
        maxSide = Math.max(maxSide, dp[i][j]);
      }
    }
  }
  return maxSide * maxSide;
}

// 方法2：滚动数组 — O(n) 空间（推荐）
function maximalSquareOptimized(matrix: string[][]): number {
  const m = matrix.length, n = matrix[0].length;
  let prev: number[] = new Array(n + 1).fill(0);
  let maxSide = 0;

  for (let i = 1; i <= m; i++) {
    const curr: number[] = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (matrix[i - 1][j - 1] === "1") {
        curr[j] = Math.min(prev[j], curr[j - 1], prev[j - 1]) + 1;
        maxSide = Math.max(maxSide, curr[j]);
      }
    }
    prev = curr;
  }
  return maxSide * maxSide;
}

// ============================================================
// 16. 最小路径和
// LeetCode 64. Minimum Path Sum
//
// 从左上角到右下角，只能向右或向下，求路径上的数字总和最小
//
// 核心思路：
//   dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
//
// 时间复杂度：O(m * n)
// 空间复杂度：O(n)（滚动数组优化）
// ============================================================

// 方法1：动态规划 - 原地修改（O(1) 额外空间）
function minPathSum(grid: number[][]): number {
  const m = grid.length, n = grid[0].length;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) continue;
      if (i === 0) grid[i][j] += grid[i][j - 1];
      else if (j === 0) grid[i][j] += grid[i - 1][j];
      else grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
    }
  }
  return grid[m - 1][n - 1];
}

// 方法2：滚动数组 — 不修改原数组
function minPathSumOptimized(grid: number[][]): number {
  const m = grid.length, n = grid[0].length;
  const dp: number[] = new Array(n).fill(0);
  dp[0] = grid[0][0];

  for (let j = 1; j < n; j++) dp[j] = dp[j - 1] + grid[0][j];

  for (let i = 1; i < m; i++) {
    dp[0] += grid[i][0];
    for (let j = 1; j < n; j++) {
      dp[j] = grid[i][j] + Math.min(dp[j], dp[j - 1]);
    }
  }
  return dp[n - 1];
}

// ============================================================
// 17. 三角形最小路径和
// LeetCode 120. Triangle
//
// 给定三角形，从顶到底的最小路径和，每步只能走到下一行相邻节点
//
// 核心思路：
//   dp[i][j] = triangle[i][j] + min(dp[i-1][j-1], dp[i-1][j])
//   自底向上更简洁：dp[j] = triangle[i][j] + min(dp[j], dp[j+1])
//
// 时间复杂度：O(n^2)，n 为三角形行数
// 空间复杂度：O(n)
// ============================================================

// 方法1：自底向上动态规划（推荐）
function minimumTotal(triangle: number[][]): number {
  const n = triangle.length;
  const dp: number[] = [...triangle[n - 1]]; // 从最后一行开始

  for (let i = n - 2; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      dp[j] = triangle[i][j] + Math.min(dp[j], dp[j + 1]);
    }
  }
  return dp[0];
}

// 方法2：自顶向下
function minimumTotalTopDown(triangle: number[][]): number {
  const n = triangle.length;
  const dp: number[] = new Array(n).fill(Infinity);
  dp[0] = triangle[0][0];

  for (let i = 1; i < n; i++) {
    // 从右往左更新，避免覆盖
    for (let j = i; j >= 0; j--) {
      const fromLeft = j > 0 ? dp[j - 1] : Infinity;
      const fromTop = dp[j] !== Infinity ? dp[j] : Infinity;
      dp[j] = triangle[i][j] + Math.min(fromLeft, fromTop);
    }
  }
  return Math.min(...dp);
}

// ============================================================
// 18. 最大乘积子数组
// LeetCode 152. Maximum Product Subarray
//
// 找出数组中乘积最大的连续子数组
//
// 核心思路：
//   由于负负得正，需同时维护最大值和最小值
//   maxDP[i] = max(nums[i], maxDP[i-1]*nums[i], minDP[i-1]*nums[i])
//   minDP[i] = min(nums[i], maxDP[i-1]*nums[i], minDP[i-1]*nums[i])
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：双滚动变量（推荐）
function maxProduct(nums: number[]): number {
  let maxProd = nums[0], minProd = nums[0], result = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    // 由于 maxProd 会被更新，需先保存旧值
    const prevMax = maxProd;
    maxProd = Math.max(num, prevMax * num, minProd * num);
    minProd = Math.min(num, prevMax * num, minProd * num);
    result = Math.max(result, maxProd);
  }
  return result;
}

// 方法2：前后两次遍历 — 巧妙利用负数个数的奇偶性
function maxProductTwoPass(nums: number[]): number {
  let result = -Infinity;
  let prod = 1;

  // 从左到右
  for (const num of nums) {
    prod *= num;
    result = Math.max(result, prod);
    if (num === 0) prod = 1; // 遇到 0 重置
  }

  prod = 1;
  // 从右到左
  for (let i = nums.length - 1; i >= 0; i--) {
    prod *= nums[i];
    result = Math.max(result, prod);
    if (nums[i] === 0) prod = 1;
  }
  return result;
}

// ============================================================
// 19. 打家劫舍
// LeetCode 198. House Robber
//
// 相邻房屋不能同时偷窃，求能偷窃到的最高金额
//
// 核心思路：
//   dp[i] = max(dp[i-1], dp[i-2] + nums[i])
//   偷第 i 家：dp[i-2] + nums[i]；不偷：dp[i-1]
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：滚动变量（推荐）
function rob(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  let prev2 = nums[0], prev1 = Math.max(nums[0], nums[1]);
  for (let i = 2; i < nums.length; i++) {
    const curr = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

// 方法2：动态规划 - 数组
function robDP(nums: number[]): number {
  const n = nums.length;
  if (n === 0) return 0;
  const dp: number[] = new Array(n);
  dp[0] = nums[0];
  if (n > 1) dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
  }
  return dp[n - 1];
}

// ============================================================
// 20. 打家劫舍 II
// LeetCode 213. House Robber II
//
// 房屋围成一圈（首尾相连），不能同时偷相邻房屋
//
// 核心思路：
//   首尾不能同时偷，分两种情况取最大值：
//   - 偷 [0, n-2]（不偷最后一间）
//   - 偷 [1, n-1]（不偷第一间）
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

function rob2(nums: number[]): number {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];
  if (n === 2) return Math.max(nums[0], nums[1]);

  // 辅助：对区间 [start, end] 做打家劫舍
  const robRange = (start: number, end: number): number => {
    let prev2 = nums[start], prev1 = Math.max(nums[start], nums[start + 1]);
    for (let i = start + 2; i <= end; i++) {
      const curr = Math.max(prev1, prev2 + nums[i]);
      prev2 = prev1;
      prev1 = curr;
    }
    return prev1;
  };

  // 不偷最后一间 vs 不偷第一间
  return Math.max(robRange(0, n - 2), robRange(1, n - 1));
}

// ============================================================
// 21. 打家劫舍 III
// LeetCode 337. House Robber III
//
// 房屋排列成二叉树，相邻节点不能同时偷，求最高金额
//
// 核心思路：
//   后序遍历 + 状态 DP：
//   每个节点返回 [不偷当前节点的最大值, 偷当前节点的最大值]
//   - 不偷当前：max(偷左, 不偷左) + max(偷右, 不偷右)
//   - 偷当前：不偷左 + 不偷右 + 当前值
//
// 时间复杂度：O(n)
// 空间复杂度：O(h)，h 为树高
// ============================================================

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

function rob3(root: TreeNode | null): number {
  // 返回 [不偷当前节点的最大值, 偷当前节点的最大值]
  function dfs(node: TreeNode | null): [number, number] {
    if (node === null) return [0, 0];

    const [leftNotRob, leftRob] = dfs(node.left);
    const [rightNotRob, rightRob] = dfs(node.right);

    // 不偷当前节点：左右子树各自取最大值（可偷可不偷）
    const notRob = Math.max(leftNotRob, leftRob) + Math.max(rightNotRob, rightRob);
    // 偷当前节点：左右子树都不能偷
    const rob = leftNotRob + rightNotRob + node.val;

    return [notRob, rob];
  }

  const [notRob, rob] = dfs(root);
  return Math.max(notRob, rob);
}

// ============================================================
// 22. 正则表达式匹配
// LeetCode 10. Regular Expression Matching
//
// '.' 匹配任意单个字符，'*' 匹配零个或多个前一个元素
//
// 核心思路：
//   dp[i][j] = s[0..i-1] 是否匹配 p[0..j-1]
//   若 p[j-1] === '*'：
//     - 匹配 0 次：dp[i][j] = dp[i][j-2]（忽略 x*）
//     - 匹配 1+ 次：dp[i][j] = dp[i-1][j] && (s[i-1] === p[j-2] || p[j-2] === '.')
//   否则：
//     dp[i][j] = dp[i-1][j-1] && (s[i-1] === p[j-1] || p[j-1] === '.')
//
// 时间复杂度：O(m * n)
// 空间复杂度：O(m * n)
// ============================================================

function isMatch(s: string, p: string): boolean {
  const m = s.length, n = p.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));

  dp[0][0] = true; // 空串匹配空模式

  // 初始化：s 为空，p 中有 '*' 可以匹配 0 次
  for (let j = 2; j <= n; j++) {
    if (p[j - 1] === "*") dp[0][j] = dp[0][j - 2];
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        // 匹配 0 次：忽略 x*
        dp[i][j] = dp[i][j - 2];
        // 匹配 1+ 次：s[i-1] 需与 * 前的字符匹配
        if (s[i - 1] === p[j - 2] || p[j - 2] === ".") {
          dp[i][j] = dp[i][j] || dp[i - 1][j];
        }
      } else {
        // 普通字符或 '.'
        if (s[i - 1] === p[j - 1] || p[j - 1] === ".") {
          dp[i][j] = dp[i - 1][j - 1];
        }
      }
    }
  }
  return dp[m][n];
}

// ============================================================
// 23. 石子合并
// AcWing 282. 石子合并 / 区间 DP 经典题
//
// n 堆石子排成一排，每次合并相邻两堆，代价为两堆石子数之和，求最小总代价
//
// 核心思路：
//   区间 DP：dp[i][j] = 合并第 i 堆到第 j 堆的最小代价
//   dp[i][j] = min(dp[i][k] + dp[k+1][j] + sum[i..j])，i <= k < j
//   先枚举区间长度，再枚举起点，最后枚举分割点
//
// 时间复杂度：O(n^3)
// 空间复杂度：O(n^2)
// ============================================================

// 方法1：区间 DP（推荐）
function mergeStones(stones: number[]): number {
  const n = stones.length;
  if (n <= 1) return 0;

  // 前缀和
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + stones[i];

  const sum = (i: number, j: number): number => prefix[j + 1] - prefix[i];

  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // 枚举区间长度
  for (let len = 2; len <= n; len++) {
    // 枚举起点
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      // 枚举分割点
      for (let k = i; k < j; k++) {
        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j] + sum(i, j));
      }
    }
  }
  return dp[0][n - 1];
}

// 方法2：区间 DP - 优化分割点范围（四边形不等式优化，进阶）
// 利用决策单调性可将内层循环从 O(n) 降到 O(1)，但此处给出基本实现
function mergeStonesOptimized(stones: number[]): number {
  const n = stones.length;
  if (n <= 1) return 0;

  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + stones[i];

  const sum = (i: number, j: number): number => prefix[j + 1] - prefix[i];

  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const opt: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // 长度为 1 的区间：代价为 0，最优分割点就是自身
  for (let i = 0; i < n; i++) opt[i][i] = i;

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      // 限制分割点范围在 [opt[i][j-1], opt[i+1][j]]
      const left = opt[i][j - 1];
      const right = opt[i + 1][j] ?? j - 1;
      for (let k = left; k <= Math.min(right, j - 1); k++) {
        const cost = dp[i][k] + dp[k + 1][j] + sum(i, j);
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          opt[i][j] = k;
        }
      }
    }
  }
  return dp[0][n - 1];
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 爬楼梯 =====");
console.log(climbStairs(2)); // 2
console.log(climbStairs(3)); // 3
console.log(climbStairs(5)); // 8
console.log(climbStairsMatrix(5)); // 8

console.log("\n===== 2. 斐波那契数列 =====");
console.log(fib(0)); // 0
console.log(fib(1)); // 1
console.log(fib(10)); // 55
console.log(fibFormula(10)); // 55

console.log("\n===== 3. 最大子序和 =====");
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([1])); // 1
console.log(maxSubArrayPrefixSum([5, 4, -1, 7, 8])); // 23

console.log("\n===== 4. 最长上升子序列 =====");
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4
console.log(lengthOfLISBinary([0, 1, 0, 3, 2, 3])); // 4
console.log(lengthOfLISBinary([7, 7, 7, 7, 7, 7, 7])); // 1

console.log("\n===== 5. 约瑟夫环 =====");
console.log(lastRemaining(5, 3)); // 3
console.log(lastRemaining(10, 17)); // 2
console.log(lastRemaining(7, 3)); // 3

console.log("\n===== 6. 编辑距离 =====");
console.log(minDistance("horse", "ros")); // 3
console.log(minDistance("intention", "execution")); // 5
console.log(minDistanceOptimized("abc", "abc")); // 0

console.log("\n===== 7. 不同路径 =====");
console.log(uniquePaths(3, 7)); // 28
console.log(uniquePathsOptimized(3, 2)); // 3
console.log(uniquePathsComb(3, 7)); // 28

console.log("\n===== 8. 最长重复子数组 =====");
console.log(findLength([1, 2, 3, 2, 1], [3, 2, 1, 4, 7])); // 3
console.log(findLengthOptimized([0, 0, 0, 0, 0], [0, 0, 0, 0, 0])); // 5

console.log("\n===== 9. 最长连续递增序列 =====");
console.log(findLengthOfLCIS([1, 3, 5, 4, 7])); // 3
console.log(findLengthOfLCISTwoPointer([2, 2, 2, 2, 2])); // 1

console.log("\n===== 10. 不同路径 II =====");
console.log(uniquePathsWithObstacles([[0, 0, 0], [0, 1, 0], [0, 0, 0]])); // 2
console.log(uniquePathsWithObstacles([[0, 1], [0, 0]])); // 1

console.log("\n===== 11. 零钱兑换 =====");
console.log(coinChange([1, 2, 5], 11)); // 3
console.log(coinChange([2], 3)); // -1
console.log(coinChangeBFS([1, 2, 5], 11)); // 3

console.log("\n===== 12. 完全平方数 =====");
console.log(numSquares(12)); // 3 (4+4+4)
console.log(numSquaresBFS(13)); // 2 (4+9)
console.log(numSquaresMath(12)); // 3

console.log("\n===== 13. 最长回文子序列 =====");
console.log(longestPalindromeSubseq("bbbab")); // 4
console.log(longestPalindromeSubseqLCS("cbbd")); // 2

console.log("\n===== 14. 整数拆分 =====");
console.log(integerBreak(2)); // 1
console.log(integerBreak(10)); // 36
console.log(integerBreakMath(10)); // 36

console.log("\n===== 15. 最大正方形 =====");
console.log(maximalSquare([["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]])); // 4
console.log(maximalSquareOptimized([["0"]])); // 0

console.log("\n===== 16. 最小路径和 =====");
console.log(minPathSum([[1,3,1],[1,5,1],[4,1,1]])); // 7
console.log(minPathSumOptimized([[1,2,3],[4,5,6]])); // 12

console.log("\n===== 17. 三角形最小路径和 =====");
console.log(minimumTotal([[2],[3,4],[6,5,7],[4,1,8,3]])); // 11
console.log(minimumTotalTopDown([[-10]])); // -10

console.log("\n===== 18. 最大乘积子数组 =====");
console.log(maxProduct([2, 3, -2, 4])); // 6
console.log(maxProduct([-2, 0, -1])); // 0
console.log(maxProductTwoPass([-2, 3, -4])); // 24

console.log("\n===== 19. 打家劫舍 =====");
console.log(rob([1, 2, 3, 1])); // 4
console.log(robDP([2, 7, 9, 3, 1])); // 12

console.log("\n===== 20. 打家劫舍 II =====");
console.log(rob2([2, 3, 2])); // 3
console.log(rob2([1, 2, 3, 1])); // 4

console.log("\n===== 21. 打家劫舍 III =====");
//     3
//    / \
//   2   3
//    \   \
//     3   1
const tree1 = new TreeNode(3,
  new TreeNode(2, null, new TreeNode(3)),
  new TreeNode(3, null, new TreeNode(1))
);
console.log(rob3(tree1)); // 7

console.log("\n===== 22. 正则表达式匹配 =====");
console.log(isMatch("aa", "a")); // false
console.log(isMatch("aa", "a*")); // true
console.log(isMatch("ab", ".*")); // true
console.log(isMatch("aab", "c*a*b")); // true

console.log("\n===== 23. 石子合并 =====");
console.log(mergeStones([1, 3, 5, 2])); // 17
console.log(mergeStones([3, 4, 5, 6])); // 30
console.log(mergeStonesOptimized([1, 3, 5, 2])); // 17

export {};
