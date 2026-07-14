// 175. 判断是否存在简单图
// 自定义题：给定度数序列，判断是否存在简单无向图（无自环、无重边）。
// 思路：Havel-Hakimi 算法 + 握手定理。

type DegreeSequence = number[];

function havelHakimiNext(seq: number[]): number[] | null {
  const arr = seq.filter((d) => d > 0);
  if (arr.length === 0) return [];
  arr.sort((a, b) => b - a);
  const first = arr.shift()!;
  if (first > arr.length) return null;
  for (let i = 0; i < first; i++) {
    arr[i] -= 1;
    if (arr[i] < 0) return null;
  }
  return arr;
}

function checkIfSimpleGraphExists(degrees: DegreeSequence): boolean {
  const sum = degrees.reduce((s, d) => s + d, 0);
  if (sum % 2 !== 0) return false;
  if (degrees.some((d) => d < 0)) return false;
  let seq: number[] | null = degrees.slice();
  while (seq !== null && seq.length > 0) {
    seq = havelHakimiNext(seq);
  }
  return seq !== null;
}

// 测试
console.log(checkIfSimpleGraphExists([3, 3, 2, 2])); // 期望 true
console.log(checkIfSimpleGraphExists([3, 3, 3, 1])); // 期望 false
console.log(checkIfSimpleGraphExists([2, 2, 2])); // 期望 true
console.log(checkIfSimpleGraphExists([4, 4, 3, 3])); // 期望 false

export {};
