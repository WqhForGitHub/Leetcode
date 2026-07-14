// ============================================================
// 150. 二叉树中的伪回文路径
// ============================================================
// LeetCode 1457. Pseudo-Palindromic Paths in a Binary Tree
// 给你一棵二叉树，判断从根到叶路径是否为伪回文路径
// （路径上节点值可以重排成回文）。返回伪回文路径的数目。
// 伪回文条件：路径中至多有一个数字出现奇数次。
// 时间复杂度：O(n)，空间复杂度：O(h)

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

// 方法1：DFS递归+位掩码（推荐）
// 节点值范围1-9，用10位整数的每一位表示对应数字出现次数的奇偶性
// 到达叶子时，掩码中1的位数 <= 1 则为伪回文
function pseudoPalindromicPaths(root: TreeNode | null): number {
  let count = 0;

  function dfs(node: TreeNode | null, mask: number): void {
    if (node === null) return;

    // 翻转该数字对应的位
    mask ^= 1 << node.val;

    // 叶子节点：检查掩码中1的位数
    if (node.left === null && node.right === null) {
      // mask & (mask-1) == 0 表示至多1个1
      if ((mask & (mask - 1)) === 0) {
        count++;
      }
      return;
    }

    dfs(node.left, mask);
    dfs(node.right, mask);
  }

  dfs(root, 0);
  return count;
}

// 方法2：DFS递归+计数数组
// 用长度10的数组记录每个数字出现次数，到达叶子时统计奇数次数<=1
function pseudoPalindromicPathsCount(root: TreeNode | null): number {
  let count = 0;
  const freq = new Array(10).fill(0);

  function dfs(node: TreeNode | null): void {
    if (node === null) return;

    freq[node.val]++;

    if (node.left === null && node.right === null) {
      // 统计奇数次数
      let oddCount = 0;
      for (let i = 1; i <= 9; i++) {
        if (freq[i] % 2 === 1) oddCount++;
      }
      if (oddCount <= 1) count++;
    } else {
      dfs(node.left);
      dfs(node.right);
    }

    freq[node.val]--; // 回溯
  }

  dfs(root);
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 150. 二叉树中的伪回文路径 =====");

function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number);
      queue.push(node.left!);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number);
      queue.push(node.right!);
    }
    i++;
  }
  return root;
}

// 测试1: [2,3,1,3,1,null,1]
//        2
//       / \
//      3   1
//     / \   \
//    3   1   1
// 路径2->3->3: {2:1,3:2} 偶数个3, 1个2 -> 伪回文(可重排332?回文需对称,2放中间)
//   2出现1次(奇),3出现2次(偶),奇数个数为1<=1 -> 是
// 路径2->3->1: {2:1,3:1,1:1} 奇数个数3 >1 -> 否
// 路径2->1->1: {2:1,1:2} 奇数个数1 -> 是
// 共2条
const tree1 = buildTree([2, 3, 1, 3, 1, null, 1]);
console.log("测试1 位掩码:", pseudoPalindromicPaths(tree1)); // 期望 2
console.log("测试1 计数:", pseudoPalindromicPathsCount(tree1)); // 期望 2

// 测试2: [2,1,1,1,3,null,null,null,null,null,1]
//        2
//       / \
//      1   1
//     / \
//    1   3
//         \
//          1
// 路径2->1->1: {2:1,1:2} 奇1 -> 是
// 路径2->1->3->1: {2:1,1:2,3:1} 奇2(2,3) -> 否
// 路径2->1: {2:1,1:1} 奇2 -> 否
// 共1条
const tree2 = buildTree([2, 1, 1, 1, 3, null, null, null, null, null, 1]);
console.log("测试2 位掩码:", pseudoPalindromicPaths(tree2)); // 期望 1
console.log("测试2 计数:", pseudoPalindromicPathsCount(tree2)); // 期望 1

// 测试3: [9] 单节点
const tree3 = buildTree([9]);
console.log("测试3 位掩码:", pseudoPalindromicPaths(tree3)); // 期望 1
console.log("测试3 计数:", pseudoPalindromicPathsCount(tree3)); // 期望 1

export {};
