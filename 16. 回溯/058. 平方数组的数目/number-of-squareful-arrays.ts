// ============================================================
// 058. 平方数组的数目
// ============================================================
// LeetCode 996. Number of Squareful Arrays
// 给定数组，求所有相邻两数之和均为完全平方数的排列数目。
// 时间复杂度：O(N!), 空间复杂度：O(N)

// 方法1：回溯 + 排序去重 (推荐)
// 排序后在同一层跳过重复元素，避免重复排列
// 时间复杂度 O(N!), 空间复杂度 O(N)
function numSquarefulPerms(nums: number[]): number {
  const n = nums.length;
  nums.sort((a, b) => a - b);
  const used: boolean[] = new Array(n).fill(false);
  let count = 0;

  const isSquare = (x: number): boolean => {
    if (x < 0) return false;
    const r = Math.floor(Math.sqrt(x));
    return r * r === x;
  };

  const backtrack = (prev: number, picked: number): void => {
    if (picked === n) {
      count++;
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      // 同层去重：与前一个未使用的相同元素相同则跳过
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
      // 第一个元素无需检查平方条件
      if (picked === 0 || isSquare(prev + nums[i])) {
        used[i] = true;
        backtrack(nums[i], picked + 1);
        used[i] = false;
      }
    }
  };

  backtrack(0, 0);
  return count;
}

// 方法2：回溯 + 图论 (Hamilton 路径)
// 将每个数作为节点，相邻和为完全平方数则连边
// 在图中找所有不同的 Hamilton 路径，仍需对相同值节点去重
// 时间复杂度 O(N^2 * 2^N) 或 O(N!), 空间复杂度 O(N^2)
function numSquarefulPerms2(nums: number[]): number {
  const n = nums.length;
  nums.sort((a, b) => a - b);

  const isSquare = (x: number): boolean => {
    if (x < 0) return false;
    const r = Math.floor(Math.sqrt(x));
    return r * r === x;
  };

  // 邻接表
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isSquare(nums[i] + nums[j])) {
        adj[i].push(j);
        adj[j].push(i);
      }
    }
  }

  const visited: boolean[] = new Array(n).fill(false);
  let count = 0;

  const dfs = (prev: number, depth: number): void => {
    if (depth === n) {
      count++;
      return;
    }
    for (let i = 0; i < n; i++) {
      if (visited[i]) continue;
      // 同值去重
      if (i > 0 && nums[i] === nums[i - 1] && !visited[i - 1]) continue;
      // 第一节点不检查边；后续需检查与 prev 是否相连
      if (depth === 0 || adj[prev].includes(i)) {
        visited[i] = true;
        dfs(i, depth + 1);
        visited[i] = false;
      }
    }
  };

  dfs(-1, 0);
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 058. 平方数组的数目 =====");
console.log(numSquarefulPerms([1, 17, 8])); // 期望结果: 2
console.log(numSquarefulPerms([2, 2, 2])); // 期望结果: 1
console.log(numSquarefulPerms2([1, 17, 8])); // 期望结果: 2
console.log(numSquarefulPerms2([2, 2, 2])); // 期望结果: 1

export {};
