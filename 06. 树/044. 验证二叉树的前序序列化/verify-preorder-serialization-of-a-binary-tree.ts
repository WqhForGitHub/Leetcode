// ============================================================
// 044. 验证二叉树的前序序列化
// ============================================================
// LeetCode 331. Verify Preorder Serialization of a Binary Tree
// 给定一个以逗号分隔的字符串，验证它是否是正确的二叉树的前序序列化。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：槽位计数法（推荐）
// 每个非空节点消耗 1 个槽位并新增 2 个槽位（左右孩子）；
// 每个空节点（#）消耗 1 个槽位但不新增槽位。
// 若中途槽位变负，或最终槽位不为 0，则非法。
function isValidSerialization(preorder: string): boolean {
  const nodes = preorder.split(",");
  // 初始有 1 个槽位给根
  let slots = 1;
  for (const node of nodes) {
    // 每访问一个节点先消耗 1 个槽位
    slots--;
    if (slots < 0) return false;
    if (node !== "#") {
      slots += 2; // 非空节点新增两个槽位
    }
  }
  return slots === 0;
}

// 方法2：栈模拟
// 用栈保存各节点"剩余的子节点槽位"（初始为 2，因为每节点有左右孩子）。
// 遇到一个节点（包括 #）时，栈顶节点的剩余槽位 -1，若归 0 则出栈；
// 若节点非空则压入一个槽位为 2 的元素。最后栈应为空。
function isValidSerializationStack(preorder: string): boolean {
  const nodes = preorder.split(",");
  if (nodes.length === 0) return true;
  if (nodes[0] === "#") return nodes.length === 1;
  const stack: number[] = [2]; // 根节点有 2 个槽位
  for (let i = 1; i < nodes.length; i++) {
    const node = nodes[i];
    if (stack.length === 0) return false; // 没有可填充的槽位
    stack[stack.length - 1]--;
    if (stack[stack.length - 1] === 0) stack.pop();
    if (node !== "#") stack.push(2);
  }
  return stack.length === 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 044. 验证二叉树的前序序列化 =====");
console.log("槽位 '9,3,4,#,#,1,#,#,2,#,6,#,#':", isValidSerialization("9,3,4,#,#,1,#,#,2,#,6,#,#")); // 期望 true
console.log("栈 '9,3,4,#,#,1,#,#,2,#,6,#,#':", isValidSerializationStack("9,3,4,#,#,1,#,#,2,#,6,#,#")); // 期望 true
console.log("槽位 '1,#':", isValidSerialization("1,#")); // 期望 false
console.log("栈 '1,#':", isValidSerializationStack("1,#")); // 期望 false
console.log("槽位 '9,#,#,1':", isValidSerialization("9,#,#,1")); // 期望 false
console.log("栈 '9,#,#,1':", isValidSerializationStack("9,#,#,1")); // 期望 false
console.log("槽位 '#':", isValidSerialization("#")); // 期望 true
console.log("栈 '#':", isValidSerializationStack("#")); // 期望 true
console.log("槽位 '1,#,#':", isValidSerialization("1,#,#")); // 期望 true
console.log("栈 '1,#,#':", isValidSerializationStack("1,#,#")); // 期望 true

export {};
