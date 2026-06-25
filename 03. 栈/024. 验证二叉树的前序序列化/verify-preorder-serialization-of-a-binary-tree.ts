// ============================================================
// 024. 验证二叉树的前序序列化
// ============================================================
// LeetCode 331. Verify Preorder Serialization of a Binary Tree
// 给定一串以逗号分隔的 preorder 序列（'#' 表示空节点），验证其是否为合法前序序列化。

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 用栈模拟。遇到非空节点入栈，遇到 '#' 时：若栈顶也是 '#'，
// 说明某叶子节点已被两个空子节点闭合，弹出 '#' 和其父节点，替换为 '#'。
// 时间 O(n)，空间 O(n)。
function isValidSerialization(preorder: string): boolean {
  const nodes = preorder.split(',');
  const stack: string[] = [];
  for (const node of nodes) {
    stack.push(node);
    while (
      stack.length >= 3 &&
      stack[stack.length - 1] === '#' &&
      stack[stack.length - 2] === '#' &&
      stack[stack.length - 3] !== '#'
    ) {
      stack.pop();
      stack.pop();
      stack.pop();
      stack.push('#');
    }
  }
  return stack.length === 1 && stack[0] === '#';
}

// ------------------------------------------------------------
// 方法2：槽位计数法（O(1) 空间）
// ------------------------------------------------------------
// 每个非空节点消耗一个槽位并新增两个，空节点只消耗一个。
function isValidSerializationSlots(preorder: string): boolean {
  const nodes = preorder.split(',');
  let slots = 1;
  for (const node of nodes) {
    slots--; // 消耗一个槽位
    if (slots < 0) return false;
    if (node !== '#') slots += 2;
  }
  return slots === 0;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1 - 栈法:', isValidSerialization('9,3,4,#,#,1,#,#,2,#,6,#,#'), '期望: true');
  console.log('测试2 - 栈法:', isValidSerialization('1,#'), '期望: false');
  console.log('测试3 - 栈法:', isValidSerialization('9,#,#,1'), '期望: false');
  console.log('测试4 - 槽位:', isValidSerializationSlots('9,3,4,#,#,1,#,#,2,#,6,#,#'), '期望: true');
}

test();

export {};
