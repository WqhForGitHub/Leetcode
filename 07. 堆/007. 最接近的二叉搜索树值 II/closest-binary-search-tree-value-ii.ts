// ============================================================
// 007. 最接近的二叉搜索树值 II
// ============================================================
// LeetCode 272. Closest Binary Search Tree Value II
// 给定一棵二叉搜索树和一个目标值，找出树中最接近目标值的 k 个值。
// 时间复杂度：O(N log k)，空间复杂度：O(k)

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

class MaxHeap {
  private heap: Array<{ val: number; diff: number }> = [];
  get size(): number {
    return this.heap.length;
  }
  peek(): Array<{ val: number; diff: number }>[0] {
    return this.heap[0];
  }
  push(v: { val: number; diff: number }): void {
    this.heap.push(v);
    this.siftUp(this.heap.length - 1);
  }
  pop(): Array<{ val: number; diff: number }>[0] | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return top;
  }
  private less(a: number, b: number): boolean {
    return this.heap[a].diff > this.heap[b].diff; // 大根堆按 diff
  }
  private siftUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.less(i, p)) {
        [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
        i = p;
      } else break;
    }
  }
  private siftDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.less(l, s)) s = l;
      if (r < n && this.less(r, s)) s = r;
      if (s !== i) {
        [this.heap[i], this.heap[s]] = [this.heap[s], this.heap[i]];
        i = s;
      } else break;
    }
  }
}

// 方法1：大根堆，遍历整棵树（推荐）
function closestKValues(root: TreeNode | null, target: number, k: number): number[] {
  const heap = new MaxHeap();
  const dfs = (node: TreeNode | null): void => {
    if (node === null) return;
    const diff = Math.abs(node.val - target);
    if (heap.size < k) {
      heap.push({ val: node.val, diff });
    } else if (diff < heap.peek().diff) {
      heap.pop();
      heap.push({ val: node.val, diff });
    }
    dfs(node.left);
    dfs(node.right);
  };
  dfs(root);
  const res: number[] = [];
  while (heap.size > 0) res.push(heap.pop()!.val);
  return res;
}

// 方法2：中序遍历 + 双指针
function closestKValuesTwoPointers(root: TreeNode | null, target: number, k: number): number[] {
  const arr: number[] = [];
  const dfs = (node: TreeNode | null): void => {
    if (node === null) return;
    dfs(node.left);
    arr.push(node.val);
    dfs(node.right);
  };
  dfs(root);
  while (arr.length > k) {
    if (Math.abs(arr[0] - target) > Math.abs(arr[arr.length - 1] - target)) arr.shift();
    else arr.pop();
  }
  return arr;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 007. 最接近的二叉搜索树值 II =====");
const t7 = new TreeNode(4, new TreeNode(2, new TreeNode(1), new TreeNode(3)), new TreeNode(5));
console.log("大根堆:", closestKValues(t7, 3.714286, 2)); // 期望 [4,5]
console.log("双指针:", closestKValuesTwoPointers(t7, 3.714286, 2)); // 期望 [4,5]

export {};
