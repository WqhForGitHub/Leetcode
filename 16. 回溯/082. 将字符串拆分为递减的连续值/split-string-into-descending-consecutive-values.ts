// ============================================================
// 082. 将字符串拆分为递减的连续值
// ============================================================
// LeetCode 1849. Splitting a String Into Descending Consecutive Values
// 给定数字字符串 s，判断能否拆分为两个或更多子串，使各子串的数值严格递减且差为 1。
// 子串允许前导零，数值可用 64 位整数表示。
// 时间复杂度：O(n^2) 级别。

// 方法1：回溯 (推荐)
// 逐段切分，维护上一段的值 prev。下一段必须等于 prev - 1。
// 由于子串值随长度递增，val >= prev 时可直接剪枝。
// 时间复杂度：O(n^2)，空间复杂度：O(n) 递归栈
function splitString1(s: string): boolean {
  const n: number = s.length;

  const backtrack = (start: number, prev: bigint | null, count: number): boolean => {
    if (start === n) return count >= 2; // 至少两段
    for (let end: number = start + 1; end <= n; end++) {
      const val: bigint = BigInt(s.substring(start, end));
      if (prev === null) {
        // 第一段：不能取整个字符串（至少要留一段）
        if (end === n) break;
        if (backtrack(end, val, count + 1)) return true;
      } else if (val === prev - 1n) {
        if (backtrack(end, val, count + 1)) return true;
        break; // 更长子串值更大，不可能是 prev - 1
      } else if (val >= prev) {
        break; // 剪枝：值已 >= prev，继续只会更大
      }
      // val < prev - 1，继续尝试更长子串
    }
    return false;
  };

  return backtrack(0, null, 0);
}

// 方法2：回溯+剪枝
// 在方法1 基础上，当 prev 已知时，目标值 prev-1 的位数确定，
// 从该最小长度开始搜索，避免尝试过短的子串。
// 时间复杂度：O(n^2)，剪枝后更快，空间复杂度：O(n)
function splitString2(s: string): boolean {
  const n: number = s.length;

  const backtrack = (start: number, prev: bigint | null, count: number): boolean => {
    if (start === n) return count >= 2;

    if (prev === null) {
      // 第一段：尝试所有可能长度（至少留 1 字符给后续）
      for (let end: number = start + 1; end < n; end++) {
        const val: bigint = BigInt(s.substring(start, end));
        if (backtrack(end, val, count + 1)) return true;
      }
      return false;
    }

    // prev 已知，下一段必须为 prev - 1
    const target: bigint = prev - 1n;
    if (target < 0n) return false; // prev 为 0 时无解

    // 目标值的最小位数（无前导零）
    const minLen: number = target.toString().length;

    for (let len: number = minLen; len <= n - start; len++) {
      const val: bigint = BigInt(s.substring(start, start + len));
      if (val === target) {
        if (backtrack(start + len, val, count + 1)) return true;
        break; // 更长只会更大
      } else if (val > target) {
        break; // 剪枝
      }
      // val < target，继续加长（可能因前导零而值偏小）
    }
    return false;
  };

  return backtrack(0, null, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 082. 将字符串拆分为递减的连续值 =====");
console.log(splitString1("1234")); // 期望结果: false
console.log(splitString1("050043")); // 期望结果: true (05=5, 004=4, 3=3)
console.log(splitString1("9080701")); // 期望结果: false
console.log(splitString1("91011")); // 期望结果: false (9,10,11 是递增)
console.log(splitString1("1000999998")); // 期望结果: true (1000,999,998)
console.log(splitString1("10")); // 期望结果: true (1,0 差为 1)
console.log(splitString2("1234")); // 期望结果: false
console.log(splitString2("050043")); // 期望结果: true
console.log(splitString2("9080701")); // 期望结果: false
console.log(splitString2("1000999998")); // 期望结果: true (1000,999,998)

export {};
