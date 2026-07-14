// ============================================================
// 100. 美丽子集的数目
// ============================================================
// LeetCode 2597. The Number of Beautiful Subsets
// 给定数组 nums 和 k，统计非空子集中任意两元素差的绝对值不为 k 的子集个数
// 时间复杂度：O(2^n), 空间复杂度：O(n)

// 方法1：回溯+排序去重 (推荐)
// 排序后回溯；选当前元素时只需检查已选元素中是否存在 nums[start]-k
function beautifulSubsets(nums: number[], k: number): number {
  nums.sort((a: number, b: number) => a - b);
  let count = 0;
  const selected: number[] = [];

  const backtrack = (start: number): void => {
    if (start === nums.length) {
      if (selected.length > 0) count++;
      return;
    }
    // 不选当前元素
    backtrack(start + 1);
    // 选当前元素：检查是否与已选元素差为 k（已排序，仅可能 nums[start]-k）
    let canPick = true;
    for (const x of selected) {
      if (nums[start] - x === k) {
        canPick = false;
        break;
      }
    }
    if (canPick) {
      selected.push(nums[start]);
      backtrack(start + 1);
      selected.pop();
    }
  };

  backtrack(0);
  return count;
}

// 方法2：回溯+哈希表
// 用哈希表记录已选元素计数，O(1) 检查 nums[start]-k 与 nums[start]+k 是否存在
function beautifulSubsets2(nums: number[], k: number): number {
  let count = 0;
  const used = new Map<number, number>();

  const backtrack = (start: number): void => {
    if (start === nums.length) {
      if (used.size > 0) count++;
      return;
    }
    // 不选
    backtrack(start + 1);
    // 选
    const v = nums[start];
    if ((used.get(v - k) ?? 0) === 0 && (used.get(v + k) ?? 0) === 0) {
      used.set(v, (used.get(v) ?? 0) + 1);
      backtrack(start + 1);
      used.set(v, (used.get(v) ?? 0) - 1);
      if ((used.get(v) ?? 0) === 0) used.delete(v);
    }
  };

  backtrack(0);
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 100. 美丽子集的数目 =====");
console.log(beautifulSubsets([2, 4, 6], 2)); // 期望结果: 4
console.log(beautifulSubsets([1], 1)); // 期望结果: 1
console.log("--- 方法2测试 ---");
console.log(beautifulSubsets2([2, 4, 6], 2)); // 期望结果: 4
console.log(beautifulSubsets2([1], 1)); // 期望结果: 1

export {};
