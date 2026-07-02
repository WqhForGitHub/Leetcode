// ============================================================
// 092. 字符串中的查找与替换
// ============================================================
// LeetCode 833. Find And Replace in String
// 给定字符串 s，以及索引数组 indices、源串 sources、目标串 targets（三者等长）。
// 对每个 i：若 s 中从 indices[i] 开始的子串等于 sources[i]，则用 targets[i] 替换。
// 所有匹配判断均基于原始 s，且不会出现重叠冲突。返回替换后的字符串。

// 方法1：按索引排序 + 从右向左替换（推荐，O(n * k) 时间，O(n) 空间）
// 先将替换操作按 indices 升序排序，再从右向左依次替换。
// 从右向左保证左侧索引位置在结果串中始终有效；匹配判断对原始 s 进行。
function findReplaceString(
  s: string,
  indices: number[],
  sources: string[],
  targets: string[],
): string {
  const k = indices.length;
  const order: number[] = Array.from({ length: k }, (_, i) => i).sort(
    (a, b) => indices[a] - indices[b],
  );

  let result = s;
  for (let j = k - 1; j >= 0; j--) {
    const idx = order[j];
    const start = indices[idx];
    const src = sources[idx];
    const tgt = targets[idx];
    // 基于原始 s 判断
    if (s.slice(start, start + src.length) === src) {
      result = result.slice(0, start) + tgt + result.slice(start + src.length);
    }
  }
  return result;
}

// 方法2：标记数组 + 顺序构建（O(n + k * |src|) 时间，O(n) 空间）
// 先用 match[i] 记录原串位置 i 处是否发生替换及其替换编号，
// 再顺序扫描原串：命中则追加 target 并跳过 source 长度，否则追加当前字符。
function findReplaceStringBuild(
  s: string,
  indices: number[],
  sources: string[],
  targets: string[],
): string {
  const n = s.length;
  const k = indices.length;
  const match: number[] = new Array(n).fill(-1);
  for (let i = 0; i < k; i++) {
    const start = indices[i];
    const src = sources[i];
    if (s.slice(start, start + src.length) === src) {
      match[start] = i;
    }
  }

  let result = "";
  let i = 0;
  while (i < n) {
    if (match[i] >= 0) {
      const idx = match[i];
      result += targets[idx];
      i += sources[idx].length;
    } else {
      result += s[i];
      i++;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 092. 字符串中的查找与替换 =====");
console.log(
  "右向左 abcd,[0,2],[ab,cd],[eee,ffff]:",
  findReplaceString("abcd", [0, 2], ["ab", "cd"], ["eee", "ffff"]),
); // 期望 "eeeffff"
console.log(
  "右向左 abcd,[0,2],[a,cd],[eee,ffff]:",
  findReplaceString("abcd", [0, 2], ["a", "cd"], ["eee", "ffff"]),
); // 期望 "eeebffff"
console.log(
  "右向左 vmokgggqzp,[3,5,1],[kg,ggq,mo],[s,so,bfr]:",
  findReplaceString("vmokgggqzp", [3, 5, 1], ["kg", "ggq", "mo"], ["s", "so", "bfr"]),
); // 期望 "vbfrssozp"
console.log(
  "构建法 abcd,[0,2],[ab,cd],[eee,ffff]:",
  findReplaceStringBuild("abcd", [0, 2], ["ab", "cd"], ["eee", "ffff"]),
); // 期望 "eeeffff"
console.log(
  "构建法 abcd,[0,2],[a,cd],[eee,ffff]:",
  findReplaceStringBuild("abcd", [0, 2], ["a", "cd"], ["eee", "ffff"]),
); // 期望 "eeebffff"
console.log(
  "构建法 vmokgggqzp,[3,5,1],[kg,ggq,mo],[s,so,bfr]:",
  findReplaceStringBuild("vmokgggqzp", [3, 5, 1], ["kg", "ggq", "mo"], ["s", "so", "bfr"]),
); // 期望 "vbfrssozp"

export {};
