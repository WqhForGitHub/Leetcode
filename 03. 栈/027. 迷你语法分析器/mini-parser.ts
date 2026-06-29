// ============================================================
// 027. 迷你语法分析器
// ============================================================
// LeetCode 385. Mini Parser
// 给定一个用字符串表示的嵌套整数列表 s，解析为 NestedInteger。

interface NestedInteger {
  isInteger(): boolean;
  getInteger(): number | null;
  setInteger(value: number): void;
  add(ni: NestedInteger): void;
  getList(): NestedInteger[];
}

// ------------------------------------------------------------
// 方法1：栈
// ------------------------------------------------------------
// 遇到 '[' 压入新列表；遇到 ']' 弹出当前列表加入父列表；
// 遇到数字解析后加入栈顶列表。时间 O(n)，空间 O(深度)。
function deserialize(s: string): NestedInteger {
  // 简单情况：单个数字
  if (s[0] !== "[") {
    const ni = new NestedIntegerImpl();
    ni.setInteger(parseInt(s, 10));
    return ni;
  }
  const stack: NestedInteger[] = [];
  let num = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "[") {
      const ni = new NestedIntegerImpl();
      if (stack.length > 0) stack[stack.length - 1].add(ni);
      stack.push(ni);
    } else if (ch === "]") {
      if (num !== "") {
        const ni = new NestedIntegerImpl();
        ni.setInteger(parseInt(num, 10));
        stack[stack.length - 1].add(ni);
        num = "";
      }
      if (stack.length > 1) stack.pop();
    } else if (ch === ",") {
      if (num !== "") {
        const ni = new NestedIntegerImpl();
        ni.setInteger(parseInt(num, 10));
        stack[stack.length - 1].add(ni);
        num = "";
      }
    } else {
      num += ch;
    }
  }
  return stack[0];
}

// 实现 NestedInteger
class NestedIntegerImpl implements NestedInteger {
  private value: number | null = null;
  private list: NestedInteger[] = [];
  isInteger(): boolean {
    return this.value !== null;
  }
  getInteger(): number | null {
    return this.value;
  }
  setInteger(value: number): void {
    this.value = value;
  }
  add(ni: NestedInteger): void {
    this.list.push(ni);
  }
  getList(): NestedInteger[] {
    return this.list;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const r1 = deserialize("324");
  console.log("测试1:", r1.isInteger() ? r1.getInteger() : "N/A", "期望: 324");
  const r2 = deserialize("[123,[456,[789]]]");
  console.log("测试2: 解析成功");
}

test();

export {};
