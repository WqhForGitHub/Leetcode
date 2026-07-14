// ============================================================
// 094. 移除盒子
// ============================================================
// LeetCode 546. Remove Boxes
// 给定有色盒子数组 boxes，每次移除连续同色盒子得 (k+1)^2 分
// （k 为连续同色数），求最大总分。
// 时间复杂度：O(n^4)，空间复杂度：O(n^3)

// 方法1：DP 区间（推荐）
// dp[i][j][k] = boxes[i..j] 中 j 后面有 k 个与 boxes[j] 同色时的最大得分
// 时间复杂度 O(n^4)，空间复杂度 O(n^3)
function removeBoxes(boxes: number[]): number {
  const n: number = boxes.length;
  // dp[i][j][k] = boxes[i..j] 后面跟 k 个与 boxes[j] 同色的盒子时的最大得分
  const dp: number[][][] = [];
  for (let i: number = 0; i < n; i++) {
    const row: number[][] = [];
    for (let j: number = 0; j < n; j++) {
      row.push(new Array(n).fill(0));
    }
    dp.push(row);
  }

  const solve = (i: number, j: number, k: number): number => {
    if (i > j) return 0;
    if (dp[i][j][k] !== 0) return dp[i][j][k];

    // 方案1：把 boxes[j] 和后面的 k 个一起移除
    // 然后处理 boxes[i..j-1] 后面跟 0 个同色
    let result: number = solve(i, j - 1, 0) + (k + 1) * (k + 1);

    // 方案2：在 [i..j-1] 中找一个和 boxes[j] 同色的盒子 boxes[m]
    // 先移除 boxes[m+1..j-1]，然后 boxes[i..m] 后面就有 k+1 个同色盒子
    for (let m: number = i; m < j; m++) {
      if (boxes[m] === boxes[j]) {
        result = Math.max(result, solve(i, m, k + 1) + solve(m + 1, j - 1, 0));
      }
    }

    dp[i][j][k] = result;
    return result;
  };

  return solve(0, n - 1, 0);
}

// 方法2：记忆化递归（同方法1的递归形式）
// 使用 Map 来记忆化
// 时间复杂度 O(n^4)，空间复杂度 O(n^3)
function removeBoxesMemo(boxes: number[]): number {
  const n: number = boxes.length;
  const memo: Map<string, number> = new Map();

  const solve = (i: number, j: number, k: number): number => {
    if (i > j) return 0;
    const key: string = i + "," + j + "," + k;
    if (memo.has(key)) return memo.get(key)!;

    // 优化：跳过 j 左边连续同色的盒子
    while (j > i && boxes[j - 1] === boxes[j]) {
      j--;
      k++;
    }

    let result: number = solve(i, j - 1, 0) + (k + 1) * (k + 1);

    for (let m: number = i; m < j; m++) {
      if (boxes[m] === boxes[j]) {
        result = Math.max(result, solve(i, m, k + 1) + solve(m + 1, j - 1, 0));
      }
    }

    memo.set(key, result);
    return result;
  };

  return solve(0, n - 1, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 094. 移除盒子 =====");
console.log(removeBoxes([1, 3, 2, 2, 2, 3, 4, 3, 1])); // 期望结果: 23
console.log(removeBoxes([1, 1, 1])); // 期望结果: 9
console.log(removeBoxes([1])); // 期望结果: 1
console.log("--- 方法2测试 ---");
console.log(removeBoxesMemo([1, 3, 2, 2, 2, 3, 4, 3, 1])); // 期望结果: 23
console.log(removeBoxesMemo([1, 1, 1])); // 期望结果: 9

export {};
