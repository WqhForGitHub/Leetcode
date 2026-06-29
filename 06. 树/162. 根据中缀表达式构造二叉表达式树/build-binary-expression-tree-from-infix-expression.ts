// ============================================================
// 162. 根据中缀表达式构造二叉表达式树
// ============================================================
// LeetCode 1597. Build Binary Expression Tree From Infix Expression
// 给定一个中缀表达式字符串 s，构造其二叉表达式树并返回根节点。
// 表达式仅包含数字、'+'、'-'、'*'、'/' 和括号。
// 时间复杂度：O(n)，空间复杂度：O(n)

class Node {
  val: string;
  left: Node | null;
  right: Node | null;
  constructor(val?: string, left?: Node | null, right?: Node | null) {
    this.val = val ?? "";
    this.left = left ?? null;
    this.right = right ?? null;
  }
}

// 方法1：调度场算法（Shunting Yard）
// 1) 用调度场算法将中缀表达式转换为逆波兰式（后缀表达式）
// 2) 用栈根据后缀表达式构造表达式树
function expTree(s: string): Node | null {
  // ----- 步骤1：中缀 -> 后缀 -----
  const output: string[] = [];
  const ops: string[] = [];
  const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };

  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch >= "0" && ch <= "9") {
      // 多位数字
      let num = "";
      while (i < s.length && s[i] >= "0" && s[i] <= "9") {
        num += s[i];
        i++;
      }
      output.push(num);
      continue;
    } else if (ch === "(") {
      ops.push(ch);
    } else if (ch === ")") {
      while (ops.length > 0 && ops[ops.length - 1] !== "(") {
        output.push(ops.pop()!);
      }
      ops.pop(); // 弹出 '('
    } else {
      // 操作符 + - * /
      while (
        ops.length > 0 &&
        ops[ops.length - 1] !== "(" &&
        precedence[ops[ops.length - 1]] >= precedence[ch]
      ) {
        output.push(ops.pop()!);
      }
      ops.push(ch);
    }
    i++;
  }
  while (ops.length > 0) {
    output.push(ops.pop()!);
  }

  // ----- 步骤2：后缀 -> 表达式树 -----
  const stack: Node[] = [];
  for (const token of output) {
    if (token.length > 1 || (token[0] >= "0" && token[0] <= "9")) {
      // 数字
      stack.push(new Node(token));
    } else {
      // 操作符
      const right = stack.pop()!;
      const left = stack.pop()!;
      stack.push(new Node(token, left, right));
    }
  }
  return stack.length > 0 ? stack[0] : null;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 162. 根据中缀表达式构造二叉表达式树 =====");

// 辅助：序列化表达式树（前序遍历输出 val）
function serialize(root: Node | null): string {
  if (root === null) return "";
  const left = serialize(root.left);
  const right = serialize(root.right);
  return `(${root.val}${left ? " " + left : ""}${right ? " " + right : ""})`;
}

// 测试1: "3*5-2"
//      -
//     / \
//    *   2
//   / \
//  3   5
console.log("测试1:", serialize(expTree("3*5-2")));

// 测试2: "2-3/(5*2)+1"
console.log("测试2:", serialize(expTree("2-3/(5*2)+1")));

// 测试3: "1+2"
console.log("测试3:", serialize(expTree("1+2")));

// 测试4: "(1+2)*3"
console.log("测试4:", serialize(expTree("(1+2)*3")));

export {};
