// ============================================================
// 042. 优美的排列
// ============================================================
// LeetCode 526. Beautiful Arrangement
// 统计1..n的排列中，对每个i，perm[i]能被i整除或i能被perm[i]整除的排列数。
// 时间复杂度：O(n!), 空间复杂度：O(n)

// 方法1：回溯+交换 (推荐)
// 通过交换生成排列，在放置每个位置时检查条件
// 时间复杂度 O(n!), 空间复杂度 O(n)
function countArrangement(n: number): number {
  // arr[i] = i（1-indexed）
  const arr: number[] = new Array(n + 1);
  for (let i: number = 1; i <= n; i++) arr[i] = i;
  let count: number = 0;

  // pos: 当前要填的位置
  function backtrack(pos: number): void {
    if (pos > n) {
      count++;
      return;
    }

    // 从pos到n中选一个数放到位置pos
    for (let i: number = pos; i <= n; i++) {
      // 交换arr[pos]和arr[i]
      [arr[pos], arr[i]] = [arr[i], arr[pos]];
      // 检查当前位置是否满足优美排列条件
      if (arr[pos] % pos === 0 || pos % arr[pos] === 0) {
        backtrack(pos + 1);
      }
      // 换回来
      [arr[pos], arr[i]] = [arr[i], arr[pos]];
    }
  }

  backtrack(1);
  return count;
}

// 方法2：回溯+used数组
// 使用used数组标记已使用的数字，逐个位置尝试放置
// 时间复杂度 O(n!), 空间复杂度 O(n)
function countArrangement2(n: number): number {
  const used: boolean[] = new Array(n + 1).fill(false);
  let count: number = 0;

  // pos: 当前要填的位置
  function backtrack(pos: number): void {
    if (pos > n) {
      count++;
      return;
    }

    // 尝试放置1到n的每个未使用数字
    for (let num: number = 1; num <= n; num++) {
      if (!used[num] && (num % pos === 0 || pos % num === 0)) {
        used[num] = true;
        backtrack(pos + 1);
        used[num] = false;
      }
    }
  }

  backtrack(1);
  return count;
}

// 方法3：状态压缩DP
// 用位掩码表示已使用的数字集合，dp[state]表示使用state中数字填满前popcount(state)个位置的方案数
// 时间复杂度 O(2^n * n), 空间复杂度 O(2^n)
function countArrangement3(n: number): number {
  const size: number = 1 << (n + 1);
  const dp: number[] = new Array(size).fill(0);
  dp[0] = 1; // 空集有1种方案

  for (let state: number = 0; state < size; state++) {
    if (dp[state] === 0) continue;

    // 计算已使用的数字个数（即下一个要填的位置）
    let pos: number = 0;
    for (let i: number = 1; i <= n; i++) {
      if (state & (1 << i)) pos++;
    }
    pos++; // 下一个要填的位置
    if (pos > n) continue;

    // 尝试放置每个未使用的数字
    for (let num: number = 1; num <= n; num++) {
      if (!(state & (1 << num)) && (num % pos === 0 || pos % num === 0)) {
        dp[state | (1 << num)] += dp[state];
      }
    }
  }

  // 返回所有n个数字都使用的状态
  return dp[(1 << (n + 1)) - 2];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 042. 优美的排列 =====");
console.log(countArrangement(2)); // 期望结果: 2
console.log(countArrangement(3)); // 期望结果: 3
console.log(countArrangement2(2)); // 期望结果: 2
console.log(countArrangement2(3)); // 期望结果: 3
console.log(countArrangement3(2)); // 期望结果: 2
console.log(countArrangement3(3)); // 期望结果: 3
console.log(countArrangement3(4)); // 期望结果: 8

export {};
