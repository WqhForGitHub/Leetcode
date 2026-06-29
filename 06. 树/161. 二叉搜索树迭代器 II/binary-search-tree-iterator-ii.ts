// ============================================================
// 161. 二叉搜索树迭代器 II
// ============================================================
// LeetCode 1586. Binary Search Tree Iterator II
// 实现一个 BSTIteratorII 类，支持 next()、prev()、hasNext()、hasPrev() 操作。
// 时间复杂度：构造 O(n)，next/prev O(1)，hasNext/hasPrev O(1)
// 空间复杂度：O(n)

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

// 方法1：中序遍历数组 + 指针
// 把 BST 中序遍历得到有序数组，用一个指针 idx 指向当前最近访问的元素
// next: idx++，返回 arr[idx-1]；prev: idx--；hasNext: idx < arr.length；hasPrev: idx > 0
class BSTIteratorII {
  private arr: number[] = [];
  private idx: number = 0; // 指向下一个 next 将返回的位置（即还未访问的位置起点）

  constructor(root: TreeNode | null) {
    this.inorder(root);
  }

  private inorder(node: TreeNode | null): void {
    if (node === null) return;
    this.inorder(node.left);
    this.arr.push(node.val);
    this.inorder(node.right);
  }

  hasNext(): boolean {
    return this.idx < this.arr.length;
  }

  next(): number {
    // 返回当前指针位置的值，并推进
    const val = this.arr[this.idx];
    this.idx++;
    return val;
  }

  hasPrev(): boolean {
    // 存在前驱意味着已经访问过至少一个节点，可以后退
    return this.idx > 0;
  }

  prev(): number {
    // 回退一格并返回该格的值
    this.idx--;
    return this.arr[this.idx];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 161. 二叉搜索树迭代器 II =====");

// 辅助：从数组构建二叉搜索树（按层序）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (node !== null) {
      if (i < arr.length) {
        const v = arr[i++];
        if (v !== null) {
          node.left = new TreeNode(v);
          queue.push(node.left);
        } else queue.push(null);
      }
      if (i < arr.length) {
        const v = arr[i++];
        if (v !== null) {
          node.right = new TreeNode(v);
          queue.push(node.right);
        } else queue.push(null);
      }
    }
  }
  return root;
}

// 测试:
//     7
//    / \
//   3   15
//      / \
//     9   20
const root = buildTree([7, 3, 15, null, null, 9, 20]);
const it = new BSTIteratorII(root);
console.log("next:", it.next()); // 3
console.log("next:", it.next()); // 7
console.log("prev:", it.prev()); // 7
console.log("next:", it.next()); // 7
console.log("next:", it.next()); // 9
console.log("next:", it.next()); // 15
console.log("next:", it.next()); // 20
console.log("hasNext:", it.hasNext()); // false
console.log("hasPrev:", it.hasPrev()); // true
console.log("prev:", it.prev()); // 20
console.log("prev:", it.prev()); // 15
console.log("hasPrev:", it.hasPrev()); // true
console.log("next:", it.next()); // 15

export {};
