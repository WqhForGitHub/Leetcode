// ============================================================
// 036. 验证二叉搜索树的前序遍历序列
// ============================================================
// LeetCode 255. Verify Preorder Sequence in Binary Search Tree
// 给定一个整数数组，判断该数组是否是某二叉搜索树的前序遍历序列。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：栈模拟（推荐）
// 利用 BST 前序遍历的性质：根 -> 左子树(都 < 根) -> 右子树(都 > 根)
// 用栈模拟遍历过程，遇到比栈顶大的值时弹出（表示进入右子树），并更新下界。
function verifyPreorder(preorder: number[]): boolean {
  const stack: number[] = [];
  let lowerBound = -Infinity;
  for (const val of preorder) {
    // 当前值不能低于下界（下界来自最近的祖先，进入右子树时确定）
    if (val < lowerBound) return false;
    // 当值大于栈顶时，说明进入某个祖先的右子树，弹出并更新下界
    while (stack.length > 0 && val > stack[stack.length - 1]) {
      lowerBound = stack.pop()!;
    }
    stack.push(val);
  }
  return true;
}

// 方法2：递归分治
// 前序第一个为根，其后小于根的连续段为左子树，剩下为右子树，
// 递归验证左右子树并保证右子树所有值都大于根。
function verifyPreorderDivide(preorder: number[]): boolean {
  function helper(start: number, end: number, min: number, max: number): boolean {
    if (start >= end) return true;
    const root = preorder[start];
    if (root <= min || root >= max) return false;
    // 找到第一个大于根的位置，划分左右子树
    let i = start + 1;
    while (i < end && preorder[i] < root) i++;
    // 右子树所有值必须大于根
    for (let j = i; j < end; j++) {
      if (preorder[j] <= root) return false;
    }
    return helper(start + 1, i, min, root) && helper(i, end, root, max);
  }
  return helper(0, preorder.length, -Infinity, Infinity);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 036. 验证二叉搜索树的前序遍历序列 =====");
console.log("栈 [5,2,1,3,6]:", verifyPreorder([5, 2, 1, 3, 6])); // 期望 true
console.log("分治 [5,2,1,3,6]:", verifyPreorderDivide([5, 2, 1, 3, 6])); // 期望 true
console.log("栈 [5,2,6,1,3]:", verifyPreorder([5, 2, 6, 1, 3])); // 期望 false
console.log("分治 [5,2,6,1,3]:", verifyPreorderDivide([5, 2, 6, 1, 3])); // 期望 false
console.log("栈 [1,3,2]:", verifyPreorder([1, 3, 2])); // 期望 true
console.log("分治 [1,3,2]:", verifyPreorderDivide([1, 3, 2])); // 期望 true
console.log("栈 [2,1]:", verifyPreorder([2, 1])); // 期望 true
console.log("空数组:", verifyPreorder([])); // 期望 true

export {};
