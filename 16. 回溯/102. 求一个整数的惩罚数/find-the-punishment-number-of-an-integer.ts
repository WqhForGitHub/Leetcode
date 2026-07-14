// ============================================================
// 102. 求一个整数的惩罚数
// ============================================================
// LeetCode 2698. Find the Punishment Number of an Integer
// 对每个 i∈[1,n]，若 i² 的十进制串可分割成若干连续子串且其和等于 i，则将 i² 加入结果，返回总和
// 时间复杂度：O(n * 2^L), L 为 i² 的位数; 空间复杂度：O(L)

// 方法1：回溯(分割 i² 的字符串) (推荐)
// 对每个 i，回溯枚举 i² 字符串的所有分割方式，判断是否存在和等于 i 的分割
function punishmentNumber(n: number): number {
  // 判断 s 从 idx 起、当前累计和 currentSum 是否能凑出 target
  const canSplit = (s: string, idx: number, currentSum: number, target: number): boolean => {
    if (idx === s.length) return currentSum === target;
    if (currentSum > target) return false; // 剪枝
    let num = 0;
    for (let end = idx; end < s.length; end++) {
      num = num * 10 + (s.charCodeAt(end) - 48);
      if (canSplit(s, end + 1, currentSum + num, target)) return true;
    }
    return false;
  };

  let result = 0;
  for (let i = 1; i <= n; i++) {
    const sq = i * i;
    if (canSplit(sq.toString(), 0, 0, i)) result += sq;
  }
  return result;
}

// 方法2：枚举+回溯验证
// 枚举每个 i，回溯验证时以"剩余目标 remaining"递减的方式判断，便于提前剪枝
function punishmentNumber2(n: number): number {
  // 从 idx 开始，剩余需要凑出的和为 remaining
  const verify = (s: string, idx: number, remaining: number): boolean => {
    if (idx === s.length) return remaining === 0;
    let num = 0;
    for (let end = idx; end < s.length; end++) {
      num = num * 10 + (s.charCodeAt(end) - 48);
      if (num > remaining) break; // 剪枝
      if (verify(s, end + 1, remaining - num)) return true;
    }
    return false;
  };

  let result = 0;
  for (let i = 1; i <= n; i++) {
    if (verify((i * i).toString(), 0, i)) result += i * i;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 102. 求一个整数的惩罚数 =====");
console.log(punishmentNumber(10)); // 期望结果: 182
console.log(punishmentNumber(37)); // 期望结果: 1478
console.log("--- 方法2测试 ---");
console.log(punishmentNumber2(10)); // 期望结果: 182
console.log(punishmentNumber2(37)); // 期望结果: 1478

export {};
