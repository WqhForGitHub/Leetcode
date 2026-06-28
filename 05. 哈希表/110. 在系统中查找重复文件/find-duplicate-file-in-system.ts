// ============================================================
// 110. 在系统中查找重复文件
// ============================================================
// LeetCode 609. Find Duplicate File in System
// 给定文件系统信息列表，每个字符串 "目录路径 文件1(content1) 文件2(content2) ..."
// 找出所有内容重复的文件路径组。
// 时间复杂度：O(N*L)，N 为字符串数，L 为平均长度；空间复杂度：O(N*L)

// 思路：哈希表以内容为键，收集所有同内容文件路径
function findDuplicate(paths: string[]): string[][] {
  // content -> 文件完整路径列表
  const contentToFiles = new Map<string, string[]>();

  for (const path of paths) {
    const parts = path.split(" ");
    const dir = parts[0];
    for (let i = 1; i < parts.length; i++) {
      // 文件名(content)
      const leftParen = parts[i].indexOf("(");
      const fileName = parts[i].slice(0, leftParen);
      const content = parts[i].slice(leftParen + 1, parts[i].length - 1);
      const fullPath = dir + "/" + fileName;
      if (!contentToFiles.has(content)) {
        contentToFiles.set(content, []);
      }
      contentToFiles.get(content)!.push(fullPath);
    }
  }

  // 只返回有重复的组
  const result: string[][] = [];
  for (const files of contentToFiles.values()) {
    if (files.length > 1) {
      result.push(files);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 110. 在系统中查找重复文件 =====");
// 测试 1
console.log(
  findDuplicate([
    "root/a 1.txt(abcd) 2.txt(efgh)",
    "root/c 3.txt(abcd)",
    "root/c/d 4.txt(efgh)",
    "root 4.txt(efgh)",
  ]),
);
// 期望: [["root/a/2.txt","root/c/d/4.txt","root/4.txt"],["root/a/1.txt","root/c/3.txt"]]
// 测试 2
console.log(
  findDuplicate([
    "root/a 1.txt(abcd) 2.txt(efgh)",
    "root/c 3.txt(abcd)",
    "root/c/d 4.txt(efgh)",
  ]),
);
// 期望: [["root/a/2.txt","root/c/d/4.txt"],["root/a/1.txt","root/c/3.txt"]]

export {};
