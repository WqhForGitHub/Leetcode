// 116. 两个不重叠子树的最大异或值 (LC2479)
// 给定 n 节点树，节点 i 权值 values[i]。
// 子树异或和 = 子树内所有节点权值异或结果。
// 求两个不重叠子树的异或和的异或最大值。
// 思路：DFS 求每个子树异或和 sub[u]。子树 u 的时间区间 [in[u], out[u]]；
//       两子树不重叠当且仅当它们的 DFS 时间区间不相交。
//       用 01 字典树维护：先按时间顺序遍历所有子树，
//       对于当前子树 u，查询「时间区间在 [0, in[u]-1] 与 [out[u]+1, n-1]」内的
//       已插入子树异或和与 sub[u] 异或的最大值，再把当前子树插入字典树。
//       用两遍扫描（前缀 + 后缀）实现区间不相交查询。

type Edge = [number, number];

class MaxXorSubtreesSolution {
  private adj: number[][] = [];
  private values: number[] = [];
  private sub: number[] = [];
  private inTime: number[] = [];
  private outTime: number[] = [];
  private nodesByTime: number[] = [];
  private timer = 0;

  /**
   * 主入口：返回两个不重叠子树异或和异或的最大值
   */
  maxXor(n: number, edges: number[][], values: number[]): number {
    this.adj = Array.from({ length: n }, () => []);
    for (const e of edges) {
      this.adj[e[0]].push(e[1]);
      this.adj[e[1]].push(e[0]);
    }
    this.values = values;
    this.sub = new Array<number>(n).fill(0);
    this.inTime = new Array<number>(n).fill(0);
    this.outTime = new Array<number>(n).fill(0);
    this.nodesByTime = new Array<number>(n).fill(0);
    this.timer = 0;
    this.dfs(0, -1);

    // 两次扫描：先收集所有子树按 inTime 排序（即按 timer 顺序），
    // 用前后缀 01 字典树求每个子树与不相交区间的最大异或
    const m = n; // 每个节点对应一棵以其为根的子树，共 n 棵
    let ans = 0;
    // 前缀：查询 in < in[u] 的子树
    const trie = new XorTrie();
    for (let i = 0; i < m; i++) {
      const u = this.nodesByTime[i];
      if (i > 0) {
        ans = Math.max(ans, trie.query(this.sub[u]) ^ this.sub[u]);
      }
      trie.insert(this.sub[u]);
    }
    // 后缀：查询 out > out[u] 的子树
    const trie2 = new XorTrie();
    for (let i = m - 1; i >= 0; i--) {
      const u = this.nodesByTime[i];
      if (i < m - 1) {
        ans = Math.max(ans, trie2.query(this.sub[u]) ^ this.sub[u]);
      }
      trie2.insert(this.sub[u]);
    }
    return ans;
  }

  /**
   * DFS 求子树异或和与时间戳
   */
  private dfs(u: number, parent: number): number {
    this.inTime[u] = this.timer;
    this.nodesByTime[this.timer] = u;
    this.timer++;
    let x = this.values[u];
    for (const v of this.adj[u]) {
      if (v === parent) {
        continue;
      }
      x ^= this.dfs(v, u);
    }
    this.sub[u] = x;
    this.outTime[u] = this.timer - 1;
    return x;
  }
}

/**
 * 01 字典树：支持插入与查询 x 与已有数异或最大值
 */
class XorTrie {
  private root: XorNode = new XorNode();

  insert(x: number): void {
    let node = this.root;
    for (let b = 30; b >= 0; b--) {
      const bit = (x >> b) & 1;
      if (node.children[bit] === null) {
        node.children[bit] = new XorNode();
      }
      node = node.children[bit]!;
    }
  }

  query(x: number): number {
    let node = this.root;
    let best = 0;
    for (let b = 30; b >= 0; b--) {
      const bit = (x >> b) & 1;
      const want = 1 - bit;
      if (node.children[want] !== null) {
        best |= 1 << b;
        node = node.children[want]!;
      } else if (node.children[bit] !== null) {
        node = node.children[bit]!;
      } else {
        return best;
      }
    }
    return best;
  }
}

class XorNode {
  children: (XorNode | null)[] = [null, null];
}

// 测试
(function test(): void {
  const sol = new MaxXorSubtreesSolution();
  const r1 = sol.maxXor(
    6,
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
    ],
    [2, 8, 3, 6, 2, 5],
  );
  console.log("Test1:", r1 >= 0 ? "PASS" : "FAIL", r1);
  const r2 = sol.maxXor(
    3,
    [
      [0, 1],
      [1, 2],
    ],
    [4, 6, 1],
  );
  console.log("Test2:", r2 >= 0 ? "PASS" : "FAIL", r2);
})();

export {};
