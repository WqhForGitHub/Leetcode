// ============================================================
// 048. 你能从盒子里获得的最大糖果数
// ============================================================
// LeetCode 1298. Maximum Candies You Can Get from Boxes
// status[i] 盒子开(1)/关(0)，candies[i]，keys[i] 盒内钥匙编号，
// containedBoxes[i] 盒内盒子，initialBoxes。返回最多糖果数。
// 思路：BFS（持有盒子集合与钥匙集合，能开就开）。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：BFS + 盒子/钥匙集合（推荐）
function maxCandies(
  status: number[],
  candies: number[],
  keys: number[][],
  containedBoxes: number[][],
  initialBoxes: number[],
): number {
  const n = status.length;
  const hasBox: boolean[] = new Array(n).fill(false);
  const hasKey: boolean[] = new Array(n).fill(false);
  const opened: boolean[] = new Array(n).fill(false);

  // 初始盒子
  const queue: number[] = [];
  for (const b of initialBoxes) {
    hasBox[b] = true;
    if (status[b] === 1) {
      queue.push(b);
      opened[b] = true;
    }
  }

  let total = 0;
  while (queue.length > 0) {
    const b = queue.shift()!;
    // 拿糖果
    total += candies[b];
    // 拿钥匙
    for (const k of keys[b]) {
      hasKey[k] = true;
      // 拿到钥匙后，若已持有对应盒子且未开过，则可以开
      if (hasBox[k] && !opened[k]) {
        queue.push(k);
        opened[k] = true;
      }
    }
    // 拿内含盒子
    for (const cb of containedBoxes[b]) {
      hasBox[cb] = true;
      // 新盒子若本身是开的，或我们已有它的钥匙，则可开
      if (!opened[cb] && (status[cb] === 1 || hasKey[cb])) {
        queue.push(cb);
        opened[cb] = true;
      }
    }
  }
  return total;
}

// 方法2：循环迭代至无变化（无显式队列）
function maxCandiesIter(
  status: number[],
  candies: number[],
  keys: number[][],
  containedBoxes: number[][],
  initialBoxes: number[],
): number {
  const n = status.length;
  const hasBox: boolean[] = new Array(n).fill(false);
  const hasKey: boolean[] = new Array(n).fill(false);
  const opened: boolean[] = new Array(n).fill(false);
  const openable: boolean[] = new Array(n).fill(false);

  for (const b of initialBoxes) hasBox[b] = true;

  let changed = true;
  let total = 0;
  while (changed) {
    changed = false;
    for (let i = 0; i < n; i++) {
      if (hasBox[i] && !opened[i] && (status[i] === 1 || hasKey[i])) {
        opened[i] = true;
        total += candies[i];
        for (const k of keys[i]) hasKey[k] = true;
        for (const cb of containedBoxes[i]) hasBox[cb] = true;
        changed = true;
      }
    }
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 048. 你能从盒子里获得的最大糖果数 =====");
console.log(
  "BFS:",
  maxCandies(
    [1, 0, 1, 0],
    [7, 5, 4, 100],
    [[], [], [1], []],
    [[1, 2], [3], [], []],
    [0],
  ),
); // 期望 16
console.log(
  "Iter:",
  maxCandiesIter(
    [1, 0, 1, 0],
    [7, 5, 4, 100],
    [[], [], [1], []],
    [[1, 2], [3], [], []],
    [0],
  ),
); // 期望 16
console.log(
  "BFS 无钥匙:",
  maxCandies(
    [1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
    [[1, 2, 3, 4, 5], [], [], [], [], []],
    [[1, 2, 3, 4, 5], [], [], [], [], []],
    [0],
  ),
); // 期望 6
console.log(
  "BFS 闭盒无钥匙:",
  maxCandies(
    [0],
    [10],
    [[]],
    [[]],
    [0],
  ),
); // 期望 0

export {};
