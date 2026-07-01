// ============================================================
// 041. 翻转对
// ============================================================
// LeetCode 493. Reverse Pairs
// 满足 i < j 且 nums[i] > 2 * nums[j] 的对数。

// 方法1：归并排序（O(n log n)）
function reversePairs(nums: number[]): number {
  const temp: number[] = new Array(nums.length);
  return mergeSort(nums, 0, nums.length - 1, temp);
}

function mergeSort(
  nums: number[],
  left: number,
  right: number,
  temp: number[]
): number {
  if (left >= right) return 0;
  const mid = Math.floor((left + right) / 2);
  let count = mergeSort(nums, left, mid, temp) +
    mergeSort(nums, mid + 1, right, temp);
  // 统计翻转对
  let j = mid + 1;
  for (let i = left; i <= mid; i++) {
    while (j <= right && nums[i] > 2 * nums[j]) j++;
    count += j - (mid + 1);
  }
  // 归并
  for (let i = left; i <= right; i++) temp[i] = nums[i];
  let i = left;
  j = mid + 1;
  let k = left;
  while (i <= mid && j <= right) {
    if (temp[i] <= temp[j]) nums[k++] = temp[i++];
    else nums[k++] = temp[j++];
  }
  while (i <= mid) nums[k++] = temp[i++];
  while (j <= right) nums[k++] = temp[j++];
  return count;
}

// 方法2：树状数组（O(n log n)）
function reversePairsBIT(nums: number[]): number {
  // 收集所有值进行离散化
  const allValues: number[] = [];
  for (const num of nums) {
    allValues.push(num, 2 * num);
  }
  allValues.sort((a, b) => a - b);
  const rank = new Map<number, number>();
  let r = 1;
  for (const v of allValues) {
    if (!rank.has(v)) rank.set(v, r++);
  }
  const bit = new Array(r + 1).fill(0);
  function update(i: number) {
    while (i < bit.length) {
      bit[i]++;
      i += i & -i;
    }
  }
  function query(i: number): number {
    let sum = 0;
    while (i > 0) {
      sum += bit[i];
      i -= i & -i;
    }
    return sum;
  }
  let count = 0;
  for (let i = nums.length - 1; i >= 0; i--) {
    // 查找 < nums[i] 的个数
    const target = nums[i] - 1;
    let rk = 0;
    // 找 target 在 rank 中的排名
    const idx = allValues.filter((v) => v <= target).length;
    count += query(idx);
    update(rank.get(nums[i])!);
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 041. 翻转对 =====");
console.log("归并 [1,3,2,3,1]:", reversePairs([1, 3, 2, 3, 1])); // 2
console.log("归并 [2,4,3,5,1]:", reversePairs([2, 4, 3, 5, 1])); // 3

export {};
