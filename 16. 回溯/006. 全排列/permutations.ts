// ============================================================
// 006. 全排列
// ============================================================
// LeetCode 46. Permutations
// 给定一个没有重复数字的数组，返回其所有可能的全排列。
// 时间复杂度：O(n * n!)，共 n! 个排列，每个构造需 O(n)

// 方法1：回溯 + used 数组（推荐）
// 使用 used 数组标记已使用的元素，回溯构造排列
// 时间复杂度 O(n * n!)，空间复杂度 O(n) 递归栈 + used 数组
function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const used: boolean[] = new Array(nums.length).fill(false);
  const path: number[] = [];

  const backtrack = (): void => {
    // 当路径长度等于数组长度，收集一个排列
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) {
        continue;
      }
      used[i] = true;
      path.push(nums[i]);
      backtrack();
      path.pop();
      used[i] = false;
    }
  };

  backtrack();
  return result;
}

// 方法2：交换法回溯
// 通过交换元素原地生成排列，无需额外 used 数组
// 时间复杂度 O(n * n!)，空间复杂度 O(n) 递归栈
function permuteSwap(nums: number[]): number[][] {
  const result: number[][] = [];

  const backtrack = (first: number): void => {
    // 当 first 到达末尾，收集当前排列
    if (first === nums.length) {
      result.push([...nums]);
      return;
    }
    for (let i = first; i < nums.length; i++) {
      // 将第 i 个元素交换到 first 位置
      [nums[first], nums[i]] = [nums[i], nums[first]];
      backtrack(first + 1);
      // 回溯，恢复交换
      [nums[first], nums[i]] = [nums[i], nums[first]];
    }
  };

  backtrack(0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 006. 全排列 =====");
console.log(permute([1, 2, 3])); // 期望结果: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,2,1],[3,1,2]]
console.log(permute([0, 1])); // 期望结果: [[0,1],[1,0]]
console.log(permute([1])); // 期望结果: [[1]]
console.log(permuteSwap([1, 2, 3])); // 期望结果: 6个排列
console.log(permuteSwap([0, 1])); // 期望结果: [[0,1],[1,0]]

export {};
