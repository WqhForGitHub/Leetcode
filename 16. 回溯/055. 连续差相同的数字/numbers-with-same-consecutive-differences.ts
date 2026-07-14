// ============================================================
// 055. 连续差相同的数字
// ============================================================
// LeetCode 967. Numbers With Same Consecutive Differences
// 返回所有长度为 n 的非负整数，满足相邻数位的绝对差为 k。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：回溯(逐位构建) (推荐)
// 从首位数字（1-9）开始，逐位添加满足差值为k的数字。
// 时间复杂度 O(2^n), 空间复杂度 O(n) 递归栈
function numsSameConsecDiff(n: number, k: number): number[] {
  const result: number[] = [];
  const path: number[] = [];

  const backtrack = (idx: number): void => {
    if (idx === n) {
      // 转为数字
      let num = 0;
      for (const d of path) num = num * 10 + d;
      result.push(num);
      return;
    }
    if (idx === 0) {
      // 首位不能为0
      for (let d = 1; d <= 9; d++) {
        path.push(d);
        backtrack(idx + 1);
        path.pop();
      }
    } else {
      const last = path[path.length - 1];
      // 下一位数字 = last ± k
      const candidates = new Set<number>();
      candidates.add(last + k);
      if (k !== 0) candidates.add(last - k);
      for (const d of candidates) {
        if (d >= 0 && d <= 9) {
          path.push(d);
          backtrack(idx + 1);
          path.pop();
        }
      }
    }
  };

  backtrack(0);
  return result;
}

// 方法2：BFS
// 从1-9开始，每层扩展一位，使用队列进行层次遍历。
// 时间复杂度 O(2^n), 空间复杂度 O(2^n)
function numsSameConsecDiffBFS(n: number, k: number): number[] {
  let queue: number[] = [];
  // 首位为1-9
  for (let d = 1; d <= 9; d++) queue.push(d);

  for (let step = 1; step < n; step++) {
    const nextQueue: number[] = [];
    for (const num of queue) {
      const last = num % 10;
      const candidates = new Set<number>();
      candidates.add(last + k);
      if (k !== 0) candidates.add(last - k);
      for (const d of candidates) {
        if (d >= 0 && d <= 9) {
          nextQueue.push(num * 10 + d);
        }
      }
    }
    queue = nextQueue;
  }
  return queue;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 055. 连续差相同的数字 =====");
console.log(numsSameConsecDiff(3, 7)); // 期望结果: [181,292,707,818,929]
console.log(numsSameConsecDiff(2, 1)); // 期望结果: [10,12,21,23,32,34,43,45,54,56,65,67,76,78,87,89,98]
console.log(numsSameConsecDiffBFS(3, 7)); // 期望结果: [181,292,707,818,929]
console.log(numsSameConsecDiffBFS(2, 1)); // 期望结果: [10,12,21,23,32,34,43,45,54,56,65,67,76,78,87,89,98]

export {};
