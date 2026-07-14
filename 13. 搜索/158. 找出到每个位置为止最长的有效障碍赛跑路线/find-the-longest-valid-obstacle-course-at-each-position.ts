// ============================================================
// 158. 找出到每个位置为止最长的有效障碍赛跑路线
// ============================================================
// LeetCode 1964. Find the Longest Valid Obstacle Course at Each Position
// 对每个位置 i，返回以 obstacles[i] 结尾的最长非递减子序列长度。

// 方法1：二分查找 + 贪心（O(n log n)）
function longestObstacleCourseAtEachPosition(obstacles: number[]): number[] {
  const n = obstacles.length;
  const result: number[] = new Array(n);
  // tails[i] = 长度为 i+1 的子序列的最小尾元素
  const tails: number[] = [];
  for (let i = 0; i < n; i++) {
    const h = obstacles[i];
    // 找第一个 > h 的位置（非递减，用上界）
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (tails[mid] <= h) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    if (lo === tails.length) {
      tails.push(h);
    } else {
      tails[lo] = h;
    }
    result[i] = lo + 1;
  }
  return result;
}

// 方法2：二分查找（左边界变体）
function longestObstacleCourseAtEachPositionAlt(obstacles: number[]): number[] {
  const n = obstacles.length;
  const result: number[] = [];
  const stack: number[] = [];
  for (let i = 0; i < n; i++) {
    let lo = 0;
    let hi = stack.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (stack[mid] > obstacles[i]) hi = mid;
      else lo = mid + 1;
    }
    result.push(lo + 1);
    if (lo === stack.length) stack.push(obstacles[i]);
    else stack[lo] = obstacles[i];
  }
  return result;
}

// 方法3：动态规划（O(n²)）
function longestObstacleCourseAtEachPositionDP(obstacles: number[]): number[] {
  const n = obstacles.length;
  const dp: number[] = new Array(n).fill(1);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (obstacles[j] <= obstacles[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return dp;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 158. 找出到每个位置为止最长的有效障碍赛跑路线 =====");
console.log("二分 [1,2,3,2]:", longestObstacleCourseAtEachPosition([1, 2, 3, 2])); // [1,2,3,3]
console.log("二分 [2,2,1]:", longestObstacleCourseAtEachPosition([2, 2, 1])); // [1,2,1]
console.log("二分 [3,1,5,6,4,2]:", longestObstacleCourseAtEachPosition([3, 1, 5, 6, 4, 2])); // [1,1,2,3,2,2]

export {};
