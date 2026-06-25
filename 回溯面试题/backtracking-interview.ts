// ============================================================
// 回溯面试题 - TypeScript 解题合集
// 主题：括号生成 / 子集 / 子集II / 组合 / 全排列 /
//       全排列II / 单词搜索 / 组合总和 / N皇后
// ============================================================

// ============================================================
// 1. 括号生成
// LeetCode 22. Generate Parentheses
//
// 给定 n 对括号，生成所有合法的括号组合
//
// 核心思路：
//   回溯法，在构建字符串的过程中做剪枝：
//   - 左括号数量 < n 时，可以添加左括号
//   - 右括号数量 < 左括号数量时，可以添加右括号
//   - 当左右括号都用完时，得到一个合法组合
//
// 时间复杂度：O(4^n / sqrt(n))（卡特兰数）
// 空间复杂度：O(n)（递归深度）
// ============================================================

// 方法1：回溯法（推荐）
function generateParenthesis(n: number): string[] {
  const result: string[] = [];

  function backtrack(current: string, open: number, close: number): void {
    // 终止条件：当前字符串长度 === 2n
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }

    // 可以添加左括号
    if (open < n) {
      backtrack(current + "(", open + 1, close);
    }

    // 可以添加右括号（右括号数量必须 < 左括号数量）
    if (close < open) {
      backtrack(current + ")", open, close + 1);
    }
  }

  backtrack("", 0, 0);
  return result;
}

// 方法2：回溯法 - 用数组代替字符串拼接（性能稍优）
function generateParenthesisArray(n: number): string[] {
  const result: string[] = [];
  const path: string[] = [];

  function backtrack(open: number, close: number): void {
    if (path.length === 2 * n) {
      result.push(path.join(""));
      return;
    }

    if (open < n) {
      path.push("(");
      backtrack(open + 1, close);
      path.pop(); // 回溯
    }

    if (close < open) {
      path.push(")");
      backtrack(open, close + 1);
      path.pop(); // 回溯
    }
  }

  backtrack(0, 0);
  return result;
}

// 方法3：动态规划
// dp[i] 表示 i 对括号的所有合法组合
// dp[i] = "(" + dp[j] + ")" + dp[i-1-j]，其中 0 <= j < i
function generateParenthesisDP(n: number): string[] {
  if (n === 0) return [""];
  const dp: string[][] = [[""]];
  // dp[0] = [""]

  for (let i = 1; i <= n; i++) {
    const current: string[] = [];
    for (let j = 0; j < i; j++) {
      // 左半部分取 dp[j]，右半部分取 dp[i-1-j]
      for (const left of dp[j]) {
        for (const right of dp[i - 1 - j]) {
          current.push("(" + left + ")" + right);
        }
      }
    }
    dp.push(current);
  }

  return dp[n];
}

// ============================================================
// 2. 子集
// LeetCode 78. Subsets
//
// 给定不含重复元素的整数数组，返回所有子集
//
// 核心思路：
//   回溯法，每个元素都有「选」或「不选」两种选择
//   - 对于每个位置，先不选（跳过），再选（加入 path）
//   - 每一步都记录当前子集
//
// 时间复杂度：O(n * 2^n)
// 空间复杂度：O(n)（递归深度）
// ============================================================

// 方法1：回溯法 - 选/不选（推荐）
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(index: number): void {
    // 每一步都是一个合法子集
    result.push([...path]);

    // 从 index 开始遍历，避免重复
    for (let i = index; i < nums.length; i++) {
      path.push(nums[i]); // 选择
      backtrack(i + 1); // 递归
      path.pop(); // 回溯
    }
  }

  backtrack(0);
  return result;
}

