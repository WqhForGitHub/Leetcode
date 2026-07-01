// ============================================================
// 077. 账户合并
// ============================================================
// LeetCode 721. Accounts Merge
// 合并共享任一邮箱的账户（视为同一人），每个账户含姓名和若干邮箱。

// 方法1：并查集 + 邮箱映射（O(n * α)）
// 思路：将同一账户内所有邮箱与第一个邮箱 union；最后按根邮箱分组，
// 组内邮箱排序，前置账户所有者姓名。
function accountsMerge(accounts: string[][]): string[][] {
  const parent = new Map<string, string>();
  const owner = new Map<string, string>();

  const find = (x: string): string => {
    const p = parent.get(x);
    if (p === undefined) return x;
    if (p !== x) parent.set(x, find(p));
    return parent.get(x)!;
  };
  const union = (x: string, y: string): void => {
    const rx = find(x);
    const ry = find(y);
    if (rx !== ry) parent.set(rx, ry);
  };

  for (const acc of accounts) {
    const name = acc[0];
    for (let i = 1; i < acc.length; i++) {
      const email = acc[i];
      owner.set(email, name);
      if (!parent.has(email)) parent.set(email, email);
      if (i > 1) union(acc[1], acc[i]);
    }
  }

  const groups = new Map<string, string[]>();
  for (const email of parent.keys()) {
    const root = find(email);
    let arr = groups.get(root);
    if (!arr) {
      arr = [];
      groups.set(root, arr);
    }
    arr.push(email);
  }

  const result: string[][] = [];
  for (const [root, emails] of groups) {
    emails.sort();
    const name = owner.get(root)!;
    result.push([name, ...emails]);
  }
  return result;
}

// 方法2：DFS 邻接图（O(n)）
// 思路：同一账户内所有邮箱与第一个邮箱建无向边，对每个连通分量做 DFS 收集邮箱。
function accountsMerge2(accounts: string[][]): string[][] {
  const graph = new Map<string, Set<string>>();
  const owner = new Map<string, string>();

  for (const acc of accounts) {
    const name = acc[0];
    for (let i = 1; i < acc.length; i++) {
      const email = acc[i];
      owner.set(email, name);
      if (!graph.has(email)) graph.set(email, new Set());
      if (i > 1) {
        graph.get(acc[1])!.add(acc[i]);
        graph.get(acc[i])!.add(acc[1]);
      }
    }
  }

  const visited = new Set<string>();
  const result: string[][] = [];
  for (const email of graph.keys()) {
    if (visited.has(email)) continue;
    const component: string[] = [];
    const stack: string[] = [email];
    visited.add(email);
    while (stack.length > 0) {
      const cur = stack.pop()!;
      component.push(cur);
      for (const neighbor of graph.get(cur)!) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          stack.push(neighbor);
        }
      }
    }
    component.sort();
    const name = owner.get(email)!;
    result.push([name, ...component]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 077. 账户合并 =====");
const acc77 = [
  ["John", "johnsmith@mail.com", "john_newyork@mail.com"],
  ["John", "johnsmith@mail.com", "john00@mail.com"],
  ["Mary", "mary@mail.com"],
  ["John", "johnnybravo@mail.com"],
];
console.log("方法1:", JSON.stringify(accountsMerge(acc77)));
console.log("方法2:", JSON.stringify(accountsMerge2(acc77)));

export {};
