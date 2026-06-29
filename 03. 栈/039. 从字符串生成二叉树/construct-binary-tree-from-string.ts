// ============================================================
// 039. 从字符串生成二叉树
// ============================================================
// LeetCode 536. Construct Binary Tree from String
// 给定一个括号表示的字符串构造二叉树，如 "4(2(3)(1))(6(5))"。

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val: number = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 遇到数字解析为节点；遇到 '(' 把当前节点压栈并设为左子（首次）或右子；
// 遇到 ')' 弹栈回溯。
// 时间 O(n)，空间 O(n)。
function str2tree(s: string): TreeNode | null {
  if (s === "") return null;
  const stack: TreeNode[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === "-" || (ch >= "0" && ch <= "9")) {
      // 解析数字（含负号）
      let j = i;
      if (s[j] === "-") j++;
      while (j < s.length && s[j] >= "0" && s[j] <= "9") j++;
      const val = parseInt(s.slice(i, j), 10);
      const node = new TreeNode(val);
      if (stack.length > 0) {
        const parent = stack[stack.length - 1];
        if (parent.left === null) parent.left = node;
        else parent.right = node;
      }
      stack.push(node);
      i = j;
    } else if (ch === "(") {
      i++;
    } else {
      // ')'
      stack.pop();
      i++;
    }
  }
  return stack[0] ?? null;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function preorder(node: TreeNode | null): number[] {
  if (node === null) return [];
  return [node.val, ...preorder(node.left), ...preorder(node.right)];
}

function test(): void {
  console.log("测试1:", preorder(str2tree("4(2(3)(1))(6(5))")), "期望: [4,2,3,1,6,5]");
  console.log("测试2:", preorder(str2tree("4(2(3))")), "期望: [4,2,3]");
  console.log("测试3:", preorder(str2tree("-4(2(6)(3))")), "期望: [-4,2,6,3]");
}

test();

export {};
