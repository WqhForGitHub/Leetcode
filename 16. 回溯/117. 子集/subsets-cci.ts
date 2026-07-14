// ============================================================
// 117. 子集
// ============================================================
// 面试金典 08.04 / LeetCode 78. Subsets
// 给定一组不含重复元素的整数，返回所有可能的子集（幂集）。

// 时间复杂度：O(n * 2^n)
// 空间复杂度：O(n) 递归栈

// 方法1：回溯
// 经典选/不选回溯，每层决定是否把当前元素加入子集。
// 时间复杂度 O(n * 2^n), 空间复杂度 O(n)
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(start: number): void {
    result.push([...path]); // 收集每个节点（包括空集）
    for (let i: number = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}

// 方法2：迭代扩展
// 从空集开始，每加入一个元素，把它追加到所有已有子集生成新子集。
// 时间复杂度 O(n * 2^n), 空间复杂度 O(n * 2^n)
function subsets2(nums: number[]): number[][] {
  const result: number[][] = [[]];
  for (const num of nums) {
    const size: number = result.length;
    for (let i: number = 0; i < size; i++) {
      result.push([...result[i], num]);
    }
  }
  return result;
}

// 方法3：位运算
// 用 0..2^n-1 的二进制位表示选/不选，直接构造子集。
// 时间复杂度 O(n * 2^n), 空间复杂度 O(n * 2^n)
function subsets3(nums: number[]): number[][] {
  const n: number = nums.length;
  const total: number = 1 << n;
  const result: number[][] = [];
  for (let mask: number = 0; mask < total; mask++) {
    const subset: number[] = [];
    for (let i: number = 0; i < n; i++) {
      if ((mask >> i) & 1) subset.push(nums[i]);
    }
    result.push(subset);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 117. 子集 =====");
console.log(subsets([1, 2, 3]));
// 期望: [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]] (顺序可不同)
console.log(subsets2([1, 2, 3]));
console.log(subsets3([1, 2, 3]));

export {};
