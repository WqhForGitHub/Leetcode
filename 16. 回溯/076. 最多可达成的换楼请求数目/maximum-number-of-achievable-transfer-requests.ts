// ============================================================
// 076. 最多可达成的换楼请求数目
// ============================================================
// LeetCode 1601. Maximum Number of Achievable Transfer Requests
// 给定 n 栋楼和 requests [from, to]，选择若干请求使每栋楼的净变化为 0，求最大选择数。
// 时间复杂度：O(2^m * n)，m 为请求数，n 为楼数。

// 方法1：回溯(子集枚举) (推荐)
// 对每个请求决定选/不选，维护每栋楼的净变化数组 balance。
// 处理完所有请求后，若所有 balance 均为 0 则更新答案。带剪枝。
// 时间复杂度：O(2^m * n)，空间复杂度：O(n + m)
function maximumRequests1(n: number, requests: number[][]): number {
  const m: number = requests.length;
  const balance: number[] = new Array(n).fill(0);
  let maxCount: number = 0;

  const backtrack = (idx: number, count: number): void => {
    // 剪枝：即便后续全选也无法超过当前最优
    if (count + (m - idx) <= maxCount) return;
    if (idx === m) {
      // 检查所有楼净变化是否为 0
      let valid: boolean = true;
      for (let i: number = 0; i < n; i++) {
        if (balance[i] !== 0) {
          valid = false;
          break;
        }
      }
      if (valid) maxCount = Math.max(maxCount, count);
      return;
    }
    // 选当前请求
    const from: number = requests[idx][0];
    const to: number = requests[idx][1];
    balance[from]--;
    balance[to]++;
    backtrack(idx + 1, count + 1);
    balance[from]++;
    balance[to]--;
    // 不选当前请求
    backtrack(idx + 1, count);
  };

  backtrack(0, 0);
  return maxCount;
}

// 方法2：位掩码枚举
// 枚举所有 2^m 个子集，对每个子集计算各楼净变化，若全为 0 则更新答案。
// 时间复杂度：O(2^m * (m + n))，空间复杂度：O(n)
function maximumRequests2(n: number, requests: number[][]): number {
  const m: number = requests.length;
  let maxCount: number = 0;

  for (let mask: number = 0; mask < 1 << m; mask++) {
    const balance: number[] = new Array(n).fill(0);
    let count: number = 0;
    for (let i: number = 0; i < m; i++) {
      if (mask & (1 << i)) {
        balance[requests[i][0]]--;
        balance[requests[i][1]]++;
        count++;
      }
    }
    let valid: boolean = true;
    for (let i: number = 0; i < n; i++) {
      if (balance[i] !== 0) {
        valid = false;
        break;
      }
    }
    if (valid) maxCount = Math.max(maxCount, count);
  }

  return maxCount;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 076. 最多可达成的换楼请求数目 =====");
// 楼 3 仅出现在 [3,2]（作为 from），该请求必须排除；其余最大平衡子集大小为 4
console.log(
  maximumRequests1(5, [
    [0, 1],
    [1, 0],
    [0, 1],
    [1, 2],
    [2, 1],
    [3, 2],
  ]),
); // 期望结果: 4
console.log(
  maximumRequests1(3, [
    [0, 0],
    [1, 2],
    [2, 1],
  ]),
); // 期望结果: 3
console.log(
  maximumRequests1(4, [
    [0, 3],
    [3, 1],
    [1, 2],
    [2, 0],
  ]),
); // 期望结果: 4
console.log(
  maximumRequests2(5, [
    [0, 1],
    [1, 0],
    [0, 1],
    [1, 2],
    [2, 1],
    [3, 2],
  ]),
); // 期望结果: 4
console.log(
  maximumRequests2(3, [
    [0, 0],
    [1, 2],
    [2, 1],
  ]),
); // 期望结果: 3
console.log(
  maximumRequests2(4, [
    [0, 3],
    [3, 1],
    [1, 2],
    [2, 0],
  ]),
); // 期望结果: 4

export {};
