// ============================================================
// 109. 推文计数
// ============================================================
// LeetCode 1348. Tweet Counts Per Frequency
// 按分钟/小时/天统计某时间段内各推文的时间区间计数。

// 方法1：排序 + 二分查找
class TweetCounts {
  private tweets: Map<string, number[]>;

  constructor() {
    this.tweets = new Map();
  }

  recordTweet(tweetName: string, time: number): void {
    if (!this.tweets.has(tweetName)) {
      this.tweets.set(tweetName, []);
    }
    this.tweets.get(tweetName)!.push(time);
  }

  getTweetCountsPerFrequency(
    freq: string,
    tweetName: string,
    startTime: number,
    endTime: number,
  ): number[] {
    if (!this.tweets.has(tweetName)) return [];
    const times = this.tweets.get(tweetName)!.sort((a, b) => a - b);
    const interval = freq === "minute" ? 60 : freq === "hour" ? 3600 : 86400;
    const result: number[] = [];
    for (let t = startTime; t <= endTime; t += interval) {
      const end = Math.min(t + interval - 1, endTime);
      // 二分找 [t, end] 范围内的推文数
      const leftIdx = lowerBound(times, t);
      const rightIdx = upperBound(times, end);
      result.push(rightIdx - leftIdx);
    }
    return result;
  }
}

function lowerBound(arr: number[], target: number): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function upperBound(arr: number[], target: number): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// 方法2：使用有序数组插入
class TweetCountsSorted {
  private tweets: Map<string, number[]>;

  constructor() {
    this.tweets = new Map();
  }

  recordTweet(tweetName: string, time: number): void {
    if (!this.tweets.has(tweetName)) {
      this.tweets.set(tweetName, []);
    }
    // 二分插入保持有序
    const arr = this.tweets.get(tweetName)!;
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] < time) lo = mid + 1;
      else hi = mid;
    }
    arr.splice(lo, 0, time);
  }

  getTweetCountsPerFrequency(
    freq: string,
    tweetName: string,
    startTime: number,
    endTime: number,
  ): number[] {
    if (!this.tweets.has(tweetName)) return [];
    const times = this.tweets.get(tweetName)!;
    const interval = freq === "minute" ? 60 : freq === "hour" ? 3600 : 86400;
    const result: number[] = [];
    for (let t = startTime; t <= endTime; t += interval) {
      const end = Math.min(t + interval - 1, endTime);
      const li = lowerBound(times, t);
      const ri = upperBound(times, end);
      result.push(ri - li);
    }
    return result;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 109. 推文计数 =====");
const tc = new TweetCounts();
tc.recordTweet("tweet3", 0);
tc.recordTweet("tweet3", 60);
tc.recordTweet("tweet3", 10);
console.log("minute,0,59:", tc.getTweetCountsPerFrequency("minute", "tweet3", 0, 59)); // [2]
console.log("minute,0,60:", tc.getTweetCountsPerFrequency("minute", "tweet3", 0, 60)); // [2,1]

export {};