// 方法2：位运算
// 用一个 n 位二进制数表示选/不选，0 ~ 2^n - 1 的每个数对应一个子集
function subsetsBitmask(nums: number[]): number[][] {
  const result: number[][] = [];
  const n = nums.length;
  const total = 1 << n; // 2^n

  for (let mask = 0; mask < total; mask++) {
    const subset: number[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        subset.push(nums[i]);
      }
    }
    result.push(subset);
  }

  return result;
}

// 方法3：迭代法（逐步扩展）
function subsetsIterative(nums: number[]): number[][] {
  const result: number[][] = [[]];

  for (const num of nums) {
    // 对 result 中每个已有子集，追加当前元素得到新子集
    const newSubsets = result.map((subset) => [...subset, num]);
    result.push(...newSubsets);
  }

  return result;
}

// ============================================================
// 3. 子集 II（有重复元素）
// LeetCode 90. Subsets II
//
// 给定可能包含重复元素的整数数组，返回所有不重复的子集
//
// 核心思路：
//   先排序！同一层中，如果当前元素与前一个相同且前一个未被选，则跳过
//   - 排序后，相同元素相邻
//   - 剪枝条件：i > start && nums[i] === nums[i-1] 时跳过
//
// 时间复杂度：O(n * 2^n)
// 空间复杂度：O(n)
// ============================================================

