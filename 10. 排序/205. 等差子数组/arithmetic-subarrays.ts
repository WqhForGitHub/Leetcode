// ============================================================
// 205. 等差子数组
// ============================================================
// LeetCode 1630. Arithmetic Subarrays
// 给定 nums、l 数组、r 数组。对每个查询 i，判断子数组 nums[l[i]..r[i]]
// 是否能重排为等差数列。返回布尔数组。

// 方法1：拷贝子数组 + 排序 + 检查差值一致（O(m * n log n)）
function checkArithmeticSubarrays(nums: number[], l: number[], r: number[]): boolean[] {
  const result: boolean[] = [];
  for (let i = 0; i < l.length; i++) {
    const sub = nums.slice(l[i], r[i] + 1).sort((a, b) => a - b);
    if (sub.length <= 2) {
      result.push(true);
      continue;
    }
    let isArithmetic = true;
    const diff = sub[1] - sub[0];
    for (let j = 2; j < sub.length; j++) {
      if (sub[j] - sub[j - 1] !== diff) {
        isArithmetic = false;
        break;
      }
    }
    result.push(isArithmetic);
  }
  return result;
}

// 方法2：求极值 + 集合判断元素存在 + 验证公差（O(m * n)）
function checkArithmeticSubarrays2(nums: number[], l: number[], r: number[]): boolean[] {
  const result: boolean[] = [];
  for (let i = 0; i < l.length; i++) {
    const left = l[i];
    const right = r[i];
    const len = right - left + 1;
    if (len <= 2) {
      result.push(true);
      continue;
    }

    let minVal = Infinity;
    let maxVal = -Infinity;
    const set = new Set<number>();
    for (let j = left; j <= right; j++) {
      minVal = Math.min(minVal, nums[j]);
      maxVal = Math.max(maxVal, nums[j]);
      set.add(nums[j]);
    }

    // 所有元素相同，公差为0，是等差数列
    if (minVal === maxVal) {
      result.push(true);
      continue;
    }

    // 公差必须整除 (maxVal - minVal) / (len - 1)
    if ((maxVal - minVal) % (len - 1) !== 0) {
      result.push(false);
      continue;
    }

    const diff = (maxVal - minVal) / (len - 1);
    let isArithmetic = true;
    for (let k = 0; k < len; k++) {
      if (!set.has(minVal + k * diff)) {
        isArithmetic = false;
        break;
      }
    }
    result.push(isArithmetic);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 205. 等差子数组 =====");
console.log(
  "方法1 nums=[4,6,5,9,3,7] l=[0,0,2] r=[2,3,5]:",
  checkArithmeticSubarrays([4, 6, 5, 9, 3, 7], [0, 0, 2], [2, 3, 5]),
);
console.log(
  "方法2 nums=[4,6,5,9,3,7] l=[0,0,2] r=[2,3,5]:",
  checkArithmeticSubarrays2([4, 6, 5, 9, 3, 7], [0, 0, 2], [2, 3, 5]),
);
console.log(
  "方法1 nums=[-12,-9,-3,-12,-10,-4] l=[0,2] r=[2,5]:",
  checkArithmeticSubarrays([-12, -9, -3, -12, -10, -4], [0, 2], [2, 5]),
);
console.log(
  "方法2 nums=[-12,-9,-3,-12,-10,-4] l=[0,2] r=[2,5]:",
  checkArithmeticSubarrays2([-12, -9, -3, -12, -10, -4], [0, 2], [2, 5]),
);

export {};
