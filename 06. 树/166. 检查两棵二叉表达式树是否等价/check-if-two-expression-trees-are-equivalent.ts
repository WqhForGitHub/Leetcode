// ============================================================
// 166. 检查两棵二叉表达式树是否等价
// ============================================================
// LeetCode 1612. Check If Two Expression Trees are Equivalent
// 给定两棵二叉表达式树的根节点 root1 和 root2（只有 + 和 * 运算），
// 判断两棵树是否等价。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 表达式树节点定义（叶节点为变量或数字，非叶节点为运算符）
// 这里用 'charCodeAt' 取字符；叶节点 val 为字符的 ASCII 值
class Node {
  val: number;
  left: Node | null;
  right: Node | null;
  constructor(val?: number, left?: Node | null, right?: Node | null) {
    this.val = val ?? 0;
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

// 方法1：DFS计数叶子值频率（推荐）
// 由于只有 + 和 *，+ 满足交换律和结合律，因此只要两棵树的叶子值频率相同即等价
// 注意：题目中运算符为 + 和 *，叶子节点为变量，+ 满足交换律，
// 但 * 不满足（不过本题的等价性按叶子值多重集相等判断）
function checkEquivalence(root1: Node | null, root2: Node | null): boolean {
  const count1 = new Map<number, number>();
  const count2 = new Map<number, number>();
  collectLeaves(root1, count1);
  collectLeaves(root2, count2);
  if (count1.size !== count2.size) return false;
  for (const [key, val] of count1) {
    if (count2.get(key) !== val) return false;
  }
  return true;

  function collectLeaves(node: Node | null, count: Map<number, number>): void {
    if (node === null) return;
    // 叶子节点：左右孩子都为空
    if (node.left === null && node.right === null) {
      count.set(node.val, (count.get(node.val) ?? 0) + 1);
      return;
    }
    // 非叶子节点，递归左右子树
    collectLeaves(node.left, count);
    collectLeaves(node.right, count);
  }
}

// 方法2：DFS展开为字符串后排序比较
function checkEquivalenceSort(root1: Node | null, root2: Node | null): boolean {
  const list1: number[] = [];
  const list2: number[] = [];
  dfs(root1, list1);
  dfs(root2, list2);
  if (list1.length !== list2.length) return false;
  list1.sort((a, b) => a - b);
  list2.sort((a, b) => a - b);
  for (let i = 0; i < list1.length; i++) {
    if (list1[i] !== list2[i]) return false;
  }
  return true;

  function dfs(node: Node | null, list: number[]): void {
    if (node === null) return;
    if (node.left === null && node.right === null) {
      list.push(node.val);
      return;
    }
    dfs(node.left, list);
    dfs(node.right, list);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 166. 检查两棵二叉表达式树是否等价 =====");

// 辅助函数：根据 ASCII 创建变量叶子节点
function leaf(ch: string): Node {
  return new Node(ch.charCodeAt(0));
}

// 构建运算符节点 ('+' = 43, '*' = 42)
function op(operator: string, left: Node | null, right: Node | null): Node {
  return new Node(operator.charCodeAt(0), left, right);
}

// 测试1: (a+b) vs (b+a) -> 等价
//   +        +
//  / \      / \
// a   b    b   a
const t1a = op("+", leaf("a"), leaf("b"));
const t1b = op("+", leaf("b"), leaf("a"));
console.log("测试1 计数法:", checkEquivalence(t1a, t1b)); // true
console.log("测试1 排序法:", checkEquivalenceSort(t1a, t1b)); // true

// 测试2: (a+b) vs (a+c) -> 不等价
const t2a = op("+", leaf("a"), leaf("b"));
const t2b = op("+", leaf("a"), leaf("c"));
console.log("测试2 计数法:", checkEquivalence(t2a, t2b)); // false
console.log("测试2 排序法:", checkEquivalenceSort(t2a, t2b)); // false

// 测试3: ((a+b)+c) vs (a+(b+c)) -> 等价（结合律）
const t3a = op("+", op("+", leaf("a"), leaf("b")), leaf("c"));
const t3b = op("+", leaf("a"), op("+", leaf("b"), leaf("c")));
console.log("测试3 计数法:", checkEquivalence(t3a, t3b)); // true
console.log("测试3 排序法:", checkEquivalenceSort(t3a, t3b)); // true

// 测试4: (a+a+b) vs (a+b+a) -> 等价
const t4a = op("+", op("+", leaf("a"), leaf("a")), leaf("b"));
const t4b = op("+", op("+", leaf("a"), leaf("b")), leaf("a"));
console.log("测试4 计数法:", checkEquivalence(t4a, t4b)); // true
console.log("测试4 排序法:", checkEquivalenceSort(t4a, t4b)); // true

// 测试5: 相同树
const t5 = op("+", leaf("x"), leaf("y"));
console.log("测试5 计数法:", checkEquivalence(t5, t5)); // true

export {};