// 方法1：回溯 + 排序去重（推荐）
function subsetsWithDup(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  // 先排序，使相同元素相邻
  nums.sort((a, b) => a - b);

  function backtrack(start: number): void {
    result.push([...path]);

    for (let i = start; i < nums.length; i++) {
      // 去重：同一层中，与前一个元素相同则跳过
      // i > start 保证是同一层的比较（不是跨层比较）
      if (i > start && nums[i] === nums[i - 1]) continue;

      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}

// 方法2：回溯 - 选/不选的方式去重
function subsetsWithDupChoose(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  nums.sort((a, b) => a - b);

  function backtrack(index: number, choosePrev: boolean): void {
    if (index === nums.length) {
      result.push([...path]);
      return;
    }

    // 不选当前元素
    backtrack(index + 1, false);

    // 选当前元素（需要去重判断）
    // 如果当前元素与前一个相同，且前一个没被选，则不能选当前（否则会重复）
    if (index > 0 && nums[index] === nums[index - 1] && !choosePrev) {
      return;
    }

    path.push(nums[index]);
    backtrack(index + 1, true);
    path.pop();
  }

  backtrack(0, false);
  return result;
}

// ============================================================
// 4. 组合
// LeetCode 77. Combinations
//
// 给定两个整数 n 和 k，返回 [1, n] 中所有 k 个数的组合
//
// 核心思路：
//   回溯法，从 start 开始选择，每次选一个数后递归
//   剪枝优化：当剩余可选元素不够时，提前终止
//
// 时间复杂度：O(C(n,k) * k)
// 空间复杂度：O(k)
// ============================================================

// 方法1：回溯法（推荐）
function combine(n: number, k: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(start: number): void {
    // 终止条件
    if (path.length === k) {
      result.push([...path]);
      return;
    }

    // 剪枝优化：i <= n - (k - path.length) + 1
    // 剩余需要选 (k - path.length) 个，所以 i 最大从 n - (k - path.length) + 1 开始
    // 超过这个值，后面的数就不够选了
    const need = k - path.length;
    for (let i = start; i <= n - need + 1; i++) {
      path.push(i);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(1);
  return result;
}

// 方法2：基于子集的组合（从所有子集中筛选长度为 k 的）
function combineFromSubsets(n: number, k: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(start: number): void {
    // 剪枝：如果 path 长度已经超过 k
    if (path.length > k) return;

    if (path.length === k) {
      result.push([...path]);
      // 不需要 return，但可以剪掉后续（因为继续选只会更长）
      return;
    }

    for (let i = start; i <= n; i++) {
      path.push(i);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(1);
  return result;
}

// 方法3：递推法 — C(n,k) = C(n-1,k-1) + C(n-1,k)
function combineRecursive(n: number, k: number): number[][] {
  if (k === 0) return [[]];
  if (k === n) {
    // [1,2,...,n]
    return [Array.from({ length: n }, (_, i) => i + 1)];
  }

  // 不选 n：从 [1, n-1] 中选 k 个
  const withoutN = combineRecursive(n - 1, k);
  // 选 n：从 [1, n-1] 中选 k-1 个，然后每个加上 n
  const withN = combineRecursive(n - 1, k - 1).map((comb) => [...comb, n]);

  return [...withoutN, ...withN];
}

// ============================================================
// 5. 全排列
// LeetCode 46. Permutations
//
// 给定不含重复元素的整数数组，返回所有全排列
//
// 核心思路：
//   回溯法，维护一个 used 数组记录哪些元素已被使用
//   - 每次从所有未使用的元素中选一个加入 path
//   - path 长度等于 nums 长度时，得到一个排列
//
// 时间复杂度：O(n * n!)
// 空间复杂度：O(n)
// ============================================================

// 方法1：回溯 + used 数组（推荐）
function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const used: boolean[] = new Array(nums.length).fill(false);

  function backtrack(): void {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue; // 已使用的跳过

      path.push(nums[i]);
      used[i] = true;
      backtrack();
      path.pop();
      used[i] = false;
    }
  }

  backtrack();
  return result;
}

// 方法2：交换法（原地排列，不需要 used 数组）
function permuteSwap(nums: number[]): number[][] {
  const result: number[][] = [];

  function swap(arr: number[], i: number, j: number): void {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  function backtrack(index: number): void {
    if (index === nums.length) {
      result.push([...nums]);
      return;
    }

    for (let i = index; i < nums.length; i++) {
      swap(nums, index, i); // 将第 i 个元素换到 index 位置
      backtrack(index + 1);
      swap(nums, index, i); // 换回来
    }
  }

  backtrack(0);
  return result;
}

// ============================================================
// 6. 包含重复元素的全排列
// LeetCode 47. Permutations II
//
// 给定可能包含重复元素的整数数组，返回所有不重复的全排列
//
// 核心思路：
//   先排序！在回溯过程中剪枝：
//   - 如果 nums[i] === nums[i-1] 且 nums[i-1] 未被使用，则跳过
//   - 原因：相同元素在同一层只应使用一次，如果前一个相同元素未被使用
//     说明前一个已经回溯完成了，再用当前元素会产生重复排列
//
// 时间复杂度：O(n * n!)
// 空间复杂度：O(n)
// ============================================================

// 方法1：回溯 + 排序去重（推荐）
function permuteUnique(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const used: boolean[] = new Array(nums.length).fill(false);
  // 先排序
  nums.sort((a, b) => a - b);

  function backtrack(): void {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;

      // 去重：当前元素与前一个相同，且前一个未被使用
      // 前一个未被使用意味着前一个刚被回溯（撤销选择），
      // 此时再选当前元素会得到与选前一个时相同的排列
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;

      path.push(nums[i]);
      used[i] = true;
      backtrack();
      path.pop();
      used[i] = false;
    }
  }

  backtrack();
  return result;
}

// 方法2：用 Map 计数去重
function permuteUniqueMap(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  // 统计每个数字出现的次数
  const count = new Map<number, number>();
  for (const num of nums) {
    count.set(num, (count.get(num) ?? 0) + 1);
  }

  function backtrack(): void {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    // 遍历 count 中所有数字（天然去重）
    for (const [num, cnt] of count) {
      if (cnt === 0) continue; // 该数字已用完

      path.push(num);
      count.set(num, cnt - 1);
      backtrack();
      path.pop();
      count.set(num, cnt); // 回溯
    }
  }

  backtrack();
  return result;
}

// ============================================================
// 7. 单词搜索
// LeetCode 79. Word Search
//
// 在 m x n 的二维网格中查找单词是否存在
// 单词可以由水平或垂直的相邻单元格组成，同一单元格不能重复使用
//
// 核心思路：
//   遍历每个格子作为起点，进行 DFS 回溯
//   - 匹配当前字符后，向四个方向继续搜索
//   - 用 visited 数组（或原地修改）标记已访问格子
//   - 找到完整单词返回 true
//
// 时间复杂度：O(m * n * 4^L)，L 为单词长度
// 空间复杂度：O(L)（递归深度）
// ============================================================

// 方法1：DFS + visited 数组（推荐）
function exist(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;
  const visited: boolean[][] = Array.from({ length: m }, () =>
    new Array(n).fill(false),
  );

  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function dfs(row: number, col: number, index: number): boolean {
    // 匹配完所有字符
    if (index === word.length) return true;

    // 边界检查 + 已访问检查 + 字符不匹配
    if (
      row < 0 ||
      row >= m ||
      col < 0 ||
      col >= n ||
      visited[row][col] ||
      board[row][col] !== word[index]
    ) {
      return false;
    }

    visited[row][col] = true;

    // 向四个方向搜索
    for (const [dr, dc] of dirs) {
      if (dfs(row + dr, col + dc, index + 1)) {
        return true;
      }
    }

    visited[row][col] = false; // 回溯
    return false;
  }

  // 从每个格子开始搜索
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (dfs(i, j, 0)) return true;
    }
  }

  return false;
}

// 方法2：原地修改法（省去 visited 数组的额外空间）
function existInPlace(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function dfs(row: number, col: number, index: number): boolean {
    if (index === word.length) return true;

    if (
      row < 0 ||
      row >= m ||
      col < 0 ||
      col >= n ||
      board[row][col] !== word[index]
    ) {
      return false;
    }

    // 标记已访问：将当前格子改为特殊字符
    const temp = board[row][col];
    board[row][col] = "#";

    for (const [dr, dc] of dirs) {
      if (dfs(row + dr, col + dc, index + 1)) {
        board[row][col] = temp; // 恢复（注意找到也要恢复）
        return true;
      }
    }

    board[row][col] = temp; // 回溯恢复
    return false;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (dfs(i, j, 0)) return true;
    }
  }

  return false;
}

// ============================================================
// 8. 组合总和
// LeetCode 39. Combination Sum
// LeetCode 40. Combination Sum II
//
// 题目一（39）：给定无重复元素的 candidates 和目标 target，
//   找出所有和为 target 的组合，同一数字可重复选取
// 题目二（40）：candidates 中可能有重复元素，每个数字只能用一次
//
// 核心思路：
//   回溯法，维护当前路径和当前总和
//   - 39题：可重复选，递归时传 i（而非 i+1）
//   - 40题：不可重复选，递归传 i+1，且需要去重
//
// 时间复杂度：O(2^n)（最坏情况）
// 空间复杂度：O(target)（递归深度）
// ============================================================

// ---------- 题目一：LeetCode 39 ----------

// 方法1：回溯法（推荐）
function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(start: number, sum: number): void {
    if (sum === target) {
      result.push([...path]);
      return;
    }

    // 剪枝：sum 已超过 target
    if (sum > target) return;

    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i]);
      // 可重复选取，所以传 i 而不是 i+1
      backtrack(i, sum + candidates[i]);
      path.pop();
    }
  }

  backtrack(0, 0);
  return result;
}

