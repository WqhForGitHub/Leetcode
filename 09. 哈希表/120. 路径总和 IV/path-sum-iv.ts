// ============================================================
// 120. 路径总和 IV
// ============================================================
// LeetCode 666. Path Sum IV
// 用一个三位数字数组表示二叉树：百位=深度，十位=位置，个位=值。
// 计算所有从根到叶子路径之和的总和。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 思路：哈希表存节点（深度,位置）-> 值，DFS 累加叶子路径
function pathSum(nums: number[]): number {
  // (depth, pos) -> value
  const tree = new Map<string, number>();
  for (const num of nums) {
    const depth = Math.floor(num / 100);
    const pos = Math.floor((num % 100) / 10);
    const val = num % 10;
    tree.set(depth + "," + pos, val);
  }

  let total = 0;

  // DFS：depth, pos, 当前路径和
  const dfs = (depth: number, pos: number, sum: number): void => {
    const key = depth + "," + pos;
    if (!tree.has(key)) return;
    const val = tree.get(key)!;
    const newSum = sum + val;

    // 子节点位置：左子 = 2*pos-1, 右子 = 2*pos（在下一层）
    const leftKey = depth + 1 + "," + (2 * pos - 1);
    const rightKey = depth + 1 + "," + 2 * pos;

    const hasLeft = tree.has(leftKey);
    const hasRight = tree.has(rightKey);

    if (!hasLeft && !hasRight) {
      // 叶子节点
      total += newSum;
      return;
    }
    if (hasLeft) dfs(depth + 1, 2 * pos - 1, newSum);
    if (hasRight) dfs(depth + 1, 2 * pos, newSum);
  };

  if (nums.length > 0) {
    dfs(1, 1, 0);
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 120. 路径总和 IV =====");
// 测试 1: [113,215,221] -> 树形：
//        3
//       / \
//      5   1
// 路径和 = (3+5) + (3+1) = 12
console.log(pathSum([113, 215, 221])); // 期望: 12
// 测试 2: [113,221]
//        3
//         \
//          1
// 路径和 = 3+1 = 4
console.log(pathSum([113, 221])); // 期望: 4
// 测试 3: 更深的树
console.log(pathSum([113, 215, 221, 314, 325])); // 期望: 3+5+4 + 3+5+5 + 3+1 = 12 + 13 + 4 = 29? 实际值待验证

export {};
