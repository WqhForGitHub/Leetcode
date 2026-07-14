// ============================================================
// 057. 从叶结点开始的最小字符串
// ============================================================
// LeetCode 988. Smallest String Starting From Leaf
// 给定一棵二叉树，每个结点值为 0-25 代表字母 a-z。从任一叶子到根的路径
// 反转后构成一个字符串，求字典序最小的字符串。
// 时间复杂度：O(N * H), 空间复杂度：O(H)，N 为结点数，H 为树高

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

// 方法1：DFS回溯 (推荐)
// 沿路径向下收集字符，到达叶子时翻转得到字符串并比较
// 时间复杂度 O(N*H), 空间复杂度 O(H)
function smallestFromLeaf(root: TreeNode | null): string {
  let ans: string | null = null;
  const path: number[] = [];

  const dfs = (node: TreeNode | null): void => {
    if (node === null) return;
    // 入栈：当前结点字符
    path.push(node.val);
    // 叶子结点：构造字符串比较
    if (node.left === null && node.right === null) {
      // 从叶到根的反转字符串
      let s = "";
      for (let i = path.length - 1; i >= 0; i--) {
        s += String.fromCharCode(path[i] + 97);
      }
      if (ans === null || s < ans) {
        ans = s;
      }
    } else {
      dfs(node.left);
      dfs(node.right);
    }
    // 回溯：弹出当前结点
    path.pop();
  };

  dfs(root);
  return ans ?? "";
}

// 方法2：DFS + 直接比较字符
// 不构造完整字符串，使用字符数组逐字符比较，更新最优路径
// 时间复杂度 O(N*H), 空间复杂度 O(H)
function smallestFromLeaf2(root: TreeNode | null): string {
  let best: number[] | null = null;
  const path: number[] = [];

  const dfs = (node: TreeNode | null): void => {
    if (node === null) return;
    path.push(node.val);
    if (node.left === null && node.right === null) {
      // 反转得到 从叶到根
      const rev: number[] = [];
      for (let i = path.length - 1; i >= 0; i--) rev.push(path[i]);
      if (best === null || compareArr(rev, best) < 0) {
        best = rev.slice();
      }
    } else {
      dfs(node.left);
      dfs(node.right);
    }
    path.pop();
  };

  dfs(root);
  if (best === null) return "";
  const arr: number[] = best;
  let res = "";
  for (const v of arr) res += String.fromCharCode(v + 97);
  return res;
}

// 比较两个数字数组字典序
function compareArr(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return a.length - b.length;
}

// 由数组构造二叉树（层序，null 表示空位）
function buildTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
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

// ============================================================
// 测试
// ============================================================
console.log("===== 057. 从叶结点开始的最小字符串 =====");
console.log(smallestFromLeaf(buildTree([0, 1, 2, 3, 4, 3, 4]))); // 期望结果: "dba"
console.log(smallestFromLeaf2(buildTree([0, 1, 2, 3, 4, 3, 4]))); // 期望结果: "dba"
console.log(smallestFromLeaf(buildTree([25, 1, 3, 1, 3, 0, 2]))); // 期望结果: "adz"

export {};
