// ============================================================
// 064. 从字符串生成二叉树
// ============================================================
// LeetCode 536. Construct Binary Tree from String
// 你需要根据一个表示二叉树的字符串构建二叉树，字符串格式如 "4(2(3)(1))(6(5))"。
// 时间复杂度：O(n)，空间复杂度：O(n)

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

// 方法1：递归解析（推荐）
// 找到根节点值后，定位左右子树的括号范围递归构建
function str2tree(s: string): TreeNode | null {
  if (s.length === 0) return null;
  let index = 0;
  function parse(): TreeNode | null {
    if (index >= s.length) return null;
    // 解析数字（可能带负号）
    let sign = 1;
    if (s[index] === '-') {
      sign = -1;
      index++;
    }
    let num = 0;
    while (index < s.length && s[index] >= '0' && s[index] <= '9') {
      num = num * 10 + (s.charCodeAt(index) - '0'.charCodeAt(0));
      index++;
    }
    const node = new TreeNode(sign * num);
    // 解析左子树
    if (index < s.length && s[index] === '(') {
      index++; // 跳过 '('
      node.left = parse();
      index++; // 跳过 ')'
    }
    // 解析右子树
    if (index < s.length && s[index] === '(') {
      index++; // 跳过 '('
      node.right = parse();
      index++; // 跳过 ')'
    }
    return node;
  }
  return parse();
}

// 方法2：栈迭代
// 用栈维护当前构建路径，遇到 '(' 入栈新节点，遇到 ')' 出栈连接父子关系
function str2treeStack(s: string): TreeNode | null {
  if (s.length === 0) return null;
  const stack: TreeNode[] = [];
  let index = 0;
  while (index < s.length) {
    if (s[index] === ')') {
      stack.pop();
      index++;
    } else if (s[index] === '(') {
      index++;
    } else {
      // 解析数字
      let sign = 1;
      if (s[index] === '-') {
        sign = -1;
        index++;
      }
      let num = 0;
      while (index < s.length && s[index] >= '0' && s[index] <= '9') {
        num = num * 10 + (s.charCodeAt(index) - '0'.charCodeAt(0));
        index++;
      }
      const node = new TreeNode(sign * num);
      if (stack.length > 0) {
        const parent = stack[stack.length - 1];
        if (parent.left === null) {
          parent.left = node;
        } else {
          parent.right = node;
        }
      }
      stack.push(node);
    }
  }
  return stack.length > 0 ? stack[0] : null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 064. 从字符串生成二叉树 =====");
function treeToArray(root: TreeNode | null): (number | null)[] {
  if (root === null) return [];
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift() ?? null;
    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  // 去掉尾部 null
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

console.log("递归 '4(2(3)(1))(6(5))':", treeToArray(str2tree('4(2(3)(1))(6(5))'))); // [4,2,6,3,1,5]
console.log("栈  '4(2(3)(1))(6(5))':", treeToArray(str2treeStack('4(2(3)(1))(6(5))'))); // [4,2,6,3,1,5]

console.log("递归 '4(2(3)(1))(6(5)(7))':", treeToArray(str2tree('4(2(3)(1))(6(5)(7))'))); // [4,2,6,3,1,5,7]
console.log("栈  '4(2(3)(1))(6(5)(7))':", treeToArray(str2treeStack('4(2(3)(1))(6(5)(7))'))); // [4,2,6,3,1,5,7]

console.log("递归 '-4(2(3)(1))(6(5))':", treeToArray(str2tree('-4(2(3)(1))(6(5))'))); // [-4,2,6,3,1,5]
console.log("栈  '-4(2(3)(1))(6(5))':", treeToArray(str2treeStack('-4(2(3)(1))(6(5))'))); // [-4,2,6,3,1,5]

console.log("递归 '51':", treeToArray(str2tree('51'))); // [51]
console.log("栈  '51':", treeToArray(str2treeStack('51'))); // [51]

console.log("递归 '':", treeToArray(str2tree(''))); // []
console.log("栈  '':", treeToArray(str2treeStack(''))); // []

export {};
