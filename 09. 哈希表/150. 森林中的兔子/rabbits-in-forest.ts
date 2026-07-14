// ============================================================
// 150. 森林中的兔子
// ============================================================
// LeetCode 781. Rabbits in Forest
// 数组 answers 中 answers[i] 表示第 i 只兔子说"还有 answers[i] 只兔子和它同色"。
// 求森林中最少兔子总数。
// 时间复杂度：O(n)，空间复杂度：O(n)

function numRabbits(answers: number[]): number {
  // 哈希表：每种回答的兔子数
  const count = new Map<number, number>();
  for (const a of answers) {
    count.set(a, (count.get(a) || 0) + 1);
  }

  let total = 0;
  for (const [ans, num] of count) {
    // 同色兔子组大小 = ans + 1
    const groupSize = ans + 1;
    // 需要的组数 = ceil(num / groupSize)
    const groups = Math.ceil(num / groupSize);
    total += groups * groupSize;
  }
  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 150. 森林中的兔子 =====");
console.log(numRabbits([1, 1, 2])); // 期望: 5 (两只答1的为同色2只组, 答2的为另一组3只, 共5)
console.log(numRabbits([10, 10, 10])); // 期望: 11 (一组11只)
console.log(numRabbits([])); // 期望: 0
console.log(numRabbits([0, 0, 1, 1, 1])); // 期望: 6

export {};
