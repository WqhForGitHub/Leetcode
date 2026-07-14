// ============================================================
// 132. 在受污染的二叉树中查找元素
// ============================================================
// LeetCode 1261. Find Elements in a Contaminated Binary Tree
// 给定一个满足以下规则的二叉树：根节点值为0，左子节点值为 2*x+1，
// 右子节点值为 2*x+2。但树被污染了所有值变为 -1。恢复树并实现查找功能。
// 时间复杂度：O(n) 建树，O(1) 查找；空间复杂度：O(n)

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

// 方法1：DFS恢复+哈希集合（推荐）
// 用一个集合存储所有恢复后的节点值，查找时 O(1)
class FindElements {
  private values: Set<number>;

  constructor(root: TreeNode | null) {
    this.values = new Set<number>();
    this.recover(root, 0);
  }

  private recover(node: TreeNode | null, val: number): void {
    if (node === null) return;
    node.val = val;
    this.values.add(val);
    this.recover(node.left, 2 * val + 1);
    this.recover(node.right, 2 * val + 2);
  }

  find(target: number): boolean {
    return this.values.has(target);
  }
}

// 方法2：DFS恢复+位运算
// 不使用额外集合，而是根据 target 反推路径判断节点是否存在
// 对于 target > 0：其父节点 = floor((target - 1) / 2)
// 通过 target 的二进制位确定从根到目标节点的路径
// （最高位后的每一位：0 表示左，1 表示右）
class FindElementsBit {
  private root: TreeNode | null;

  constructor(root: TreeNode | null) {
    this.root = root;
    this.recover(root, 0);
  }

  private recover(node: TreeNode | null, val: number): void {
    if (node === null) return;
    node.val = val;
    this.recover(node.left, 2 * val + 1);
    this.recover(node.right, 2 * val + 2);
  }

  find(target: number): boolean {
    if (target < 0 || this.root === null) return false;
    if (target === 0) return true;

    // 计算从根到 target 的路径
    // target 的二进制去掉最高位 1 后，剩余位 0=左, 1=右
    let path = 0; // 用位记录路径
    let length = 0;
    let t = target;
    while (t > 0) {
      // 最低位：0 表示左孩子，1 表示右孩子（相对于其父）
      // 但需要小心：target = 2*x+1 (左), target = 2*x+2 (右)
      // 即 (target - 1) / 2 = 父（左孩子时），target / 2 = 父（右孩子时）
      // t 为偶数 -> 是父的右孩子 -> 位 1
      // t 为奇数 -> 是父的左孩子 -> 位 0
      path = (path << 1) | (t % 2 === 0 ? 1 : 0);
      length++;
      t = Math.floor((t - 1) / 2);
    }
    // 现在 path 中有 length 位，从最高位到最低位依次是从根开始的走向
    // 注意：最后压入的是 target 自身相对其父的位，应该最后处理
    // 我们重新构造方向数组（从根到目标）
    const dirs: number[] = [];
    t = target;
    while (t > 0) {
      dirs.push(t % 2 === 0 ? 1 : 0); // 1=右, 0=左
      t = Math.floor((t - 1) / 2);
    }
    dirs.reverse(); // 反转：从根到目标

    let curr: TreeNode | null = this.root;
    for (const d of dirs) {
      curr = d === 0 ? curr!.left : curr!.right;
      if (curr === null) return false;
    }
    return true;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 132. 在受污染的二叉树中查找元素 =====");

// 辅助函数：构建污染树（所有值置 -1）
function buildContaminatedTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(-1);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (node !== null) {
      if (i < arr.length) {
        const leftVal = arr[i++];
        node.left = leftVal !== null ? new TreeNode(-1) : null;
        queue.push(node.left);
      }
      if (i < arr.length) {
        const rightVal = arr[i++];
        node.right = rightVal !== null ? new TreeNode(-1) : null;
        queue.push(node.right);
      }
    }
  }
  return root;
}

// 测试1: 树形 [-1, null, -1] -> 恢复为 [0, null, 2]
// find(1) = false, find(2) = true
const fe1 = new FindElements(buildContaminatedTree([-1, null, -1]));
console.log("测试1 find(1):", fe1.find(1)); // 期望 false
console.log("测试1 find(2):", fe1.find(2)); // 期望 true

// 测试2: 树形 [-1, -1, -1, -1, -1] -> 恢复为
//        0
//       / \
//      1   2
//     / \
//    3   4
const fe2 = new FindElements(buildContaminatedTree([-1, -1, -1, -1, -1]));
console.log("测试2 find(1):", fe2.find(1)); // 期望 true
console.log("测试2 find(3):", fe2.find(3)); // 期望 true
console.log("测试2 find(5):", fe2.find(5)); // 期望 false

// 测试3: 位运算方法
const fe3 = new FindElementsBit(buildContaminatedTree([-1, -1, -1, -1, -1]));
console.log("测试3 位运算 find(1):", fe3.find(1)); // 期望 true
console.log("测试3 位运算 find(3):", fe3.find(3)); // 期望 true
console.log("测试3 位运算 find(4):", fe3.find(4)); // 期望 true
console.log("测试3 位运算 find(5):", fe3.find(5)); // 期望 false

export {};
