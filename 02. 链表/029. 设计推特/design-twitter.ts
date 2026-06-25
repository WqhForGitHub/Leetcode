// ============================================================
// 029. 设计推特
// ============================================================
// LeetCode 355. Design Twitter
// 设计一个简化版的推特，支持以下操作：
//   postTweet(userId, tweetId)：发布推文
//   getNewsFeed(userId)：获取该用户及关注者的最近 10 条推文（按时间倒序）
//   follow(followerId, followeeId)：关注
//   unfollow(followerId, followeeId)：取关
// 时间复杂度：postTweet O(1)，follow/unfollow O(1)，getNewsFeed O(n log k)

// 推文节点（链表形式，按时间倒序排列，最新推文在头）
class Tweet {
  tweetId: number;
  time: number; // 时间戳，越大越新
  next: Tweet | null;
  constructor(tweetId: number, time: number) {
    this.tweetId = tweetId;
    this.time = time;
    this.next = null;
  }
}

// 用户类
class User {
  userId: number;
  tweets: Tweet | null; // 该用户的推文链表头（最新推文）
  following: Set<number>; // 关注的用户集合（包括自己）

  constructor(userId: number) {
    this.userId = userId;
    this.tweets = null;
    this.following = new Set<number>();
    this.following.add(userId); // 用户默认关注自己
  }

  // 发布推文：头插法插入推文链表
  post(tweetId: number, time: number): void {
    const tweet = new Tweet(tweetId, time);
    tweet.next = this.tweets;
    this.tweets = tweet;
  }

  follow(userId: number): void {
    this.following.add(userId);
  }

  unfollow(userId: number): void {
    // 不能取关自己
    if (userId !== this.userId) {
      this.following.delete(userId);
    }
  }
}

class Twitter {
  private users: Map<number, User>; // userId -> User
  private timestamp: number; // 全局时间戳

  constructor() {
    this.users = new Map<number, User>();
    this.timestamp = 0;
  }

  // 获取或创建用户
  private getUser(userId: number): User {
    if (!this.users.has(userId)) {
      this.users.set(userId, new User(userId));
    }
    return this.users.get(userId)!;
  }

  // 发布推文
  postTweet(userId: number, tweetId: number): void {
    const user = this.getUser(userId);
    user.post(tweetId, this.timestamp++);
  }

  // 获取最近 10 条推文（多路归并）
  // 使用最大堆（按 time 降序）合并用户及关注者的推文链表
  getNewsFeed(userId: number): number[] {
    const user = this.getUser(userId);
    const result: number[] = [];

    // 最小堆比较器：按 time 降序排列（堆顶 time 最大）
    const heap: Tweet[] = [];
    const compare = (a: Tweet, b: Tweet): number => b.time - a.time;

    // 将用户及其关注者的推文链表头加入堆
    for (const followeeId of user.following) {
      const followee = this.users.get(followeeId);
      if (followee !== undefined && followee.tweets !== null) {
        heap.push(followee.tweets);
      }
    }
    // 建堆
    heap.sort(compare);

    // 多路归并，每次取 time 最大的推文
    while (heap.length > 0 && result.length < 10) {
      // 堆顶是 time 最大的
      const top = heap.shift()!; // 取出堆顶
      result.push(top.tweetId);
      if (top.next !== null) {
        heap.push(top.next);
        heap.sort(compare); // 重新排序保持堆性质
      }
    }
    return result;
  }

  // 关注
  follow(followerId: number, followeeId: number): void {
    const follower = this.getUser(followerId);
    this.getUser(followeeId); // 确保 followee 存在
    follower.follow(followeeId);
  }

  // 取关
  unfollow(followerId: number, followeeId: number): void {
    const follower = this.getUser(followerId);
    follower.unfollow(followeeId);
  }
}

// 测试
console.log("===== 029. 设计推特 =====");
const twitter = new Twitter();
twitter.postTweet(1, 5); // 用户1发布推文5
console.log("用户1的新闻流：", twitter.getNewsFeed(1)); // [5]
twitter.follow(1, 2); // 用户1关注用户2
twitter.postTweet(2, 6); // 用户2发布推文6
console.log("用户1关注2后的新闻流：", twitter.getNewsFeed(1)); // [6,5]
twitter.unfollow(1, 2); // 用户1取关用户2
console.log("用户1取关2后的新闻流：", twitter.getNewsFeed(1)); // [5]

// 测试2：多推文排序
const twitter2 = new Twitter();
twitter2.postTweet(1, 1);
twitter2.postTweet(1, 2);
twitter2.postTweet(1, 3);
console.log("用户1发3条推文后新闻流：", twitter2.getNewsFeed(1)); // [3,2,1]

export {};
