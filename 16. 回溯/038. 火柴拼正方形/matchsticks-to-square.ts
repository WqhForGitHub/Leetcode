// ============================================================
// 038. 火柴拼正方形
// ============================================================
// LeetCode 473. Matchsticks to Square
// 给定火柴数组，判断是否能用所有火柴拼成正方形（每根火柴用一次，不可折断）。
// 时间复杂度：O(4^n), 空间复杂度：O(n)

// 方法1：回溯(4条边) (推荐)
// 将每根火柴放到4条边之一，回溯搜索所有可能
// 时间复杂度 O(4^n), 空间复杂度 O(n)
function makesquare(matchsticks: number[]): boolean {
  const sum: number = matchsticks.reduce((a: number, b: number) => a + b, 0);
  if (sum % 4 !== 0) return false;
  const side: number = sum / 4;
  const sides: number[] = [0, 0, 0, 0];

  // index: 当前要放置的火柴下标
  function backtrack(index: number): boolean {
    // 所有火柴都放完，检查是否每条边都等于side
    if (index === matchsticks.length) {
      return sides[0] === side && sides[1] === side && sides[2] === side;
    }

    // 尝试将当前火柴放到4条边之一
    for (let i: number = 0; i < 4; i++) {
      if (sides[i] + matchsticks[index] > side) continue; // 超出边长，剪枝
      sides[i] += matchsticks[index];
      if (backtrack(index + 1)) return true;
      sides[i] -= matchsticks[index]; // 回溯
    }
    return false;
  }

  return backtrack(0);
}

// 方法2：回溯+排序优化+剪枝
// 降序排序后大数先放，更容易触发剪枝；跳过相同边长的重复尝试
// 时间复杂度 O(4^n)（实际更快）, 空间复杂度 O(n)
function makesquare2(matchsticks: number[]): boolean {
  const sum: number = matchsticks.reduce((a: number, b: number) => a + b, 0);
  if (sum % 4 !== 0) return false;
  const side: number = sum / 4;

  // 降序排序：大数先放，更容易触发剪枝
  matchsticks.sort((a: number, b: number) => b - a);
  // 最大的火柴超过边长，直接返回false
  if (matchsticks[0] > side) return false;

  const sides: number[] = [0, 0, 0, 0];

  function backtrack(index: number): boolean {
    if (index === matchsticks.length) return true;

    for (let i: number = 0; i < 4; i++) {
      if (sides[i] + matchsticks[index] > side) continue;
      // 去重优化：如果当前边和前面的边长度相同，跳过（避免重复搜索）
      if (i > 0 && sides[i] === sides[i - 1]) continue;

      sides[i] += matchsticks[index];
      if (backtrack(index + 1)) return true;
      sides[i] -= matchsticks[index];
    }
    return false;
  }

  return backtrack(0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 038. 火柴拼正方形 =====");
console.log(makesquare([1, 1, 2, 2, 2])); // 期望结果: true
console.log(makesquare([3, 3, 3, 3, 4])); // 期望结果: false
console.log(makesquare2([1, 1, 2, 2, 2])); // 期望结果: true
console.log(makesquare2([3, 3, 3, 3, 4])); // 期望结果: false
console.log(makesquare2([5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3])); // 期望结果: true

export {};
