// ============================================================
// 118. 二叉树的垂序遍历
// ============================================================
// LeetCode 987. Vertical Order Traversal of a Binary Tree
// 对二叉树结点按「列」从左到右分组输出；同一列内按「行」从小到大，
// 同行同列按「值」从小到大排序。

// 方法1：DFS 收集所有结点再排序（推荐，O(n log n) 时间，O(n) 空间）
// 收集三元组 (col, row, val)，排序后按列分组输出。

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

function verticalTraversal(root: TreeNode | null): number[][] {
  const nodes: Array<[number, number, number]> = []; // [col, row, val]

  function dfs(node: TreeNode | null, row: number, col: number): void {
    if (node === null) return;
    nodes.push([col, row, node.val]);
    dfs(node.left, row + 1, col - 1);
    dfs(node.right, row + 1, col + 1);
  }

  dfs(root, 0, 0);

  // 按 col 升序、row 升序、val 升序排序
  nodes.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    if (a[1] !== b[1]) return a[1] - b[1];
    return a[2] - b[2];
  });

  const result: number[][] = [];
  let i = 0;
  while (i < nodes.length) {
    const col: number[] = [];
    const curCol = nodes[i][0];
    while (i < nodes.length && nodes[i][0] === curCol) {
      col.push(nodes[i][2]);
      i++;
    }
    result.push(col);
  }
  return result;
}

// 方法2：BFS 按层收集再排序（O(n log n) 时间，O(n) 空间）
// 用队列代替递归，收集逻辑与排序方式一致。
function verticalTraversalBFS(root: TreeNode | null): number[][] {
  if (root === null) return [];
  const nodes: Array<[number, number, number]> = []; // [col, row, val]
  const queue: Array<[TreeNode, number, number]> = [[root, 0, 0]];
  while (queue.length > 0) {
    const [node, row, col] = queue.shift() as [TreeNode, number, number];
    nodes.push([col, row, node.val]);
    if (node.left) queue.push([node.left, row + 1, col - 1]);
    if (node.right) queue.push([node.right, row + 1, col + 1]);
  }
  nodes.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    if (a[1] !== b[1]) return a[1] - b[1];
    return a[2] - b[2];
  });
  const result: number[][] = [];
  let i = 0;
  while (i < nodes.length) {
    const col: number[] = [];
    const curCol = nodes[i][0];
    while (i < nodes.length && nodes[i][0] === curCol) {
      col.push(nodes[i][2]);
      i++;
    }
    result.push(col);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 118. 二叉树的垂序遍历 =====");

// 构造测试树:
//        3
//       / \
//      9   20
//         /  \
//        15   7
const root1 = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
console.log("方法1 DFS:", verticalTraversal(root1)); // 期望 [[9],[3,15],[20],[7]]
console.log("方法2 BFS:", verticalTraversalBFS(root1)); // 期望 [[9],[3,15],[20],[7]]

// 构造测试树:
//        1
//       / \
//      2   3
//     / \   \
//    4   5   6
const root2 = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3, null, new TreeNode(6)),
);
console.log("方法1 DFS:", verticalTraversal(root2)); // 期望 [[4],[2],[1,5,6],[3]]
console.log("方法2 BFS:", verticalTraversalBFS(root2));

export {};
