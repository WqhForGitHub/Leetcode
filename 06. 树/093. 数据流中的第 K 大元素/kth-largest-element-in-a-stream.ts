// ============================================================
// 093. 数据流中的第 K 大元素
// ============================================================
// LeetCode 703. Kth Largest Element in a Stream
// 设计一个找到数据流中第 k 大元素的类（注意是排序后的第 k 大元素，不是第 k 个不同的元素）。
// 实现 KthLargest 类，初始化时传入整数 k 和整数数组 nums，并提供 add(val) 方法，
// 返回当前数据流中第 k 大的元素。
// 时间复杂度：每次 add O(log k)；空间复杂度：O(k)

// 方法1：最小堆（推荐）
// 维护一个大小为 k 的最小堆，堆顶就是第 k 大元素。
// 当堆大小 < k，直接加入；否则新值大于堆顶时弹出堆顶并加入新值。

class MinHeap {
  private heap: number[] = [];

  get size(): number {
    return this.heap.length;
  }

  peek(): number | undefined {
    return this.heap[0];
  }

  push(val: number): void {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): number | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent] <= this.heap[index]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  private bubbleDown(index: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      if (left < n && this.heap[left] < this.heap[smallest]) smallest = left;
      if (right < n && this.heap[right] < this.heap[smallest]) smallest = right;
      if (smallest === index) break;
      [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
      index = smallest;
    }
  }
}

class KthLargest {
  private k: number;
  private minHeap: MinHeap;

  constructor(k: number, nums: number[]) {
    this.k = k;
    this.minHeap = new MinHeap();
    for (const num of nums) {
      this.add(num);
    }
  }

  add(val: number): number {
    if (this.minHeap.size < this.k) {
      this.minHeap.push(val);
    } else if (val > (this.minHeap.peek() as number)) {
      this.minHeap.pop();
      this.minHeap.push(val);
    }
    return this.minHeap.peek() as number;
  }
}

// 方法2：BST（简化实现）
// 用简化的二叉搜索树结构维护插入元素，中序遍历可得到排序结果。
// 注意：最坏情况会退化成 O(n)。这里展示思路。

class BSTNode {
  val: number;
  count: number; // 相同值计数
  left: BSTNode | null;
  right: BSTNode | null;
  size: number; // 子树（含重复）总节点数
  constructor(val: number) {
    this.val = val;
    this.count = 1;
    this.size = 1;
    this.left = null;
    this.right = null;
  }
}

class KthLargestBST {
  private root: BSTNode | null = null;
  private k: number;

  constructor(k: number, nums: number[]) {
    this.k = k;
    for (const num of nums) {
      this.insert(num);
    }
  }

  private insert(val: number): void {
    this.root = this.insertNode(this.root, val);
  }

  private insertNode(node: BSTNode | null, val: number): BSTNode {
    if (node === null) return new BSTNode(val);
    node.size++;
    if (val < node.val) {
      node.left = this.insertNode(node.left, val);
    } else if (val > node.val) {
      node.right = this.insertNode(node.right, val);
    } else {
      node.count++;
    }
    return node;
  }

  // 找第 k 大（即按中序倒序的第 k 个）
  private findKthLargest(node: BSTNode | null, k: number): number {
    if (node === null) return -1;
    const rightSize = node.right ? node.right.size : 0;
    if (k <= rightSize) {
      return this.findKthLargest(node.right, k);
    } else if (k <= rightSize + node.count) {
      return node.val;
    } else {
      return this.findKthLargest(node.left, k - rightSize - node.count);
    }
  }

  add(val: number): number {
    this.insert(val);
    return this.findKthLargest(this.root, this.k);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 093. 数据流中的第 K 大元素 =====");

// 测试1: KthLargest(3, [4,5,8,2])
// add 操作序列：3 -> 4 -> 5 -> 10 -> 9 -> 4
const kth1 = new KthLargest(3, [4, 5, 8, 2]);
console.log("最小堆 - add(3):", kth1.add(3)); // 期望 4
console.log("最小堆 - add(5):", kth1.add(5)); // 期望 5
console.log("最小堆 - add(10):", kth1.add(10)); // 期望 5
console.log("最小堆 - add(9):", kth1.add(9)); // 期望 8
console.log("最小堆 - add(4):", kth1.add(4)); // 期望 8

// 测试2: BST 实现
const kth2 = new KthLargestBST(3, [4, 5, 8, 2]);
console.log("BST - add(3):", kth2.add(3)); // 期望 4
console.log("BST - add(5):", kth2.add(5)); // 期望 5
console.log("BST - add(10):", kth2.add(10)); // 期望 5
console.log("BST - add(9):", kth2.add(9)); // 期望 8
console.log("BST - add(4):", kth2.add(4)); // 期望 8

// 测试3: k=1 单元素
const kth3 = new KthLargest(1, []);
console.log("k=1 - add(1):", kth3.add(1)); // 期望 1
console.log("k=1 - add(2):", kth3.add(2)); // 期望 2

export {};
