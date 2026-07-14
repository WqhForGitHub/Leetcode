// ============================================================
// 123. 二叉树寻路
// ============================================================
// LeetCode 1104. Path In Zigzag Labelled Binary Tree
// 在一棵无限二叉树中，每个节点都有两个子节点。奇数层从左到右标记，
// 偶数层从右到左标记。给定标签 label，返回从根到该标签节点的路径。
// 时间复杂度：O(log n)，空间复杂度：O(log n)

// 方法1：数学位运算
// 第 level 层（从1开始）的节点范围是 [2^(level-1), 2^level - 1]
// 该层节点数为 2^(level-1)。每一层的标签和等于该层首尾之和：2^(level-1) + 2^level - 1
// 因此同一层中标签 x 的"实际位置"与"镜像位置"满足 x + mirror = 2^(level-1) + 2^level - 1
// 所以 mirror = 2^(level-1) + 2^level - 1 - x
// 从 label 向上找父节点：先求该层镜像位置，再除以2得到父节点位置，再求父节点层的镜像
function pathInZigZagTree(label: number): number[] {
  const path: number[] = [];
  let level = Math.floor(Math.log2(label)) + 1; // label 所在层（从1开始）

  while (level > 0) {
    path.push(label);
    // 当前层的首尾之和
    const sum = (1 << (level - 1)) + (1 << level) - 1;
    // 父节点 = 镜像位置的父位置 = (sum - label) / 2
    label = Math.floor((sum - label) / 2);
    level--;
  }
  path.reverse();
  return path;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 123. 二叉树寻路 =====");

// 测试1: label = 14
// 树结构（前4层）：
//       1
//     /   \
//    3     2
//   / \   / \
//  4   5 6   7
// / \ /\ /\ /\
//15 14 13 12 11 10 9 8
console.log("测试1:", pathInZigZagTree(14)); // 期望 [1,3,4,14]

// 测试2: label = 26
console.log("测试2:", pathInZigZagTree(26)); // 期望 [1,2,6,26]

// 测试3: label = 1
console.log("测试3:", pathInZigZagTree(1)); // 期望 [1]

// 测试4: label = 2
console.log("测试4:", pathInZigZagTree(2)); // 期望 [1,2]

// 测试5: label = 16
console.log("测试5:", pathInZigZagTree(16)); // 期望 [1,3,4,15,16]

export {};
