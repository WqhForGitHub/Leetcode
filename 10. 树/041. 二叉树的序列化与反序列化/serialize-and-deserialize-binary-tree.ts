// ============================================================
// 041. 二叉树的序列化与反序列化
// ============================================================
// LeetCode 297. Serialize and Deserialize Binary Tree
// 设计一个算法来序列化和反序列化一棵二叉树。
// 时间复杂度：O(n)，空间复杂度：O(n)

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

// 方法1：BFS 层序（推荐）
class CodecBFS {
  serialize(root: TreeNode | null): string {
    if (root === null) return "null";
    const result: string[] = [];
    const queue: (TreeNode | null)[] = [root];
    while (queue.length > 0) {
      const node = queue.shift()!;
      if (node === null) {
        result.push("null");
      } else {
        result.push(String(node.val));
        queue.push(node.left);
        queue.push(node.right);
      }
    }
    // 去掉末尾多余的 null
    while (result.length > 0 && result[result.length - 1] === "null") {
      result.pop();
    }
    return result.join(",");
  }

  deserialize(data: string): TreeNode | null {
    const parts = data.split(",");
    if (parts.length === 0 || parts[0] === "null") return null;
    const root = new TreeNode(Number(parts[0]));
    const queue: TreeNode[] = [root];
    let i = 1;
    while (queue.length > 0 && i < parts.length) {
      const node = queue.shift()!;
      if (i < parts.length && parts[i] !== "null") {
        node.left = new TreeNode(Number(parts[i]));
        queue.push(node.left);
      }
      i++;
      if (i < parts.length && parts[i] !== "null") {
        node.right = new TreeNode(Number(parts[i]));
        queue.push(node.right);
      }
      i++;
    }
    return root;
  }
}

// 方法2：DFS 前序
class CodecDFS {
  serialize(root: TreeNode | null): string {
    const parts: string[] = [];
    function dfs(node: TreeNode | null): void {
      if (node === null) {
        parts.push("null");
        return;
      }
      parts.push(String(node.val));
      dfs(node.left);
      dfs(node.right);
    }
    dfs(root);
    return parts.join(",");
  }

  deserialize(data: string): TreeNode | null {
    const parts = data.split(",");
    let i = 0;
    function dfs(): TreeNode | null {
      if (i >= parts.length || parts[i] === "null") {
        i++;
        return null;
      }
      const node = new TreeNode(Number(parts[i]));
      i++;
      node.left = dfs();
      node.right = dfs();
      return node;
    }
    return dfs();
  }
}

// 辅助函数：层序输出
function levelOrder(root: TreeNode | null): (number | null)[] {
  if (root === null) return [];
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 041. 二叉树的序列化与反序列化 =====");
const tree41 = new TreeNode(1, new TreeNode(2), new TreeNode(3, new TreeNode(4), new TreeNode(5)));
const codecBFS = new CodecBFS();
const data41 = codecBFS.serialize(tree41);
console.log("BFS 序列化:", data41);
const tree41b = codecBFS.deserialize(data41);
console.log("BFS 反序列化层序:", levelOrder(tree41b)); // 期望 [1,2,3,4,5]

const codecDFS = new CodecDFS();
const data41d = codecDFS.serialize(tree41);
console.log("DFS 序列化:", data41d);
const tree41d = codecDFS.deserialize(data41d);
console.log("DFS 反序列化层序:", levelOrder(tree41d)); // 期望 [1,2,3,4,5]

console.log("空树 BFS:", codecBFS.serialize(null)); // 期望 "null"
console.log("空树 DFS:", codecDFS.serialize(null)); // 期望 "null"

export {};
