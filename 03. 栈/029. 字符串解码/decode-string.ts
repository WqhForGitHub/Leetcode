// ============================================================
// 029. 字符串解码
// ============================================================
// LeetCode 394. Decode String
// 给定一个经过编码的字符串，返回它解码后的字符串。k[encoded_string] 表示重复 k 次。

// ------------------------------------------------------------
// 方法1：双栈
// ------------------------------------------------------------
// 一个栈存数字（重复次数），一个栈存外层字符串。遇到 '[' 入栈，遇到 ']' 出栈拼接。
// 时间 O(n)，空间 O(n)。
function decodeString(s: string): string {
  const numStack: number[] = [];
  const strStack: string[] = [];
  let curStr = '';
  let curNum = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      curNum = curNum * 10 + (ch.charCodeAt(0) - '0'.charCodeAt(0));
    } else if (ch === '[') {
      numStack.push(curNum);
      strStack.push(curStr);
      curNum = 0;
      curStr = '';
    } else if (ch === ']') {
      const repeat = numStack.pop()!;
      const prev = strStack.pop()!;
      curStr = prev + curStr.repeat(repeat);
    } else {
      curStr += ch;
    }
  }
  return curStr;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1:', decodeString('3[a]2[bc]'), '期望: aaabcbc');
  console.log('测试2:', decodeString('3[a2[c]]'), '期望: accaccacc');
  console.log('测试3:', decodeString('2[abc]3[cd]ef'), '期望: abcabccdcdcdef');
  console.log('测试4:', decodeString('abc3[cd]xyz'), '期望: abccdcdcdxyz');
}

test();

export {};
