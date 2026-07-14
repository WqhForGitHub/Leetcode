// ============================================================
// 253. 每段建筑物的平均高度
// ============================================================
// LeetCode 2015. Average Height of Buildings in Each Segment
// 给定 buildings = [start, end, height]（半开区间 [start, end)）。
// 求出每段活动建筑物集合（因而平均高度）恒定的子段。
// 返回 [[segStart, segEnd, avgHeight], ...]，avgHeight 为总高度 / 段长（向下取整）。

// 方法1：差分事件扫描：起点 +height，终点 -height，排序事件后前缀累加并输出 count>0 段
// 时间复杂度 O(n log n)
function averageHeightOfBuildings1(buildings: number[][]): number[][] {
  type Ev = [pos: number, delta: number];
  const events: Ev[] = [];
  for (const [s, e, h] of buildings) {
    events.push([s, h]);
    events.push([e, -h]);
  }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const res: number[][] = [];
  let sum = 0;
  let count = 0;
  let prev = -1;
  for (let i = 0; i < events.length; i++) {
    const [pos, delta] = events[i];
    if (prev !== -1 && pos !== prev && count > 0) {
      const len = pos - prev;
      const avg = Math.floor(sum / len);
      // 合并相邻同平均高度的段
      if (res.length > 0 && res[res.length - 1][1] === prev && res[res.length - 1][2] === avg) {
        res[res.length - 1][1] = pos;
      } else {
        res.push([prev, pos, avg]);
      }
    }
    sum += delta;
    if (delta > 0) count += 1;
    else count -= 1;
    prev = pos;
  }
  return res;
}

// 方法2：收集所有边界点排序，相邻边界间累计活动高度求和
// 时间复杂度 O(n^2) 简单实现，便于理解
function averageHeightOfBuildings2(buildings: number[][]): number[][] {
  const boundsSet: Set<number> = new Set();
  for (const [s, e] of buildings) {
    boundsSet.add(s);
    boundsSet.add(e);
  }
  const bounds: number[] = [...boundsSet].sort((a, b) => a - b);
  const res: number[][] = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    const segStart = bounds[i];
    const segEnd = bounds[i + 1];
    let sum = 0;
    let count = 0;
    for (const [s, e, h] of buildings) {
      if (s <= segStart && e >= segEnd) {
        sum += h;
        count += 1;
      }
    }
    if (count > 0) {
      const avg = Math.floor(sum / (segEnd - segStart));
      if (res.length > 0 && res[res.length - 1][1] === segStart && res[res.length - 1][2] === avg) {
        res[res.length - 1][1] = segEnd;
      } else {
        res.push([segStart, segEnd, avg]);
      }
    }
  }
  return res;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 253. 每段建筑物的平均高度 =====");
console.log(
  "方法1 [[1,4,2],[3,9,4]]:",
  JSON.stringify(
    averageHeightOfBuildings1([
      [1, 4, 2],
      [3, 9, 4],
    ]),
  ),
);
console.log(
  "方法1 [[1,3,2],[2,5,3],[3,7,2]]:",
  JSON.stringify(
    averageHeightOfBuildings1([
      [1, 3, 2],
      [2, 5, 3],
      [3, 7, 2],
    ]),
  ),
);
console.log(
  "方法2 [[1,4,2],[3,9,4]]:",
  JSON.stringify(
    averageHeightOfBuildings2([
      [1, 4, 2],
      [3, 9, 4],
    ]),
  ),
);
console.log(
  "方法2 [[1,3,2],[2,5,3],[3,7,2]]:",
  JSON.stringify(
    averageHeightOfBuildings2([
      [1, 3, 2],
      [2, 5, 3],
      [3, 7, 2],
    ]),
  ),
);

export {};
