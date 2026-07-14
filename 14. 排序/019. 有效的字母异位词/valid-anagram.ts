// ============================================================
// 019. 有效的字母异位词
// ============================================================
// LeetCode 242. Valid Anagram
// 给定两个字符串 s 和 t，判断 t 是否是 s 的字母异位词
// （即两个字符串中各字符出现次数完全相同）。

// 方法1：排序后比较（O(n log n)，O(n)）
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const arr1: string[] = s.split("");
  const arr2: string[] = t.split("");
  arr1.sort();
  arr2.sort();
  return arr1.join("") === arr2.join("");
}

// 方法2：字符计数数组（推荐，O(n)，O(1)）
// 假设只包含小写字母，使用长度为 26 的数组记录字符出现次数差。
function isAnagram2(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count: number[] = new Array(26).fill(0);
  for (const c of s) {
    count[c.charCodeAt(0) - 97]++;
  }
  for (const c of t) {
    const idx: number = c.charCodeAt(0) - 97;
    count[idx]--;
    if (count[idx] < 0) return false;
  }
  return count.every((v) => v === 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 019. 有效的字母异位词 =====");
console.log("方法1:", isAnagram("anagram", "nagaram")); // 期望 true
console.log("方法1:", isAnagram("rat", "car")); // 期望 false
console.log("方法2:", isAnagram2("anagram", "nagaram")); // 期望 true
console.log("方法2:", isAnagram2("rat", "car")); // 期望 false

export {};
