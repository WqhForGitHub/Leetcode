// ============================================================
// 004. 全排列 II
// ============================================================
// LeetCode 47. Permutations II
// 给定可包含重复数字的集合 nums，返回所有不重复的全排列。

// 方法1：回溯 + 排序去重（推荐，时间 O(n!)，空间 O(n) 递归栈）
function permuteUnique(nums: number[]): number[][] {
  const result: number[][] = [];
  const n = nums.length;
  nums.sort((a, b) => a - b);
  const used: boolean[] = new Array(n).fill(false);
  const path: number[] = [];

  const backtrack = (): void => {
    if (path.length === n) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < n; i++) {
      // 已使用跳过
      if (used[i]) continue;
      // 同层去重：当前元素与前一个相同，且前一个未使用（同层中已被撤销）
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;

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

// 方法2：回溯 + 计数 Map（时间 O(n!)，空间 O(n)）
function permuteUnique2(nums: number[]): number[][] {
  const result: number[][] = [];
  const counter = new Map<number, number>();
  for (const num of nums) {
    counter.set(num, (counter.get(num) ?? 0) + 1);
  }

  const path: number[] = [];
  const n = nums.length;

  const backtrack = (): void => {
    if (path.length === n) {
      result.push([...path]);
      return;
    }
    for (const [num, count] of counter) {
      if (count <= 0) continue;
      counter.set(num, count - 1);
      path.push(num);
      backtrack();
      path.pop();
      counter.set(num, count);
    }
  };

  backtrack();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 004. 全排列 II =====");
console.log("方法1:", permuteUnique([1, 1, 2])); // 期望: [[1,1,2],[1,2,1],[2,1,1]]
console.log("方法1:", permuteUnique([1, 2, 3])); // 期望: 6 种排列
console.log("方法2:", permuteUnique2([1, 1, 2])); // 期望: [[1,1,2],[1,2,1],[2,1,1]]
console.log("方法2:", permuteUnique2([1, 2, 3])); // 期望: 6 种排列

export {};
