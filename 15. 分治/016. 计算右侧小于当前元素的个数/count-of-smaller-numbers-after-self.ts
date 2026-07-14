// ============================================================
// 016. 计算右侧小于当前元素的个数
// ============================================================
// LeetCode 315. Count of Smaller Numbers After Self
// 给定一个整数数组 nums，返回一个新数组 counts，
// counts[i] 表示 nums[i] 右侧小于 nums[i] 的元素个数。
// 时间复杂度：O(n log n), 空间复杂度：O(n)

// 方法1：归并排序（分治）统计每个元素的逆序数（推荐）
// 归并时对左半每个元素，统计右半中已归位（比它小）的元素个数
function countSmaller1(nums: number[]): number[] {
  const n: number = nums.length;
  const counts: number[] = new Array(n).fill(0);
  // indices 记录每个位置当前对应的原始下标
  const indices: number[] = nums.map((_: number, i: number): number => i);
  const temp: number[] = new Array(n);
  mergeSortCount(nums, indices, temp, counts, 0, n - 1);
  return counts;
}

function mergeSortCount(
  nums: number[],
  indices: number[],
  temp: number[],
  counts: number[],
  left: number,
  right: number,
): void {
  if (left >= right) return;
  const mid: number = (left + right) >> 1;
  mergeSortCount(nums, indices, temp, counts, left, mid);
  mergeSortCount(nums, indices, temp, counts, mid + 1, right);

  // 合并 [left..mid] 与 [mid+1..right]，按 nums[indices[i]] 升序
  let i: number = left;
  let j: number = mid + 1;
  let k: number = left;
  let rightCount: number = 0; // 右半部分已放入 temp 的元素数
  while (i <= mid && j <= right) {
    if (nums[indices[j]] < nums[indices[i]]) {
      temp[k++] = indices[j++];
      rightCount++;
    } else {
      // 左半元素：有 rightCount 个右侧元素比它小
      counts[indices[i]] += rightCount;
      temp[k++] = indices[i++];
    }
  }
  while (i <= mid) {
    counts[indices[i]] += rightCount;
    temp[k++] = indices[i++];
  }
  while (j <= right) {
    temp[k++] = indices[j++];
  }
  for (let t: number = left; t <= right; t++) {
    indices[t] = temp[t];
  }
}

// 方法2：树状数组（离散化）
// 从右往左遍历，查询已出现的比当前值小的元素个数，再加入当前值
function countSmaller2(nums: number[]): number[] {
  const n: number = nums.length;
  if (n === 0) return [];
  // 离散化：将值映射到 1..m
  const sorted: number[] = [...new Set(nums)].sort((a: number, b: number): number => a - b);
  const rank: Map<number, number> = new Map();
  for (let i: number = 0; i < sorted.length; i++) {
    rank.set(sorted[i], i + 1);
  }

  const m: number = sorted.length;
  const tree: number[] = new Array(m + 1).fill(0);

  const add = (i: number): void => {
    while (i <= m) {
      tree[i]++;
      i += i & -i;
    }
  };

  const query = (i: number): number => {
    let s: number = 0;
    while (i > 0) {
      s += tree[i];
      i -= i & -i;
    }
    return s;
  };

  const counts: number[] = new Array(n).fill(0);
  for (let i: number = n - 1; i >= 0; i--) {
    const r: number = rank.get(nums[i]) as number;
    counts[i] = query(r - 1); // 查询比 nums[i] 小的元素个数
    add(r);
  }
  return counts;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 016. 计算右侧小于当前元素的个数 =====");
console.log("方法1:", JSON.stringify(countSmaller1([5, 2, 6, 1]))); // 期望结果: [2,1,1,0]
console.log("方法2:", JSON.stringify(countSmaller2([5, 2, 6, 1]))); // 期望结果: [2,1,1,0]
console.log("方法1:", JSON.stringify(countSmaller1([-1]))); // 期望结果: [0]
console.log("方法2:", JSON.stringify(countSmaller2([-1, -1]))); // 期望结果: [0,0]
console.log("方法1:", JSON.stringify(countSmaller1([1, 2, 3, 4]))); // 期望结果: [0,0,0,0]
console.log("方法2:", JSON.stringify(countSmaller2([4, 3, 2, 1]))); // 期望结果: [3,2,1,0]

export {};
