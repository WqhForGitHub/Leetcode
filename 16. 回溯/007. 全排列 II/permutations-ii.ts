// ============================================================
// 007. 全排列 II
// ============================================================
// LeetCode 47. Permutations II
// 给定一个可包含重复数字的序列，返回所有不重复的全排列。
// 时间复杂度：O(n * n!)，最坏情况

// 方法1：排序 + 回溯 + 去重（used[i-1] 判断）（推荐）
// 先排序使相同元素相邻，回溯时用 used[i-1] 判断跳过同层重复
// 时间复杂度 O(n * n!)，空间复杂度 O(n)
function permuteUnique(nums: number[]): number[][] {
  const result: number[][] = [];
  // 排序使相同元素相邻
  nums.sort((a: number, b: number) => a - b);
  const used: boolean[] = new Array(nums.length).fill(false);
  const path: number[] = [];

  const backtrack = (): void => {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) {
        continue;
      }
      // 去重：当前元素与前一个相同，且前一个未被使用（同层）
      // used[i-1] === false 表示前一个同值元素在当前层已被回溯撤销
      // 这样保证相同元素只按顺序选一次，避免重复排列
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
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

// 方法2：计数 + 回溯
// 统计每个数字出现次数，按数字种类枚举，天然去重
// 时间复杂度 O(n * n!)，空间复杂度 O(n)
function permuteUniqueCount(nums: number[]): number[][] {
  const result: number[][] = [];
  const countMap: Map<number, number> = new Map();
  for (const num of nums) {
    countMap.set(num, (countMap.get(num) ?? 0) + 1);
  }
  // 转为数组便于遍历
  const entries: [number, number][] = [];
  countMap.forEach((cnt: number, num: number) => {
    entries.push([num, cnt]);
  });

  const path: number[] = [];

  const backtrack = (): void => {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (const [num, cnt] of entries) {
      if (cnt === 0) {
        continue;
      }
      // 使用一个 num
      path.push(num);
      countMap.set(num, cnt - 1);
      backtrack();
      // 回溯
      path.pop();
      countMap.set(num, cnt);
    }
  };

  backtrack();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 007. 全排列 II =====");
console.log(permuteUnique([1, 1, 2])); // 期望结果: [[1,1,2],[1,2,1],[2,1,1]]
console.log(permuteUnique([1, 2, 3])); // 期望结果: 6个排列
console.log(permuteUniqueCount([1, 1, 2])); // 期望结果: [[1,1,2],[1,2,1],[2,1,1]]
console.log(permuteUniqueCount([1, 2, 3])); // 期望结果: 6个排列

export {};
