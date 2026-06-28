// ============================================================
// 089. 非递减子序列
// ============================================================
// LeetCode 491. Non-decreasing Subsequences
// 给定整数数组，找出所有不同的非递减子序列（长度至少为 2）
// 思路：回溯枚举所有子序列，每层用哈希集合去重避免相同元素重复选取
// 时间复杂度：O(2^n)，空间复杂度：O(n)

function findSubsequences(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  const backtrack = (start: number): void => {
    // 长度 >= 2 的非递减子序列加入结果
    if (path.length >= 2) {
      result.push([...path]);
    }

    // 哈希集合：记录本层已使用的元素值，避免同一层选重复值导致重复子序列
    const used = new Set<number>();

    for (let i = start; i < nums.length; i++) {
      // 跳过不满足非递减条件的元素
      if (path.length > 0 && nums[i] < path[path.length - 1]) {
        continue;
      }
      // 跳过本层已使用的相同值
      if (used.has(nums[i])) {
        continue;
      }

      used.add(nums[i]);
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  };

  backtrack(0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 089. 非递减子序列 =====");
console.log(findSubsequences([4, 6, 7, 7]));
// 期望输出: [[4,6],[4,6,7],[4,6,7,7],[4,7],[4,7,7],[6,7],[6,7,7],[7,7]]
console.log(findSubsequences([4, 4, 3, 2, 1])); // 期望输出: [[4,4]]
console.log(findSubsequences([1, 2, 3])); // 期望输出: [[1,2],[1,2,3],[1,3],[2,3]]

export {};
