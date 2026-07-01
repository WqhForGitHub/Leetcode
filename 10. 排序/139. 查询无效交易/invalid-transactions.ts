// ============================================================
// 139. 查询无效交易
// ============================================================
// LeetCode 1169. Invalid Transactions
// 交易格式为 [name, time(分钟), amount(美元), city]。
// 若 amount > 1000，或与同名用户在不同城市、且时间差 <= 60 分钟，则该交易无效。
// 返回无效交易列表（任意顺序）。

type Transaction = {
  name: string;
  time: number;
  amount: number;
  city: string;
  index: number;
};

// 解析形如 "name,time,amount,city" 的字符串
function parseTx(s: string, index: number): Transaction {
  const parts = s.split(",");
  return {
    name: parts[0],
    time: parseInt(parts[1], 10),
    amount: parseInt(parts[2], 10),
    city: parts[3],
    index,
  };
}

// 方法1：按时间排序 + 对每条交易检查 60 分钟窗口（时间 O(n^2) / O(n log n + n*k)）
// 排序后，对每条交易，向左右两侧扩展检查同名用户在 60 分钟内是否在不同城市。
function invalidTransactions(transactions: string[]): string[] {
  const n = transactions.length;
  const txs: Transaction[] = transactions.map((s, i) => parseTx(s, i));
  // 按时间排序，稳定起见用 index 作为次序
  txs.sort((a, b) => a.time - b.time || a.index - b.index);

  const invalid: boolean[] = new Array(n).fill(false);

  for (let i = 0; i < n; i++) {
    // 规则1：金额超过 1000
    if (txs[i].amount > 1000) {
      invalid[txs[i].index] = true;
    }
    // 规则2：同名用户在 60 分钟内于不同城市交易
    // 向右侧扫描
    for (let j = i + 1; j < n && txs[j].time - txs[i].time <= 60; j++) {
      if (txs[j].name === txs[i].name && txs[j].city !== txs[i].city) {
        invalid[txs[i].index] = true;
        invalid[txs[j].index] = true;
      }
    }
  }

  const result: string[] = [];
  for (let i = 0; i < n; i++) {
    if (invalid[i]) result.push(transactions[i]);
  }
  return result;
}

// 方法2：按姓名分组 + 每组内按时间排序 + 双指针滑窗（时间 O(n log n)）
// 对每个用户的交易列表维护一个时间窗口 [t-60, t+60]，检查窗口内是否有不同城市。
function invalidTransactions2(transactions: string[]): string[] {
  const n = transactions.length;
  const txs: Transaction[] = transactions.map((s, i) => parseTx(s, i));

  // 按姓名分组
  const groups = new Map<string, Transaction[]>();
  for (const t of txs) {
    if (!groups.has(t.name)) groups.set(t.name, []);
    groups.get(t.name)!.push(t);
  }

  const invalid: boolean[] = new Array(n).fill(false);

  for (const list of groups.values()) {
    list.sort((a, b) => a.time - b.time || a.index - b.index);
    const m = list.length;
    // 对每条交易 i，使用双指针确定 [time-60, time+60] 窗口
    for (let i = 0; i < m; i++) {
      if (list[i].amount > 1000) {
        invalid[list[i].index] = true;
      }
      // 向右扩展找时间 <= time+60 的交易
      for (let j = i + 1; j < m && list[j].time - list[i].time <= 60; j++) {
        if (list[j].city !== list[i].city) {
          invalid[list[i].index] = true;
          invalid[list[j].index] = true;
        }
      }
    }
  }

  const result: string[] = [];
  for (let i = 0; i < n; i++) {
    if (invalid[i]) result.push(transactions[i]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 139. 查询无效交易 =====");
console.log(
  "方法1:",
  invalidTransactions(["alice,20,800,mtv", "alice,50,100,beijing"])
); // 期望: ["alice,20,800,mtv","alice,50,100,beijing"]
console.log(
  "方法1:",
  invalidTransactions(["alice,20,800,mtv", "alice,50,1200,mtv"])
); // 期望: ["alice,50,1200,mtv"]
console.log(
  "方法1:",
  invalidTransactions(["alice,20,800,mtv", "alice,50,1200,mtv", "alice,20,800,beijing"])
); // 期望: ["alice,20,800,mtv","alice,50,1200,mtv","alice,20,800,beijing"]
console.log(
  "方法2:",
  invalidTransactions2(["alice,20,800,mtv", "alice,50,100,beijing"])
); // 期望: ["alice,20,800,mtv","alice,50,100,beijing"]
console.log(
  "方法2:",
  invalidTransactions2(["alice,20,800,mtv", "alice,50,1200,mtv"])
); // 期望: ["alice,50,1200,mtv"]
console.log(
  "方法2:",
  invalidTransactions2(["alice,20,800,mtv", "alice,50,1200,mtv", "alice,20,800,beijing"])
); // 期望: ["alice,20,800,mtv","alice,50,1200,mtv","alice,20,800,beijing"]

export {};
