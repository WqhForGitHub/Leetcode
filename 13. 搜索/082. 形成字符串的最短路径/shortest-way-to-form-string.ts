// ============================================================
// 082. 形成字符串的最短路径
// ============================================================
// LeetCode 1055. Shortest Way to Form String
// 从 source 中按顺序取子序列拼成 target，最少需要多少次。

// 方法1：贪心 + 双指针
function shortestWay(source: string, target: string): number {
  let count = 0;
  let tIdx = 0;
  while (tIdx < target.length) {
    let sIdx = 0;
    let matched = false;
    while (sIdx < source.length && tIdx < target.length) {
      if (source[sIdx] === target[tIdx]) {
        tIdx++;
        matched = true;
      }
      sIdx++;
    }
    if (!matched) return -1; // source 中缺少 target 的字符
    count++;
  }
  return count;
}

// 方法2：预处理 + 二分查找
function shortestWayBinary(source: string, target: string): number {
  // pos[c] = source 中字符 c 出现的位置列表
  const pos: Map<string, number[]> = new Map();
  for (let i = 0; i < source.length; i++) {
    if (!pos.has(source[i])) pos.set(source[i], []);
    pos.get(source[i])!.push(i);
  }
  let count = 1;
  let sIdx = -1; // source 中当前匹配位置
  for (const ch of target) {
    if (!pos.has(ch)) return -1;
    const arr = pos.get(ch)!;
    // 二分找第一个 > sIdx 的位置
    let lo = 0;
    let hi = arr.length - 1;
    let found = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] > sIdx) {
        found = arr[mid];
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    if (found === -1) {
      // 需要重新从 source 开头开始
      count++;
      sIdx = arr[0];
    } else {
      sIdx = found;
    }
  }
  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 082. 形成字符串的最短路径 =====");
console.log("贪心 'abc','abcbc':", shortestWay("abc", "abcbc")); // 2
console.log("贪心 'abc','acdbc':", shortestWay("abc", "acdbc")); // -1
console.log("贪心 'xyz','xzyxz':", shortestWay("xyz", "xzyxz")); // 3
console.log("二分 'abc','abcbc':", shortestWayBinary("abc", "abcbc")); // 2

export {};
