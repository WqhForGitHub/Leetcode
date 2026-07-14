// ============================================================
// 115. 奇偶跳
// ============================================================
// LeetCode 975. Odd Even Jump
// 从下标 i 出发做一系列跳跃，奇数次跳：跳到值 >= 当前值的最小值
// （并列取最左下标）；偶数次跳：跳到值 <= 当前值的最大值（并列取最左下标）。
// 只能向右跳（j > i）。统计能跳到末尾的起点个数。

// 方法1：单调栈 + 排序下标（推荐，O(n log n) 时间，O(n) 空间）
// 对每个下标求出 oddNext[i]、evenNext[i]，再从右向左 DP。
// - oddNext：按 (值升序, 下标升序) 排序，用单调递减栈求下一个更大下标。
// - evenNext：按 (值降序, 下标升序) 排序，用单调递减栈求下一个更小下标。
function oddEvenJumps(arr: number[]): number {
  const n = arr.length;
  if (n === 1) return 1;

  const oddNext = computeNext(arr, true); // 值升序
  const evenNext = computeNext(arr, false); // 值降序

  // odd[i]: 从 i 出发，下一次是奇数次跳，能否到终点
  // even[i]: 从 i 出发，下一次是偶数次跳，能否到终点
  const odd = new Array<boolean>(n).fill(false);
  const even = new Array<boolean>(n).fill(false);
  odd[n - 1] = true;
  even[n - 1] = true;

  let count = 1; // 末尾本身是好的
  for (let i = n - 2; i >= 0; i--) {
    if (oddNext[i] !== -1) odd[i] = even[oddNext[i]];
    if (evenNext[i] !== -1) even[i] = odd[evenNext[i]];
    // 起点第一次必为奇数次跳，故只需 odd[i] 为真即可
    if (odd[i]) count++;
  }
  return count;
}

// ascending=true 求奇数次跳目标（值升序），false 求偶数次跳目标（值降序）
function computeNext(arr: number[], ascending: boolean): number[] {
  const n = arr.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  indices.sort((a, b) => {
    if (arr[a] !== arr[b]) {
      return ascending ? arr[a] - arr[b] : arr[b] - arr[a];
    }
    // 值相同时按下标升序，保证并列取最左下标
    return a - b;
  });

  const next = new Array<number>(n).fill(-1);
  const stack: number[] = []; // 存下标，保持单调递减（栈底到栈顶下标递减）
  for (const cur of indices) {
    // 栈顶下标若小于 cur，说明 cur 在其右侧，可作为其跳转目标
    while (stack.length > 0 && stack[stack.length - 1] < cur) {
      const top = stack.pop() as number;
      next[top] = cur;
    }
    stack.push(cur);
  }
  return next;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 115. 奇偶跳 =====");
console.log("输入 [10,13,12,14,15]:", oddEvenJumps([10, 13, 12, 14, 15])); // 期望 2
console.log("输入 [2,3,1,1,4]:", oddEvenJumps([2, 3, 1, 1, 4])); // 期望 3
console.log("输入 [5,1,3,2,1]:", oddEvenJumps([5, 1, 3, 2, 1])); // 期望 2
console.log("输入 [1]:", oddEvenJumps([1])); // 期望 1
console.log("输入 [1,2,3,2,1]:", oddEvenJumps([1, 2, 3, 2, 1])); // 期望 3

export {};
