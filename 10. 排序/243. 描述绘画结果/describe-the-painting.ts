// ============================================================
// 243. 描述绘画结果
// ============================================================
// LeetCode 1943. Describe the Painting
// 给定线段 segments = [[start, end, color], ...]，重叠区域颜色为各颜色之和。
// 返回不重叠的区间列表 [start, end, color]，其中 color 为该区间内颜色总和。

// 方法1：事件扫描 + 差分累加（O(n log n)）
// 将每条线段拆为 start 处 +color、end 处 -color 的事件，
// 按位置排序后扫描，累加当前颜色和，在相邻不同位置间输出区间。
function splitPainting1(segments: number[][]): number[][] {
  const events: number[][] = []; // [position, delta]
  for (const [s, e, c] of segments) {
    events.push([s, c]);
    events.push([e, -c]);
  }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  const res: number[][] = [];
  let sum = 0;
  let prev = -1;
  let i = 0;
  while (i < events.length) {
    const pos = events[i][0];
    // [prev, pos) 区间颜色为 sum
    if (prev !== -1 && sum > 0 && pos > prev) {
      res.push([prev, pos, sum]);
    }
    // 处理同一位置的所有事件
    while (i < events.length && events[i][0] === pos) {
      sum += events[i][1];
      i++;
    }
    prev = pos;
  }
  return res;
}

// 方法2：坐标差分聚合 + 排序累加（O(n log n)）
// 先用 Map 把每个位置的颜色变化聚合，再按位置排序扫描。
function splitPainting2(segments: number[][]): number[][] {
  const delta = new Map<number, number>();
  for (const [s, e, c] of segments) {
    delta.set(s, (delta.get(s) ?? 0) + c);
    delta.set(e, (delta.get(e) ?? 0) - c);
  }
  const positions = [...delta.keys()].sort((a, b) => a - b);

  const res: number[][] = [];
  let sum = 0;
  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    sum += delta.get(pos)!;
    if (i + 1 < positions.length && sum > 0) {
      res.push([pos, positions[i + 1], sum]);
    }
  }
  return res;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 243. 描述绘画结果 =====");
console.log(
  "方法1 [[1,4,5],[4,7,7]]:",
  JSON.stringify(
    splitPainting1([
      [1, 4, 5],
      [4, 7, 7],
    ]),
  ),
); // [[1,4,5],[4,7,7]]
console.log(
  "方法2 [[1,4,5],[4,7,7]]:",
  JSON.stringify(
    splitPainting2([
      [1, 4, 5],
      [4, 7, 7],
    ]),
  ),
); // [[1,4,5],[4,7,7]]
console.log(
  "方法1 [[1,7,5],[2,4,3]]:",
  JSON.stringify(
    splitPainting1([
      [1, 7, 5],
      [2, 4, 3],
    ]),
  ),
); // [[1,2,5],[2,4,8],[4,7,5]]
console.log(
  "方法2 [[1,7,5],[2,4,3]]:",
  JSON.stringify(
    splitPainting2([
      [1, 7, 5],
      [2, 4, 3],
    ]),
  ),
); // [[1,2,5],[2,4,8],[4,7,5]]
console.log(
  "方法1 [[1,4,5],[1,4,7],[4,7,9]]:",
  JSON.stringify(
    splitPainting1([
      [1, 4, 5],
      [1, 4, 7],
      [4, 7, 9],
    ]),
  ),
); // [[1,4,12],[4,7,9]]
console.log(
  "方法2 [[1,4,5],[1,4,7],[4,7,9]]:",
  JSON.stringify(
    splitPainting2([
      [1, 4, 5],
      [1, 4, 7],
      [4, 7, 9],
    ]),
  ),
); // [[1,4,12],[4,7,9]]

export {};
