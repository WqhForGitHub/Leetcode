// ============================================================
// 060. 寻找比目标字母大的最小字母
// ============================================================
// LeetCode 744. Find Smallest Letter Greater Than Target
// 给定排序的字母列表，找比目标字母大的最小字母（字母循环）。

// 方法1：二分查找
function nextGreatestLetter(letters: string[], target: string): string {
  let left = 0;
  let right = letters.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (letters[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  // 如果没找到，返回第一个字母（循环）
  return letters[left % letters.length];
}

// 方法2：线性扫描
function nextGreatestLetterLinear(letters: string[], target: string): string {
  for (const ch of letters) {
    if (ch > target) return ch;
  }
  return letters[0];
}

// 方法3：位运算二分
function nextGreatestLetterBit(letters: string[], target: string): string {
  const n = letters.length;
  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (letters[mid].charCodeAt(0) > target.charCodeAt(0)) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  if (letters[lo] > target) return letters[lo];
  return letters[0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 060. 寻找比目标字母大的最小字母 =====");
console.log("二分 ['c','f','j'],'a':", nextGreatestLetter(["c", "f", "j"], "a")); // "c"
console.log("二分 ['c','f','j'],'c':", nextGreatestLetter(["c", "f", "j"], "c")); // "f"
console.log("二分 ['c','f','j'],'j':", nextGreatestLetter(["c", "f", "j"], "j")); // "c"
console.log("线性 ['c','f','j'],'d':", nextGreatestLetterLinear(["c", "f", "j"], "d")); // "f"

export {};
