// ============================================================
// 060. 设计最近使用（MRU）队列
// ============================================================
// LeetCode 1756. Design Most Recently Used Cache
// 初始化含 1..n 的队列。fetch(k) 取出第 k 个元素（1-indexed），
// 将其移到队列末尾并返回。
// 方法：SQRT 分块（分块数组），每个块大小约 sqrt(n)，
// fetch 时定位块、删除、追加到末尾。
// 时间复杂度：fetch O(sqrt(n))，空间复杂度：O(n)

class MRUQueue {
  private blocks: number[][];
  private blockSize: number;

  constructor(n: number) {
    this.blockSize = Math.max(1, Math.ceil(Math.sqrt(n)));
    this.blocks = [];
    for (let i = 1; i <= n; i++) {
      const blockIdx = Math.floor((i - 1) / this.blockSize);
      if (!this.blocks[blockIdx]) this.blocks[blockIdx] = [];
      this.blocks[blockIdx].push(i);
    }
  }

  // 取出第 k 个元素（1-indexed），移到末尾并返回
  fetch(k: number): number {
    let count = 0;
    let val = 0;
    let targetBlock = 0;
    // 定位第 k 个元素所在块及块内下标
    for (let i = 0; i < this.blocks.length; i++) {
      if (count + this.blocks[i].length >= k) {
        const idx = k - count - 1; // 块内下标
        val = this.blocks[i][idx];
        this.blocks[i].splice(idx, 1); // 从块中删除
        targetBlock = i;
        break;
      }
      count += this.blocks[i].length;
    }
    // 若块变空则移除该块
    if (this.blocks[targetBlock].length === 0) {
      this.blocks.splice(targetBlock, 1);
    }
    // 追加到末尾块；若末尾块已满则新建块
    const lastBlock = this.blocks[this.blocks.length - 1];
    if (lastBlock && lastBlock.length < this.blockSize) {
      lastBlock.push(val);
    } else {
      this.blocks.push([val]);
    }
    return val;
  }
}

// 测试
(function test() {
  const q = new MRUQueue(8); // [1,2,3,4,5,6,7,8]
  console.log(q.fetch(3)); // 3 -> [1,2,4,5,6,7,8,3]
  console.log(q.fetch(5)); // 6 -> [1,2,4,5,7,8,3,6]
  console.log(q.fetch(2)); // 2 -> [1,4,5,7,8,3,6,2]
  console.log(q.fetch(8)); // 2 -> [1,4,5,7,8,3,6,2]
})();

export {};
