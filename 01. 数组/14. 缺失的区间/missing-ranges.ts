// ============================================================
// 14. 缺失的区间
// ============================================================
// LeetCode 163. Missing Ranges
// 给定排序整数数组 nums、下界 lower、上界 upper，返回缺失的区间。
// 例如 nums=[0,1,3,50,75], lower=0, upper=99 -> ["2","4->49","51->74","76->99"]
// 时间复杂度：O(n)，空间复杂度：O(1)（不计输出空间）

// 方法1：遍历处理边界（推荐）
// 将 lower-1 和 upper+1 作为哨兵，统一处理相邻两个数之间的缺失区间
function findMissingRanges(
  nums: number[],
  lower: number,
  upper: number,
): string[] {
  const result: string[] = [];
  // 引入哨兵 prev，初始为 lower - 1（注意用 Number 防止溢出问题，这里用普通 number 即可）
  let prev = lower - 1;

  // 将 upper+1 也作为虚拟的最后一个元素处理
  for (let i = 0; i <= nums.length; i++) {
    const curr = i < nums.length ? nums[i] : upper + 1;
    // curr 与 prev 之间相差大于 1 时，存在缺失区间
    if (curr - prev >= 2) {
      if (curr - prev === 2) {
        // 仅缺失一个数
        result.push(`${prev + 1}`);
      } else {
        // 缺失一段区间
        result.push(`${prev + 1}->${curr - 1}`);
      }
    }
    prev = curr;
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 14. 缺失的区间 =====");
console.log("描述:", findMissingRanges([0, 1, 3, 50, 75], 0, 99)); // 期望结果: ["2","4->49","51->74","76->99"]
console.log("描述:", findMissingRanges([], 1, 1)); // 期望结果: ["1"]
console.log("描述:", findMissingRanges([], -3, -1)); // 期望结果: ["-3->-1"]
console.log("描述:", findMissingRanges([-1], -1, -1)); // 期望结果: []
console.log("描述:", findMissingRanges([-1], -2, -1)); // 期望结果: ["-2"]

export {};
