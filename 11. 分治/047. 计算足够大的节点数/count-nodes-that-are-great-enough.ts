// ============================================================
// 047. 计算足够大的节点数
// ============================================================
// LeetCode 2792. Count Nodes That Are Great Enough
// 给定一棵二叉树的根节点 root 和整数 k。若节点满足以下两个条件则称其“足够大”：
// 1) 其子树中至少有 k 个节点（子树包含自身）；
// 2) 其值大于其子树中至少 k 个节点的值（即子树中值严格小于该节点值的节点数 >= k）。
// 返回足够大的节点数。
// 时间复杂度：O(n^2) 最坏 / O(n log n) 平衡, 空间复杂度：O(n)

// 二叉树节点定义
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

// 由层序数组构建二叉树（null 表示空节点），便于测试
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root: TreeNode = new TreeNode(arr[0] as number);
  const queue: TreeNode[] = [root];
  let i: number = 1;
  while (queue.length > 0 && i < arr.length) {
    const node: TreeNode = queue.shift()!;
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

// 二分：返回有序数组中严格小于 target 的元素个数
function countLess(arr: number[], target: number): number {
  let lo: number = 0;
  let hi: number = arr.length;
  while (lo < hi) {
    const mid: number = (lo + hi) >> 1;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// 有序插入（二分找位置后 splice）
function insertSorted(arr: number[], v: number): void {
  let lo: number = 0;
  let hi: number = arr.length;
  while (lo < hi) {
    const mid: number = (lo + hi) >> 1;
    if (arr[mid] < v) lo = mid + 1;
    else hi = mid;
  }
  arr.splice(lo, 0, v);
}

// 合并两个升序数组
function mergeSorted(a: number[], b: number[]): number[] {
  const merged: number[] = [];
  let i: number = 0;
  let j: number = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) merged.push(a[i++]);
    else merged.push(b[j++]);
  }
  while (i < a.length) merged.push(a[i++]);
  while (j < b.length) merged.push(b[j++]);
  return merged;
}

// 方法1：分治后序遍历 + 线性合并（推荐）
// 对每个节点，递归得到左右子树的“升序值数组”，线性合并后再二分插入自身值，
// 得到该子树的升序值数组。用二分统计子树中严格小于 node.val 的节点数。
// 时间复杂度 O(n^2) 最坏（链状），O(n log n) 平衡；空间复杂度 O(n)
function countGreatEnoughNodes(root: TreeNode | null, k: number): number {
  let res: number = 0;
  function dfs(node: TreeNode | null): number[] {
    if (node === null) return [];
    const left: number[] = dfs(node.left);
    const right: number[] = dfs(node.right);
    const merged: number[] = mergeSorted(left, right);
    insertSorted(merged, node.val); // 现包含自身，长度 = 子树大小
    const cnt: number = countLess(merged, node.val); // 子树中值 < node.val 的个数
    if (merged.length >= k && cnt >= k) res++;
    return merged;
  }
  dfs(root);
  return res;
}

// 方法2：分治后序 + 小并大（small-to-large）
// 始终以较大的子树升序数组为主体，将较小子树的元素逐个二分插入，
// 再插入自身值。减少合并工作量。时间复杂度 O(n^2) 最坏（数组 splice 移动），
// 平均优于方法1；空间复杂度 O(n)
function countGreatEnoughNodesS2L(root: TreeNode | null, k: number): number {
  let res: number = 0;
  function dfs(node: TreeNode | null): number[] {
    if (node === null) return [];
    const left: number[] = dfs(node.left);
    const right: number[] = dfs(node.right);
    // 小并大：以较大数组为主体
    const big: number[] = left.length >= right.length ? left : right;
    const small: number[] = left.length >= right.length ? right : left;
    for (const v of small) insertSorted(big, v);
    insertSorted(big, node.val);
    const cnt: number = countLess(big, node.val);
    if (big.length >= k && cnt >= k) res++;
    return big;
  }
  dfs(root);
  return res;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 047. 计算足够大的节点数 =====");
console.log(countGreatEnoughNodes(buildTree([7, 6, 5, 4, 3, 2, 1]), 2)); // 期望结果: 3
console.log(countGreatEnoughNodes(buildTree([1, 2, 3]), 1)); // 期望结果: 0
console.log(countGreatEnoughNodes(buildTree([3, 2, 2]), 2)); // 期望结果: 1
console.log("--- 方法2测试 ---");
console.log(countGreatEnoughNodesS2L(buildTree([7, 6, 5, 4, 3, 2, 1]), 2)); // 期望结果: 3
console.log(countGreatEnoughNodesS2L(buildTree([1, 2, 3]), 1)); // 期望结果: 0
console.log(countGreatEnoughNodesS2L(buildTree([3, 2, 2]), 2)); // 期望结果: 1

export {};
