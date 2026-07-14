// ============================================================
// 122. 移动石子直到连续 II
// ============================================================
// LeetCode 1040. Moving Stones Until Consecutive II
// 数轴上 n 个石子，每次移动可将最左或最右端点石子移动到"剩余石子"的最左与
// 最右之间的任意空闲位置（即被移动端点拿走后，放入其它石子构成的区间内部）。
// 返回使石子连续所需的最小与最大移动次数 [min, max]。

// 方法1：排序 + 滑动窗口（时间 O(n log n)，空间 O(log n) 排序栈）
//
// 最小值：对每个左端 i，用窗口 [stones[i], stones[i]+n-1]（长度 n）框住尽量多
// 的石子，设框住 count 个。一般情况下还需 n-count 次移动填补空位。
//   特殊情况：当 count == n-1 且这 n-1 个石子已连续时，唯一空位紧贴端点，
//   被移动的端点无法直接填入（拿走端点后该空位不在剩余石子区间内），需 2 次。
//   但若另一窗口能给出更小候选（如 lone 距离恰为 2 时的非连续 n-1 窗口），
//   取 min 后仍会得到正确值 1。
//
// 最大值：相当于"舍弃"一侧端点，每次只能让端点向内挪一格空位。
//   maxMoves = max(stones[n-2]-stones[0]-(n-2), stones[n-1]-stones[1]-(n-2))
function numMovesStonesII(stones: number[]): number[] {
  stones.sort((a, b) => a - b);
  const n = stones.length;

  // 最大移动次数
  const maxMoves = Math.max(
    stones[n - 2] - stones[0] - (n - 2),
    stones[n - 1] - stones[1] - (n - 2),
  );

  // 最小移动次数：滑动窗口
  let minMoves = n;
  let j = 0;
  for (let i = 0; i < n; i++) {
    // 扩展 j，使窗口 [stones[i], stones[i] + n - 1] 包含 stones[i..j-1]
    while (j < n && stones[j] - stones[i] + 1 <= n) {
      j++;
    }
    const count = j - i; // 窗口内石子数
    let candidate: number;
    if (count === n - 1 && stones[j - 1] - stones[i] === n - 2) {
      // n-1 个石子已连续：唯一空位贴边，需 2 次
      candidate = 2;
    } else {
      candidate = n - count;
    }
    minMoves = Math.min(minMoves, candidate);
  }

  return [minMoves, maxMoves];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 122. 移动石子直到连续 II =====");
console.log("方法1:", numMovesStonesII([7, 4, 9])); // 期望: [1,2]
console.log("方法1:", numMovesStonesII([6, 5, 4, 3, 10])); // 期望: [2,3]
console.log("方法1:", numMovesStonesII([100, 101, 104, 102, 103])); // 期望: [0,0]
console.log("方法1:", numMovesStonesII([1, 2, 5])); // 期望: [2,2]

export {};
