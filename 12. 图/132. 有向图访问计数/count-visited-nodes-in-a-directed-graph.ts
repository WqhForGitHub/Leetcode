// 132. 有向图访问计数
// LC2876. Count Visited Nodes in a Directed Graph
// 给定 n 个节点的有向图，每个节点恰好有一条出边 edges[i]。
// 从每个节点出发，求能访问到的不同节点个数。内向基环树找环 + DP。
//
// 思路：
// 1. 这是一张函数图（每个节点出度恰为 1），必然存在至少一个环。
// 2. 对每个节点沿出边走，记录路径；遇到已计算节点则直接复用；
//    遇到当前路径中的节点则发现环，环上节点答案 = 环长，
//    环外节点答案 = 1 + 下一个节点的答案。
// 3. 用状态数组 0=未访问 1=访问中 2=已完成 实现迭代式求解。

type State = 0 | 1 | 2;

class Solution {
  countVisitedNodes(edges: number[]): number[] {
    const n = edges.length;
    const ans: number[] = new Array(n).fill(0);
    const state: State[] = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      if (state[i] !== 0) {
        continue;
      }
      const path: number[] = [];
      let cur = i;
      while (state[cur] === 0) {
        state[cur] = 1;
        path.push(cur);
        cur = edges[cur];
      }
      if (state[cur] === 1) {
        // 发现环：找到环起点
        let cycleStart = 0;
        while (path[cycleStart] !== cur) {
          cycleStart++;
        }
        const cycleLen = path.length - cycleStart;
        for (let k = cycleStart; k < path.length; k++) {
          ans[path[k]] = cycleLen;
          state[path[k]] = 2;
        }
        // 环外节点（在路径上环之前的节点）
        for (let k = cycleStart - 1; k >= 0; k--) {
          ans[path[k]] = ans[edges[path[k]]] + 1;
          state[path[k]] = 2;
        }
      } else {
        // 命中已完成节点：直接复用
        for (let k = path.length - 1; k >= 0; k--) {
          ans[path[k]] = ans[edges[path[k]]] + 1;
          state[path[k]] = 2;
        }
      }
    }

    return ans;
  }

  runTests(): void {
    const cases: { edges: number[]; expected: number[] }[] = [
      { edges: [1, 2, 0, 0], expected: [3, 3, 3, 4] },
      { edges: [1, 2, 3, 4, 0], expected: [5, 5, 5, 5, 5] },
      { edges: [1, 0, 1], expected: [2, 2, 2] },
    ];
    for (const c of cases) {
      const got = this.countVisitedNodes(c.edges);
      const ok = got.length === c.expected.length && got.every((v, i) => v === c.expected[i]);
      console.log(
        `edges=[${c.edges.join(",")}] => [${got.join(", ")}] ${ok ? "OK" : "FAIL exp=[" + c.expected.join(", ") + "]"}`,
      );
    }
  }
}

const s132 = new Solution();
s132.runTests();

export {};