// 方法2：排序 + 剪枝优化
function combinationSumOptimized(
  candidates: number[],
  target: number,
): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  // 排序后可以更早剪枝
  candidates.sort((a, b) => a - b);

  function backtrack(start: number, sum: number): void {
    if (sum === target) {
      result.push([...path]);
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      // 剪枝：如果当前数加进去就超过 target，后面的更大，更不可能
      if (sum + candidates[i] > target) break;

      path.push(candidates[i]);
      backtrack(i, sum + candidates[i]);
      path.pop();
    }
  }

  backtrack(0, 0);
  return result;
}

// ---------- 题目二：LeetCode 40 ----------

// 方法1：回溯 + 排序去重（推荐）
function combinationSum2(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  candidates.sort((a, b) => a - b);

  function backtrack(start: number, sum: number): void {
    if (sum === target) {
      result.push([...path]);
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      // 剪枝
      if (sum + candidates[i] > target) break;

      // 去重：同一层中，与前一个相同则跳过
      if (i > start && candidates[i] === candidates[i - 1]) continue;

      path.push(candidates[i]);
      backtrack(i + 1, sum + candidates[i]); // 每个数只能用一次，传 i+1
      path.pop();
    }
  }

  backtrack(0, 0);
  return result;
}

// 方法2：用 count 计数去重
function combinationSum2Count(
  candidates: number[],
  target: number,
): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  // 统计每个数字出现的次数
  const count = new Map<number, number>();
  for (const num of candidates) {
    count.set(num, (count.get(num) ?? 0) + 1);
  }
  // 去重后的候选数组
  const unique = [...count.keys()].sort((a, b) => a - b);

  function backtrack(index: number, sum: number): void {
    if (sum === target) {
      result.push([...path]);
      return;
    }

    for (let i = index; i < unique.length; i++) {
      const num = unique[i];
      const cnt = count.get(num)!;

      if (sum + num > target) break; // 剪枝
      if (cnt === 0) continue; // 该数字已用完

      path.push(num);
      count.set(num, cnt - 1);
      // 注意：这里传 i 而不是 i+1，因为当前数字还可能被再次使用（如果还有次数）
      backtrack(i, sum + num);
      path.pop();
      count.set(num, cnt); // 回溯
    }
  }

  backtrack(0, 0);
  return result;
}

