// ============================================================
// 045. 单词的唯一缩写
// ============================================================
// LeetCode 288. Unique Word Abbreviation
// 一个单词的缩写为其首字母 + 中间字符个数 + 末字母。
// 判断字典中某个单词的缩写是否唯一（即没有其他单词与之同缩写）。
// 时间复杂度：预处理 O(n)，查询 O(1)，空间复杂度：O(n)

class ValidWordAbbr {
  // 缩写 -> 该缩写对应的单词集合（去重）
  private map: Map<string, Set<string>>;

  constructor(dictionary: string[]) {
    this.map = new Map();
    for (const word of dictionary) {
      const abbr = this.getAbbr(word);
      if (!this.map.has(abbr)) {
        this.map.set(abbr, new Set());
      }
      this.map.get(abbr)!.add(word);
    }
  }

  // 计算单词缩写：首字母 + 中间字符个数 + 末字母
  private getAbbr(word: string): string {
    if (word.length <= 2) return word;
    return word[0] + (word.length - 2).toString() + word[word.length - 1];
  }

  // 判断 word 的缩写是否唯一：
  // 该缩写对应的单词集合中要么为空，要么只有 word 本身
  isUnique(word: string): boolean {
    const abbr = this.getAbbr(word);
    const set = this.map.get(abbr);
    if (!set) return true; // 没有其他单词共用此缩写
    // 如果集合中只有该单词自己，则唯一
    return set.has(word) && set.size === 1;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 045. 单词的唯一缩写 =====");
// 字典缩写：deer->d2r, door->d2r, cake->c2e, card->c2d
const vwa1 = new ValidWordAbbr(["deer", "door", "cake", "card"]);
console.log(vwa1.isUnique("dear")); // false (dear 缩写 d2r 已被 deer/door 占用)
console.log(vwa1.isUnique("cart")); // true (cart 缩写 c2t 无冲突)
console.log(vwa1.isUnique("cane")); // false (cane 缩写 c2e 已被 cake 占用)
console.log(vwa1.isUnique("make")); // true (make 缩写 m2e 无冲突)

const vwa2 = new ValidWordAbbr(["hello"]);
console.log(vwa2.isUnique("hello")); // true

export {};
