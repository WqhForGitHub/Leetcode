// ============================================================
// 078. 构建字典序最大的可行序列
// ============================================================
// LeetCode 1718. Construct the Lexicographically Largest Valid Sequence
// 给定 n，构造长度为 2n-1 的序列：
//   - 数字 1 出现 1 次，数字 2..n 各出现 2 次。
//   - 数字 i 的两次出现位置之差恰好为 i。
//   - 返回字典序最大的序列。
// 时间复杂度：O(n!)，实际由于约束很强，回溯很快。

// 方法1：回溯(从大到小尝试) (推荐)
// 逐位置从左到右填充，每个空位尝试从大到小的可用数字。
// 数字 1 只占 1 位，数字 i(i>=2) 占 pos 与 pos+i 两位。
// 第一个找到的解即为字典序最大。
// 时间复杂度：最坏 O(n!)，空间复杂度：O(n)
function constructDistancedSequence1(n: number): number[] {
  const len: number = 2 * n - 1;
  const result: number[] = new Array(len).fill(0);
  const used: boolean[] = new Array(n + 1).fill(false);

  const backtrack = (pos: number): boolean => {
    if (pos === len) return true; // 所有位置已填
    if (result[pos] !== 0) return backtrack(pos + 1); // 当前位置已填

    // 从大到小尝试，保证字典序最大
    for (let i: number = n; i >= 1; i--) {
      if (used[i]) continue;
      if (i === 1) {
        // 数字 1 只出现一次
        result[pos] = 1;
        used[1] = true;
        if (backtrack(pos + 1)) return true;
        used[1] = false;
        result[pos] = 0;
      } else {
        // 数字 i 需要放在 pos 和 pos+i
        if (pos + i >= len || result[pos + i] !== 0) continue;
        result[pos] = i;
        result[pos + i] = i;
        used[i] = true;
        if (backtrack(pos + 1)) return true;
        used[i] = false;
        result[pos] = 0;
        result[pos + i] = 0;
      }
    }
    return false;
  };

  backtrack(0);
  return result;
}

// 方法2：回溯+剪枝
// 在方法1 基础上增加剪枝：当剩余空位数恰好等于剩余数字所需位数时，
// 只有能放下两位的数字才可尝试放在非末尾位置；若只剩一个空位则只能放 1。
// 时间复杂度：最坏 O(n!)，剪枝后更快，空间复杂度：O(n)
function constructDistancedSequence2(n: number): number[] {
  const len: number = 2 * n - 1;
  const result: number[] = new Array(len).fill(0);
  const used: boolean[] = new Array(n + 1).fill(false);
  let remainingSlots: number = len; // 剩余空位数
  let _remainingOneCount: number = 1; // 数字 1 还需 1 个位置
  let _remainingPairCount: number = n - 1; // 数字 2..n 还需 2*(n-1) 个位置

  const backtrack = (pos: number): boolean => {
    if (pos === len) return true;
    if (result[pos] !== 0) return backtrack(pos + 1);

    // 剪枝：若剩余空位仅 1 个，则只能放数字 1
    if (remainingSlots === 1) {
      if (!used[1]) {
        result[pos] = 1;
        used[1] = true;
        remainingSlots--;
        _remainingOneCount--;
        if (backtrack(pos + 1)) return true;
        remainingSlots++;
        _remainingOneCount++;
        used[1] = false;
        result[pos] = 0;
      }
      return false;
    }

    for (let i: number = n; i >= 1; i--) {
      if (used[i]) continue;
      if (i === 1) {
        result[pos] = 1;
        used[1] = true;
        remainingSlots--;
        _remainingOneCount--;
        if (backtrack(pos + 1)) return true;
        remainingSlots++;
        _remainingOneCount++;
        used[1] = false;
        result[pos] = 0;
      } else {
        if (pos + i >= len || result[pos + i] !== 0) continue;
        result[pos] = i;
        result[pos + i] = i;
        used[i] = true;
        remainingSlots -= 2;
        _remainingPairCount--;
        if (backtrack(pos + 1)) return true;
        remainingSlots += 2;
        _remainingPairCount++;
        used[i] = false;
        result[pos] = 0;
        result[pos + i] = 0;
      }
    }
    return false;
  };

  backtrack(0);
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 078. 构建字典序最大的可行序列 =====");
console.log(constructDistancedSequence1(3)); // 期望结果: [3,1,2,3,2]
console.log(constructDistancedSequence1(5)); // 期望结果: [5,3,1,4,3,5,2,4,2]
console.log(constructDistancedSequence2(3)); // 期望结果: [3,1,2,3,2]
console.log(constructDistancedSequence2(5)); // 期望结果: [5,3,1,4,3,5,2,4,2]
console.log(constructDistancedSequence1(1)); // 期望结果: [1]

export {};
