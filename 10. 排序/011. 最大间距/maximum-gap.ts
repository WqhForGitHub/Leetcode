// ============================================================
// 011. 最大间距
// ============================================================
// LeetCode 164. Maximum Gap
// 给定无序数组，返回排序后相邻元素的最大差值，要求 O(n) 时间和空间。

// 方法1：基数排序（O(n) 时间，O(n) 空间）
function maximumGap(nums: number[]): number {
  const n = nums.length;
  if (n < 2) return 0;

  // 找最大值以确定位数
  const maxVal = Math.max(...nums);
  if (maxVal === 0) return 0;

  // 基数排序（LSD，从低位到高位）
  const buf = new Array<number>(n).fill(0);
  let exp = 1;
  while (Math.floor(maxVal / exp) > 0) {
    const count = new Array<number>(10).fill(0);
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(nums[i] / exp) % 10;
      count[digit]++;
    }
    // 前缀和确定位置
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
    // 从后往前保证稳定性
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(nums[i] / exp) % 10;
      buf[count[digit] - 1] = nums[i];
      count[digit]--;
    }
    for (let i = 0; i < n; i++) {
      nums[i] = buf[i];
    }
    exp *= 10;
  }

  let maxGap = 0;
  for (let i = 1; i < n; i++) {
    maxGap = Math.max(maxGap, nums[i] - nums[i - 1]);
  }
  return maxGap;
}

// 方法2：桶排序 / 鸽巢原理（O(n) 时间，O(n) 空间）
function maximumGapBucket(nums: number[]): number {
  const n = nums.length;
  if (n < 2) return 0;

  let minVal = Infinity;
  let maxVal = -Infinity;
  for (const v of nums) {
    if (v < minVal) minVal = v;
    if (v > maxVal) maxVal = v;
  }
  if (maxVal === minVal) return 0;

  // 桶大小：保证最大间距必然出现在桶之间
  const bucketSize = Math.max(1, Math.floor((maxVal - minVal) / (n - 1)));
  const bucketCount = Math.floor((maxVal - minVal) / bucketSize) + 1;

  const bucketMin = new Array<number>(bucketCount).fill(Infinity);
  const bucketMax = new Array<number>(bucketCount).fill(-Infinity);
  const hasValue = new Array<boolean>(bucketCount).fill(false);

  for (const v of nums) {
    const idx = Math.floor((v - minVal) / bucketSize);
    bucketMin[idx] = Math.min(bucketMin[idx], v);
    bucketMax[idx] = Math.max(bucketMax[idx], v);
    hasValue[idx] = true;
  }

  let maxGap = 0;
  let prevMax = minVal;
  for (let i = 0; i < bucketCount; i++) {
    if (!hasValue[i]) continue;
    maxGap = Math.max(maxGap, bucketMin[i] - prevMax);
    prevMax = bucketMax[i];
  }
  return maxGap;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 011. 最大间距 =====");
console.log("基数排序 [3,6,9,1]:", maximumGap([3, 6, 9, 1])); // 3
console.log("基数排序 [10]:", maximumGap([10])); // 0
console.log("桶排序 [3,6,9,1]:", maximumGapBucket([3, 6, 9, 1])); // 3
console.log("桶排序 [1,1,1,1]:", maximumGapBucket([1, 1, 1, 1])); // 0

export {};
