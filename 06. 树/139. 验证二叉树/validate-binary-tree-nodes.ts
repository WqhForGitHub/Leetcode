// ============================================================
// 139. 验证二叉树
// ============================================================
// LeetCode 1361. Validate Binary Tree Nodes
// 给定 n 个二叉树节点，编号 0 到 n-1，以及 leftChild 和 rightChild 数组，
// 判断这些节点是否构成一棵有效的二叉树。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：并查集+入度检查（推荐）
// 有效二叉树条件：1) 一个根（入度为0）；2) 其余节点入度均为1；
// 3) 无环（并查集合并时检测）；4) 全部连通
function validateBinaryTreeNodes(
  n: number,
  leftChild: number[],
  rightChild: number[]
): boolean {
  const parent = new Array(n).fill(0).map((_, i) => i);
  const indegree = new Array(n).fill(0);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x: number, y: number): boolean {
    const px = find(x);
    const py = find(y);
    if (px === py) return false; // 已连通，再连会成环
    parent[px] = py;
    return true;
  }

  // 统计入度，并检查重复父节点
  for (let i = 0; i < n; i++) {
    const l = leftChild[i];
    const r = rightChild[i];
    if (l !== -1) {
      indegree[l]++;
      if (indegree[l] > 1) return false; // 入度>1，不合法
      if (!union(i, l)) return false; // 成环
    }
    if (r !== -1) {
      indegree[r]++;
      if (indegree[r] > 1) return false;
      if (!union(i, r)) return false;
    }
  }

  // 必须有且仅有一个根（入度为0）
  let rootCount = 0;
  for (let i = 0; i < n; i++) {
    if (indegree[i] === 0) rootCount++;
  }
  return rootCount === 1;
}

// 方法2：BFS
// 找到唯一入度为0的根，从根开始BFS，若能访问所有节点且无重复访问，则合法
function validateBinaryTreeNodesBFS(
  n: number,
  leftChild: number[],
  rightChild: number[]
): boolean {
  const indegree = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    if (leftChild[i] !== -1) indegree[leftChild[i]]++;
    if (rightChild[i] !== -1) indegree[rightChild[i]]++;
  }

  // 找根
  let root = -1;
  for (let i = 0; i < n; i++) {
    if (indegree[i] === 0) {
      if (root !== -1) return false; // 多个根
      root = i;
    }
  }
  if (root === -1) return false; // 无根

  const visited = new Array(n).fill(false);
  const queue: number[] = [root];
  visited[root] = true;
  let count = 0;

  while (queue.length > 0) {
    const node = queue.shift()!;
    count++;
    const l = leftChild[node];
    const r = rightChild[node];
    if (l !== -1) {
      if (visited[l]) return false; // 重复访问，有环或多父
      visited[l] = true;
      queue.push(l);
    }
    if (r !== -1) {
      if (visited[r]) return false;
      visited[r] = true;
      queue.push(r);
    }
  }

  return count === n;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 139. 验证二叉树 =====");

// 测试1: n=4, leftChild=[1,-1,3,-1], rightChild=[2,-1,-1,-1]
//  0
// / \
// 1  2
//    /
//   3
// 合法
console.log("测试1 并查集:", validateBinaryTreeNodes(4, [1, -1, 3, -1], [2, -1, -1, -1])); // true
console.log("测试1 BFS:", validateBinaryTreeNodesBFS(4, [1, -1, 3, -1], [2, -1, -1, -1])); // true

// 测试2: n=4, leftChild=[1,-1,3,-1], rightChild=[2,3,-1,-1]
// 节点3有两个父节点(2和1)，不合法
console.log("测试2 并查集:", validateBinaryTreeNodes(4, [1, -1, 3, -1], [2, 3, -1, -1])); // false
console.log("测试2 BFS:", validateBinaryTreeNodesBFS(4, [1, -1, 3, -1], [2, 3, -1, -1])); // false

// 测试3: n=2, leftChild=[1,0], rightChild=[-1,-1]
// 0->1, 1->0 成环
console.log("测试3 并查集:", validateBinaryTreeNodes(2, [1, 0], [-1, -1])); // false
console.log("测试3 BFS:", validateBinaryTreeNodesBFS(2, [1, 0], [-1, -1])); // false

// 测试4: n=3, leftChild=[1,-1,-1], rightChild=[-1,-1,1]
// 0->1, 2->1, 节点1入度2
console.log("测试4 并查集:", validateBinaryTreeNodes(3, [1, -1, -1], [-1, -1, 1])); // false
console.log("测试4 BFS:", validateBinaryTreeNodesBFS(3, [1, -1, -1], [-1, -1, 1])); // false

export {};
