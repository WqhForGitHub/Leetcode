// ============================================================
// 152. 网格图中最少访问的格子数
// ============================================================
// LeetCode 2612. Minimum Reverse Operations
// 在一维数组上，每次可以跳到长度为 k 的反转区间内的位置，求从 start 到各位置的最小步数。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：BFS + 最小堆
function minReverseOperations(n: number, p: number, banned: number[], k: number): number[] {
  const result: number[] = new Array(n).fill(-1);
  const bannedSet: Set<number> = new Set(banned);
  if (bannedSet.has(p)) return result;
  result[p] = 0;
  // BFS
  const visited: Set<number> = new Set([p]);
  const queue: number[] = [p];
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    // 反转区间 [i, i+k-1]，cur 在其中
    // cur 可以跳到 2*(i) + k - 1 - cur
    // i 范围: max(0, cur - k + 1) 到 min(cur, n - k)
    const lo = Math.max(0, cur - k + 1);
    const hi = Math.min(cur, n - k);
    for (let i = lo; i <= hi; i++) {
      const target = 2 * i + k - 1 - cur;
      if (target >= 0 && target < n && !visited.has(target) && !bannedSet.has(target)) {
        visited.add(target);
        result[target] = result[cur] + 1;
        queue.push(target);
      }
    }
  }
  return result;
}

// 方法2：BFS + 并查集优化
function minReverseOperationsUF(n: number, p: number, banned: number[], k: number): number[] {
  const result: number[] = new Array(n).fill(-1);
  const bannedSet: Set<number> = new Set(banned);
  result[p] = 0;
  // 两个并查集，分别管理奇偶位置
  const parent: number[] = Array.from({ length: n + 2 }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  };
  const ban = (x: number): void => { parent[x] = find(x + 1); };
  ban(p);
  for (const b of banned) ban(b);
  const queue: number[] = [p];
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++];
    const lo = Math.max(0, cur - k + 1);
    const hi = Math.min(cur, n - k);
    const minTarget = 2 * lo + k - 1 - cur;
    const maxTarget = 2 * hi + k - 1 - cur;
    if (minTarget > maxTarget) continue;
    for (let t = find(minTarget); t <= maxTarget; t = find(t)) {
      result[t] = result[cur] + 1;
      queue.push(t);
      ban(t);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 152. 网格图中最少访问的格子数 =====");
console.log("BFS:", minReverseOperations(5, 0, [2, 4], 3)); // 期望 [0,-1,-1,-1,-1]
console.log("BFS:", minReverseOperations(4, 2, [1], 2)); // 期望 [-1,-1,0,1]

export {};
