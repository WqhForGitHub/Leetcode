// ============================================================
// 134. 账户合并
// ============================================================
// LeetCode 721. Accounts Merge
// 给定账户列表 accounts，每个账户含姓名和若干邮箱，合并具有相同邮箱的账户。
// 时间复杂度：O(N * α(N) * L)，N 为邮箱数，L 为平均长度；空间复杂度：O(N*L)

class UnionFind {
  parent: Map<string, string> = new Map();

  find(x: string): string {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      return x;
    }
    // 路径压缩
    const p = this.parent.get(x)!;
    if (p === x) return x;
    const root = this.find(p);
    this.parent.set(x, root);
    return root;
  }

  union(x: string, y: string): void {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx !== ry) {
      this.parent.set(rx, ry);
    }
  }
}

function accountsMerge(accounts: string[][]): string[][] {
  const uf = new UnionFind();
  // 邮箱 -> 账户名
  const emailToName = new Map<string, string>();

  // 建立并查集
  for (const account of accounts) {
    const name = account[0];
    const firstEmail = account[1];
    emailToName.set(firstEmail, name);
    for (let i = 1; i < account.length; i++) {
      const email = account[i];
      emailToName.set(email, name);
      uf.union(firstEmail, email);
    }
  }

  // 根邮箱 -> 邮箱列表
  const rootToEmails = new Map<string, string[]>();
  for (const email of emailToName.keys()) {
    const root = uf.find(email);
    if (!rootToEmails.has(root)) {
      rootToEmails.set(root, []);
    }
    rootToEmails.get(root)!.push(email);
  }

  // 构造结果
  const result: string[][] = [];
  for (const [root, emails] of rootToEmails) {
    emails.sort();
    const name = emailToName.get(root)!;
    result.push([name, ...emails]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 134. 账户合并 =====");
console.log(
  accountsMerge([
    ["John", "johnsmith@mail.com", "john00@mail.com"],
    ["John", "johnnybravo@mail.com"],
    ["John", "johnsmith@mail.com", "john_newyork@mail.com"],
    ["Mary", "mary@mail.com"],
  ]),
);
// 期望:
// [["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],
//  ["John","johnnybravo@mail.com"],
//  ["Mary","mary@mail.com"]]

export {};