// ============================================================
// 9. N 皇后
// LeetCode 51. N-Queens
//
// 在 n x n 的棋盘上放置 n 个皇后，使其不能互相攻击
// 皇后可以攻击同行、同列、同对角线上的其他皇后
// 返回所有不同的摆放方案
//
// 核心思路：
//   逐行放置皇后，每行选一个列位置
//   - 用 3 个集合记录已被占用的列、主对角线、副对角线
//   - 主对角线：row - col 为常数
//   - 副对角线：row + col 为常数
//   - 回溯时撤销选择
//
// 时间复杂度：O(n!)（第一行 n 种选择，第二行最多 n-1 种...）
// 空间复杂度：O(n)（递归深度 + 3 个集合）
// ============================================================

// 方法1：回溯 + 集合去重（推荐）
function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  // queens[i] 表示第 i 行皇后所在的列
  const queens: number[] = new Array(n).fill(-1);
  // 用集合记录已被占用的列和对角线
  const columns = new Set<number>(); // 已占用的列
  const diagonals1 = new Set<number>(); // 主对角线 (row - col)
  const diagonals2 = new Set<number>(); // 副对角线 (row + col)

  function backtrack(row: number): void {
    // 终止条件：所有行都放置了皇后
    if (row === n) {
      // 生成棋盘
      const board: string[] = queens.map((col) => {
        const rowStr = new Array(n).fill(".");
        rowStr[col] = "Q";
        return rowStr.join("");
      });
      result.push(board);
      return;
    }

    // 尝试在当前行的每一列放置皇后
    for (let col = 0; col < n; col++) {
      // 剪枝：检查该位置是否安全
      if (columns.has(col)) continue; // 同列有皇后
      if (diagonals1.has(row - col)) continue; // 主对角线有皇后
      if (diagonals2.has(row + col)) continue; // 副对角线有皇后

      // 做选择
      queens[row] = col;
      columns.add(col);
      diagonals1.add(row - col);
      diagonals2.add(row + col);

      // 递归下一行
      backtrack(row + 1);

      // 撤销选择（回溯）
      queens[row] = -1;
      columns.delete(col);
      diagonals1.delete(row - col);
      diagonals2.delete(row + col);
    }
  }

  backtrack(0);
  return result;
}

