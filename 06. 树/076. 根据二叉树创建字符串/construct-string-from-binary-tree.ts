// ============================================================
// 076. 根据二叉树创建字符串
// ============================================================
// LeetCode 606. Construct String from Binary Tree
// 你需要采用前序遍历的方式，将一个二叉树转换成一个由括号和整数组成的字符串。
// 空节点用空括号对 "()" 表示，但不能省略影响解析的括号。
// 时间复杂度：O(n)，空间复杂度：O(h) （h为树高）

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

// 方法1：递归（推荐）
// 规则：
// 1. 左右都空：直接返回值
// 2. 左空右不空：必须保留左空括号 "()"，否则无法区分右子树
// 3. 左不空右空：只递归左子树
// 4. 左右都不空：都递归
function tree2str(root: TreeNode | null): string {
  if (root === null) return "";
  const val = root.val.toString();
  if (root.left === null && root.right === null) {
    return val;
  }
  if (root.right === null) {
    // 只有左子树，省略右子树的括号
    return val + "(" + tree2str(root.left) + ")";
  }
  // 左为空或非空都要写括号
  return val + "(" + tree2str(root.left) + ")(" + tree2str(root.right) + ")";
}

// 方法2：迭代栈
// 使用栈模拟前序遍历，遇到节点先输出值，按需输出括号
// 用 visited 集合标记节点是否已被处理过一次（用于区分第一次访问和回溯）
function tree2strIterative(root: TreeNode | null): string {
  if (root === null) return "";
  const stack: TreeNode[] = [root];
  const visited = new Set<TreeNode>();
  let result = "";
  while (stack.length > 0) {
    const node = stack[stack.length - 1];
    if (visited.has(node)) {
      // 第二次访问，输出右括号并出栈
      stack.pop();
      result += ")";
    } else {
      visited.add(node);
      result += "(" + node.val;
      // 先压右后压左（栈先入后出，先处理左）
      // 右子树为空但左子树非空时，不需要处理空右子树
      // 左子树为空但右子树非空时，需要补 "()" 占位
      if (node.left === null && node.right !== null) {
        result += "()";
      }
      if (node.right !== null) {
        stack.push(node.right);
      }
      if (node.left !== null) {
        stack.push(node.left);
      }
    }
  }
  // 去掉最外层括号
  return result.substring(1, result.length - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 076. 根据二叉树创建字符串 =====");

// 测试1: [1,2,3,4]
//      1
//     / \
//    2   3
//   /
//  4
const tree1 = new TreeNode(1);
tree1.left = new TreeNode(2);
tree1.right = new TreeNode(3);
tree1.left.left = new TreeNode(4);
console.log("递归:", tree2str(tree1)); // 期望 "1(2(4))(3)"
console.log("迭代:", tree2strIterative(tree1)); // 期望 "1(2(4))(3)"

// 测试2: [1,2,3,null,4]
//      1
//     / \
//    2   3
//     \
//      4
const tree2 = new TreeNode(1);
tree2.left = new TreeNode(2);
tree2.right = new TreeNode(3);
tree2.left.right = new TreeNode(4);
console.log("递归:", tree2str(tree2)); // 期望 "1(2()(4))(3)"
console.log("迭代:", tree2strIterative(tree2)); // 期望 "1(2()(4))(3)"

// 测试3: 单节点
const tree3 = new TreeNode(5);
console.log("递归:", tree2str(tree3)); // 期望 "5"
console.log("迭代:", tree2strIterative(tree3)); // 期望 "5"

export {};
