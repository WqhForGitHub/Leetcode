// ============================================================
// 010. 组合
// ============================================================
// LeetCode 77. Combinations
// 给定两个整数 n 和 k，返回 [1, n] 中所有可能的 k 个数的组合。
// 时间复杂度：O(C(n,k) * k)

// 方法1：回溯（推荐）
// 从 start 开始枚举，保证组合内元素递增以避免重复
// 时间复杂度 O(C(n,k) * k)，空间复杂度 O(k) 递归栈
function combine(n: number, k: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  const backtrack = (start: number): void => {
    // 已选够 k 个数
    if (path.length === k) {
      result.push([...path]);
      return;
    }
    // 剪枝：剩余可用数不足以凑够 k 个
    // 还需选 k - path.length 个，i 上界为 n - (k - path.length) + 1
    const upper: number = n - (k - path.length) + 1;
    for (let i = start; i <= upper; i++) {
      path.push(i);
      backtrack(i + 1);
      path.pop();
    }
  };

  backtrack(1);
  return result;
}

// 方法2：字典序法 / 迭代
// 利用组合的字典序生成算法，构造一个指针数组，逐步推进
// 时间复杂度 O(C(n,k) * k)，空间复杂度 O(k)
function combineIter(n: number, k: number): number[][] {
  const result: number[][] = [];
  // temp 存储当前组合，初始为 [1..k]
  const temp: number[] = [];
  for (let i = 1; i <= k; i++) {
    temp.push(i);
  }
  temp.push(n + 1); // 哨兵

  let j: number = 0;
  while (j < k) {
    // 收集当前组合（去掉哨兵）
    result.push(temp.slice(0, k));
    // 找到第一个 temp[i] + 1 != temp[i+1] 的位置
    j = 0;
    while (j < k && temp[j] + 1 === temp[j + 1]) {
      temp[j] = j + 1; // 重置为最小
      j++;
    }
    // 将该位置加一
    if (j < k) {
      temp[j]++;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 010. 组合 =====");
console.log(combine(4, 2)); // 期望结果: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
console.log(combine(1, 1)); // 期望结果: [[1]]
console.log(combineIter(4, 2)); // 期望结果: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
console.log(combineIter(1, 1)); // 期望结果: [[1]]

export {};
