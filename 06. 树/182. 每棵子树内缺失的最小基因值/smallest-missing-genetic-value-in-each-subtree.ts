// ============================================================
// 182. 每棵子树内缺失的最小基因值
// ============================================================
// LeetCode 2003. Smallest Missing Genetic Value in Each Subtree
// 给定一棵树（用 parents 数组表示）和基因值数组 nums，
// 返回数组 ans，其中 ans[i] 是以节点 i 为根的子树中缺失的最小正整数基因值。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：DFS+集合合并（推荐）
// 关键观察：
// 1. ans[i] >= 1 总是成立
// 2. 若子树中不包含基因值 1，则 ans[i] = 1
// 3. 只有包含基因值 1 的子树，ans[i] 可能 > 1
// 4. 基因值 1 所在节点到根的路径上的节点，其 ans 可能 > 1
// 5. 其他节点的 ans 都是 1
// 优化：只需处理从基因值1所在节点到根的路径
function smallestMissingValueSubtree(
  parents: number[],
  nums: number[]
): number[] {
  const n = parents.length;
  // 建邻接表
  const children: number[][] = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) {
    children[parents[i]].push(i);
  }

  const ans: number[] = new Array(n).fill(1);

  // 找到基因值为 1 的节点
  let oneNode = -1;
  for (let i = 0; i < n; i++) {
    if (nums[i] === 1) {
      oneNode = i;
      break;
    }
  }

  // 若没有基因值 1，则所有节点 ans = 1
  if (oneNode === -1) {
    return ans;
  }

  // 从 oneNode 向上遍历到根，依次处理路径上的节点
  const visited = new Set<number>(); // 记录已访问的基因值
  let miss = 1; // 当前缺失的最小值

  let cur = oneNode;
  while (cur !== -1) {
    // DFS 收集 cur 子树中所有基因值（跳过已访问的子树）
    dfsCollect(cur, cur);
    // 更新 miss
    while (visited.has(miss)) {
      miss++;
    }
    ans[cur] = miss;
    // 向上移动到父节点
    cur = parents[cur];
  }

  return ans;

  function dfsCollect(node: number, stop: number): void {
    if (visited.has(nums[node])) {
      // 已访问，跳过（但需继续处理孩子？不，如果 node 的值已访问，
      // 说明这个子树之前处理过，可以跳过整个子树）
      // 注意：这里需要谨慎，只有当 node 是从路径节点出发才完整遍历
    }
    if (!visited.has(nums[node])) {
      visited.add(nums[node]);
      for (const child of children[node]) {
        // 避免回到 stop 之上的路径节点（它们会被单独处理）
        dfsCollect(child, stop);
      }
    }
  }
}

// 方法2：暴力DFS（用于验证，O(n^2)）
function smallestMissingValueSubtreeBruteForce(
  parents: number[],
  nums: number[]
): number[] {
  const n = parents.length;
  const children: number[][] = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) {
    children[parents[i]].push(i);
  }

  const ans: number[] = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    const values = new Set<number>();
    collect(i);
    let miss = 1;
    while (values.has(miss)) miss++;
    ans[i] = miss;

    function collect(node: number): void {
      values.add(nums[node]);
      for (const child of children[node]) {
        collect(child);
      }
    }
  }

  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 182. 每棵子树内缺失的最小基因值 =====");

// 测试1:
// parents = [-1,0,0,1,1,2,2]
// nums = [1,2,3,4,5,6,7]
// 树:
//       0(1)
//      / \
//     1(2) 2(3)
//    / \  / \
//   3(4)4(5) 5(6) 6(7)
// 子树0包含所有1-7，缺失8 -> ans[0]=8
// 子树1包含2,4,5，缺失1 -> ans[1]=1
// 子树2包含3,6,7，缺失1 -> ans[2]=1
// ...
const parents1 = [-1, 0, 0, 1, 1, 2, 2];
const nums1 = [1, 2, 3, 4, 5, 6, 7];
console.log("测试1 优化法:", smallestMissingValueSubtree(parents1, nums1));
console.log("测试1 暴力法:", smallestMissingValueSubtreeBruteForce(parents1, nums1));
// 期望 [8,1,1,1,1,1,1]

// 测试2:
// parents = [-1,0,1,0,3,3]
// nums = [5,4,6,2,1,3]
// 树:
//       0(5)
//      / \
//     1(4) 3(2)
//     |    / \
//     2(6) 4(1) 5(3)
const parents2 = [-1, 0, 1, 0, 3, 3];
const nums2 = [5, 4, 6, 2, 1, 3];
console.log("测试2 优化法:", smallestMissingValueSubtree(parents2, nums2));
console.log("测试2 暴力法:", smallestMissingValueSubtreeBruteForce(parents2, nums2));
// 期望 [7,1,1,4,2,1]
// 子树0: {5,4,6,2,1,3} 缺7 -> 7
// 子树1: {4,6} 缺1 -> 1
// 子树2: {6} 缺1 -> 1
// 子树3: {2,1,3} 缺4 -> 4
// 子树4: {1} 缺2 -> 2
// 子树5: {3} 缺1 -> 1

// 测试3: 无基因值1
// parents = [-1,0]
// nums = [2,3]
console.log("测试3 优化法:", smallestMissingValueSubtree([-1, 0], [2, 3]));
console.log("测试3 暴力法:", smallestMissingValueSubtreeBruteForce([-1, 0], [2, 3]));
// 期望 [1,1]

export {};
