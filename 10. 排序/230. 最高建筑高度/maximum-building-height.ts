// ============================================================
// 230. 最高建筑高度
// ============================================================
// LeetCode 1840. Maximum Building Height
// n 栋建筑排成一行（编号 1..n），restrictions[i] = [id, maxHeight] 限制该建筑高度。
// 相邻建筑高度差不超过 1，且 1 号建筑高度 <= 0（即 0）。求任意建筑可能的最大高度。

// 方法1：排序 + 两遍约束传播 + 求峰值（O(m log m)）
// 强制 1 号建筑高度为 0，按 id 排序后先从左到右、再从右到左传播相邻差 <= 1 的约束，
// 然后对每对相邻限制位置计算中间可达的峰值高度，并单独处理尾部段。
function maxBuilding(n: number, restrictions: number[][]): number {
  const map = new Map<number, number>();
  map.set(1, 0); // 1 号建筑高度强制为 0
  for (const [id, h] of restrictions) {
    map.set(id, Math.min(map.get(id) ?? Infinity, h));
  }
  const arr: number[][] = [];
  for (const [id, h] of map) {
    arr.push([id, h]);
  }
  arr.sort((a, b) => a[0] - b[0]);

  // 从左到右传播
  for (let i = 1; i < arr.length; i++) {
    const d = arr[i][0] - arr[i - 1][0];
    arr[i][1] = Math.min(arr[i][1], arr[i - 1][1] + d);
  }
  // 从右到左传播
  for (let i = arr.length - 2; i >= 0; i--) {
    const d = arr[i + 1][0] - arr[i][0];
    arr[i][1] = Math.min(arr[i][1], arr[i + 1][1] + d);
  }

  let maxH = 0;
  for (const [, h] of arr) {
    maxH = Math.max(maxH, h);
  }
  for (let i = 0; i + 1 < arr.length; i++) {
    const [id1, h1] = arr[i];
    const [id2, h2] = arr[i + 1];
    const d = id2 - id1;
    const peak = Math.floor((h1 + h2 + d) / 2);
    maxH = Math.max(maxH, peak);
  }
  // 最后一个限制之后到 n 号建筑可继续上升
  const last = arr[arr.length - 1];
  maxH = Math.max(maxH, last[1] + (n - last[0]));
  return maxH;
}

// 方法2：排序 + 带边界处理的约束传播（O(m log m)）
// 在 1 号建筑（高度 0）之外，额外加入 n 号建筑的上界 [n, n-1]
// （由 1 号建筑为 0、相邻差 <= 1 可知 n 号建筑至多 n-1），使峰值公式自动覆盖尾部段。
function maxBuilding2(n: number, restrictions: number[][]): number {
  const map = new Map<number, number>();
  map.set(1, 0); // 1 号建筑高度强制为 0
  map.set(n, n - 1); // n 号建筑的上界
  for (const [id, h] of restrictions) {
    map.set(id, Math.min(map.get(id) ?? Infinity, h));
  }
  const arr: number[][] = [];
  for (const [id, h] of map) {
    arr.push([id, h]);
  }
  arr.sort((a, b) => a[0] - b[0]);

  for (let i = 1; i < arr.length; i++) {
    const d = arr[i][0] - arr[i - 1][0];
    arr[i][1] = Math.min(arr[i][1], arr[i - 1][1] + d);
  }
  for (let i = arr.length - 2; i >= 0; i--) {
    const d = arr[i + 1][0] - arr[i][0];
    arr[i][1] = Math.min(arr[i][1], arr[i + 1][1] + d);
  }

  let maxH = 0;
  for (const [, h] of arr) {
    maxH = Math.max(maxH, h);
  }
  for (let i = 0; i + 1 < arr.length; i++) {
    const [id1, h1] = arr[i];
    const [id2, h2] = arr[i + 1];
    const d = id2 - id1;
    const peak = Math.floor((h1 + h2 + d) / 2);
    maxH = Math.max(maxH, peak);
  }
  return maxH;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 230. 最高建筑高度 =====");
console.log(
  "方法1 n=5,[[2,1],[4,1]]:",
  maxBuilding(5, [
    [2, 1],
    [4, 1],
  ]),
);
console.log(
  "方法2 n=5,[[2,1],[4,1]]:",
  maxBuilding2(5, [
    [2, 1],
    [4, 1],
  ]),
);
console.log(
  "方法1 n=6,[[1,2],[3,1],[5,2]]:",
  maxBuilding(6, [
    [1, 2],
    [3, 1],
    [5, 2],
  ]),
);
console.log(
  "方法2 n=6,[[1,2],[3,1],[5,2]]:",
  maxBuilding2(6, [
    [1, 2],
    [3, 1],
    [5, 2],
  ]),
);
console.log("方法1 n=5,[]:", maxBuilding(5, []));
console.log("方法2 n=5,[]:", maxBuilding2(5, []));

export {};
