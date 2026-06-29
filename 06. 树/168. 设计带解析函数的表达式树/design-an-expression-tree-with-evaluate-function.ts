// ============================================================
// 168. 设计带解析函数的表达式树
// ============================================================
// LeetCode 1628. Design an Expression Tree With Evaluate Function
// 设计一个表达式树类，支持根据后缀表达式构造树并计算结果。
// 时间复杂度：构造 O(n)，计算 O(n)；空间复杂度：O(n)

// 抽象表达式树节点基类
abstract class Node {
  abstract evaluate(): number;
  left: Node | null = null;
  right: Node | null = null;
}

// 数字叶子节点
class NumNode extends Node {
  constructor(private value: number) {
    super();
  }
  evaluate(): number {
    return this.value;
  }
}

// 运算符节点
class OpNode extends Node {
  constructor(
    private operator: string,
    left: Node | null,
    right: Node | null
  ) {
    super();
    this.left = left;
    this.right = right;
  }
  evaluate(): number {
    const left = this.left!.evaluate();
    const right = this.right!.evaluate();
    switch (this.operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return Math.trunc(left / right);
      default:
        throw new Error(`Unknown operator: ${this.operator}`);
    }
  }
}

// 方法1：栈构造表达式树（推荐）
// 后缀表达式遍历：
// - 遇到数字，压入栈
// - 遇到运算符，弹出两个操作数构造节点后压回栈
function buildTree(postfix: string[]): Node | null {
  const stack: Node[] = [];
  const isOperator = (s: string) =>
    s === "+" || s === "-" || s === "*" || s === "/";
  for (const token of postfix) {
    if (isOperator(token)) {
      const right = stack.pop()!;
      const left = stack.pop()!;
      stack.push(new OpNode(token, left, right));
    } else {
      stack.push(new NumNode(parseInt(token, 10)));
    }
  }
  return stack.length > 0 ? stack[0] : null;
}

// 方法2：递归构造（用索引游标）
function buildTreeRecursive(postfix: string[]): Node | null {
  let idx = postfix.length - 1;
  function build(): Node {
    const token = postfix[idx];
    idx--;
    const isOperator = (s: string) =>
      s === "+" || s === "-" || s === "*" || s === "/";
    if (isOperator(token)) {
      const right = build();
      const left = build();
      return new OpNode(token, left, right);
    }
    return new NumNode(parseInt(token, 10));
  }
  if (postfix.length === 0) return null;
  return build();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 168. 设计带解析函数的表达式树 =====");

// 测试1: ["3","4","+","2","*","7","/"]
// 后缀: 3 4 + 2 * 7 /
// = ((3+4)*2)/7 = 14/7 = 2
const tree1 = buildTree(["3", "4", "+", "2", "*", "7", "/"]);
console.log("测试1 栈构造:", tree1?.evaluate()); // 期望 2
const tree1r = buildTreeRecursive(["3", "4", "+", "2", "*", "7", "/"]);
console.log("测试1 递归构造:", tree1r?.evaluate()); // 期望 2

// 测试2: ["4","5","2","7","+","-","*"]
// 后缀: 4 5 2 7 + - *
// = 4 * (5 - (2+7)) = 4 * (5-9) = 4 * (-4) = -16
const tree2 = buildTree(["4", "5", "2", "7", "+", "-", "*"]);
console.log("测试2 栈构造:", tree2?.evaluate()); // 期望 -16

// 测试3: ["4","2","+","3","5","1","-","*","+"]
// = (4+2) + 3*(5-1) = 6 + 12 = 18
const tree3 = buildTree(["4", "2", "+", "3", "5", "1", "-", "*", "+"]);
console.log("测试3 栈构造:", tree3?.evaluate()); // 期望 18

// 测试4: 单数字 ["100"]
const tree4 = buildTree(["100"]);
console.log("测试4 单数字:", tree4?.evaluate()); // 期望 100

// 测试5: ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
// 复杂表达式
const tree5 = buildTree([
  "10",
  "6",
  "9",
  "3",
  "+",
  "-11",
  "*",
  "/",
  "*",
  "17",
  "+",
  "5",
  "+",
]);
console.log("测试5 栈构造:", tree5?.evaluate()); // 期望 22

export {};
