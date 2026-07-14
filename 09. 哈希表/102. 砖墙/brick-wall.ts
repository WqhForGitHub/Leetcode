// ============================================================
// 102. 砖墙
// ============================================================
// LeetCode 554. Brick Wall
// 矩形砖墙由多行砖块组成，每行砖块宽度之和相等。
// 画一条自顶向下的垂直线，穿过最少的砖块。求最少穿过的砖块数。
// 时间复杂度：O(n)，n 为砖块总数；空间复杂度：O(m)，m 为每行宽度

// 思路：哈希表统计每个边缘位置出现的次数
// 边缘出现最多的位置即为最优缝隙位置，最少穿过砖块数 = 行数 - 最大边缘数
function leastBricks(wall: number[][]): number {
  const edgeCount = new Map<number, number>();
  let maxEdges = 0;
  const rows = wall.length;

  for (const row of wall) {
    let pos = 0;
    // 注意：不包括最后一个边缘（墙的右边界）
    for (let i = 0; i < row.length - 1; i++) {
      pos += row[i];
      edgeCount.set(pos, (edgeCount.get(pos) || 0) + 1);
    }
  }

  for (const count of edgeCount.values()) {
    maxEdges = Math.max(maxEdges, count);
  }

  return rows - maxEdges;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 102. 砖墙 =====");
// 测试 1
console.log(
  leastBricks([
    [1, 2, 2, 1],
    [3, 1, 2],
    [1, 3, 2],
    [2, 4],
    [3, 1, 2],
    [1, 3, 1, 1],
  ]),
); // 期望: 2
// 测试 2: 只有一块砖每行，无边缘可穿
console.log(leastBricks([[1], [1], [1]])); // 期望: 3
// 测试 3
console.log(leastBricks([[1, 1], [2], [1, 1]])); // 期望: 1

export {};
