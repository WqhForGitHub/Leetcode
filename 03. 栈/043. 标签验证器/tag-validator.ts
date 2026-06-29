// ============================================================
// 043. 标签验证器
// ============================================================
// LeetCode 591. Tag Validator
// 验证一个 XML 风格的代码字符串是否合法。

// ------------------------------------------------------------
// 方法1：栈模拟
// ------------------------------------------------------------
// 逐字符解析：CDATA、开始标签、结束标签、普通文本。
// 时间 O(n)，空间 O(n)。
function isValid(code: string): boolean {
  const stack: string[] = [];
  let i = 0;
  const n = code.length;
  while (i < n) {
    if (code[i] !== "<") {
      // 根节点之外不能有普通文本
      if (stack.length === 0) return false;
      i++;
      continue;
    }
    if (i + 1 >= n) return false;
    if (code[i + 1] === "!") {
      // CDATA
      if (stack.length === 0) return false;
      const start = code.indexOf("[CDATA[", i + 2);
      if (start !== i + 2) return false;
      const end = code.indexOf("]]>", start);
      if (end === -1) return false;
      i = end + 3;
    } else if (code[i + 1] === "/") {
      // 结束标签
      const end = code.indexOf(">", i + 2);
      if (end === -1) return false;
      const tag = code.slice(i + 2, end);
      if (stack.length === 0 || stack[stack.length - 1] !== tag) return false;
      stack.pop();
      i = end + 1;
      // 全部闭合后不能再有内容
      if (stack.length === 0 && i !== n) return false;
    } else {
      // 开始标签
      const end = code.indexOf(">", i + 1);
      if (end === -1) return false;
      const tag = code.slice(i + 1, end);
      if (tag.length < 1 || tag.length > 9) return false;
      for (const ch of tag) {
        if (ch < "A" || ch > "Z") return false;
      }
      stack.push(tag);
      i = end + 1;
    }
  }
  return stack.length === 0;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", isValid("<DIV>This is my title</DIV>"), "期望: true");
  console.log("测试2:", isValid("<A>  <B> </B> </A>"), "期望: true");
  console.log("测试3:", isValid("<A>  <B> </A>   </B>"), "期望: false");
  console.log("测试4:", isValid("<DIV>  div  </DIV>"), "期望: true");
  console.log("测试5:", isValid("<A></A><B></B>"), "期望: false");
}

test();

export {};
