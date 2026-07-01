// ============================================================
// 149. 装包裹的最小浪费空间
// ============================================================
// LeetCode 1889. Minimum Space Wasted From Packaging
// （与 148 相同问题，不同实现方法）

// 方法1：排序 + 前缀和 + 二分查找
function minWastedSpace(packages: number[], boxes: number[][]): number {
  const mod = 1_000_000_007;
  packages.sort((a, b) => a - b);
  const n = packages.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + packages[i];
  let minWaste = Infinity;
  for (const supplier of boxes) {
    supplier.sort((a, b) => a - b);
    let waste = 0;
    let prev = 0;
    for (const boxSize of supplier) {
      // 二分找 packages 中 <= boxSize 的最大索引
      let lo = prev;
      let hi = n - 1;
      let best = prev - 1;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (packages[mid] <= boxSize) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      if (best >= prev) {
        const count = best - prev + 1;
        waste += boxSize * count - (prefix[best + 1] - prefix[prev]);
        prev = best + 1;
      }
      if (prev === n) break;
    }
    if (prev === n) {
      minWaste = Math.min(minWaste, waste);
    }
  }
  return minWaste === Infinity ? -1 : minWaste % mod;
}

// 方法2：双指针
function minWastedSpaceTwoPointer(packages: number[], boxes: number[][]): number {
  const mod = 1_000_000_007;
  packages.sort((a, b) => a - b);
  const n = packages.length;
  let minWaste = Infinity;
  for (const supplier of boxes) {
    supplier.sort((a, b) => a - b);
    let waste = 0;
    let pkgIdx = 0;
    for (const boxSize of supplier) {
      while (pkgIdx < n && packages[pkgIdx] <= boxSize) {
        waste += boxSize - packages[pkgIdx];
        pkgIdx++;
      }
    }
    if (pkgIdx === n) {
      minWaste = Math.min(minWaste, waste);
    }
  }
  return minWaste === Infinity ? -1 : minWaste % mod;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 149. 装包裹的最小浪费空间 =====");
console.log("二分 [2,3,5],[[4,8],[2,8]]:",
  minWastedSpace([2, 3, 5], [[4, 8], [2, 8]])); // 6
console.log("双指针 [2,3,5],[[4,8],[2,8]]:",
  minWastedSpaceTwoPointer([2, 3, 5], [[4, 8], [2, 8]])); // 6

export {};
