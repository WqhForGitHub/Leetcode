// ============================================================
// 044. 栅栏涂色
// ============================================================
// LeetCode 276. Paint Fence
// n 个栅栏刷 k 种颜色，最多 2 个相邻栅栏同色，求方案数。
// 时间复杂度 O(n)，空间复杂度 O(1)

// 方法1：动态规划（推荐）
// same[i] 表示第i个栅栏与第i-1个同色的方案数
// diff[i] 表示第i个栅栏与第i-1个不同色的方案数
// 状态转移：
//   same = diff_prev （与上一个同色，上一个必须与上上一个不同色）
//   diff = (same_prev + diff_prev) * (k-1) （与上一个不同色，有k-1种选择）
// 时间复杂度 O(n)，空间复杂度 O(1)
function numWays(n: number, k: number): number {
  if (n === 0) return 0;
  if (n === 1) return k;
  if (k === 1) return n <= 2 ? 1 : 0;

  // 初始化：第二个栅栏
  let same: number = k; // 与第一个同色，有k种
  let diff: number = k * (k - 1); // 与第一个不同色，有k*(k-1)种

  for (let i: number = 3; i <= n; i++) {
    const prevSame: number = same;
    const prevDiff: number = diff;
    // 与上一个同色：上一个必须与上上一个不同色
    same = prevDiff;
    // 与上一个不同色：有k-1种选择，上一个可以是同色或不同色
    diff = (prevSame + prevDiff) * (k - 1);
  }

  return same + diff;
}

// 方法2：动态规划（数组版）
// 使用数组记录每一步的 same 和 diff
// 时间复杂度 O(n)，空间复杂度 O(n)
function numWays2(n: number, k: number): number {
  if (n === 0) return 0;
  if (n === 1) return k;
  if (k === 1) return n <= 2 ? 1 : 0;

  // same[i] 和 diff[i] 分别表示第i+1个栅栏的方案数
  const same: number[] = new Array<number>(n);
  const diff: number[] = new Array<number>(n);

  same[0] = k;
  diff[0] = k;
  same[1] = k;
  diff[1] = k * (k - 1);

  for (let i: number = 2; i < n; i++) {
    same[i] = diff[i - 1];
    diff[i] = (same[i - 1] + diff[i - 1]) * (k - 1);
  }

  return same[n - 1] + diff[n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 044. 栅栏涂色 =====");
console.log(numWays(3, 2)); // 期望结果: 6
console.log(numWays(1, 1)); // 期望结果: 1
console.log(numWays(7, 2)); // 期望结果: 42
console.log(numWays(2, 3)); // 期望结果: 9
console.log(numWays2(3, 2)); // 期望结果: 6

export {};
