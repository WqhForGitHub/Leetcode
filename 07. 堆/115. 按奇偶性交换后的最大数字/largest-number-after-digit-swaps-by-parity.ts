// ============================================================
// 115. 按奇偶性交换后的最大数字
// ============================================================
// LeetCode 2231. Largest Number After Digit Swaps by Parity
// 可交换同奇偶性的数字，求最大数字。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：两个堆（奇偶分别排序）
function largestInteger(num: number): number {
  const odd: number[] = [];
  const even: number[] = [];
  const digits: number[] = [];
  const s = num.toString();
  for (const ch of s) {
    const d = parseInt(ch);
    digits.push(d);
    if (d % 2 === 0) even.push(d);
    else odd.push(d);
  }
  odd.sort((a, b) => b - a);
  even.sort((a, b) => b - a);
  let oi = 0;
  let ei = 0;
  let result = 0;
  for (const d of digits) {
    if (d % 2 === 0) {
      result = result * 10 + even[ei++];
    } else {
      result = result * 10 + odd[oi++];
    }
  }
  return result;
}

// 方法2：最大堆
function largestIntegerHeap(num: number): number {
  const oddHeap: number[] = [];
  const evenHeap: number[] = [];
  const pushMax = (arr: number[], v: number): void => {
    arr.push(v);
    let i = arr.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (arr[i] > arr[p]) { [arr[i], arr[p]] = [arr[p], arr[i]]; i = p; } else break;
    }
  };
  const popMax = (arr: number[]): number => {
    const top = arr[0];
    const last = arr.pop()!;
    if (arr.length > 0) {
      arr[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < arr.length && arr[l] > arr[s]) s = l;
        if (r < arr.length && arr[r] > arr[s]) s = r;
        if (s !== i) { [arr[i], arr[s]] = [arr[s], arr[i]]; i = s; } else break;
      }
    }
    return top;
  };
  const s = num.toString();
  const digits: number[] = [];
  for (const ch of s) {
    const d = parseInt(ch);
    digits.push(d);
    if (d % 2 === 0) pushMax(evenHeap, d);
    else pushMax(oddHeap, d);
  }
  let result = 0;
  for (const d of digits) {
    if (d % 2 === 0) result = result * 10 + popMax(evenHeap);
    else result = result * 10 + popMax(oddHeap);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 115. 按奇偶性交换后的最大数字 =====");
console.log("排序:", largestInteger(1234)); // 期望 3412
console.log("堆:", largestIntegerHeap(65875)); // 期望 87655

export {};
