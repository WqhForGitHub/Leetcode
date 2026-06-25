// ============================================================
// 字符串面试题 - TypeScript 解题合集
// 1. 字符串中的第一个唯一字符
// 2. 反转字符串
// 3. 字符串中的单词数
// 4. 反转单词顺序
// 5. 判断回文串
// 6. 压缩字符串
// 7. 大数加法
// 8. 最长回文子串
// ============================================================

// ============================================================
// 1. 字符串中的第一个唯一字符
// LeetCode 387. First Unique Character in a String
// 核心思路：统计每个字符出现次数，再遍历找到第一个次数为 1 的字符索引
// 时间复杂度：O(n)
// 空间复杂度：O(1)（字符集有限）
// ============================================================

// 方法1：哈希计数两次遍历（推荐）- 最直观
function firstUniqChar(s: string): number {
  const count = new Map<string, number>();
  for (const ch of s) {
    count.set(ch, (count.get(ch) ?? 0) + 1);
  }
  for (let i = 0; i < s.length; i++) {
    if (count.get(s[i]) === 1) return i;
  }
  return -1;
}

// 方法2：数组计数 — 字符集为小写字母时用定长数组更快
function firstUniqCharArray(s: string): number {
  const freq = new Array(26).fill(0);
  for (const ch of s) {
    freq[ch.charCodeAt(0) - 97]++;
  }
  for (let i = 0; i < s.length; i++) {
    if (freq[s.charCodeAt(i) - 97] === 1) return i;
  }
  return -1;
}

// 方法3：indexOf + lastIndexOf — 利用字符串 API，仅作对比
function firstUniqCharAPI(s: string): number {
  for (let i = 0; i < s.length; i++) {
    if (s.indexOf(s[i]) === s.lastIndexOf(s[i])) return i;
  }
  return -1;
}

// ============================================================
// 2. 反转字符串
// LeetCode 344. Reverse String
// 核心思路：双指针从两端向中间交换，原地反转
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：双指针原地交换（推荐）
function reverseString(s: string[]): void {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}

// 方法2：反转字符串（返回新字符串）- 适用于不可变字符串场景
function reverseStringNew(s: string): string {
  return s.split("").reverse().join("");
}

// 方法3：手动拼接反转 — 不使用 reverse API
function reverseStringManual(s: string): string {
  let result = "";
  for (let i = s.length - 1; i >= 0; i--) {
    result += s[i];
  }
  return result;
}

// ============================================================
// 3. 字符串中的单词数
// LeetCode 434. Number of Segments in a String
// 核心思路：统计从空格过渡到非空格的次数，即单词起始位置个数
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：状态机统计单词起始（推荐）
function countSegments(s: string): number {
  let count = 0;
  let inWord = false;
  for (const ch of s) {
    if (ch !== " ") {
      if (!inWord) {
        count++;
        inWord = true;
      }
    } else {
      inWord = false;
    }
  }
  return count;
}

// 方法2：利用 split 过滤空串
function countSegmentsSplit(s: string): number {
  return s.split(" ").filter((w) => w.length > 0).length;
}

// 方法3：前后加空格，统计 " 非空格" 模式
function countSegmentsPattern(s: string): number {
  let count = 0;
  const extended = " " + s + " ";
  for (let i = 1; i < extended.length; i++) {
    if (extended[i] !== " " && extended[i - 1] === " ") count++;
  }
  return count;
}

// ============================================================
// 4. 反转单词顺序
// LeetCode 151. Reverse Words in a String
// 核心思路：先去除多余空格，再整体反转，再逐个单词反转
// 时间复杂度：O(n)
// 空间复杂度：O(n)（转为数组操作）
// ============================================================

// 方法1：三步反转法（推荐）- 去空格 → 整体反转 → 逐词反转
function reverseWords(s: string): string {
  // 1. 去除多余空格，转为字符数组
  const chars: string[] = [];
  let i = 0;
  while (i < s.length) {
    // 跳过前导和连续空格
    if (s[i] === " ") {
      if (chars.length > 0 && chars[chars.length - 1] !== " ") {
        chars.push(" ");
      }
      while (i < s.length && s[i] === " ") i++;
    } else {
      chars.push(s[i]);
      i++;
    }
  }
  // 去除末尾可能多出的空格
  if (chars.length > 0 && chars[chars.length - 1] === " ") chars.pop();

  // 2. 整体反转
  reverseRange(chars, 0, chars.length - 1);

  // 3. 逐个单词反转
  let start = 0;
  for (let j = 0; j <= chars.length; j++) {
    if (j === chars.length || chars[j] === " ") {
      reverseRange(chars, start, j - 1);
      start = j + 1;
    }
  }

  return chars.join("");
}

function reverseRange(arr: string[], left: number, right: number): void {
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
}

// 方法2：利用 API split + reverse + join
function reverseWordsAPI(s: string): string {
  return s.trim().split(/\s+/).reverse().join(" ");
}