// 方法2：回溯 + 位运算优化（仅适用于 n <= 32）
// 用整数的二进制位表示列和对角线的占用情况，速度更快
function solveNQueensBitwise(n: number): string[][] {
  const result: string[][] = [];
  const queens: number[] = new Array(n).fill(-1);

  function backtrack(
    row: number,
    cols: number,
    diag1: number,
    diag2: number,
  ): void {
    if (row === n) {
      const board: string[] = queens.map((col) => {
        const rowStr = new Array(n).fill(".");
        rowStr[col] = "Q";
        return rowStr.join("");
      });
      result.push(board);
      return;
    }

    // 计算当前行可用的位置：1 表示可用
    // ~((cols | diag1 | diag2)) 取反后低 n 位为可用位置
    const occupied = cols | diag1 | diag2;
    let available = ~occupied & ((1 << n) - 1); // 只保留低 n 位

    while (available !== 0) {
      // 取最低位的 1（最右边的可用位置）
      const pos = available & -available;
      // 计算列号：pos 是 2^col，用 log2 或者数位数
      const col = Math.log2(pos);

      queens[row] = col;

      // 递归：列、主对角线、副对角线各自左移/右移
      backtrack(
        row + 1,
        cols | pos,
        (diag1 | pos) << 1,
        (diag2 | pos) >>> 1, // >>> 无符号右移，避免符号位干扰
      );

      queens[row] = -1;

      // 移除最低位的 1
      available &= available - 1;
    }
  }

  backtrack(0, 0, 0, 0);
  return result;
}

// 方法3：回溯 + 数组代替集合（性能优于集合，代码稍长）
function solveNQueensArray(n: number): string[][] {
  const result: string[][] = [];
  const queens: number[] = new Array(n).fill(-1);
  // 用布尔数组代替集合，访问 O(1)
  const cols = new Array(n).fill(false); // 列
  // 主对角线数量 = 2n-1，偏移量 n-1 使索引非负
  const diag1 = new Array(2 * n - 1).fill(false); // row - col + n - 1
  const diag2 = new Array(2 * n - 1).fill(false); // row + col

  function backtrack(row: number): void {
    if (row === n) {
      const board: string[] = queens.map((col) => {
        const rowStr = new Array(n).fill(".");
        rowStr[col] = "Q";
        return rowStr.join("");
      });
      result.push(board);
      return;
    }

    for (let col = 0; col < n; col++) {
      const d1 = row - col + n - 1; // 主对角线索引
      const d2 = row + col; // 副对角线索引

      // 剪枝
      if (cols[col] || diag1[d1] || diag2[d2]) continue;

      // 做选择
      queens[row] = col;
      cols[col] = true;
      diag1[d1] = true;
      diag2[d2] = true;

      backtrack(row + 1);

      // 撤销选择
      queens[row] = -1;
      cols[col] = false;
      diag1[d1] = false;
      diag2[d2] = false;
    }
  }

  backtrack(0);
  return result;
}

// ============================================================
// 补充：N 皇后 II
// LeetCode 52. N-Queens II
//
// 只返回 N 皇后问题的方案数量，不需要输出棋盘
// ============================================================

function totalNQueens(n: number): number {
  const cols = new Array(n).fill(false);
  const diag1 = new Array(2 * n - 1).fill(false);
  const diag2 = new Array(2 * n - 1).fill(false);
  let count = 0;

  function backtrack(row: number): void {
    if (row === n) {
      count++;
      return;
    }

    for (let col = 0; col < n; col++) {
      const d1 = row - col + n - 1;
      const d2 = row + col;

      if (cols[col] || diag1[d1] || diag2[d2]) continue;

      cols[col] = true;
      diag1[d1] = true;
      diag2[d2] = true;

      backtrack(row + 1);

      cols[col] = false;
      diag1[d1] = false;
      diag2[d2] = false;
    }
  }

  backtrack(0);
  return count;
}

