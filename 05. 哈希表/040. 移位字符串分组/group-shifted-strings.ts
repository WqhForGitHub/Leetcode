// ============================================================
// 040. 移位字符串分组
// ============================================================
// LeetCode 249. Group Shifted Strings
// 将移位字符串分组。哈希表，key 为相邻字符差值序列。
// 时间复杂度：O(N * L)，N 为字符串数量，L 为字符串平均长度
// 空间复杂度：O(N * L)

/**
 * 计算字符串的移位特征 key
 * key 为相邻字符差值（mod 26）组成的字符串
 * 同一组移位字符串具有相同的 key
 */
function getShiftKey(s: string): string {
  if (s.length <= 1) return "";

  const diffs: number[] = [];
  for (let i = 1; i < s.length; i++) {
    // 计算相邻字符差值，处理负数取模
    let diff = s.charCodeAt(i) - s.charCodeAt(i - 1);
    if (diff < 0) {
      diff += 26;
    }
    diffs.push(diff);
  }
  // 用逗号分隔避免多义性
  return diffs.join(",");
}

/**
 * 将移位字符串分组
 * 使用哈希表，key 为相邻字符差值序列
 */
function groupStrings(strings: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const s of strings) {
    const key = getShiftKey(s);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(s);
  }

  return Array.from(groups.values());
}

// ============================================================
// 测试
// ============================================================
console.log("===== 040. 移位字符串分组 =====");
// 测试 1: 经典用例
console.log(groupStrings(["abc", "bcd", "acef", "xyz", "az", "ba", "a", "z"]));
// 期望输出: [["abc","bcd","xyz"],["acef"],["az","ba"],["a","z"]]

// 测试 2: 单个字符串
console.log(groupStrings(["abc"]));
// 期望输出: [["abc"]]

// 测试 3: 全部为同一组
console.log(groupStrings(["abc", "def", "ghi"]));
// 期望输出: [["abc","def","ghi"]]

// 测试 4: 空数组
console.log(groupStrings([]));
// 期望输出: []

export {};
