// ============================================================
// 226. 绝对差值和
// ============================================================
// LeetCode 1818. Minimum Absolute Sum Difference
// 给定两个正整数数组 nums1 和 nums2，可以将 nums1 中至多一个元素替换为 nums1 中任意
// 另一个元素，求替换后 sum(|nums1[i]-nums2[i]|) 的最小值，对 1e9+7 取模。

// 方法1：排序 + 二分查找（O(n log n)）
// 拷贝并排序 nums1，对每个 i 在有序数组中二分查找最接近 nums2[i] 的元素，
// 统计可以减少的最大差值，最后用原始总和减去最大减少量。
function minAbsoluteSumDiff(nums1: number[], nums2: number[]): number {
  const MOD = 1e9 + 7;
  const sorted = [...nums1].sort((a, b) => a - b);
  const n = nums1.length;
  let sum = 0;
  let maxReduce = 0;
  for (let i = 0; i < n; i++) {
    const diff = Math.abs(nums1[i] - nums2[i]);
    sum = (sum + diff) % MOD;
    const target = nums2[i];
    // 二分查找 target
    let left = 0;
    let right = sorted.length - 1;
    let found = false;
    while (left <= right) {
      const mid = (left + right) >> 1;
      if (sorted[mid] === target) {
        found = true;
        break;
      } else if (sorted[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    let newDiff: number;
    if (found) {
      newDiff = 0;
    } else {
      // sorted[left] >= target（若 left < n）；sorted[right] < target（若 right >= 0）
      const candidates: number[] = [];
      if (left < sorted.length) candidates.push(sorted[left]);
      if (right >= 0) candidates.push(sorted[right]);
      newDiff = Math.min(...candidates.map((c) => Math.abs(c - target)));
    }
    maxReduce = Math.max(maxReduce, diff - newDiff);
  }
  return (((sum - maxReduce) % MOD) + MOD) % MOD;
}

// 方法2：排序 + 双指针（O(n log n)）
// 排序 nums1，并将下标按 nums2[i] 升序排列，利用单调推进的双指针
// 在有序数组中为每个 target 找到最接近的元素，避免二分。
function minAbsoluteSumDiff2(nums1: number[], nums2: number[]): number {
  const MOD = 1e9 + 7;
  const n = nums1.length;
  const sorted = [...nums1].sort((a, b) => a - b);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum = (sum + Math.abs(nums1[i] - nums2[i])) % MOD;
  }
  // 下标按 nums2 值升序
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => nums2[a] - nums2[b]);
  let maxReduce = 0;
  let j = 0; // sorted 数组上的指针，随 target 增大只向前推进
  for (const i of order) {
    const target = nums2[i];
    while (j < n && sorted[j] < target) {
      j++;
    }
    let newDiff = Infinity;
    if (j < n) newDiff = Math.min(newDiff, Math.abs(sorted[j] - target));
    if (j > 0) newDiff = Math.min(newDiff, Math.abs(sorted[j - 1] - target));
    const diff = Math.abs(nums1[i] - nums2[i]);
    maxReduce = Math.max(maxReduce, diff - newDiff);
  }
  return (((sum - maxReduce) % MOD) + MOD) % MOD;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 226. 绝对差值和 =====");
console.log("方法1 [1,7,5],[2,3,5]:", minAbsoluteSumDiff([1, 7, 5], [2, 3, 5]));
console.log("方法2 [1,7,5],[2,3,5]:", minAbsoluteSumDiff2([1, 7, 5], [2, 3, 5]));
console.log(
  "方法1 [1,10,4,4,2,7],[9,3,5,1,7,4]:",
  minAbsoluteSumDiff([1, 10, 4, 4, 2, 7], [9, 3, 5, 1, 7, 4]),
);
console.log(
  "方法2 [1,10,4,4,2,7],[9,3,5,1,7,4]:",
  minAbsoluteSumDiff2([1, 10, 4, 4, 2, 7], [9, 3, 5, 1, 7, 4]),
);

export {};
