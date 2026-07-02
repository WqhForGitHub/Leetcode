// ============================================================
// 161. 数组大小减半
// ============================================================
// LeetCode 1338. Reduce Array Size to The Half
// 给定数组 arr，选择一个整数集合，使得从 arr 中删除所有等于该集合中元素的项后，
// 剩余元素个数 <= 原数组一半。返回该集合的最小大小。

// 方法1：频率统计 + 降序排序 + 贪心（O(n log n)）
function minSetSize1(arr: number[]): number {
  const freq = new Map<number, number>();
  for (const v of arr) freq.set(v, (freq.get(v) ?? 0) + 1);
  const counts = [...freq.values()].sort((a, b) => b - a);
  const target = arr.length >> 1;
  let sum = 0;
  let i = 0;
  while (sum < target) {
    sum += counts[i];
    i++;
  }
  return i;
}

// 方法2：频率统计 + 桶排序（O(n)）
function minSetSize2(arr: number[]): number {
  const freq = new Map<number, number>();
  for (const v of arr) freq.set(v, (freq.get(v) ?? 0) + 1);
  const n = arr.length;
  // bucket[f] = 出现次数恰好为 f 的不同整数个数
  const bucket: number[] = new Array(n + 1).fill(0);
  for (const c of freq.values()) bucket[c]++;
  let sum = 0;
  let res = 0;
  const target = n >> 1;
  // 从最大频率开始贪心选取
  for (let f = n; f >= 1 && sum < target; f--) {
    while (bucket[f] > 0 && sum < target) {
      sum += f;
      res++;
      bucket[f]--;
    }
  }
  return res;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 161. 数组大小减半 =====");
console.log("方法1 [3,3,7,7,7,7]:", minSetSize1([3, 3, 7, 7, 7, 7])); // 1
console.log("方法2 [3,3,7,7,7,7]:", minSetSize2([3, 3, 7, 7, 7, 7])); // 1
console.log("方法1 [7,7,7,7,7,7]:", minSetSize1([7, 7, 7, 7, 7, 7])); // 1
console.log("方法2 [1,9]:", minSetSize2([1, 9])); // 1

export {};
