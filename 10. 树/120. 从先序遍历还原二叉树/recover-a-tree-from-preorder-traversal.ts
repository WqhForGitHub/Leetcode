// ============================================================
// 120. 从先序遍历还原二叉树
// ============================================================
// LeetCode 1028. Recover a Tree From Preorder Traversal
// 我们从二叉树的根节点 root 开始进行深度优先搜索，在遍历中的每个节点处，
// 输出 D 条短横线（其中 D 是该节点的深度），然后输出该节点的值。
// 给定这样的输出字符串 S，还原树并返回其根节点 root。
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

// 方法1：迭代栈（推荐）
// 解析字符串得到 (深度, 值) 对
// 用栈维护从根到当前节点的路径，栈大小等于当前深度
// 新节点深度 = 栈大小 -> 是栈顶的左孩子
// 新节点深度 < 栈大小 -> 弹栈直到栈大小等于深度，是栈顶的右孩子
function recoverFromPreorder(s: string): TreeNode | null {
  const stack: TreeNode[] = [];
  let i = 0;
  while (i < s.length) {
    // 解析深度（连续的 '-'）
    let depth = 0;
    while (i < s.length && s[i] === "-") {
      depth++;
      i++;
    }
    // 解析数值
    let val = 0;
    while (i < s.length && s[i] >= "0" && s[i] <= "9") {
      val = val * 10 + (s.charCodeAt(i) - "0".charCodeAt(0));
      i++;
    }

    const node = new TreeNode(val);

    // 弹栈直到栈大小等于深度（栈顶是新节点的父节点）
    while (stack.length > depth) {
      stack.pop();
    }

    if (stack.length > 0) {
      const parent = stack[stack.length - 1];
      // 优先作为左孩子，左孩子已存在则作为右孩子
      if (parent.left === null) {
        parent.left = node;
      } else {
        parent.right = node;
      }
    }

    stack.push(node);
  }

  return stack.length > 0 ? stack[0] : null;
}

// 方法2：递归
// 解析整个字符串为 (深度, 值) 列表，再递归构造
let tokens: { depth: number; val: number }[];
let tokenIdx: number;

function recoverFromPreorderRecursive(s: string): TreeNode | null {
  // 解析字符串
  tokens = [];
  let i = 0;
  while (i < s.length) {
    let depth = 0;
    while (i < s.length && s[i] === "-") {
      depth++;
      i++;
    }
    let val = 0;
    while (i < s.length && s[i] >= "0" && s[i] <= "9") {
      val = val * 10 + (s.charCodeAt(i) - "0".charCodeAt(0));
      i++;
    }
    tokens.push({ depth, val });
  }

  tokenIdx = 0;
  return build(0);
}

function build(expectedDepth: number): TreeNode | null {
  if (tokenIdx >= tokens.length) return null;
  if (tokens[tokenIdx].depth !== expectedDepth) return null;

  const { val } = tokens[tokenIdx];
  tokenIdx++;
  const node = new TreeNode(val);
  node.left = build(expectedDepth + 1);
  node.right = build(expectedDepth + 1);
  return node;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 120. 从先序遍历还原二叉树 =====");

// 辅助函数：树转数组（层序）
function treeToArray(root: TreeNode | null): (number | null)[] {
  if (root === null) return [];
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// 测试1: S = "1-2--3--4-5--6--7"
//       1
//      / \
//     2   5
//    / \  / \
//   3  4 6  7
console.log("测试1 迭代:", treeToArray(recoverFromPreorder("1-2--3--4-5--6--7")));
// 期望 [1,2,5,3,4,6,7]
console.log("测试1 递归:", treeToArray(recoverFromPreorderRecursive("1-2--3--4-5--6--7")));

// 测试2: S = "1-2--3---4-5--6---7"
//        1
//       / \
//      2   5
//     /   /
//    3   6
//   /
//  4
console.log("测试2 迭代:", treeToArray(recoverFromPreorder("1-2--3---4-5--6---7")));
console.log("测试2 递归:", treeToArray(recoverFromPreorderRecursive("1-2--3---4-5--6---7")));

// 测试3: S = "1-401--349---90--88"
//        1
//       /
//     401
//     /  \
//   349   88
//   /
//  90
console.log("测试3 迭代:", treeToArray(recoverFromPreorder("1-401--349---90--88")));
// 期望 [1,401,null,349,88,90]
console.log("测试3 递归:", treeToArray(recoverFromPreorderRecursive("1-401--349---90--88")));

// 测试4: 单节点 S = "5"
console.log("测试4 迭代:", treeToArray(recoverFromPreorder("5"))); // 期望 [5]
console.log("测试4 递归:", treeToArray(recoverFromPreorderRecursive("5")));

export {};
