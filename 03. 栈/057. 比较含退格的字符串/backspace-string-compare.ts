// ============================================================
// 057. 比较含退格的字符串
// ============================================================
// LeetCode 844. Backspace String Compare
// 给定两个字符串 s 和 t，'#' 表示退格，判断两者最终是否相等。

// ------------------------------------------------------------
// 方法1：栈重构字符串
// ------------------------------------------------------------
// 用栈模拟退格过程，比较结果。时间 O(n)，空间 O(n)。
function backspaceCompare(s: string, t: string): boolean {
  return build(s) === build(t);
}

function build(str: string): string {
  const stack: string[] = [];
  for (const ch of str) {
    if (ch === '#') stack.pop();
    else stack.push(ch);
  }
  return stack.join('');
}

// ------------------------------------------------------------
// 方法2：双指针（O(1) 空间）
// ------------------------------------------------------------
// 从后往前扫描，遇到 '#' 记录需跳过的字符数。
function backspaceCompareTwoPointer(s: string, t: string): boolean {
  let i = s.length - 1,
    j = t.length - 1;
  let skipS = 0,
    skipT = 0;
  while (i >= 0 || j >= 0) {
    // 找到 s 的下一个有效字符
    while (i >= 0) {
      if (s[i] === '#') {
        skipS++;
        i--;
      } else if (skipS > 0) {
        skipS--;
        i--;
      } else {
        break;
      }
    }
    while (j >= 0) {
      if (t[j] === '#') {
        skipT++;
        j--;
      } else if (skipT > 0) {
        skipT--;
        j--;
      } else {
        break;
      }
    }
    if (i >= 0 && j >= 0 && s[i] !== t[j]) return false;
    if ((i >= 0) !== (j >= 0)) return false;
    i--;
    j--;
  }
  return true;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1 - 栈法:', backspaceCompare('ab#c', 'ad#c'), '期望: true');
  console.log('测试2 - 栈法:', backspaceCompare('ab##', 'c#d#'), '期望: true');
  console.log('测试3 - 栈法:', backspaceCompare('a##c', '#a#c'), '期望: true');
  console.log('测试4 - 双指针:', backspaceCompareTwoPointer('a#c', 'b'), '期望: false');
}

test();

export {};
