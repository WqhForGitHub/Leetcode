// ============================================================
// 104. 每段建筑物的平均高度
// ============================================================
// LeetCode 2015. Average Height of Buildings in Each Segment
// 给定建筑物 [start, end, height]，返回每段的平均高度。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：扫描线 + 排序
function averageHeightOfBuildings(buildings: number[][]): number[][] {
  const events: Array<{ pos: number; h: number; delta: number }> = [];
  for (const [start, end, h] of buildings) {
    events.push({ pos: start, h, delta: 1 });
    events.push({ pos: end, h, delta: -1 });
  }
  events.sort((a, b) => a.pos - b.pos);
  const result: number[][] = [];
  let prevPos = -1;
  let sumH = 0;
  let count = 0;
  let i = 0;
  while (i < events.length) {
    const pos = events[i].pos;
    if (prevPos !== -1 && prevPos !== pos && count > 0) {
      result.push([prevPos, pos, Math.floor(sumH / count)]);
    }
    while (i < events.length && events[i].pos === pos) {
      sumH += events[i].h * events[i].delta;
      count += events[i].delta;
      i++;
    }
    prevPos = pos;
  }
  // 合并相邻相同高度段
  const merged: number[][] = [];
  for (const seg of result) {
    if (
      merged.length > 0 &&
      merged[merged.length - 1][1] === seg[0] &&
      merged[merged.length - 1][2] === seg[2]
    ) {
      merged[merged.length - 1][1] = seg[1];
    } else {
      merged.push(seg);
    }
  }
  return merged;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 104. 每段建筑物的平均高度 =====");
console.log(
  "结果:",
  JSON.stringify(
    averageHeightOfBuildings([
      [1, 4, 2],
      [3, 9, 4],
    ]),
  ),
);
// 期望 [[1,3,2],[3,4,3],[4,9,4]]
console.log(
  "结果:",
  JSON.stringify(
    averageHeightOfBuildings([
      [1, 3, 2],
      [2, 5, 3],
      [2, 8, 3],
    ]),
  ),
);

export {};
