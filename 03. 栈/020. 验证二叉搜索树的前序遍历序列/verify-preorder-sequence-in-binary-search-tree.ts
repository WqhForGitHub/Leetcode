// ============================================================
// 020. 验证二叉搜索树的前序遍历序列
// ============================================================
// LeetCode 255. Verify Preorder Sequence in Binary Search Tree
// 给定一个整数数组，判断它是否是某个二叉搜索树的前序遍历序列。

// ------------------------------------------------------------
// 方法1：单调栈
// ------------------------------------------------------------
// 维护单调递减栈模拟前序遍历「根->左->右」。
// 当遇到比栈顶大的元素，说明进入右子树，弹出栈顶更新下界 lower，
// 后续所有值必须大于 lower。
// 时间 O(n)，空间 O(n)。
function verifyPreorder(preorder: number[]): boolean {
  const stack: number[] = [];
  let lower = -Infinity;
  for (const val of preorder) {
    if (val < lower) return false;
    while (stack.length > 0 && val > stack[stack.length - 1]) {
      lower = stack.pop()!;
    }
    stack.push(val);
  }
  return true;
}

// ------------------------------------------------------------
// 方法2：原地复用数组（O(1) 空间）
// ------------------------------------------------------------
function verifyPreorderO1(preorder: number[]): boolean {
  let lower = -Infinity;
  let top = -1;
  for (const val of preorder) {
    if (val < lower) return false;
    while (top >= 0 && val > preorder[top]) {
      lower = preorder[top--];
    }
    preorder[++top] = val;
  }
  return true;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1 - 栈法:', verifyPreorder([5, 2, 1, 3, 6]), '期望: true');
  console.log('测试2 - 栈法:', verifyPreorder([5, 2, 6, 1, 3]), '期望: false');
  console.log('测试3 - O1法:', verifyPreorderO1([5, 2, 1, 3, 6]), '期望: true');
}

test();

export {};
