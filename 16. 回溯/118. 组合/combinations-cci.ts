// ============================================================
// 118. 组合
// ============================================================
// 面试金典 08.07 / LeetCode 77. Combinations
// 给定 n 和 k，返回 1..n 中所有 k 个数的组合。

// 时间复杂度：O(C(n,k) * k)
// 空间复杂度：O(k) 递归栈

// 方法1：回溯
// 经典组合回溯，从 start 开始枚举，避免重复。
// 时间复杂度 O(C(n,k) * k), 空间复杂度 O(k)
function combine(n: number, k: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(start: number): void {
    if (path.length === k) {
      result.push([...path]);
      return;
    }
    // 剪枝：剩余元素不足以凑齐 k 个
    for (let i: number = start; i <= n - (k - path.length) + 1; i++) {
      path.push(i);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(1);
  return result;
}

// 方法2：字典序法
// 用一个长度 k 的组合表示，按字典序生成下一个组合，直到结束。
// 时间复杂度 O(C(n,k) * k), 空间复杂度 O(k)
function combine2(n: number, k: number): number[][] {
  const result: number[][] = [];
  // 初始组合 [1,2,...,k]
  const comb: number[] = [];
  for (let i: number = 1; i <= k; i++) comb.push(i);
  // 哨兵：在末尾加 n+1 便于判断结束
  comb.push(n + 1);

  let j: number = 0;
  while (j < k) {
    // 收集当前组合（去掉哨兵）
    result.push(comb.slice(0, k));
    // 找到第一个 comb[j]+1 != comb[j+1] 的位置
    j = 0;
    while (j < k && comb[j + 1] === comb[j] + 1) {
      comb[j] = j + 1; // 重置为最小
      j++;
    }
    if (j < k) comb[j]++;
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 118. 组合 =====");
console.log(combine(4, 2));
// 期望: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
console.log(combine2(4, 2));
console.log(combine(5, 3));

export {};
