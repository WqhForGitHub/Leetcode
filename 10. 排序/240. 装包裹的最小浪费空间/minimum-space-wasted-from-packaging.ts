// ============================================================
// 240. 装包裹的最小浪费空间
// ============================================================
// LeetCode 1889. Minimum Space Wasted From Packaging
// 给定 packages（包裹尺寸）和 boxes（每个供应商的箱子尺寸列表）。
// 选定一个供应商，为每个包裹分配一个尺寸 >= 包裹的箱子，
// 浪费空间 = 所选箱子尺寸之和 - 包裹尺寸之和。求最小浪费空间，
// 若无供应商能满足返回 -1。结果对 1e9+7 取模。

const MOD_WASTE = 1e9 + 7;

// 方法1：包裹排序 + 每个供应商箱子排序 + 二分 + 前缀和（O(p log p + sum(b log b + p log b))）
function minWastedSpace1(packages: number[], boxes: number[][]): number {
  packages.sort((a, b) => a - b);
  const n = packages.length;
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + packages[i];

  let minWaste = Infinity;
  for (const supplierBoxes of boxes) {
    const bs = [...supplierBoxes].sort((a, b) => a - b);
    if (bs[bs.length - 1] < packages[n - 1]) continue; // 放不下最大包裹
    let waste = 0;
    let pkgStart = 0;
    for (const box of bs) {
      if (pkgStart >= n) break;
      // 二分找最后一个 <= box 的包裹位置
      let lo = pkgStart;
      let hi = n;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (packages[mid] <= box) lo = mid + 1;
        else hi = mid;
      }
      const pkgEnd = lo;
      if (pkgEnd > pkgStart) {
        const cnt = pkgEnd - pkgStart;
        const pkgSum = prefix[pkgEnd] - prefix[pkgStart];
        waste += box * cnt - pkgSum;
        pkgStart = pkgEnd;
      }
    }
    if (waste < minWaste) minWaste = waste;
  }
  return minWaste === Infinity ? -1 : minWaste % MOD_WASTE;
}

// 方法2：包裹排序 + 箱子排序 + 双指针 + 前缀和（O(p log p + sum(b log b + p))）
function minWastedSpace2(packages: number[], boxes: number[][]): number {
  packages.sort((a, b) => a - b);
  const n = packages.length;
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + packages[i];

  let minWaste = Infinity;
  for (const supplierBoxes of boxes) {
    const bs = [...supplierBoxes].sort((a, b) => a - b);
    if (bs[bs.length - 1] < packages[n - 1]) continue;
    let waste = 0;
    let pkgStart = 0;
    for (const box of bs) {
      if (pkgStart >= n) break;
      if (packages[pkgStart] > box) continue; // 当前箱子太小
      // 双指针线性推进所有 <= box 的包裹
      let pkgEnd = pkgStart;
      while (pkgEnd < n && packages[pkgEnd] <= box) pkgEnd++;
      const cnt = pkgEnd - pkgStart;
      const pkgSum = prefix[pkgEnd] - prefix[pkgStart];
      waste += box * cnt - pkgSum;
      pkgStart = pkgEnd;
    }
    if (waste < minWaste) minWaste = waste;
  }
  return minWaste === Infinity ? -1 : minWaste % MOD_WASTE;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 240. 装包裹的最小浪费空间 =====");
console.log(
  "方法1 [2,3,5],[[4,8],[2,8]]:",
  minWastedSpace1(
    [2, 3, 5],
    [
      [4, 8],
      [2, 8],
    ],
  ),
); // 6
console.log(
  "方法2 [2,3,5],[[4,8],[2,8]]:",
  minWastedSpace2(
    [2, 3, 5],
    [
      [4, 8],
      [2, 8],
    ],
  ),
); // 6
console.log(
  "方法1 [2,3,5],[[1,4],[2,3],[3,4]]:",
  minWastedSpace1(
    [2, 3, 5],
    [
      [1, 4],
      [2, 3],
      [3, 4],
    ],
  ),
); // -1
console.log(
  "方法2 [2,3,5],[[1,4],[2,3],[3,4]]:",
  minWastedSpace2(
    [2, 3, 5],
    [
      [1, 4],
      [2, 3],
      [3, 4],
    ],
  ),
); // -1
console.log(
  "方法1 [3,5,8,10,11,12],[[12],[1,4,10,11,12]]:",
  minWastedSpace1([3, 5, 8, 10, 11, 12], [[12], [1, 4, 10, 11, 12]]),
); // 8
console.log(
  "方法2 [3,5,8,10,11,12],[[12],[1,4,10,11,12]]:",
  minWastedSpace2([3, 5, 8, 10, 11, 12], [[12], [1, 4, 10, 11, 12]]),
); // 8

export {};
