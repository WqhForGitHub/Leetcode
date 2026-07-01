// ============================================================
// 158. 数组序号转换
// ============================================================
// LeetCode 1331. Rank Transform of an Array
// 将数组中每个元素替换为它的序号（按值升序，1 开始，相同值序号相同）。

// 方法1：排序去重 + 哈希映射（O(n log n)）
function arrayRankTransform(arr: number[]): number[] {
  const sorted = [...arr].sort((a, b) => a - b);
  const rank = new Map<number, number>();
  let r = 1;
  for (const v of sorted) {
    if (!rank.has(v)) {
      rank.set(v, r++);
    }
  }
  return arr.map((v) => rank.get(v)!);
}

// 方法2：排序带索引 + 去重分配序号（O(n log n)）
// 通过稳定排序保留原下标，避免额外 Map 查找。
function arrayRankTransform2(arr: number[]): number[] {
  const n = arr.length;
  const result: number[] = new Array(n).fill(0);
  const indices = arr.map((_, i) => i).sort((a, b) => arr[a] - arr[b]);
  let r = 0;
  let prev = Infinity;
  for (const idx of indices) {
    if (arr[idx] !== prev) {
      r++;
      prev = arr[idx];
    }
    result[idx] = r;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 158. 数组序号转换 =====");
console.log("方法1 [40,10,20,30]:", arrayRankTransform([40, 10, 20, 30])); // [4,1,2,3]
console.log("方法1 [100,100,100]:", arrayRankTransform([100, 100, 100])); // [1,1,1]
console.log("方法1 [37,12,28,9,100,56,80,5,12]:", arrayRankTransform([37, 12, 28, 9, 100, 56, 80, 5, 12])); // [5,3,4,2,8,6,7,1,3]
console.log("方法2 [40,10,20,30]:", arrayRankTransform2([40, 10, 20, 30])); // [4,1,2,3]
console.log("方法2 [37,12,28,9,100,56,80,5,12]:", arrayRankTransform2([37, 12, 28, 9, 100, 56, 80, 5, 12])); // [5,3,4,2,8,6,7,1,3]

export {};
