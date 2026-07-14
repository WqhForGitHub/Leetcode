// ============================================================
// 052. 验证二叉树
// ============================================================
// LeetCode 1361. Validate Binary Tree Nodes
// n 个节点（编号 0..n-1），leftChild/rightChild 数组（-1 表示无）。
// 判断是否构成一棵合法二叉树：恰有一个根，每个非根节点入度恰为 1，无环，全连通。
// 时间复杂度：O(n)，空间复杂度：O(n)

// ============================================================
// 方法1：入度统计 + BFS 连通检测（推荐）
// 时间复杂度：O(n)，空间复杂度：O(n)
// ============================================================
function validateBinaryTreeNodesBFS(n: number, leftChild: number[], rightChild: number[]): boolean {
  const indeg = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    const l = leftChild[i];
    const r = rightChild[i];
    if (l !== -1) indeg[l]++;
    if (r !== -1) indeg[r]++;
  }

  // 恰有一个根（入度为 0）
  let root = -1;
  for (let i = 0; i < n; i++) {
    if (indeg[i] === 0) {
      if (root !== -1) return false; // 多个根
      root = i;
    }
  }
  if (root === -1) return false; // 无根（成环）

  // 检查非根节点入度恰为 1
  for (let i = 0; i < n; i++) {
    if (i !== root && indeg[i] !== 1) return false;
  }

  // BFS 从根出发，验证全连通且无环
  const visited = new Array(n).fill(false);
  const queue: number[] = [root];
  visited[root] = true;
  let count = 0;
  while (queue.length > 0) {
    const u = queue.shift()!;
    count++;
    const l = leftChild[u];
    const r = rightChild[u];
    for (const v of [l, r]) {
      if (v === -1) continue;
      if (visited[v]) return false; // 重复访问 -> 有环/多父
      visited[v] = true;
      queue.push(v);
    }
  }
  return count === n;
}

// ============================================================
// 方法2：并查集
// 时间复杂度：O(n α(n))，空间复杂度：O(n)
// ============================================================
class UnionFind {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(x: number, y: number): boolean {
    const px = this.find(x);
    const py = this.find(y);
    if (px === py) return false; // 已同集合 -> 成环
    if (this.rank[px] < this.rank[py]) this.parent[px] = py;
    else if (this.rank[px] > this.rank[py]) this.parent[py] = px;
    else {
      this.parent[py] = px;
      this.rank[px]++;
    }
    return true;
  }
}

function validateBinaryTreeNodesUF(n: number, leftChild: number[], rightChild: number[]): boolean {
  const uf = new UnionFind(n);
  const indeg = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (const v of [leftChild[i], rightChild[i]]) {
      if (v === -1) continue;
      indeg[v]++;
      if (indeg[v] > 1) return false; // 多父
      // v 的根需与 i 不同；若已连通则成环
      if (uf.find(i) === uf.find(v)) return false;
      uf.union(i, v);
    }
  }
  // 恰一个根
  let roots = 0;
  for (let i = 0; i < n; i++) {
    if (uf.find(i) === i) roots++;
  }
  return roots === 1;
}

// 统一入口
function validateBinaryTreeNodes(n: number, leftChild: number[], rightChild: number[]): boolean {
  return validateBinaryTreeNodesBFS(n, leftChild, rightChild);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 052. 验证二叉树 =====");
// 测试1: n=4, left=[1,-1,3,-1], right=[2,-1,-1,-1] -> true
console.log(validateBinaryTreeNodes(4, [1, -1, 3, -1], [2, -1, -1, -1])); // 期望 true
console.log(validateBinaryTreeNodesUF(4, [1, -1, 3, -1], [2, -1, -1, -1])); // 期望 true
// 测试2: n=4, left=[1,-1,3,-1], right=[2,3,-1,-1] -> false（3 有两个父）
console.log(validateBinaryTreeNodes(4, [1, -1, 3, -1], [2, 3, -1, -1])); // 期望 false
// 测试3: n=2, left=[1,0], right=[-1,-1] -> false（成环）
console.log(validateBinaryTreeNodes(2, [1, 0], [-1, -1])); // 期望 false
// 测试4: n=3, left=[1,-1,-1], right=[-1,-1,1] -> false（不连通）
console.log(validateBinaryTreeNodes(3, [1, -1, -1], [-1, -1, 1])); // 期望 false

export {};
