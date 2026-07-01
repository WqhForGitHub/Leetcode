// ============================================================
// 170. 每一个查询的最大美丽值
// ============================================================
// LeetCode 2070. Most Beautiful Item for Each Query
// items[i] = [price, beauty]，对每个查询 price，
// 找价格 <= price 的商品中的最大美丽值。

// 方法1：排序 + 前缀最大值 + 二分查找
function maximumBeauty(items: number[][], queries: number[]): number[] {
  // 按价格排序
  items.sort((a, b) => a[0] - b[0]);
  // 构建前缀最大美丽值
  for (let i = 1; i < items.length; i++) {
    items[i][1] = Math.max(items[i][1], items[i - 1][1]);
  }
  // 对每个查询二分查找
  const result: number[] = [];
  for (const q of queries) {
    let lo = 0;
    let hi = items.length - 1;
    let idx = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (items[mid][0] <= q) {
        idx = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    result.push(idx === -1 ? 0 : items[idx][1]);
  }
  return result;
}

// 方法2：排序查询 + 双指针
function maximumBeautyOffline(items: number[][], queries: number[]): number[] {
  items.sort((a, b) => a[0] - b[0]);
  // 带索引排序查询
  const indexedQueries = queries.map((q, i) => [q, i]);
  indexedQueries.sort((a, b) => a[0] - b[0]);

  const result = new Array(queries.length).fill(0);
  let maxBeauty = 0;
  let itemIdx = 0;
  for (const [q, originalIdx] of indexedQueries) {
    while (itemIdx < items.length && items[itemIdx][0] <= q) {
      maxBeauty = Math.max(maxBeauty, items[itemIdx][1]);
      itemIdx++;
    }
    result[originalIdx] = maxBeauty;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 170. 每一个查询的最大美丽值 =====");
console.log("二分 [[1,2],[3,2],[2,4],[5,6],[3,5]],[1,2,3,4,5,6]:",
  maximumBeauty([[1, 2], [3, 2], [2, 4], [5, 6], [3, 5]], [1, 2, 3, 4, 5, 6])); // [2,4,5,5,6,6]
console.log("离线 [[1,2],[1,2],[1,3],[1,4]],[1]:",
  maximumBeautyOffline([[1, 2], [1, 2], [1, 3], [1, 4]], [1])); // [4]
console.log("离线 [[10,1000]],[5]:",
  maximumBeautyOffline([[10, 1000]], [5])); // [0]

export {};
