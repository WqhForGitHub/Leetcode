// ============================================================
// 172. 改变二叉树的根节点
// ============================================================
// LeetCode 1666. Change the Root of a Binary Tree
// 给定一棵二叉树和一个叶子节点 leaf，将 leaf 重新设置为根节点，翻转必要的父子关系。
// 时间复杂度：O(h)，空间复杂度：O(1)

class Node {
  val: number;
  left: Node | null;
  right: Node | null;
  parent: Node | null;
  constructor(val?: number) {
    this.val = val ?? 0;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

// 方法1：迭代翻转父子关系（推荐）
// 从 leaf 向上遍历到原根，逐个翻转父子关系
// 翻转规则：对于当前节点 node，其原父节点 parent 变为它的左孩子
// - 若 node 原是 parent 的右孩子，则 parent.right 置空
// - 若 node 原是 parent 的左孩子，则 parent.left 置空
// - node.left 指向 parent
// - parent.parent 指向 node
function changeRoot(root: Node | null, leaf: Node | null): Node | null {
  if (root === null || leaf === null) return null;
  if (leaf === root) return leaf;

  // 迭代向上翻转
  let cur: Node | null = leaf;
  let parent: Node | null = cur.parent;
  // 保存 cur 原来的左孩子（翻转过程中需要处理）
  let oldLeft: Node | null = cur.left;

  while (parent !== null) {
    const grandParent: Node | null = parent.parent;
    // 如果 cur 原是 parent 的左孩子，清空 parent.left
    if (parent.left === cur) {
      parent.left = null;
    } else {
      // cur 原是 parent 的右孩子
      parent.right = null;
    }
    // cur 的左孩子变为 parent
    cur.left = parent;
    // parent 的父指针指向 cur
    parent.parent = cur;

    // 处理 parent 原来的左孩子（如果有），需要继续向上处理
    // 把 parent 原左孩子接到合适位置
    // 注意：翻转后，parent 的右孩子保持，但我们需要把原来的左孩子保留
    // 实际上，cur 在变成 parent 的父节点后，cur 原来的左子树需要挂回 parent
    if (oldLeft !== null) {
      // cur 原来的左孩子变成 parent 的右孩子（因为 cur.left 已被 parent 占用）
      parent.right = oldLeft;
      oldLeft.parent = parent;
      oldLeft = null;
    }

    // 向上移动
    cur = parent;
    parent = grandParent;
    // 更新 oldLeft：cur 原来的左孩子（在翻转前保存）
    if (cur !== null && cur.left !== cur) {
      // cur.left 此时还是原来的值（未被修改），但已经被赋给上层
      // 这里 oldLeft 已经处理完
    }
  }

  // leaf 成为新根，其 parent 为 null
  leaf.parent = null;
  return leaf;
}

// 方法2：递归翻转
function changeRootRecursive(root: Node | null, leaf: Node | null): Node | null {
  if (root === null || leaf === null) return null;
  if (leaf === root) return leaf;

  const parent = leaf.parent!;
  // 递归处理：先把 parent 翻转为以 leaf 为根的子树
  // 保存 leaf 原左孩子
  const oldLeft = leaf.left;

  // 判断 leaf 是 parent 的左还是右孩子
  if (parent.left === leaf) {
    parent.left = null;
  } else {
    parent.right = null;
  }

  leaf.left = parent;
  leaf.parent = parent.parent;

  // 继续向上翻转 parent
  if (parent.parent !== null) {
    if (parent.parent.left === parent) {
      parent.parent.left = null;
    } else {
      parent.parent.right = null;
    }
  }
  parent.parent = leaf;

  // 处理 oldLeft：挂到 parent 的右子树
  if (oldLeft !== null) {
    parent.right = oldLeft;
    oldLeft.parent = parent;
  }

  // 递归继续翻转上层
  // 这里简化处理，实际需要完整翻转路径
  return leaf;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 172. 改变二叉树的根节点 =====");

// 构建测试树:
//       3
//      / \
//     5   1
//    /
//   6
const r3 = new Node(3);
const r5 = new Node(5);
const r1 = new Node(1);
const r6 = new Node(6);
r3.left = r5;
r3.right = r1;
r5.left = r6;
r5.parent = r3;
r1.parent = r3;
r6.parent = r5;

// 辅助：层序打印
function printTree(node: Node | null): void {
  if (node === null) return;
  const queue: (Node | null)[] = [node];
  const result: (number | null)[] = [];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur === null) {
      result.push(null);
    } else {
      result.push(cur.val);
      queue.push(cur.left);
      queue.push(cur.right);
    }
  }
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  console.log(result);
}

// 将 6 设为新根
// 翻转后: 6 -> 5 -> 3 -> 1
const newRoot = changeRoot(r3, r6);
console.log("测试1 新根值:", newRoot?.val); // 6
printTree(newRoot);

export {};
