// ============================================================
// 136. 最流行的视频创作者
// ============================================================
// LeetCode 2456. Most Popular Video Creator
// 给定创作者、视频ID和播放量，找出总播放量最大的创作者及其播放量最高的视频。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：哈希表 + 排序
function mostPopularCreator(creators: string[], ids: string[], views: number[]): string[][] {
  const n = creators.length;
  const map: Map<string, { total: number; bestId: string; bestView: number }> = new Map();
  let maxTotal = 0;
  for (let i = 0; i < n; i++) {
    if (!map.has(creators[i])) {
      map.set(creators[i], { total: 0, bestId: ids[i], bestView: views[i] });
    }
    const info = map.get(creators[i])!;
    info.total += views[i];
    if (views[i] > info.bestView || (views[i] === info.bestView && ids[i] < info.bestId)) {
      info.bestId = ids[i];
      info.bestView = views[i];
    }
    maxTotal = Math.max(maxTotal, info.total);
  }
  const result: string[][] = [];
  for (const [creator, info] of map) {
    if (info.total === maxTotal) {
      result.push([creator, info.bestId]);
    }
  }
  return result;
}

// 方法2：最大堆
function mostPopularCreatorHeap(creators: string[], ids: string[], views: number[]): string[][] {
  const n = creators.length;
  const map: Map<string, { total: number; bestId: string; bestView: number }> = new Map();
  for (let i = 0; i < n; i++) {
    if (!map.has(creators[i])) {
      map.set(creators[i], { total: 0, bestId: ids[i], bestView: views[i] });
    }
    const info = map.get(creators[i])!;
    info.total += views[i];
    if (views[i] > info.bestView || (views[i] === info.bestView && ids[i] < info.bestId)) {
      info.bestId = ids[i];
      info.bestView = views[i];
    }
  }
  const arr = Array.from(map.entries()).map(([c, info]) => [c, info] as const);
  // 最大堆按 total
  const heap: Array<{ creator: string; total: number; bestId: string }> = [];
  for (const [creator, info] of arr) {
    heap.push({ creator, total: info.total, bestId: info.bestId });
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i].total > heap[p].total) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  }
  const result: string[][] = [];
  const maxTotal = heap[0].total;
  for (const item of heap) {
    if (item.total === maxTotal) result.push([item.creator, item.bestId]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 136. 最流行的视频创作者 =====");
console.log("哈希表:", JSON.stringify(mostPopularCreator(
  ["alice", "bob", "alice", "chris"],
  ["one", "two", "three", "four"],
  [5, 10, 5, 4]
))); // 期望 [["alice","one"],["bob","two"]]

export {};
