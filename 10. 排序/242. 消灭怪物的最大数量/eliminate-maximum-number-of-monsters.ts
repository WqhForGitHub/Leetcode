// ============================================================
// 242. 消灭怪物的最大数量
// ============================================================
// LeetCode 1921. Eliminate Maximum Number of Monsters
// 给定 dist[i] 和 speed[i]，怪物 i 以速度 speed[i] 接近你，
// 到达时间 = dist[i] / speed[i]。你每分钟可消灭一只怪物，
// 若有怪物在你消灭它之前到达则失败。求最多能消灭的怪物数。

// 方法1：计算到达时间(向上取整) + 排序 + 贪心（O(n log n)）
// 到达分钟 arrival = ceil(dist/speed)，按升序排序，
// 第 i 只（0 基）在第 i 分钟消灭，需 arrival > i。
function eliminateMaximum1(dist: number[], speed: number[]): number {
  const n = dist.length;
  const arrival = dist.map((d, i) => Math.ceil(d / speed[i]));
  arrival.sort((a, b) => a - b);
  let kills = 0;
  for (let i = 0; i < n; i++) {
    if (arrival[i] > i) kills++;
    else break;
  }
  return kills;
}

// 方法2：按下标排序(交叉相乘避免浮点) + 计数（O(n log n)）
// 用 dist[a]*speed[b] 与 dist[b]*speed[a] 比较到达时间排序，
// 第 i 只消灭条件 dist > speed * i（等价于到达时间 > i）。
function eliminateMaximum2(dist: number[], speed: number[]): number {
  const n = dist.length;
  const idx = Array.from({ length: n }, (_, i) => i);
  idx.sort((a, b) => dist[a] * speed[b] - dist[b] * speed[a]);
  let kills = 0;
  for (let i = 0; i < n; i++) {
    if (dist[idx[i]] > speed[idx[i]] * i) kills++;
    else break;
  }
  return kills;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 242. 消灭怪物的最大数量 =====");
console.log("方法1 dist=[1,3,4],speed=[1,1,1]:", eliminateMaximum1([1, 3, 4], [1, 1, 1])); // 3
console.log("方法2 dist=[1,3,4],speed=[1,1,1]:", eliminateMaximum2([1, 3, 4], [1, 1, 1])); // 3
console.log("方法1 dist=[1,1,2,3],speed=[1,1,1,1]:", eliminateMaximum1([1, 1, 2, 3], [1, 1, 1, 1])); // 1
console.log("方法2 dist=[1,1,2,3],speed=[1,1,1,1]:", eliminateMaximum2([1, 1, 2, 3], [1, 1, 1, 1])); // 1
console.log("方法1 dist=[3,2,4],speed=[5,3,2]:", eliminateMaximum1([3, 2, 4], [5, 3, 2])); // 1
console.log("方法2 dist=[3,2,4],speed=[5,3,2]:", eliminateMaximum2([3, 2, 4], [5, 3, 2])); // 1

export {};