// ============================================================
// 补充：回溯算法通用模板
// ============================================================
//
// function backtrack(路径, 选择列表):
//   if 满足结束条件:
//     result.push(路径)
//     return
//
//   for 选择 in 选择列表:
//     做选择（路径.add(选择)）
//     backtrack(路径, 选择列表)
//     撤销选择（路径.remove(选择)）  ← 这就是"回溯"
//
// 关键要素：
//   1. 路径：已经做出的选择
//   2. 选择列表：当前可以做的选择
//   3. 结束条件：到达决策树底层，无法再做选择
//   4. 剪枝：提前判断某些分支不可能得到合法解，直接跳过

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 括号生成 =====");
console.log(generateParenthesis(3)); // ["((()))","(()())","(())()","()(())","()()()"]
console.log(generateParenthesis(1)); // ["()"]
console.log(generateParenthesisArray(2)); // ["(())","()()"]
console.log(generateParenthesisDP(2)); // ["(())","()()"]

console.log("\n===== 2. 子集 =====");
console.log(subsets([1, 2, 3])); // [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]
console.log(subsetsBitmask([1, 2, 3]));
console.log(subsetsIterative([1, 2, 3]));

console.log("\n===== 3. 子集 II（有重复元素）=====");
console.log(subsetsWithDup([1, 2, 2])); // [[],[1],[1,2],[1,2,2],[2],[2,2]]
console.log(subsetsWithDup([0]));
console.log(subsetsWithDupChoose([1, 2, 2]));

console.log("\n===== 4. 组合 =====");
console.log(combine(4, 2)); // [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
console.log(combine(1, 1)); // [[1]]
console.log(combineRecursive(4, 2));

console.log("\n===== 5. 全排列 =====");
console.log(permute([1, 2, 3])); // [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
console.log(permute([0, 1]));
console.log(permuteSwap([1, 2, 3]));

console.log("\n===== 6. 全排列 II（有重复元素）=====");
console.log(permuteUnique([1, 1, 2])); // [[1,1,2],[1,2,1],[2,1,1]]
console.log(permuteUnique([1, 2, 3]));
console.log(permuteUniqueMap([1, 1, 2]));

console.log("\n===== 7. 单词搜索 =====");
const board1 = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];
console.log(exist(board1, "ABCCED")); // true
console.log(exist(board1, "SEE")); // true
console.log(exist(board1, "ABCB")); // false

const board2 = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];
console.log(existInPlace(board2, "ABCCED")); // true
console.log(existInPlace(board2, "ABCB")); // false

console.log("\n===== 8. 组合总和 =====");
// LeetCode 39
console.log(combinationSum([2, 3, 6, 7], 7)); // [[2,2,3],[7]]
console.log(combinationSum([2, 3, 5], 8)); // [[2,2,2,2],[2,3,3],[3,5]]
console.log(combinationSumOptimized([2, 3, 6, 7], 7)); // [[2,2,3],[7]]

// LeetCode 40
console.log(combinationSum2([10, 1, 2, 7, 6, 1, 5], 8)); // [[1,1,6],[1,2,5],[1,7],[2,6]]
console.log(combinationSum2([2, 5, 2, 1, 2], 5)); // [[1,2,2],[5]]
console.log(combinationSum2Count([10, 1, 2, 7, 6, 1, 5], 8));

console.log("\n===== 9. N 皇后 =====");
console.log(solveNQueens(4));
// [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
console.log(solveNQueens(1)); // [["Q"]]
console.log(solveNQueensBitwise(4));
console.log(solveNQueensArray(4));
console.log("N 皇后方案数 n=4:", totalNQueens(4)); // 2
console.log("N 皇后方案数 n=8:", totalNQueens(8)); // 92

export {};
