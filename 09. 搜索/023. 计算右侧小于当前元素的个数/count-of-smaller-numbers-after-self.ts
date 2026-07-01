// ============================================================
// 023. 计算右侧小于当前元素的个数
// ============================================================
// LeetCode 315. Count of Smaller Numbers After Self
// 对于数组中每个元素，统计其右侧比它小的元素个数。

// 方法1：归并排序 + 索引跟踪（O(n log n)）
function countSmaller(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(0);
  const indices = nums.map((_, i) => i);
  const temp = new Array(n);

  function mergeSort(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  }

  function merge(left: number, mid: number, right: number) {
    for (let i = left; i <= right; i++) temp[i] = indices[i];
    let i = left;
    let j = mid + 1;
    let k = left;
    let rightCount = 0;
    while (i <= mid || j <= right) {
      if (i > mid) {
        indices[k++] = temp[j++];
      } else if (j > right) {
        result[temp[i]] += rightCount;
        indices[k++] = temp[i++];
      } else if (nums[temp[i]] <= nums[temp[j]]) {
        result[temp[i]] += rightCount;
        indices[k++] = temp[i++];
      } else {
        rightCount++;
        indices[k++] = temp[j++];
      }
    }
  }

  mergeSort(0, n - 1);
  return result;
}

// 方法2：二叉搜索树（O(n log n) 平均）
function countSmallerBST(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(0);
  class BSTNode {
    val: number;
    left: BSTNode | null = null;
    right: BSTNode | null = null;
    leftCount = 0; // 左子树节点数
    count = 1; // 相同值计数
    constructor(val: number) {
      this.val = val;
    }
  }
  let root: BSTNode | null = null;
  for (let i = n - 1; i >= 0; i--) {
    root = insert(root, nums[i], result, i);
  }
  return result;
}

function insert(
  node: BSTNode | null,
  val: number,
  result: number[],
  idx: number
): BSTNode {
  if (!node) return new BSTNode(val);
  if (val < node.val) {
    node.leftCount++;
    node.left = insert(node.left, val, result, idx);
  } else if (val > node.val) {
    result[idx] += node.leftCount + node.count;
    node.right = insert(node.right, val, result, idx);
  } else {
    node.count++;
    result[idx] += node.leftCount;
  }
  return node;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 023. 计算右侧小于当前元素的个数 =====");
console.log("归并 [5,2,6,1]:", countSmaller([5, 2, 6, 1])); // [2,1,1,0]
console.log("BST [5,2,6,1]:", countSmallerBST([5, 2, 6, 1])); // [2,1,1,0]
console.log("归并 [-1]:", countSmaller([-1])); // [0]

export {};
