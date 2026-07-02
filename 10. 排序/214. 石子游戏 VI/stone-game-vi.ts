// ============================================================
// 214. 石子游戏 VI
// ============================================================
// LeetCode 1686. Stone Game VI
// Alice 对每块石子有价值 aliceValues[i]，Bob 有 bobValues[i]。
// 轮流选一块石子拿走（Alice 先手），各得对应价值。
// 返回 1 表示 Alice 赢，-1 表示 Bob 赢，0 表示平局。

// 方法1：按价值之和降序 + 贪心选取（O(n log n)）
// 选走一块石子既获得自身价值，又剥夺对手价值，故按两者之和排序最优。
function stoneGameVI(aliceValues: number[], bobValues: number[]): number {
  const n = aliceValues.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  indices.sort((a, b) => aliceValues[b] + bobValues[b] - (aliceValues[a] + bobValues[a]));
  let alice = 0;
  let bob = 0;
  for (let turn = 0; turn < n; turn++) {
    const idx = indices[turn];
    if (turn % 2 === 0) alice += aliceValues[idx];
    else bob += bobValues[idx];
  }
  if (alice > bob) return 1;
  if (alice < bob) return -1;
  return 0;
}

// 方法2：按合并价值排序 + 差值累计（O(n log n)）
// 直接维护 Alice 与 Bob 的分差，避免分别累加。
function stoneGameVI2(aliceValues: number[], bobValues: number[]): number {
  const n = aliceValues.length;
  const stones = aliceValues.map((a, i) => ({ a, b: bobValues[i], sum: a + bobValues[i] }));
  stones.sort((x, y) => y.sum - x.sum);
  let diff = 0; // Alice - Bob
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) diff += stones[i].a;
    else diff -= stones[i].b;
  }
  return diff > 0 ? 1 : diff < 0 ? -1 : 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 214. 石子游戏 VI =====");
console.log("方法1 [1,3],[2,1]:", stoneGameVI([1, 3], [2, 1])); // 1
console.log("方法1 [1,2],[3,1]:", stoneGameVI([1, 2], [3, 1])); // 0
console.log("方法1 [2,4,3],[1,6,7]:", stoneGameVI([2, 4, 3], [1, 6, 7])); // -1
console.log("方法2 [1,3],[2,1]:", stoneGameVI2([1, 3], [2, 1])); // 1
console.log("方法2 [1,2],[3,1]:", stoneGameVI2([1, 2], [3, 1])); // 0
console.log("方法2 [2,4,3],[1,6,7]:", stoneGameVI2([2, 4, 3], [1, 6, 7])); // -1

export {};
