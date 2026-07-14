// ============================================================
// 040. 非递减子序列
// ============================================================
// LeetCode 491. Non-decreasing Subsequences
// 给定整数数组，返回所有不同的非递减子序列（长度>=2）。
// 时间复杂度：O(2^n * n), 空间复杂度：O(n)

// 方法1：回溯+集合去重 (推荐)
// 回溯生成所有子序列，在同层使用Set去重
// 时间复杂度 O(2^n * n), 空间复杂度 O(n)
function findSubsequences(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  // start: 当前选择的起始位置
  function backtrack(start: number): void {
    // 长度>=2的子序列加入结果
    if (path.length >= 2) {
      result.push([...path]);
    }

    // 同层去重：记录本层已使用的数字
    const used: Set<number> = new Set();
    for (let i: number = start; i < nums.length; i++) {
      // 跳过重复数字
      if (used.has(nums[i])) continue;
      // 非递减检查：当前数字不能小于路径最后一个数字
      if (path.length > 0 && nums[i] < path[path.length - 1]) continue;

      used.add(nums[i]);
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}

// 方法2：回溯+原地去重
// 不使用额外Set，而是在同层检查当前数字是否已经出现过
// 时间复杂度 O(2^n * n^2), 空间复杂度 O(n)
function findSubsequences2(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(start: number): void {
    if (path.length >= 2) {
      result.push([...path]);
    }

    for (let i: number = start; i < nums.length; i++) {
      // 同层去重：检查start到i-1之间是否有与nums[i]相同的数字
      let isDuplicate: boolean = false;
      for (let j: number = start; j < i; j++) {
        if (nums[j] === nums[i]) {
          isDuplicate = true;
          break;
        }
      }
      if (isDuplicate) continue;

      // 非递减检查
      if (path.length > 0 && nums[i] < path[path.length - 1]) continue;

      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 040. 非递减子序列 =====");
console.log(findSubsequences([4, 6, 7, 7]));
// 期望结果: [[4,6],[4,6,7],[4,6,7,7],[4,7],[4,7,7],[6,7],[6,7,7],[7,7]]
console.log(findSubsequences([4, 4, 3, 2, 1]));
// 期望结果: [[4,4]]
console.log(findSubsequences2([4, 6, 7, 7]));
// 期望结果: 同上

export {};
