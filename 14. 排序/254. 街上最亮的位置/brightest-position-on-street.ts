// ============================================================
// 254. 街上最亮的位置
// ============================================================
// LeetCode 2021. Brightest Position on Street
// 给定 lamps[i] = [position, range]，每盏灯照亮 [position - range, position + range]
// （闭区间）。求被最多灯照亮的位置（相同数量取最小位置）。

// 方法1：差分数组思路：事件 (position-range, +1) 与 (position+range+1, -1)，排序后前缀和
// 时间复杂度 O(n log n)
function brightestPosition1(lamps: number[][]): number {
  type Ev = [pos: number, delta: number];
  const events: Ev[] = [];
  for (const [pos, range] of lamps) {
    events.push([pos - range, 1]);
    events.push([pos + range + 1, -1]);
  }
  events.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  let best = -1;
  let bestCount = -1;
  let cur = 0;
  let i = 0;
  while (i < events.length) {
    const p = events[i][0];
    while (i < events.length && events[i][0] === p) {
      cur += events[i][1];
      i++;
    }
    if (cur > bestCount) {
      bestCount = cur;
      best = p;
    }
  }
  return best;
}

// 方法2：排序所有起止事件，扫描计数当前活动灯数量
// 时间复杂度 O(n log n)
function brightestPosition2(lamps: number[][]): number {
  type Ev = [pos: number, type: number]; // type 0 = start, 1 = end+1
  const events: Ev[] = [];
  for (const [pos, range] of lamps) {
    events.push([pos - range, 0]);
    events.push([pos + range + 1, 1]);
  }
  // 起点优先于终点（同一位置先 +1 再 -1），保证闭区间正确
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let active = 0;
  let best = -1;
  let bestCount = -1;
  let i = 0;
  while (i < events.length) {
    const p = events[i][0];
    while (i < events.length && events[i][0] === p) {
      if (events[i][1] === 0) active++;
      else active--;
      i++;
    }
    if (active > bestCount) {
      bestCount = active;
      best = p;
    }
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 254. 街上最亮的位置 =====");
console.log(
  "方法1 [[1,0],[2,1]]:",
  brightestPosition1([
    [1, 0],
    [2, 1],
  ]),
);
console.log(
  "方法1 [[1,2],[3,3],[2,1]]:",
  brightestPosition1([
    [1, 2],
    [3, 3],
    [2, 1],
  ]),
);
console.log(
  "方法2 [[1,0],[2,1]]:",
  brightestPosition2([
    [1, 0],
    [2, 1],
  ]),
);
console.log(
  "方法2 [[1,2],[3,3],[2,1]]:",
  brightestPosition2([
    [1, 2],
    [3, 3],
    [2, 1],
  ]),
);

export {};
