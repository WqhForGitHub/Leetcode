// ============================================================
// 122. 全排列 II
// ============================================================
// 面试金典 08.08 / LeetCode 47. Permutations II
// 给定含重复数字的数组，返回所有不重复的全排列。

// 时间复杂度：O(n * n!)
// 空间复杂度：O(n) 递归栈

// 方法1：排序 + 回溯 + 去重
// 排序后，同层中若当前元素与前一个相同且前一个未使用，则跳过。
// 时间复杂度 O(n * n!), 空间复杂度 O(n)
function permuteUnique(nums: number[]): number[][] {
  const n: number = nums.length;
  const sorted: number[] = [...nums].sort((a, b) => a - b);
  const result: number[][] = [];
  const path: number[] = [];
  const used: boolean[] = new Array(n).fill(false);

  function backtrack(): void {
    if (path.length === n) {
      result.push([...path]);
      return;
    }
    for (let i: number = 0; i < n; i++) {
      if (used[i]) continue;
      // 去重：相同元素，前一个未使用时跳过当前（保证同层只选第一个）
      if (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      path.push(sorted[i]);
      backtrack();
      path.pop();
      used[i] = false;
    }
  }

  backtrack();
  return result;
}

// 方法2：计数 + 回溯
// 统计每个数字频次，按不同数字回溯，避免排序去重逻辑。
// 时间复杂度 O(n * n!), 空间复杂度 O(n)
function permuteUnique2(nums: number[]): number[][] {
  const countMap: Map<number, number> = new Map();
  for (const x of nums) countMap.set(x, (countMap.get(x) ?? 0) + 1);
  const keys: number[] = Array.from(countMap.keys());

  const result: number[][] = [];
  const path: number[] = [];
  const n: number = nums.length;

  function backtrack(): void {
    if (path.length === n) {
      result.push([...path]);
      return;
    }
    for (const k of keys) {
      const cnt: number = countMap.get(k)!;
      if (cnt <= 0) continue;
      countMap.set(k, cnt - 1);
      path.push(k);
      backtrack();
      path.pop();
      countMap.set(k, cnt);
    }
  }

  backtrack();
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 122. 全排列 II =====");
console.log(permuteUnique([1, 1, 2]));
// 期望: [[1,1,2],[1,2,1],[2,1,1]]
console.log(permuteUnique2([1, 1, 2]));
console.log(permuteUnique([1, 2, 3]));

export {};
