// ============================================================
// 038. 最长的美好子字符串
// ============================================================
// LeetCode 1763. Longest Nice Substring
// 字符串 s 是"美好的"，当且仅当对 s 中每个小写字母，其大写形式也出现在 s 中，
// 反之亦然。返回 s 中最长的美好子字符串。若有多个返回最早出现的一个。
// 时间复杂度：O(n^2) 最坏, 空间复杂度：O(n)

// 方法1：分治（推荐）
// 找到破坏"美好"性质的字符（小写对应大写不存在或反之），
// 以这些字符为分隔点切分字符串，递归处理各段。
// 时间复杂度 O(n^2) 最坏，空间复杂度 O(n)
function longestNiceSubstring(s: string): string {
  if (s.length < 2) return "";

  // 收集所有破坏美好性质的字符索引
  const splitIdx: number[] = [];
  for (let i: number = 0; i < s.length; i++) {
    const ch: string = s[i];
    if (ch >= "a" && ch <= "z") {
      // 小写字母：检查大写是否存在
      const upper: string = ch.toUpperCase();
      if (s.indexOf(upper) === -1) splitIdx.push(i);
    } else {
      // 大写字母：检查小写是否存在
      const lower: string = ch.toLowerCase();
      if (s.indexOf(lower) === -1) splitIdx.push(i);
    }
  }

  // 没有破坏字符：整个字符串就是美好的
  if (splitIdx.length === 0) return s;

  // 在破坏字符中选一个分隔点（取中间的，平衡递归）
  const pivot: number = splitIdx[Math.floor(splitIdx.length / 2)];
  const left: string = longestNiceSubstring(s.slice(0, pivot));
  const right: string = longestNiceSubstring(s.slice(pivot + 1));

  // 返回较长的；长度相同取 left（更早出现）
  if (left.length >= right.length) return left;
  return right;
}

// 方法2：位掩码 + 暴力枚举
// 枚举所有子串，用位掩码记录小写和大写字母集合，判断是否美好。
// 时间复杂度 O(n^2)，空间复杂度 O(1)
function longestNiceSubstringBrute(s: string): string {
  const n: number = s.length;
  let bestStart: number = 0;
  let bestLen: number = 0;

  for (let i: number = 0; i < n; i++) {
    let lowerMask: number = 0;
    let upperMask: number = 0;
    for (let j: number = i; j < n; j++) {
      const ch: string = s[j];
      if (ch >= "a" && ch <= "z") {
        lowerMask |= 1 << (ch.charCodeAt(0) - "a".charCodeAt(0));
      } else {
        upperMask |= 1 << (ch.charCodeAt(0) - "A".charCodeAt(0));
      }
      // 小写集合 == 大写集合 即为美好
      if (lowerMask === upperMask && j - i + 1 > bestLen) {
        bestLen = j - i + 1;
        bestStart = i;
      }
    }
  }
  return s.slice(bestStart, bestStart + bestLen);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 038. 最长的美好子字符串 =====");
console.log(longestNiceSubstring("YazaAay")); // 期望结果: "aAa"
console.log(longestNiceSubstring("Bb")); // 期望结果: "Bb"
console.log(longestNiceSubstring("c")); // 期望结果: ""
console.log(longestNiceSubstring("dDzeE")); // 期望结果: "dD"
console.log("--- 方法2测试 ---");
console.log(longestNiceSubstringBrute("YazaAay")); // 期望结果: "aAa"
console.log(longestNiceSubstringBrute("Bb")); // 期望结果: "Bb"
console.log(longestNiceSubstringBrute("c")); // 期望结果: ""
console.log(longestNiceSubstringBrute("dDzeE")); // 期望结果: "dD"

export {};
