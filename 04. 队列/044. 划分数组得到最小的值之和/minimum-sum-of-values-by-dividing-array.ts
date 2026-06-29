// ============================================================
// 044. 划分数组得到最小的值之和
// ============================================================
// LeetCode 3117. Minimum Sum of Values by Dividing Array
// 将数组 nums 划分为若干子数组，每个子数组的值为该子数组 AND 结果，
// 使子数组值之和等于 andValues，求最小和。不可能返回 -1。

// ------------------------------------------------------------
// 方法1：记忆化搜索 + 剪枝
// ------------------------------------------------------------
// dfs(i, j, curAnd) 表示从位置 i 开始，已匹配 j 组，当前 AND 值为 curAnd。
// 时间 O(n * m * logU)，空间 O(n * m * logU)。
function minimumValueSum1(nums: number[], andValues: number[]): number {
  const n = nums.length;
  const m = andValues.length;
  const memo: Map<string, number> = new Map();
  const INF = Infinity;

  const dfs = (i: number, j: number, curAnd: number): number => {
    if (i === n && j === m) return 0;
    if (i === n || j === m) return INF;
    const key = `${i},${j},${curAnd}`;
    if (memo.has(key)) return memo.get(key)!;

    const newAnd = curAnd === -1 ? nums[i] : curAnd & nums[i];
    let result: number;
    if (newAnd < andValues[j]) {
      // 无法达到目标，剪枝
      result = INF;
    } else if (newAnd === andValues[j]) {
      // 可以在此切割
      result = Math.min(
        dfs(i + 1, j, newAnd), // 继续扩展
        nums[i] + dfs(i + 1, j + 1, -1), // 在此切割
      );
    } else {
      result = dfs(i + 1, j, newAnd);
    }
    memo.set(key, result);
    return result;
  };

  const result = dfs(0, 0, -1);
  return result === INF ? -1 : result;
}

// ------------------------------------------------------------
// 方法2：字典记忆化 + 单调剪枝
// ------------------------------------------------------------
// 用 Map 存储每个 (i, j) 状态下不同 curAnd 的最小值，进一步剪枝。
// 时间 O(n * m * logU)，空间 O(n * m * logU)。
function minimumValueSum2(nums: number[], andValues: number[]): number {
  const n = nums.length;
  const m = andValues.length;
  const INF = Infinity;
  // memo[i][j] = Map<curAnd, minSum>
  const memo: Map<number, number>[][] = [];
  for (let i = 0; i <= n; i++) {
    memo.push([]);
    for (let j = 0; j <= m; j++) {
      memo[i].push(new Map());
    }
  }

  const dfs = (i: number, j: number, curAnd: number): number => {
    if (i === n && j === m) return 0;
    if (i === n || j === m) return INF;
    if (memo[i][j].has(curAnd)) return memo[i][j].get(curAnd)!;

    const newAnd = curAnd === -1 ? nums[i] : curAnd & nums[i];
    let result: number;
    if (newAnd < andValues[j]) {
      result = INF;
    } else if (newAnd === andValues[j]) {
      result = Math.min(dfs(i + 1, j, newAnd), nums[i] + dfs(i + 1, j + 1, -1));
    } else {
      result = dfs(i + 1, j, newAnd);
    }
    memo[i][j].set(curAnd, result);
    return result;
  };

  const result = dfs(0, 0, -1);
  return result === INF ? -1 : result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", minimumValueSum1([1, 4, 3, 3, 2], [0, 3, 3, 2]), "期望: 12");
  console.log("测试2:", minimumValueSum1([2, 3, 5, 7, 7, 7, 5], [4, 7, 5]), "期望: 17");
  console.log("测试3:", minimumValueSum1([1, 2, 3, 4], [2, 4]), "期望: -1");
  console.log("测试4:", minimumValueSum2([1, 4, 3, 3, 2], [0, 3, 3, 2]), "期望: 12");
}

test();

export {};