// 方法3：从后向前遍历手动拼接
function reverseWordsBackward(s: string): string {
  const words: string[] = [];
  let i = s.length - 1;
  while (i >= 0) {
    while (i >= 0 && s[i] === " ") i--;
    if (i < 0) break;
    let j = i;
    while (j >= 0 && s[j] !== " ") j--;
    words.push(s.substring(j + 1, i + 1));
    i = j;
  }
  return words.join(" ");
}

// ============================================================
// 5. 判断回文串
// LeetCode 125. Valid Palindrome
// 核心思路：双指针从两端向中间，跳过非字母数字字符，忽略大小写比较
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：双指针原地判断（推荐）
function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++;
    while (left < right && !isAlphaNum(s[right])) right--;
    if (left < right && s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

function isAlphaNum(ch: string): boolean {
  return /[a-zA-Z0-9]/.test(ch);
}

// 方法2：先过滤再比较 — 构造干净字符串后双端比较
function isPalindromeFiltered(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0;
  let right = cleaned.length - 1;
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}

// 方法3：反转比较法 — 仅作对比
function isPalindromeReverse(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}

// ============================================================
// 6. 压缩字符串
// LeetCode 443. String Compression
// 核心思路：双指针 read/write，read 扫描连续相同字符，write 写入字符和计数
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：双指针原地压缩（推荐）
function compress(chars: string[]): number {
  let write = 0;
  let read = 0;

  while (read < chars.length) {
    const ch = chars[read];
    let count = 0;
    // 统计连续相同字符个数
    while (read < chars.length && chars[read] === ch) {
      read++;
      count++;
    }
    // 写入字符
    chars[write++] = ch;
    // 写入计数（大于 1 时才写）
    if (count > 1) {
      const digits = count.toString();
      for (const d of digits) {
        chars[write++] = d;
      }
    }
  }

  return write;
}

// 方法2：分组统计 + 拼接 — 返回压缩后字符串，仅作对比
function compressToString(s: string): string {
  let result = "";
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    let count = 0;
    while (i < s.length && s[i] === ch) {
      i++;
      count++;
    }
    result += ch;
    if (count > 1) result += count;
  }
  return result;
}

// ============================================================
// 7. 大数加法
// 面试常见题：两个用字符串表示的非负整数相加，结果也用字符串表示
// 核心思路：从末尾逐位相加，处理进位，最后反转结果
// 时间复杂度：O(max(m, n))
// 空间复杂度：O(max(m, n))
// ============================================================

// 方法1：逐位相加 + 进位（推荐）
function addStrings(num1: string, num2: string): string {
  let i = num1.length - 1;
  let j = num2.length - 1;
  let carry = 0;
  const result: string[] = [];

  while (i >= 0 || j >= 0 || carry > 0) {
    const digit1 = i >= 0 ? num1.charCodeAt(i) - 48 : 0; // '0'.charCodeAt(0) === 48
    const digit2 = j >= 0 ? num2.charCodeAt(j) - 48 : 0;
    const sum = digit1 + digit2 + carry;
    result.push(String.fromCharCode((sum % 10) + 48));
    carry = Math.floor(sum / 10);
    i--;
    j--;
  }

  return result.reverse().join("");
}

// 方法2：使用 Number 转换（推荐辅助理解）— 仅适用于短数字，大数会丢失精度
function addStringsSimple(num1: string, num2: string): string {
  return (BigInt(num1) + BigInt(num2)).toString();
}

// 方法3：补零对齐后逐位加 — 代码稍长但逻辑更对称
function addStringsPadded(num1: string, num2: string): string {
  // 补前导零使两数等长
  const maxLen = Math.max(num1.length, num2.length);
  const a = num1.padStart(maxLen, "0");
  const b = num2.padStart(maxLen, "0");

  let carry = 0;
  const result: string[] = [];

  for (let k = maxLen - 1; k >= 0; k--) {
    const sum = a.charCodeAt(k) - 48 + (b.charCodeAt(k) - 48) + carry;
    result.push(String(sum % 10));
    carry = Math.floor(sum / 10);
  }

  if (carry > 0) result.push("1");
  return result.reverse().join("");
}

// ============================================================
// 8. 最长回文子串
// LeetCode 5. Longest Palindromic Substring
// 核心思路：中心扩展法，以每个字符（和相邻字符间隙）为中心向两边扩展
// 时间复杂度：O(n^2)
// 空间复杂度：O(1)
// ============================================================

// 方法1：中心扩展法（推荐）
function longestPalindrome(s: string): string {
  if (s.length <= 1) return s;

  let start = 0;
  let maxLen = 1;

  function expandAroundCenter(left: number, right: number): void {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const len = right - left + 1;
      if (len > maxLen) {
        maxLen = len;
        start = left;
      }
      left--;
      right++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    // 奇数长度回文，以 s[i] 为中心
    expandAroundCenter(i, i);
    // 偶数长度回文，以 s[i] 和 s[i+1] 为中心
    expandAroundCenter(i, i + 1);
  }

  return s.substring(start, start + maxLen);
}

