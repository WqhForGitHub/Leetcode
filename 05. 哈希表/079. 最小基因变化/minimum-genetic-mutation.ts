// ============================================================
// 079. 最小基因变化
// ============================================================
// LeetCode 433. Minimum Genetic Mutation
// 找从 start 基因变化到 end 基因的最小变化次数，每次只变一个字符且必须在 bank 中
// 思路：BFS 逐层扩展，哈希集合存 bank 用于 O(1) 查询合法性
// 时间复杂度：O(n * 8 * 4)，空间复杂度：O(n)

function minMutation(start: string, end: string, bank: string[]): number {
  const bankSet = new Set(bank);
  if (!bankSet.has(end)) return -1;

  const visited = new Set<string>();
  visited.add(start);

  // 队列元素：[当前基因序列, 变化步数]
  const queue: [string, number][] = [[start, 0]];
  const genes = ["A", "C", "G", "T"];

  while (queue.length > 0) {
    const [cur, steps] = queue.shift()!;
    if (cur === end) return steps;

    const arr = cur.split("");
    for (let i = 0; i < 8; i++) {
      const old = arr[i];
      for (const g of genes) {
        if (g === old) continue;
        arr[i] = g;
        const next = arr.join("");
        if (bankSet.has(next) && !visited.has(next)) {
          visited.add(next);
          queue.push([next, steps + 1]);
        }
      }
      // 还原
      arr[i] = old;
    }
  }

  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 079. 最小基因变化 =====");
console.log(minMutation("AACCGGTT", "AACCGGTA", ["AACCGGTA"])); // 期望输出: 1
console.log(
  minMutation("AACCGGTT", "AAACGGTA", ["AACCGGTA", "AACCGCTA", "AAACGGTA"]),
); // 期望输出: 2
console.log(
  minMutation("AAAAACCC", "AACCCCCC", ["AAAACCCC", "AAACCCCC", "AACCCCCC"]),
); // 期望输出: 3

export {};
