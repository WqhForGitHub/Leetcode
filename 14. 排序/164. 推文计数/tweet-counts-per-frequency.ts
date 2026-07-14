// ============================================================
// 164. 推文计数
// ============================================================
// LeetCode 1348. Tweet Counts Per Frequency
// 设计类 TweetCounts：recordTweet(name, time) 记录推文；
// getTweetCountsPerInterval(name, startTime, endTime, interval)
// 返回 [startTime, endTime] 内按 interval 大小划分的每个区间的推文数。
// interval 为秒数（如 60/3600/86400）。

// 方法1：Map 存储时间数组 + 查询前排序 + 二分查找（O(n log n) 查询）
class TweetCounts1 {
  private map: Map<string, number[]> = new Map();

  recordTweet(tweetName: string, time: number): void {
    let arr = this.map.get(tweetName);
    if (!arr) {
      arr = [];
      this.map.set(tweetName, arr);
    }
    arr.push(time);
  }

  getTweetCountsPerInterval(
    tweetName: string,
    startTime: number,
    endTime: number,
    interval: number,
  ): number[] {
    const arr = this.map.get(tweetName);
    if (!arr) return [];
    arr.sort((a, b) => a - b);
    const res: number[] = [];
    // lowerBound 返回首个 >= target 的下标
    const lowerBound = (target: number): number => {
      let lo = 0;
      let hi = arr.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    };
    for (let s = startTime; s <= endTime; s += interval) {
      const e = Math.min(s + interval - 1, endTime);
      const l = lowerBound(s);
      const r = lowerBound(e + 1);
      res.push(r - l);
    }
    return res;
  }
}

// 方法2：插入时二分保持有序 + 查询时双指针扫描（O(n) 查询）
class TweetCounts2 {
  private map: Map<string, number[]> = new Map();

  recordTweet(tweetName: string, time: number): void {
    let arr = this.map.get(tweetName);
    if (!arr) {
      arr = [];
      this.map.set(tweetName, arr);
    }
    // 二分找到插入位置，保持有序
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < time) lo = mid + 1;
      else hi = mid;
    }
    arr.splice(lo, 0, time);
  }

  getTweetCountsPerInterval(
    tweetName: string,
    startTime: number,
    endTime: number,
    interval: number,
  ): number[] {
    const arr = this.map.get(tweetName) ?? [];
    const res: number[] = [];
    let idx = 0;
    for (let s = startTime; s <= endTime; s += interval) {
      const e = Math.min(s + interval - 1, endTime);
      // 跳过 < s 的（实际上一次循环已跳过）
      while (idx < arr.length && arr[idx] < s) idx++;
      let count = 0;
      while (idx < arr.length && arr[idx] <= e) {
        count++;
        idx++;
      }
      res.push(count);
    }
    return res;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 164. 推文计数 =====");
const tc1 = new TweetCounts1();
tc1.recordTweet("tweet3", 0);
tc1.recordTweet("tweet3", 60);
tc1.recordTweet("tweet3", 10);
console.log("方法1 [0,60,60]:", tc1.getTweetCountsPerInterval("tweet3", 0, 60, 60)); // [2,1]
console.log("方法1 [0,60,10]:", tc1.getTweetCountsPerInterval("tweet3", 0, 60, 10)); // [1,1,0,0,0,0,1]

const tc2 = new TweetCounts2();
tc2.recordTweet("tweet3", 0);
tc2.recordTweet("tweet3", 60);
tc2.recordTweet("tweet3", 10);
console.log("方法2 [0,60,60]:", tc2.getTweetCountsPerInterval("tweet3", 0, 60, 60)); // [2,1]
console.log("方法2 [0,60,10]:", tc2.getTweetCountsPerInterval("tweet3", 0, 60, 10)); // [1,1,0,0,0,0,1]

export {};
