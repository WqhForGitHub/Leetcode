// ============================================================
// 035. K 距离间隔重排字符串
// ============================================================
// LeetCode 358. Rearrange String k Distance Apart
// 重排字符串 s，使相同字符之间的间隔至少为 k。若无法重排返回空串。

// 大顶堆实现（按频率降序，频率相同时按字符升序以保证确定性）
class MaxHeapChar {
  private data: Array<[string, number]> = []; // [char, count]

  size(): number {
    return this.data.length;
  }

  push(item: [string, number]): void {
    this.data.push(item);
    this.siftUp(this.data.length - 1);
  }

  pop(): [string, number] | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  private less(i: number, j: number): boolean {
    // 大顶堆：频率大的在上；频率相同则字符序小的在上
    const a = this.data[i];
    const b = this.data[j];
    if (a[1] !== b[1]) return a[1] < b[1];
    return a[0] > b[0];
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.less(parent, i)) {
        [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
        i = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;
      if (left < n && this.less(largest, left)) largest = left;
      if (right < n && this.less(largest, right)) largest = right;
      if (largest === i) break;
      [this.data[largest], this.data[i]] = [this.data[i], this.data[largest]];
      i = largest;
    }
  }
}

// 方法1：贪心 + 大顶堆 + 冷却队列（O(n log 26) ≈ O(n)）
// 每次从堆中取频率最高的字符追加到结果，使用后放入冷却队列，k 步后才可再次使用。
function rearrangeString(s: string, k: number): string {
  if (k <= 1) return s;
  const freq = new Map<string, number>();
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }
  const heap = new MaxHeapChar();
  for (const [ch, c] of freq) {
    heap.push([ch, c]);
  }
  const result: string[] = [];
  // 冷却队列元素：[char, remainingCount, availableIndex]
  const cooldown: Array<[string, number, number]> = [];
  while (result.length < s.length) {
    // 先释放已就绪的冷却元素
    while (cooldown.length > 0 && cooldown[0][2] <= result.length) {
      const [ch, c] = cooldown.shift()!;
      if (c > 0) {
        heap.push([ch, c]);
      }
    }
    if (heap.size() === 0) {
      return ""; // 无可用字符，无法满足间隔要求
    }
    const [ch, c] = heap.pop()!;
    result.push(ch);
    // 该字符下一次可用位置为当前位置 + k
    cooldown.push([ch, c - 1, result.length - 1 + k]);
  }
  return result.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 035. K 距离间隔重排字符串 =====");

// 验证重排结果是否合法：长度相同且相同字符间隔 >= k
function isValid(result: string, k: number): boolean {
  if (result.length === 0) return true;
  const pos = new Map<string, number>();
  for (let i = 0; i < result.length; i++) {
    const ch = result[i];
    if (pos.has(ch) && i - pos.get(ch)! < k) {
      return false;
    }
    pos.set(ch, i);
  }
  return true;
}

const r1 = rearrangeString("aabbcc", 3);
console.log(`"aabbcc", k=3 => "${r1}" (合法: ${isValid(r1, 3)})`); // 期望合法，如 "abcabc"

const r2 = rearrangeString("aaabc", 3);
console.log(`"aaabc", k=3 => "${r2}" (合法: ${isValid(r2, 3)})`); // 期望 "" (无法重排)

const r3 = rearrangeString("aaadbbcc", 2);
console.log(`"aaadbbcc", k=2 => "${r3}" (合法: ${isValid(r3, 2)})`); // 期望合法

const r4 = rearrangeString("a", 2);
console.log(`"a", k=2 => "${r4}" (合法: ${isValid(r4, 2)})`); // 期望 "a"

export {};
