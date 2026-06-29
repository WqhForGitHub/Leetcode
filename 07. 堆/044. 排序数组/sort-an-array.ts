// ============================================================
// 044. 排序数组
// ============================================================
// LeetCode 912. Sort an Array
// 给你一个整数数组 nums，请你将该数组升序排列。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：堆排序
function sortArray(nums: number[]): number[] {
  const siftDown = (arr: number[], i: number, n: number): void => {
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && arr[l] > arr[s]) s = l;
      if (r < n && arr[r] > arr[s]) s = r;
      if (s !== i) {
        [arr[i], arr[s]] = [arr[s], arr[i]];
        i = s;
      } else break;
    }
  };
  const n = nums.length;
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(nums, i, n);
  for (let i = n - 1; i > 0; i--) {
    [nums[0], nums[i]] = [nums[i], nums[0]];
    siftDown(nums, 0, i);
  }
  return nums;
}

// 方法2：归并排序
function sortArrayMerge(nums: number[]): number[] {
  const merge = (arr: number[], lo: number, mid: number, hi: number): void => {
    const temp = arr.slice(lo, hi + 1);
    let i = 0;
    let j = mid - lo + 1;
    let k = lo;
    while (i <= mid - lo && j <= hi - lo) {
      if (temp[i] <= temp[j]) arr[k++] = temp[i++];
      else arr[k++] = temp[j++];
    }
    while (i <= mid - lo) arr[k++] = temp[i++];
    while (j <= hi - lo) arr[k++] = temp[j++];
  };
  const sort = (arr: number[], lo: number, hi: number): void => {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    sort(arr, lo, mid);
    sort(arr, mid + 1, hi);
    merge(arr, lo, mid, hi);
  };
  sort(nums, 0, nums.length - 1);
  return nums;
}

// 方法3：快速排序
function sortArrayQuick(nums: number[]): number[] {
  const partition = (lo: number, hi: number): number => {
    const pivot = nums[(lo + hi) >> 1];
    let i = lo;
    let j = hi;
    while (i <= j) {
      while (nums[i] < pivot) i++;
      while (nums[j] > pivot) j--;
      if (i <= j) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
        i++;
        j--;
      }
    }
    return i;
  };
  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) return;
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p, hi);
  };
  sort(0, nums.length - 1);
  return nums;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 044. 排序数组 =====");
console.log("堆排序:", sortArray([5, 2, 3, 1])); // 期望 [1,2,3,5]
console.log("归并:", sortArrayMerge([5, 1, 1, 2, 0, 0])); // 期望 [0,0,1,1,2,5]
console.log("快排:", sortArrayQuick([5, 2, 3, 1])); // 期望 [1,2,3,5]

export {};