// 方法2：动态规划 — dp[i][j] 表示 s[i..j] 是否为回文
// 时间复杂度：O(n^2)，空间复杂度：O(n^2)
function longestPalindromeDP(s: string): string {
  const n = s.length;
  if (n <= 1) return s;

  const dp: boolean[][] = Array.from({ length: n }, () =>
    new Array(n).fill(false),
  );
  let start = 0;
  let maxLen = 1;

  // 单字符都是回文
  for (let i = 0; i < n; i++) dp[i][i] = true;

  // 从短到长枚举子串
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) {
        if (len === 2 || dp[i + 1][j - 1]) {
          dp[i][j] = true;
          if (len > maxLen) {
            maxLen = len;
            start = i;
          }
        }
      }
    }
  }

  return s.substring(start, start + maxLen);
}

// 方法3：暴力枚举 — O(n^3)，仅作对比
function longestPalindromeBruteForce(s: string): string {
  let maxSub = "";
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      const sub = s.substring(i, j + 1);
      if (sub.length > maxSub.length && isPalindromeRaw(sub)) {
        maxSub = sub;
      }
    }
  }
  return maxSub;
}

function isPalindromeRaw(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 字符串中的第一个唯一字符 =====");

console.log(firstUniqChar("leetcode")); // 0
console.log(firstUniqChar("loveleetcode")); // 2
console.log(firstUniqChar("aabb")); // -1

console.log(firstUniqCharArray("leetcode")); // 0
console.log(firstUniqCharArray("loveleetcode")); // 2

console.log(firstUniqCharAPI("leetcode")); // 0
console.log(firstUniqCharAPI("aabb")); // -1

console.log("\n===== 2. 反转字符串 =====");

const arr1 = ["h", "e", "l", "l", "o"];
reverseString(arr1);
console.log(arr1); // ["o","l","l","e","h"]

const arr2 = ["H", "a", "n", "n", "a", "h"];
reverseString(arr2);
console.log(arr2); // ["h","a","n","n","a","H"]

console.log(reverseStringNew("hello")); // "olleh"
console.log(reverseStringManual("world")); // "dlrow"

console.log("\n===== 3. 字符串中的单词数 =====");

console.log(countSegments("Hello, I am a developer")); // 5
console.log(countSegments("   fly me   to   the moon  ")); // 5
console.log(countSegments("the sky is blue")); // 4

console.log(countSegmentsSplit("Hello, I am a developer")); // 5
console.log(countSegmentsPattern("   fly me   to   the moon  ")); // 5

console.log("\n===== 4. 反转单词顺序 =====");

console.log(reverseWords("the sky is blue")); // "blue is sky the"
console.log(reverseWords("  hello world  ")); // "world hello"
console.log(reverseWords("a good   example")); // "example good a"

console.log(reverseWordsAPI("the sky is blue")); // "blue is sky the"
console.log(reverseWordsAPI("  hello world  ")); // "world hello"

console.log(reverseWordsBackward("a good   example")); // "example good a"

console.log("\n===== 5. 判断回文串 =====");

console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car")); // false
console.log(isPalindrome(" ")); // true

console.log(isPalindromeFiltered("A man, a plan, a canal: Panama")); // true
console.log(isPalindromeFiltered("race a car")); // false

console.log(isPalindromeReverse("A man, a plan, a canal: Panama")); // true

console.log("\n===== 6. 压缩字符串 =====");

const c1 = ["a", "a", "b", "b", "c", "c", "c"];
console.log(compress(c1)); // 6, chars 变为 ["a","2","b","2","c","3",...]

const c2 = ["a"];
console.log(compress(c2)); // 1

const c3 = ["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"];
console.log(compress(c3)); // 4, chars 变为 ["a","b","1","2",...]

console.log(compressToString("aabcccccaaa")); // "a2bc5a3"

console.log("\n===== 7. 大数加法 =====");

console.log(addStrings("11", "123")); // "134"
console.log(addStrings("999", "1")); // "1000"
console.log(addStrings("0", "0")); // "0"
console.log(addStrings("456", "77")); // "533"
console.log(addStrings("12345678901234567890", "98765432109876543210")); // "111111111011111111100"

console.log(addStringsPadded("999", "1")); // "1000"
console.log(addStringsSimple("456", "77")); // "533"

console.log("\n===== 8. 最长回文子串 =====");

console.log(longestPalindrome("babad")); // "bab" 或 "aba"
console.log(longestPalindrome("cbbd")); // "bb"
console.log(longestPalindrome("a")); // "a"
console.log(longestPalindrome("ac")); // "a"

console.log(longestPalindromeDP("babad")); // "bab" 或 "aba"
console.log(longestPalindromeDP("cbbd")); // "bb"

console.log(longestPalindromeBruteForce("babad")); // "bab" 或 "aba"

export {};
