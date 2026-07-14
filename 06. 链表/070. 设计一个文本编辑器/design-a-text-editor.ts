// ============================================================
// 070. 设计一个文本编辑器
// ============================================================
// LeetCode 2296. Design a Text Editor
// 设计一个文本编辑器，支持光标左/右移动、添加文本、删除文本。
// 双栈实现：左栈存光标前字符（栈顶为光标前一个字符），右栈存光标后字符（栈顶为光标后第一个字符）。
// 时间复杂度：addText O(k)，deleteText O(k)，cursorLeft/Right O(k)
// 空间复杂度：O(总字符数)

class TextEditor {
  // 左栈：栈顶为紧邻光标左侧的字符
  private left: string[];
  // 右栈：栈顶为紧邻光标右侧的字符（存储时反转，方便 pop）
  private right: string[];

  constructor() {
    this.left = [];
    this.right = [];
  }

  // 在光标位置添加文本
  addText(text: string): void {
    for (const ch of text) {
      this.left.push(ch);
    }
  }

  // 删除光标左侧 k 个字符，返回实际删除数量
  deleteText(k: number): number {
    const deleted = Math.min(k, this.left.length);
    for (let i = 0; i < deleted; i++) {
      this.left.pop();
    }
    return deleted;
  }

  // 光标左移 k 位，返回光标左侧 min(10, len) 个字符
  cursorLeft(k: number): string {
    for (let i = 0; i < k && this.left.length > 0; i++) {
      // 从左栈弹出，压入右栈
      const ch = this.left.pop()!;
      this.right.push(ch);
    }
    return this.getLeftText();
  }

  // 光标右移 k 位，返回光标左侧 min(10, len) 个字符
  cursorRight(k: number): string {
    for (let i = 0; i < k && this.right.length > 0; i++) {
      const ch = this.right.pop()!;
      this.left.push(ch);
    }
    return this.getLeftText();
  }

  // 返回光标左侧最多 10 个字符（按正序）
  private getLeftText(): string {
    const len = this.left.length;
    const start = Math.max(0, len - 10);
    return this.left.slice(start).join("");
  }
}

// ============================================================
// 测试
// ============================================================
function testTextEditor(): void {
  const editor = new TextEditor();
  editor.addText("leetcode");
  console.log(editor.deleteText(4) === 4); // true，删除 "tcode"
  editor.addText("practice");
  console.log(editor.cursorRight(3) === "etpractice"); // true
  console.log(editor.cursorLeft(8) === "leet"); // true
  console.log(editor.deleteText(10) === 4); // true，删除 "leet"
  console.log(editor.cursorLeft(2) === ""); // true
  console.log(editor.cursorRight(6) === "practi"); // true
  console.log("TextEditor 测试完成");
}

testTextEditor();

export {};
