// ============================================================
// 029. 摆动排序 II
// ============================================================
// LeetCode 324. Wiggle Sort II
// 原地重排数组，使得 nums[0] < nums[1] > nums[2] < nums[3]...（严格不等）。
// 题目保证存在合法解。

// 方法1：排序后交叉放置（推荐，O(n log n) 时间，O(n) 空间）
// 排序后，把较小半段逆序放到偶数下标，较大半段逆序放到奇数下标。
// 逆序可避免相等元素相邻，保证严格不等。
function wiggleSortII(nums: number[]): void {
  const n = nums.length;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = (n + 1) >> 1; // 较小半段长度
  let small = mid - 1; // 较小半段指针，从 mid-1 递减
  let large = n - 1; // 较大半段指针，从 n-1 递减
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      nums[i] = sorted[small--];
    } else {
      nums[i] = sorted[large--];
    }
  }
}

// 方法2：快速选择 + 虚拟下标三路划分（进阶，O(n) 平均时间，O(1) 额外空间）
// 1) 用快速选择找到中位数 median = sorted[(n-1)/2]
// 2) 虚拟下标映射 A(i) = (1 + 2*i) % (n | 1)，把“峰位”排在虚拟序列前段
// 3) 荷兰国旗三路划分：>median 放峰位，<median 放谷位，==median 居中
function wiggleSortIIQuickselect(nums: number[]): void {
  const n = nums.length;
  const k = (n - 1) >> 1; // 中位数在升序中的下标
  const median = quickselect(nums, 0, n - 1, k);

  const A = (i: number): number => (1 + 2 * i) % (n | 1);

  let i = 0; // 下一个 >median 的位置
  let j = 0; // 当前扫描位置
  let right = n - 1; // 下一个 <median 的位置
  while (j <= right) {
    const vj = nums[A(j)];
    if (vj > median) {
      [nums[A(i)], nums[A(j)]] = [nums[A(j)], nums[A(i)]];
      i++;
      j++;
    } else if (vj < median) {
      [nums[A(j)], nums[A(right)]] = [nums[A(right)], nums[A(j)]];
      right--;
    } else {
      j++;
    }
  }
}

// 快速选择：返回 nums[lo..hi] 中升序第 k 小（0-indexed）的元素值
function quickselect(
  nums: number[],
  lo: number,
  hi: number,
  k: number
): number {
  if (lo === hi) return nums[lo];
  const pivotIdx = lo + Math.floor(Math.random() * (hi - lo + 1));
  const pivotVal = nums[pivotIdx];
  // Lomuto 划分：把 pivot 移到末尾
  [nums[pivotIdx], nums[hi]] = [nums[hi], nums[pivotIdx]];
  let store = lo;
  for (let i = lo; i < hi; i++) {
    if (nums[i] < pivotVal) {
      [nums[store], nums[i]] = [nums[i], nums[store]];
      store++;
    }
  }
  [nums[store], nums[hi]] = [nums[hi], nums[store]];
  // 此时 nums[store] 为 pivotVal 的最终排序位置
  if (k === store) return nums[store];
  if (k < store) return quickselect(nums, lo, store - 1, k);
  return quickselect(nums, store + 1, hi, k);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 029. 摆动排序 II =====");

function isWiggleII(nums: number[]): boolean {
  for (let i = 0; i < nums.length - 1; i++) {
    if (i % 2 === 0 && !(nums[i] < nums[i + 1])) return false;
    if (i % 2 === 1 && !(nums[i] > nums[i + 1])) return false;
  }
  return true;
}

const a1 = [1, 5, 1, 1, 6, 4];
wiggleSortII(a1);
console.log("排序交叉 [1,5,1,1,6,4]:", a1, "通过:", isWiggleII(a1)); // 期望：满足严格摆动

const a2 = [1, 3, 2, 2, 3, 1];
wiggleSortII(a2);
console.log("排序交叉 [1,3,2,2,3,1]:", a2, "通过:", isWiggleII(a2)); // 期望：满足严格摆动

const a3 = [1, 5, 1, 1, 6, 4];
wiggleSortIIQuickselect(a3);
console.log("快选虚拟下标 [1,5,1,1,6,4]:", a3, "通过:", isWiggleII(a3)); // 期望：满足严格摆动

const a4 = [1, 3, 2, 2, 3, 1];
wiggleSortIIQuickselect(a4);
console.log("快选虚拟下标 [1,3,2,2,3,1]:", a4, "通过:", isWiggleII(a4)); // 期望：满足严格摆动

export {};
