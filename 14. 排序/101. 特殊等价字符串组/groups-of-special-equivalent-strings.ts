// ============================================================
// 101. 特殊等价字符串组
// ============================================================
// LeetCode 893. Groups of Special-Equivalent Strings
// 若字符串 A 可通过若干次"交换偶数下标字符之间 / 交换奇数下标字符之间"
// 得到字符串 B，则 A、B 特殊等价。求字符串数组中特殊等价组的数量。

// 方法1：偶数位 + 奇数位排序作为键（推荐，时间 O(n * k log k)，空间 O(n * k)）
// 特殊等价的两个字符串，其偶数下标字符多重集相同、奇数下标字符多重集相同。
// 因此把偶数位字符排序、奇数位字符排序，拼接成签名作为组 key，统计不同 key 数。
function numSpecialEquivGroups(words: string[]): number {
  const groups = new Set<string>();

  for (const w of words) {
    const even: string[] = [];
    const odd: string[] = [];
    for (let i = 0; i < w.length; i++) {
      if (i % 2 === 0) {
        even.push(w[i]);
      } else {
        odd.push(w[i]);
      }
    }
    even.sort();
    odd.sort();
    const key = even.join("") + "," + odd.join("");
    groups.add(key);
  }

  return groups.size;
}

// 方法2：字符频次计数作为键（时间 O(n * k)，空间 O(n * 1)）
// 用长度 26 的频次数组分别记录偶数位、奇数位字符，拼成字符串作为 key，
// 避免排序，时间更优。
function numSpecialEquivGroupsFreq(words: string[]): number {
  const groups = new Set<string>();

  for (const w of words) {
    const freq = new Array<number>(52).fill(0); // 0-25 偶数位, 26-51 奇数位
    for (let i = 0; i < w.length; i++) {
      const code = w.charCodeAt(i) - 97; // 'a' 的 ASCII
      if (i % 2 === 0) {
        freq[code]++;
      } else {
        freq[26 + code]++;
      }
    }
    groups.add(freq.join(","));
  }

  return groups.size;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 101. 特殊等价字符串组 =====");
console.log("方法1:", numSpecialEquivGroups(["abcd", "cdab", "cbad", "xyzz", "zzxy", "zzyx"])); // 期望: 3
console.log("方法1:", numSpecialEquivGroups(["abc", "acb", "bac", "bca", "cab", "cba"])); // 期望: 3
console.log("方法2:", numSpecialEquivGroupsFreq(["abcd", "cdab", "cbad", "xyzz", "zzxy", "zzyx"])); // 期望: 3
console.log("方法2:", numSpecialEquivGroupsFreq(["abc", "acb", "bac", "bca", "cab", "cba"])); // 期望: 3

export {};
