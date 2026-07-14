// ============================================================
// 026. 嵌套列表加权和 II
// ============================================================
// LeetCode 364. Nested List Weight Sum II
// 深度从下往上数（叶子深度为1），求加权和。

interface NestedInteger {
  isInteger(): boolean;
  getInteger(): number | null;
  getList(): NestedInteger[];
}

// ------------------------------------------------------------
// 方法1：BFS 分层累加
// ------------------------------------------------------------
// 每处理一层，把之前累积的 sum 再加一次（相当于深度+1），再加当前层整数。
// 时间 O(n)，空间 O(n)。
function depthSumInverse(nestedList: NestedInteger[]): number {
  let weighted = 0;
  let unweighted = 0;
  let queue: NestedInteger[] = [...nestedList];
  while (queue.length > 0) {
    const next: NestedInteger[] = [];
    for (const ni of queue) {
      if (ni.isInteger()) {
        unweighted += ni.getInteger()!;
      } else {
        next.push(...ni.getList());
      }
    }
    weighted += unweighted; // 之前层的和再累加一次（深度+1）
    queue = next;
  }
  return weighted;
}

// ------------------------------------------------------------
// 方法2：DFS 先求最大深度
// ------------------------------------------------------------
function depthSumInverseDFS(nestedList: NestedInteger[]): number {
  function maxDepth(list: NestedInteger[]): number {
    let d = 1;
    for (const ni of list) {
      if (!ni.isInteger()) d = Math.max(d, maxDepth(ni.getList()) + 1);
    }
    return d;
  }
  const md = maxDepth(nestedList);
  function dfs(list: NestedInteger[], depth: number): number {
    let sum = 0;
    for (const ni of list) {
      if (ni.isInteger()) {
        sum += ni.getInteger()! * depth;
      } else {
        sum += dfs(ni.getList(), depth - 1);
      }
    }
    return sum;
  }
  return dfs(nestedList, md);
}

// 测试辅助
class NI implements NestedInteger {
  constructor(private val: number | NestedInteger[]) {}
  isInteger(): boolean {
    return typeof this.val === "number";
  }
  getInteger(): number | null {
    return typeof this.val === "number" ? this.val : null;
  }
  getList(): NestedInteger[] {
    return typeof this.val === "number" ? [] : this.val;
  }
}

function test(): void {
  // [[1,1],2,[1,1]] -> 1*2+1*2+2*2+1*2+1*2 = 8+? 实际期望 8
  const list = [new NI([new NI(1), new NI(1)]), new NI(2), new NI([new NI(1), new NI(1)])];
  console.log("测试1 - BFS:", depthSumInverse(list), "期望: 8");
  console.log("测试2 - DFS:", depthSumInverseDFS(list), "期望: 8");
}

test();

export {};
