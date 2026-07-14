// ============================================================
// 022. 组合总和 III
// ============================================================
// LeetCode 216. Combination Sum III
// 找出所有 k 个数字的组合，数字从 1-9 中选取，每个数字最多用一次，使得和为 n。
// 时间复杂度：O(C(9,k))，空间复杂度：O(k)

// 方法1：回溯 (推荐)
// 从 1 开始递增选取数字，维护当前组合和剩余目标和
// 时间复杂度 O(C(9,k)), 空间复杂度 O(k) 递归栈
function combinationSum3(k: number, n: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(start: number, remaining: number): void {
    // 如果已选够 k 个数
    if (path.length === k) {
      if (remaining === 0) {
        result.push([...path]);
      }
      return;
    }

    // 剪枝：剩余可选数字不够，或剩余值太小/太大
    // 还需要选 k - path.length 个数，从 start 到 9
    const need: number = k - path.length;
    for (let i = start; i <= 9 - need + 1; i++) {
      // 剪枝：如果当前数已经大于剩余值，后续更大，直接退出
      if (i > remaining) break;
      path.push(i);
      backtrack(i + 1, remaining - i);
      path.pop();
    }
  }

  backtrack(1, n);
  return result;
}

// 方法2：位掩码枚举
// 用 9 位二进制数枚举 1-9 的所有子集，选出大小为 k 且和为 n 的组合
// 时间复杂度 O(2^9 * 9) = O(512 * 9), 空间复杂度 O(k)
function combinationSum3_2(k: number, n: number): number[][] {
  const result: number[][] = [];

  // 枚举所有 2^9 种子集
  for (let mask = 0; mask < 1 << 9; mask++) {
    // 计算子集大小和元素和
    let count: number = 0;
    let sum: number = 0;
    const combination: number[] = [];

    for (let i = 0; i < 9; i++) {
      if (mask & (1 << i)) {
        count++;
        sum += i + 1;
        combination.push(i + 1);
      }
    }

    // 检查是否满足条件
    if (count === k && sum === n) {
      result.push(combination);
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 022. 组合总和 III =====");
console.log(combinationSum3(3, 7)); // 期望结果: [[1,2,4]]
console.log(combinationSum3(3, 9)); // 期望结果: [[1,2,6],[1,3,5],[2,3,4]]
console.log(combinationSum3_2(3, 7)); // 期望结果: [[1,2,4]]
console.log(combinationSum3_2(3, 9)); // 期望结果: [[1,2,6],[1,3,5],[2,3,4]]
console.log(combinationSum3(4, 1)); // 期望结果: []
console.log(combinationSum3(2, 18)); // 期望结果: [] (最大 8+9=17 < 18)

export {};
