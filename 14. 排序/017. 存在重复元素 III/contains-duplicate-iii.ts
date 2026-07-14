// ============================================================
// 017. 存在重复元素 III
// ============================================================
// LeetCode 220. Contains Duplicate III
// 给定整数数组和两个整数 k、t，判断是否存在两个不同索引 i、j，
// 使得 abs(i - j) <= k 且 abs(nums[i] - nums[j]) <= t。

// 方法1：桶排序（推荐，O(n)，O(k)）
// 将每个数放入大小为 t+1 的桶中，相同桶或相邻桶中存在满足条件的数即返回 true。
function containsNearbyAlmostDuplicate(nums: number[], k: number, t: number): boolean {
  if (t < 0 || k <= 0) return false;
  const size: number = t + 1;
  const bucketMap = new Map<number, number>();

  const getBucketId = (num: number): number => {
    // 对负数处理：使 -1 / size 落入 -1 桶而非 0 桶
    return num < 0 ? Math.floor((num + 1) / size) - 1 : Math.floor(num / size);
  };

  for (let i = 0; i < nums.length; i++) {
    const num: number = nums[i];
    const id: number = getBucketId(num);

    // 同一桶中已存在元素，差值必然 <= t
    if (bucketMap.has(id)) return true;
    // 检查相邻桶
    if (bucketMap.has(id - 1) && Math.abs(num - bucketMap.get(id - 1)!) <= t) return true;
    if (bucketMap.has(id + 1) && Math.abs(num - bucketMap.get(id + 1)!) <= t) return true;

    bucketMap.set(id, num);

    // 维护窗口大小不超过 k
    if (i >= k) {
      const oldId: number = getBucketId(nums[i - k]);
      bucketMap.delete(oldId);
    }
  }
  return false;
}

// 方法2：有序数组模拟 TreeSet + 二分（O(n log k)，O(k)）
// 维护一个大小为 k 的有序数组，对每个新元素二分查找最近的邻居判断差值。
function containsNearbyAlmostDuplicate2(nums: number[], k: number, t: number): boolean {
  if (t < 0 || k <= 0) return false;
  const sorted: number[] = [];

  const lowerBound = (arr: number[], target: number): number => {
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const mid: number = (lo + hi) >> 1;
      if (arr[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  for (let i = 0; i < nums.length; i++) {
    const num: number = nums[i];
    const pos: number = lowerBound(sorted, num);

    // 检查 pos 处元素
    if (pos < sorted.length && Math.abs(sorted[pos] - num) <= t) return true;
    // 检查 pos-1 处元素
    if (pos > 0 && Math.abs(sorted[pos - 1] - num) <= t) return true;

    // 插入 num
    sorted.splice(pos, 0, num);

    // 维护窗口大小不超过 k
    if (i >= k) {
      const oldNum: number = nums[i - k];
      const oldPos: number = lowerBound(sorted, oldNum);
      sorted.splice(oldPos, 1);
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 017. 存在重复元素 III =====");
console.log("方法1:", containsNearbyAlmostDuplicate([1, 2, 3, 1], 3, 0)); // 期望 true
console.log("方法1:", containsNearbyAlmostDuplicate([1, 0, 1, 1], 1, 2)); // 期望 true
console.log("方法1:", containsNearbyAlmostDuplicate([1, 5, 9, 1, 5, 9], 2, 3)); // 期望 false
console.log("方法2:", containsNearbyAlmostDuplicate2([1, 2, 3, 1], 3, 0)); // 期望 true
console.log("方法2:", containsNearbyAlmostDuplicate2([1, 0, 1, 1], 1, 2)); // 期望 true
console.log("方法2:", containsNearbyAlmostDuplicate2([1, 5, 9, 1, 5, 9], 2, 3)); // 期望 false

export {};
