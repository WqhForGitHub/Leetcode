// ============================================================
// 023. 因子的组合
// ============================================================
// LeetCode 254. Factor Combinations
// 给定整数 n，返回其所有因子的组合（不包含 1 和 n 本身），使得因子乘积等于 n。
// 时间复杂度：O(n log n)，空间复杂度：O(log n) 递归栈

// 方法1：回溯
// 从最小因子 2 开始，递归寻找因子组合，每个因子不小于上一个因子
// 时间复杂度 O(n log n), 空间复杂度 O(log n) 递归栈
function getFactors(n: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(remaining: number, start: number): void {
    // 如果 path 不为空，说明找到了一个因子组合
    if (path.length > 0) {
      result.push([...path, remaining]);
    }

    // 从 start 开始尝试因子
    for (let i = start; i * i <= remaining; i++) {
      if (remaining % i === 0) {
        path.push(i);
        // 递归处理 remaining / i，下一个因子不小于 i（保证非递减序）
        backtrack(remaining / i, i);
        path.pop();
      }
    }
  }

  backtrack(n, 2);
  return result;
}

// 方法2：回溯 + 剪枝
// 更高效的剪枝：只遍历到 sqrt(n)，提前终止不可能的分支
// 时间复杂度 O(sqrt(n) * log n), 空间复杂度 O(log n) 递归栈
function getFactors2(n: number): number[][] {
  const result: number[][] = [];

  function backtrack(remaining: number, start: number, path: number[]): void {
    // 从 start 遍历到 sqrt(remaining)
    for (let i = start; i * i <= remaining; i++) {
      if (remaining % i === 0) {
        // i 是一个因子，remaining/i 是另一个因子
        // 这是一个合法的因子组合
        result.push([...path, i, remaining / i]);
        // 继续分解 remaining / i
        path.push(i);
        backtrack(remaining / i, i, path);
        path.pop();
      }
    }
  }

  backtrack(n, 2, []);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 023. 因子的组合 =====");
console.log(getFactors(12)); // 期望结果: [[2,6],[2,2,3],[3,4]]
console.log(getFactors2(12)); // 期望结果: [[2,6],[2,2,3],[3,4]]
console.log(getFactors(32)); // 期望结果: [[2,16],[2,2,8],[2,2,2,4],[2,2,2,2,2],[2,4,4],[4,8]]
console.log(getFactors2(32)); // 期望结果: [[2,16],[2,2,8],[2,2,2,4],[2,2,2,2,2],[2,4,4],[4,8]]
console.log(getFactors(1)); // 期望结果: []
console.log(getFactors(37)); // 期望结果: [] (质数)

export {};
