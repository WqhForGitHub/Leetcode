// ============================================================
// 155. 最长公共子路径
// ============================================================
// LeetCode 1923. Longest Common Subpath
// 多个整数数组中的最长公共连续子数组。

// 方法1：二分查找 + 滚动哈希
function longestCommonSubpath(n: number, paths: number[][]): number {
  const base = 100001n;
  const mod = (1n << 64n) - 1n; // 伪 64 位模数
  let lo = 1;
  let hi = Math.min(...paths.map((p) => p.length));
  let result = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const common = getCommon(paths, mid, base, mod);
    if (common) {
      result = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return result;
}

function getCommon(
  paths: number[][],
  len: number,
  base: bigint,
  mod: bigint
): boolean {
  let common: Set<bigint> | null = null;
  for (const path of paths) {
    const seen = new Set<bigint>();
    if (path.length < len) return false;
    let hash = 0n;
    let power = 1n;
    for (let i = 0; i < len; i++) {
      hash = (hash * base + BigInt(path[i])) % mod;
      power = (power * base) % mod;
    }
    seen.add(hash);
    for (let i = len; i < path.length; i++) {
      hash = (hash * base + BigInt(path[i]) - BigInt(path[i - len]) * power) % mod;
      if (hash < 0n) hash += mod;
      seen.add(hash);
    }
    if (common === null) {
      common = seen;
    } else {
      common = new Set([...common!].filter((h) => seen.has(h)));
    }
    if (common!.size === 0) return false;
  }
  return true;
}

// 方法2：二分 + 暴力比较（O(n² log n)）
function longestCommonSubpathBrute(n: number, paths: number[][]): number {
  let lo = 1;
  let hi = Math.min(...paths.map((p) => p.length));
  let result = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const set0 = new Set<string>();
    for (let i = 0; i <= paths[0].length - mid; i++) {
      set0.add(paths[0].slice(i, i + mid).join(","));
    }
    let hasCommon = true;
    for (let p = 1; p < paths.length; p++) {
      const setP = new Set<string>();
      for (let i = 0; i <= paths[p].length - mid; i++) {
        const key = paths[p].slice(i, i + mid).join(",");
        if (set0.has(key)) setP.add(key);
      }
      if (setP.size === 0) {
        hasCommon = false;
        break;
      }
    }
    if (hasCommon) {
      result = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 155. 最长公共子路径 =====");
console.log("哈希 5,[[0,1,2,3,4],[2,3,4],[4,0,1,2,3]]:", longestCommonSubpath(5, [[0, 1, 2, 3, 4], [2, 3, 4], [4, 0, 1, 2, 3]])); // 2
console.log("暴力 3,[[0],[1],[2]]:", longestCommonSubpathBrute(3, [[0], [1], [2]])); // 0

export {};
