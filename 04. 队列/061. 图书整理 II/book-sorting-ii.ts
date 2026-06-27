// ============================================================
// 061. 图书整理 II
// ============================================================
// LeetCode LCR 094 / 剑指 Offer 09. 用两个栈实现队列
// 用两个栈实现一个队列。队列的声明如下，请实现它的两个函数 appendTail 和 deleteHead，
// 分别完成在队列尾部插入整数和在队列头部删除整数的功能。

// ------------------------------------------------------------
// 方法1：两个栈（输入栈 + 输出栈）
// ------------------------------------------------------------
// appendTail 时压入 inStack，deleteHead 时若 outStack 为空先把 inStack 全部倒入。
// 时间 O(1) 均摊，空间 O(n)。
class CQueue1 {
  private inStack: number[] = [];
  private outStack: number[] = [];

  appendTail(value: number): void {
    this.inStack.push(value);
  }

  deleteHead(): number {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop()!);
      }
    }
    return this.outStack.length > 0 ? this.outStack.pop()! : -1;
  }
}

// ------------------------------------------------------------
// 方法2：单栈递归
// ------------------------------------------------------------
// 用递归调用栈作为辅助栈，deleteHead 时递归取出栈底元素。
// 时间 O(n) deleteHead，空间 O(n)。
class CQueue2 {
  private stack: number[] = [];

  appendTail(value: number): void {
    this.stack.push(value);
  }

  deleteHead(): number {
    if (this.stack.length === 0) return -1;
    const top = this.stack.pop()!;
    if (this.stack.length === 0) {
      return top;
    }
    const result = this.deleteHead();
    this.stack.push(top);
    return result;
  }
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  const q1 = new CQueue1();
  console.log("测试1 deleteHead:", q1.deleteHead(), "期望: -1");
  q1.appendTail(5);
  q1.appendTail(2);
  console.log("测试2 deleteHead:", q1.deleteHead(), "期望: 5");
  console.log("测试3 deleteHead:", q1.deleteHead(), "期望: 2");

  const q2 = new CQueue2();
  console.log("测试4 deleteHead:", q2.deleteHead(), "期望: -1");
  q2.appendTail(1);
  q2.appendTail(3);
  console.log("测试5 deleteHead:", q2.deleteHead(), "期望: 1");
}

test();

export {};
