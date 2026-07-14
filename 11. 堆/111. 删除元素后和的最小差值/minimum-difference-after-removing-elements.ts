// ============================================================
// 111. 删除元素后和的最小差值
// ============================================================
// LeetCode 2163. Minimum Difference in Sums After Removal of Elements
// 删除 n 个元素后，前 n 个最小和后 n 个最大和的最小差值。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：前缀最小堆 + 后缀最大堆
function minimumDifference(nums: number[]): number {
  const n3 = nums.length;
  const n = n3 / 3;
  // 前缀：前 2n 中选 n 个最小和
  const leftMin: number[] = new Array(n3).fill(0);
  const maxHeap: number[] = [];
  let leftSum = 0;
  const pushMax = (arr: number[], v: number): void => {
    arr.push(v);
    let i = arr.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (arr[i] > arr[p]) {
        [arr[i], arr[p]] = [arr[p], arr[i]];
        i = p;
      } else break;
    }
  };
  const popMax = (arr: number[]): number => {
    const top = arr[0];
    const last = arr.pop()!;
    if (arr.length > 0) {
      arr[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < arr.length && arr[l] > arr[s]) s = l;
        if (r < arr.length && arr[r] > arr[s]) s = r;
        if (s !== i) {
          [arr[i], arr[s]] = [arr[s], arr[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  const pushMin = (arr: number[], v: number): void => {
    arr.push(v);
    let i = arr.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (arr[i] < arr[p]) {
        [arr[i], arr[p]] = [arr[p], arr[i]];
        i = p;
      } else break;
    }
  };
  const popMin = (arr: number[]): number => {
    const top = arr[0];
    const last = arr.pop()!;
    if (arr.length > 0) {
      arr[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < arr.length && arr[l] < arr[s]) s = l;
        if (r < arr.length && arr[r] < arr[s]) s = r;
        if (s !== i) {
          [arr[i], arr[s]] = [arr[s], arr[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (let i = 0; i < n; i++) {
    pushMax(maxHeap, nums[i]);
    leftSum += nums[i];
  }
  leftMin[n - 1] = leftSum;
  for (let i = n; i < 2 * n; i++) {
    if (nums[i] < maxHeap[0]) {
      leftSum += nums[i] - popMax(maxHeap);
      pushMax(maxHeap, nums[i]);
    }
    leftMin[i] = leftSum;
  }
  // 后缀：后 2n 中选 n 个最大和
  const rightMax: number[] = new Array(n3).fill(0);
  const minHeap: number[] = [];
  let rightSum = 0;
  for (let i = n3 - 1; i >= 2 * n; i--) {
    pushMin(minHeap, nums[i]);
    rightSum += nums[i];
  }
  rightMax[2 * n] = rightSum;
  for (let i = 2 * n - 1; i >= n; i--) {
    if (nums[i] > minHeap[0]) {
      rightSum += nums[i] - popMin(minHeap);
      pushMin(minHeap, nums[i]);
    }
    rightMax[i] = rightSum;
  }
  let result = Infinity;
  for (let i = n - 1; i < 2 * n; i++) {
    result = Math.min(result, leftMin[i] - rightMax[i + 1]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 111. 删除元素后和的最小差值 =====");
console.log("最小差:", minimumDifference([3, 1, 2])); // 期望 -1
console.log("最小差:", minimumDifference([7, 9, 5, 8, 9, 6])); // 期望 1

export {};
