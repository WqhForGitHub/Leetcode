// ============================================================
// 13. 用 Read4 读取 N 个字符
// ============================================================
// LeetCode 157. Read N Characters Given Read4
// API read4(buf) 每次最多读取4个字符到 buf 中。实现 read(buf, n) 读取 n 个字符。
// 注意：read4 是一个已存在的 API，需要模拟。定义一个辅助函数模拟 read4。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 模拟文件内容，供 read4 读取使用
let fileContent: string = "";
let filePointer: number = 0;

// 重置模拟文件（测试辅助）
function resetFile(content: string): void {
  fileContent = content;
  filePointer = 0;
}

// 模拟 read4 API：从文件中读取最多 4 个字符到 buf4，返回实际读取的字符数
function read4(buf4: string[]): number {
  let count = 0;
  while (count < 4 && filePointer < fileContent.length) {
    buf4[count] = fileContent[filePointer];
    count++;
    filePointer++;
  }
  return count;
}

// 方法1：循环调用 read4（推荐）
// 每次 read4 最多读 4 个字符到临时缓冲区，再按需拷贝到目标 buf
function read(buf: string[], n: number): number {
  let total = 0; // 已读取的总字符数
  const buf4: string[] = ["", "", "", ""]; // read4 的临时缓冲区

  while (total < n) {
    const count = read4(buf4); // 调用 read4 读取一批字符
    if (count === 0) break; // 文件已读完

    // 将 buf4 中的字符拷贝到 buf，注意不能超过 n
    for (let i = 0; i < count && total < n; i++) {
      buf[total] = buf4[i];
      total++;
    }
  }

  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 13. 用 Read4 读取 N 个字符 =====");

resetFile("abc");
const buf1: string[] = [];
console.log("描述:", read(buf1, 4), "buf:", buf1.join("")); // 期望结果: 3, buf: abc

resetFile("abcde");
const buf2: string[] = [];
console.log("描述:", read(buf2, 5), "buf:", buf2.join("")); // 期望结果: 5, buf: abcde

resetFile("abcdABCD1234");
const buf3: string[] = [];
console.log("描述:", read(buf3, 12), "buf:", buf3.join("")); // 期望结果: 12, buf: abcdABCD1234

resetFile("leetcode");
const buf4: string[] = [];
console.log("描述:", read(buf4, 5), "buf:", buf4.join("")); // 期望结果: 5, buf: leetc

export {};
