// ============================================================
// 110. 监控二叉树
// ============================================================
// LeetCode 968. Binary Tree Cameras
// 给定一个二叉树，我们在树的节点上安装摄像头。每个摄像头都可以监视其父节点、自身和直接子节点。
// 计算监控树的所有节点所需的最小摄像头数量。
// 时间复杂度：O(n)，空间复杂度：O(h)

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

// 方法1：DFS后序返回三种状态（推荐）
// 每个节点返回三种状态：
// 0: 该节点未被覆盖（需要父节点监视它）
// 1: 该节点已被覆盖（但本节点没装摄像头）
// 2: 该节点装了摄像头
// 决策规则：
// - 任一孩子返回 0（未覆盖）-> 当前必须装摄像头
// - 任一孩子返回 2（装了摄像头）-> 当前已被覆盖
// - 否则（两个孩子都返回 1）-> 当前未被覆盖，返回 0
let cameraCount: number;

function minCameraCover(root: TreeNode | null): number {
  cameraCount = 0;
  const rootStatus = dfs(root);
  // 若根节点未被覆盖，需要再装一个摄像头
  if (rootStatus === 0) cameraCount++;
  return cameraCount;
}

function dfs(node: TreeNode | null): number {
  if (node === null) return 1; // 空节点视为已覆盖，不影响父节点决策

  const left = dfs(node.left);
  const right = dfs(node.right);

  // 任一孩子未被覆盖，当前节点必须装摄像头
  if (left === 0 || right === 0) {
    cameraCount++;
    return 2;
  }

  // 任一孩子装了摄像头，当前节点已被覆盖
  if (left === 2 || right === 2) {
    return 1;
  }

  // 两个孩子都已覆盖（但都没装摄像头），当前节点未被覆盖
  return 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 110. 监控二叉树 =====");

// 辅助函数：从数组构建二叉树（层序）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// 测试1: [0,0,null,0,0] 需要1个摄像头
//     0
//    /
//   0
//  / \
// 0   0
// 在中间节点装摄像头即可监视所有节点
const tree1 = buildTree([0, 0, null, 0, 0]);
console.log("测试1:", minCameraCover(tree1)); // 期望 1

// 测试2: [0,0,null,0,null,0,null,null,0] 需要2个摄像头
const tree2 = buildTree([0, 0, null, 0, null, 0, null, null, 0]);
console.log("测试2:", minCameraCover(tree2)); // 期望 2

// 测试3: 单节点，需要1个摄像头
const tree3 = buildTree([0]);
console.log("测试3:", minCameraCover(tree3)); // 期望 1

// 测试4: 两个节点
const tree4 = buildTree([0, 0]);
console.log("测试4:", minCameraCover(tree4)); // 期望 1

// 测试5: 三个节点满二叉树
const tree5 = buildTree([0, 0, 0]);
console.log("测试5:", minCameraCover(tree5)); // 期望 1

export {};
