// ============================================================
// 143. 最近的房间
// ============================================================
// LeetCode 1847. Closest Room
// 房间列表和查询列表，找面积 >= preferred 且房间号最接近 preferred 的房间。

// 方法1：排序 + 有序集合 + 二分查找
function closestRoom(rooms: number[][], queries: number[][]): number[] {
  // 按面积降序排序
  rooms.sort((a, b) => b[1] - a[1]);
  // 给查询加索引，按面积要求降序排序
  const indexedQueries = queries.map((q, i) => [...q, i]);
  indexedQueries.sort((a, b) => b[1] - a[1]);
  const result = new Array(queries.length).fill(-1);
  const sortedIds: number[] = [];
  let roomIdx = 0;
  for (const [preferred, minSize, qIdx] of indexedQueries) {
    // 加入所有面积 >= minSize 的房间号
    while (roomIdx < rooms.length && rooms[roomIdx][1] >= minSize) {
      insertSorted(sortedIds, rooms[roomIdx][0]);
      roomIdx++;
    }
    if (sortedIds.length === 0) continue;
    // 二分找最接近 preferred 的房间号
    let lo = 0;
    let hi = sortedIds.length - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (sortedIds[mid] < preferred) lo = mid + 1;
      else hi = mid;
    }
    let best = sortedIds[lo];
    if (lo > 0) {
      const prev = sortedIds[lo - 1];
      if (Math.abs(prev - preferred) <= Math.abs(best - preferred)) {
        best = prev;
      }
    }
    result[qIdx] = best;
  }
  return result;
}

function insertSorted(arr: number[], val: number): void {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] < val) lo = mid + 1;
    else hi = mid;
  }
  arr.splice(lo, 0, val);
}

// 方法2：排序 + TreeSet（用数组模拟）
function closestRoomAlt(rooms: number[][], queries: number[][]): number[] {
  rooms.sort((a, b) => b[1] - a[1]);
  const q = queries.map((query, i) => ({ preferred: query[0], minSize: query[1], idx: i }));
  q.sort((a, b) => b.minSize - a.minSize);
  const result = new Array(queries.length).fill(-1);
  const ids: number[] = [];
  let j = 0;
  for (const { preferred, minSize, idx } of q) {
    while (j < rooms.length && rooms[j][1] >= minSize) {
      insertSorted(ids, rooms[j][0]);
      j++;
    }
    if (ids.length === 0) continue;
    let lo = 0;
    let hi = ids.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (ids[mid] >= preferred) hi = mid;
      else lo = mid + 1;
    }
    let best = -1;
    let bestDist = Infinity;
    if (lo < ids.length) {
      bestDist = Math.abs(ids[lo] - preferred);
      best = ids[lo];
    }
    if (lo > 0 && Math.abs(ids[lo - 1] - preferred) <= bestDist) {
      best = ids[lo - 1];
    }
    result[idx] = best;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 143. 最近的房间 =====");
console.log("有序集合 [[2,2],[1,2],[3,2]],[[3,1],[3,3],[5,2]]:",
  closestRoom([[2, 2], [1, 2], [3, 2]], [[3, 1], [3, 3], [5, 2]])); // [3,-1,3]
console.log("有序集合 [[1,4],[2,3],[3,5],[4,1],[5,2]],[[2,3],[2,4],[2,5]]:",
  closestRoom([[1, 4], [2, 3], [3, 5], [4, 1], [5, 2]], [[2, 3], [2, 4], [2, 5]])); // [2,1,3]

export {};
