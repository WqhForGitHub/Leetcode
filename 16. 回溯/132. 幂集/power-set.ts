// ============================================================
// 132. 幂集
// ============================================================
// 面试金典 CCI 08.04. 幂集
// 给定一组不含重复元素的整数集合，返回其所有子集（幂集）。
// 时间复杂度：O(N*2^N), 空间复杂度：O(N)

// 方法1：回溯 (推荐)
// 对每个元素做"选/不选"决策，递归生成所有子集。
// 时间复杂度 O(N*2^N), 空间复杂度 O(N)
function powerSet(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  const backtrack = (start: number): void => {
    // 每个节点都对应一个子集
    result.push([...path]);
    for (let i: number = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  };

  backtrack(0);
  return result;
}

// 方法2：迭代扩展
// 从空集开始，对每个元素，把它加入已有所有子集中生成新子集。
// 时间复杂度 O(N*2^N), 空间复杂度 O(N*2^N)
function powerSetIterative(nums: number[]): number[][] {
  const result: number[][] = [[]];
  for (const num of nums) {
    const newSize: number = result.length;
    for (let i: number = 0; i < newSize; i++) {
      result.push([...result[i], num]);
    }
  }
  return result;
}

// 方法3：位运算
// 长度为 N 的集合有 2^N 个子集，用 0..2^N-1 的二进制位表示元素选取情况。
// 时间复杂度 O(N*2^N), 空间复杂度 O(N*2^N)
function powerSetBitmask(nums: number[]): number[][] {
  const n: number = nums.length;
  const total: number = 1 << n; // 2^n
  const result: number[][] = [];
  for (let mask: number = 0; mask < total; mask++) {
    const subset: number[] = [];
    for (let i: number = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) {
        subset.push(nums[i]);
      }
    }
    result.push(subset);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 132. 幂集 =====");
console.log(powerSet([1, 2, 3]));
// 期望结果: [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]] (顺序可不同)
console.log(powerSetIterative([1, 2, 3]));
console.log(powerSetBitmask([1, 2, 3]));
console.log(powerSet([])); // 期望结果: [[]]

export {};
