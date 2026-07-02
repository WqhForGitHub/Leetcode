// ============================================================
// 017. 摆动排序 II
// ============================================================
// LeetCode 324. Wiggle Sort II
// 重新排列数组 nums，使得 nums[0] < nums[1] > nums[2] < nums[3]...
// 你可以假设所有输入都能得到有效结果。
// 时间复杂度：O(n log n) / O(n) 平均, 空间复杂度：O(n) / O(1)

// 方法1：排序 + 虚拟索引交叉排列（推荐）
// 排序后将较大的元素放到奇数位置（峰），较小的元素放到偶数位置（谷）
// 虚拟索引映射 (1 + 2*i) % (n|1) 保证中位数相同的元素被隔开
function wiggleSort1(nums: number[]): void {
  const n: number = nums.length;
  const sorted: number[] = [...nums].sort((a: number, b: number): number => a - b);
  for (let i: number = 0; i < n; i++) {
    // 从大到小依次放到虚拟位置：先填奇数位（峰），再填偶数位（谷）
    nums[(1 + 2 * i) % (n | 1)] = sorted[n - 1 - i];
  }
}

// 方法2：快速选择找中位数 + 虚拟索引三路划分
// 先用快速选择找到中位数，再通过虚拟索引做荷兰国旗三路划分，平均 O(n)
function wiggleSort2(nums: number[]): void {
  const n: number = nums.length;
  // 找中位数（排序后索引 n>>1 处的元素，即较小一侧的中位数）
  const mid: number = quickselect(nums, 0, n - 1, n >> 1);

  // 虚拟索引映射：将逻辑位置映射到实际位置
  const map = (idx: number): number => (1 + 2 * idx) % (n | 1);

  // 荷兰国旗三路划分：大于中位数的放左侧（峰），小于中位数的放右侧（谷）
  let i: number = 0;
  let left: number = 0;
  let right: number = n - 1;
  while (i <= right) {
    if (nums[map(i)] > mid) {
      [nums[map(i)], nums[map(left)]] = [nums[map(left)], nums[map(i)]];
      i++;
      left++;
    } else if (nums[map(i)] < mid) {
      [nums[map(i)], nums[map(right)]] = [nums[map(right)], nums[map(i)]];
      right--;
    } else {
      i++;
    }
  }
}

// 快速选择：找第 k 小（0-indexed）的元素
function quickselect(nums: number[], lo: number, hi: number, k: number): number {
  while (lo < hi) {
    const p: number = partitionQS(nums, lo, hi);
    if (p === k) return nums[p];
    if (p < k) lo = p + 1;
    else hi = p - 1;
  }
  return nums[lo];
}

function partitionQS(nums: number[], lo: number, hi: number): number {
  const pivot: number = nums[hi];
  let i: number = lo;
  for (let j: number = lo; j < hi; j++) {
    if (nums[j] <= pivot) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
      i++;
    }
  }
  [nums[i], nums[hi]] = [nums[hi], nums[i]];
  return i;
}

// 校验摆动性质：nums[0] < nums[1] > nums[2] < nums[3] ...
function isWiggle(nums: number[]): boolean {
  for (let i: number = 0; i < nums.length - 1; i++) {
    if (i % 2 === 0) {
      if (!(nums[i] < nums[i + 1])) return false;
    } else {
      if (!(nums[i] > nums[i + 1])) return false;
    }
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 017. 摆动排序 II =====");
const test1: number[] = [1, 5, 1, 1, 6, 4];
wiggleSort1(test1);
console.log("方法1:", JSON.stringify(test1), "有效:", isWiggle(test1)); // 期望结果: 有效: true

const test2: number[] = [1, 3, 2, 2, 3, 1];
wiggleSort1(test2);
console.log("方法1:", JSON.stringify(test2), "有效:", isWiggle(test2)); // 期望结果: 有效: true

const test3: number[] = [1, 5, 1, 1, 6, 4];
wiggleSort2(test3);
console.log("方法2:", JSON.stringify(test3), "有效:", isWiggle(test3)); // 期望结果: 有效: true

const test4: number[] = [1, 3, 2, 2, 3, 1];
wiggleSort2(test4);
console.log("方法2:", JSON.stringify(test4), "有效:", isWiggle(test4)); // 期望结果: 有效: true

const test5: number[] = [1, 1, 2, 2, 2, 1];
wiggleSort2([...test5]);
const test5Copy: number[] = [...test5];
wiggleSort2(test5Copy);
console.log("方法2:", JSON.stringify(test5Copy), "有效:", isWiggle(test5Copy)); // 期望结果: 有效: true

export {};
