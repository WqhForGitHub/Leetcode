// ============================================================
// 050. 拼车
// ============================================================
// LeetCode 1094. Car Pooling
// 给定行程 trips（乘客数、起点、终点）和车容量 capacity，判断能否完成所有行程。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：差分数组（推荐）
function carPooling(trips: number[][], capacity: number): boolean {
  let maxLoc = 0;
  for (const t of trips) maxLoc = Math.max(maxLoc, t[2]);
  const diff: number[] = new Array(maxLoc + 1).fill(0);
  for (const [num, from, to] of trips) {
    diff[from] += num;
    diff[to] -= num;
  }
  let cur = 0;
  for (const d of diff) {
    cur += d;
    if (cur > capacity) return false;
  }
  return true;
}

// 方法2：扫描线 + 最小堆
function carPoolingSweep(trips: number[][], capacity: number): boolean {
  const events: Array<{ loc: number; delta: number }> = [];
  for (const [num, from, to] of trips) {
    events.push({ loc: from, delta: num });
    events.push({ loc: to, delta: -num });
  }
  events.sort((a, b) => a.loc - b.loc || a.delta - b.delta);
  let cur = 0;
  for (const ev of events) {
    cur += ev.delta;
    if (cur > capacity) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 050. 拼车 =====");
console.log("差分:", carPooling([[2, 1, 5], [3, 3, 7]], 4)); // 期望 false
console.log("扫描线:", carPoolingSweep([[2, 1, 5], [3, 3, 7]], 5)); // 期望 true

export {};
