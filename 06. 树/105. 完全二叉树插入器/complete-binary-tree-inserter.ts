// ============================================================
// 105. 完全二叉树插入器
// ============================================================
// LeetCode 919. Complete Binary Tree Inserter
// 完全二叉树是每一层（除最后一层外）都是完全填充的，并且所有的节点都尽可能地靠左。
// 设计一个用完全二叉树初始化的数据结构 CBTInserter，并支持插入操作 insert(v)：
// 向树中插入新节点 v，返回新插入节点的父节点的值；
// 以及 get_root() 返回树的根节点。
// 时间复杂度：构造 O(n)，insert O(1) 摊销；空间复杂度：O(n)

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

// 方法1：BFS 队列存储可插入节点（推荐）
// 初始化时 BFS 遍历整棵树，把所有"还可以插入子节点"的节点（左或右为空）入队。
// insert 时取队首节点，按"先左后右"插入，填满后出队。

class CBTInserter {
  private root: TreeNode;
  private queue: TreeNode[] = []; // 候选父节点（仍有空缺）

  constructor(root: TreeNode | null) {
    if (root === null) {
      this.root = new TreeNode(0);
      this.queue = [this.root];
      return;
    }
    this.root = root;
    // BFS 找出所有尚有插入空缺的节点
    const bfs: TreeNode[] = [root];
    while (bfs.length > 0) {
      const node = bfs.shift()!;
      if (node.left === null || node.right === null) {
        // 还有空缺，加入候选队列
        this.queue.push(node);
      }
      if (node.left !== null) bfs.push(node.left);
      if (node.right !== null) bfs.push(node.right);
    }
  }

  insert(v: number): number {
    const newNode = new TreeNode(v);
    const parent = this.queue[0];

    if (parent.left === null) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
      // 左右都填满了，父节点出队
      this.queue.shift();
    }
    // 新节点本身也加入候选队列（它是叶子，肯定有插入空缺）
    this.queue.push(newNode);

    return parent.val;
  }

  get_root(): TreeNode | null {
    return this.root;
  }
}

// 方法2：按编号定位父节点
// 利用完全二叉树的编号性质：节点 i 的父节点为 Math.floor(i/2)。
// 通过 BFS 给每个节点编号，存储到数组。insert 时新节点编号为 size+1，父节点为 floor((size+1)/2)。
class CBTInserterByIndex {
  private nodeList: TreeNode[] = []; // 下标 1 开始（下标 0 占位）

  constructor(root: TreeNode | null) {
    if (root === null) return;
    this.nodeList.push(new TreeNode(0)); // 占位
    const queue: TreeNode[] = [root];
    while (queue.length > 0) {
      const node = queue.shift()!;
      this.nodeList.push(node);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  insert(v: number): number {
    const newNode = new TreeNode(v);
    this.nodeList.push(newNode);
    const parentIdx = Math.floor((this.nodeList.length - 1) / 2);
    const parent = this.nodeList[parentIdx];
    if (parent.left === null) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
    return parent.val;
  }

  get_root(): TreeNode | null {
    return this.nodeList[1] ?? null;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 105. 完全二叉树插入器 =====");

// 辅助函数：通过层序数组构建二叉树
function buildTreeForCBT(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.left = new TreeNode(arr[i] as number);
        queue.push(node.left);
      }
      i++;
    }
    if (i < arr.length) {
      if (arr[i] !== null) {
        node.right = new TreeNode(arr[i] as number);
        queue.push(node.right);
      }
      i++;
    }
  }
  return root;
}

// 辅助函数：层序遍历输出
function levelOrderForCBT(root: TreeNode | null): (number | null)[] {
  if (root === null) return [];
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      result.push(null);
      continue;
    }
    result.push(node.val);
    queue.push(node.left);
    queue.push(node.right);
  }
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// 测试1: 初始化 root = [1,2], 插入 3, 4, 5
//      1                1
//     /        =>      / \
//    2                2   3
// 再插入 4, 5 后:
//        1
//       / \
//      2   3
//     / \  /
//    4  5 6(假设继续)
const tree1 = buildTreeForCBT([1, 2]);
const cbt1 = new CBTInserter(tree1);
console.log("方法1 - 插入3返回父:", cbt1.insert(3)); // 期望 1
console.log("方法1 - 插入4返回父:", cbt1.insert(4)); // 期望 2
console.log("方法1 - 插入5返回父:", cbt1.insert(5)); // 期望 2
console.log("方法1 - 插入6返回父:", cbt1.insert(6)); // 期望 3
console.log("方法1 - 最终层序:", levelOrderForCBT(cbt1.get_root())); // 期望 [1,2,3,4,5,6]

// 测试2: 按编号方法
const tree2 = buildTreeForCBT([1, 2]);
const cbt2 = new CBTInserterByIndex(tree2);
console.log("方法2 - 插入3返回父:", cbt2.insert(3)); // 期望 1
console.log("方法2 - 插入4返回父:", cbt2.insert(4)); // 期望 2
console.log("方法2 - 插入5返回父:", cbt2.insert(5)); // 期望 2
console.log("方法2 - 最终层序:", levelOrderForCBT(cbt2.get_root())); // 期望 [1,2,3,4,5]

// 测试3: 单节点初始化
const tree3 = buildTreeForCBT([1]);
const cbt3 = new CBTInserter(tree3);
console.log("单节点插入2返回父:", cbt3.insert(2)); // 期望 1
console.log("单节点插入3返回父:", cbt3.insert(3)); // 期望 1
console.log("最终层序:", levelOrderForCBT(cbt3.get_root())); // 期望 [1,2,3]

export {};
