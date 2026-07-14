// LC2296. 跳跃游戏 VIII
// 给定 nums 和 k, 从 i 跳到 j 需满足 i < j <= i + k 且 i < l < j 有 nums[l] < nums[i]
// 求从 0 到 n-1 的最大和
// 单调栈 + 记忆化 DFS

type NumArr = number[];

// 方法1: 单调栈建图 + 记忆化 DFS
function maxJump1(nums: NumArr, k: number): number {
  const n = nums.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  // 单调栈: 找到 i 之后第一个不小于 nums[i] 的位置, 中间更小的可直接跳
  const stack: number[] = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      const j = stack.pop()!;
      adj[j].push(i);
    }
    if (stack.length) {
      // 栈顶元素可以跳到 i (中间均小于栈顶)
      adj[stack[stack.length - 1]].push(i);
    }
    stack.push(i);
  }
  const memo = new Array(n).fill(-Infinity);
  memo[n - 1] = nums[n - 1];
  function dfs(i: number): number {
    if (memo[i] !== -Infinity) return memo[i];
    let best = -Infinity;
    for (const j of adj[i]) {
      if (j <= i + k) best = Math.max(best, dfs(j));
    }
    memo[i] = nums[i] + best;
    return memo[i];
  }
  return dfs(0);
}

// 方法2: 单调栈 + 区间 DP 枚举
function maxJump2(nums: NumArr, k: number): number {
  const n = nums.length;
  const dp = new Array(n).fill(-Infinity);
  dp[0] = nums[0];
  // nextGreater[i]: i 之后第一个 >= nums[i] 的位置
  const ng = new Array(n).fill(n);
  const st: number[] = [];
  for (let i = n - 1; i >= 0; i--) {
    while (st.length && nums[st[st.length - 1]] < nums[i]) st.pop();
    ng[i] = st.length ? st[st.length - 1] : n;
    st.push(i);
  }
  for (let i = 0; i < n; i++) {
    if (dp[i] === -Infinity) continue;
    let j = i + 1;
    while (j <= Math.min(i + k, n - 1) && j < ng[i]) {
      dp[j] = Math.max(dp[j], dp[i] + nums[j]);
      j++;
    }
    if (ng[i] <= Math.min(i + k, n - 1)) {
      dp[ng[i]] = Math.max(dp[ng[i]], dp[i] + nums[ng[i]]);
    }
  }
  return dp[n - 1];
}

// 测试
function test(): void {
  console.log(maxJump1([1, 3, 6, 4, 2], 2)); // 7
  console.log(maxJump2([1, 3, 6, 4, 2], 2)); // 7
}
test();

export {};
