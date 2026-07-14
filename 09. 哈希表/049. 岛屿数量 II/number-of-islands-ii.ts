// ============================================================
// 049. 岛屿数量 II
// ============================================================
// LeetCode 305. Number of Islands II
// 一个 m x n 的网格初始全为水（0）。给定一系列位置 positions，每次把该位置变为陆地（1）。
// 返回每次操作后的岛屿数量。
// 使用并查集 + 哈希表（仅记录已变为陆地的位置）。
// 时间复杂度：O(k * α(m*n))，k 为操作次数，α 为反阿克曼函数
// 空间复杂度：O(m*n)

function numIslands2(m: number, n: number, positions: number[][]): number[] {
  const result: number[] = [];
  // 哈希表：记录每个位置是否为陆地，以及并查集的父节点
  // key 使用 "r,c" 字符串形式
  const root = new Map<string, string>();
  let count = 0;

  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // 路径压缩查找
  const find = (key: string): string => {
    if (root.get(key) !== key) {
      root.set(key, find(root.get(key)!));
    }
    return root.get(key)!;
  };

  // 合并两个位置，返回是否发生合并
  const union = (key1: string, key2: string): boolean => {
    const r1 = find(key1);
    const r2 = find(key2);
    if (r1 === r2) return false; // 已在同一集合
    root.set(r1, r2);
    return true;
  };

  for (const [r, c] of positions) {
    const key = `${r},${c}`;
    // 该位置已是陆地，跳过（防止重复计数）
    if (root.has(key)) {
      result.push(count);
      continue;
    }
    // 新增陆地
    root.set(key, key);
    count++;

    // 检查四个方向相邻的陆地，尝试合并
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      const nkey = `${nr},${nc}`;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && root.has(nkey)) {
        if (union(key, nkey)) {
          count--; // 合并后岛屿数减一
        }
      }
    }
    result.push(count);
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 049. 岛屿数量 II =====");
console.log(
  numIslands2(3, 3, [
    [0, 0],
    [0, 1],
    [1, 2],
    [2, 1],
  ]),
); // [1,1,2,3]
console.log(numIslands2(1, 1, [[0, 0]])); // [1]
console.log(
  numIslands2(3, 3, [
    [0, 1],
    [1, 2],
    [2, 1],
    [1, 0],
    [0, 2],
    [0, 0],
    [1, 1],
    [2, 2],
    [2, 0],
  ]),
); // [1,2,3,4,3,2,1,1,1]
console.log(
  numIslands2(2, 2, [
    [0, 0],
    [1, 1],
    [0, 1],
  ]),
); // [1,2,1]

export {};
