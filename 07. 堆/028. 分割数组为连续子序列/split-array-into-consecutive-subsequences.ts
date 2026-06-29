// ============================================================
// 028. 分割数组为连续子序列
// ============================================================
// LeetCode 659. Split Array into Consecutive Subsequences
// 判断能否将升序数组分割成长度至少为 3 的连续子序列。
// 时间复杂度：O(N)，空间复杂度：O(N)

// 方法1：贪心 + 哈希表（推荐）
function isPossible(nums: number[]): boolean {
  const freq = new Map<number, number>();
  const need = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  for (const n of nums) {
    if ((freq.get(n) ?? 0) === 0) continue;
    if ((need.get(n) ?? 0) > 0) {
      freq.set(n, freq.get(n)! - 1);
      need.set(n, need.get(n)! - 1);
      need.set(n + 1, (need.get(n + 1) ?? 0) + 1);
    } else if ((freq.get(n + 1) ?? 0) > 0 && (freq.get(n + 2) ?? 0) > 0) {
      freq.set(n, freq.get(n)! - 1);
      freq.set(n + 1, freq.get(n + 1)! - 1);
      freq.set(n + 2, freq.get(n + 2)! - 1);
      need.set(n + 3, (need.get(n + 3) ?? 0) + 1);
    } else {
      return false;
    }
  }
  return true;
}

// 方法2：最小堆（按子序列结尾）
function isPossibleHeap(nums: number[]): boolean {
  const map = new Map<number, Array<{ end: number; len: number }>>();
  for (const n of nums) {
    if (!map.has(n - 1)) map.set(n - 1, []);
    const list = map.get(n - 1)!;
    if (!map.has(n)) map.set(n, []);
    if (list.length > 0) {
      const shortest = list.reduce((min, cur) => (cur.len < min.len ? cur : min));
      const idx = list.indexOf(shortest);
      list.splice(idx, 1);
      map.get(n)!.push({ end: n, len: shortest.len + 1 });
    } else {
      map.get(n)!.push({ end: n, len: 1 });
    }
  }
  for (const list of map.values()) {
    for (const sub of list) {
      if (sub.len < 3) return false;
    }
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 028. 分割数组为连续子序列 =====");
console.log("贪心:", isPossible([1, 2, 3, 3, 4, 5])); // 期望 true
console.log("堆:", isPossibleHeap([1, 2, 3, 3, 4, 4, 5, 5])); // 期望 true
console.log("贪心:", isPossible([1, 2, 3, 4, 4, 5])); // 期望 false

export {};
