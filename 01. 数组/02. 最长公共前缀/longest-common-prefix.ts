// ============================================================
// 02. 最长公共前缀
// ============================================================
// LeetCode 14. Longest Common Prefix
// 给定字符串数组，找出最长公共前缀。
// 时间复杂度：O(S)，空间复杂度：O(1)（S 为所有字符串字符总数）

// 方法1：纵向扫描（推荐）
function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return "";
  const first = strs[0];
  for (let i = 0; i < first.length; i++) {
    const ch = first[i];
    for (let j = 1; j < strs.length; j++) {
      // 当前字符越界或不匹配，则返回已匹配前缀
      if (i >= strs[j].length || strs[j][i] !== ch) {
        return first.substring(0, i);
      }
    }
  }
  return first;
}

// 方法2：横向扫描
function longestCommonPrefixHorizontal(strs: string[]): string {
  if (strs.length === 0) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    // 不断缩短 prefix 直到它是当前字符串的前缀
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (prefix.length === 0) return "";
    }
  }
  return prefix;
}

// 方法3：分治法
function longestCommonPrefixDivideConquer(strs: string[]): string {
  if (strs.length === 0) return "";

  function commonPrefix(left: string, right: string): string {
    const minLen = Math.min(left.length, right.length);
    for (let i = 0; i < minLen; i++) {
      if (left[i] !== right[i]) {
        return left.substring(0, i);
      }
    }
    return left.substring(0, minLen);
  }

  function divide(start: number, end: number): string {
    if (start === end) return strs[start];
    const mid = Math.floor((start + end) / 2);
    const leftLcp = divide(start, mid);
    const rightLcp = divide(mid + 1, end);
    return commonPrefix(leftLcp, rightLcp);
  }

  return divide(0, strs.length - 1);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 02. 最长公共前缀 =====");
console.log(
  "纵向扫描 ['flower','flow','flight']:",
  longestCommonPrefix(["flower", "flow", "flight"]),
); // 期望结果 "fl"
console.log(
  "纵向扫描 ['dog','racecar','car']:",
  longestCommonPrefix(["dog", "racecar", "car"]),
); // 期望结果 ""
console.log("纵向扫描 []:", longestCommonPrefix([])); // 期望结果 ""
console.log(
  "横向扫描 ['flower','flow','flight']:",
  longestCommonPrefixHorizontal(["flower", "flow", "flight"]),
); // 期望结果 "fl"
console.log(
  "横向扫描 ['dog','racecar','car']:",
  longestCommonPrefixHorizontal(["dog", "racecar", "car"]),
); // 期望结果 ""
console.log(
  "分治法 ['flower','flow','flight']:",
  longestCommonPrefixDivideConquer(["flower", "flow", "flight"]),
); // 期望结果 "fl"
console.log(
  "分治法 ['interspecies','interstellar','interstate']:",
  longestCommonPrefixDivideConquer([
    "interspecies",
    "interstellar",
    "interstate",
  ]),
); // 期望结果 "inters"

export {};
