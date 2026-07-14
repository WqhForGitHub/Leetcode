// ============================================================
// 127. 找出适应屏幕的最大字号
// ============================================================
// LeetCode 1618. Maximum Font to Fit a Sentence on a Screen
// 给定文本、字号数组和宽高限制，找能放入屏幕的最大字号。

// 模拟 FontInfo 接口
interface FontInfo {
  getWidth(fontSize: number, ch: string): number;
  getHeight(fontSize: number): number;
}

class MockFontInfo implements FontInfo {
  getWidth(fontSize: number, ch: string): number {
    return fontSize; // 简化：每个字符宽度等于字号
  }
  getHeight(fontSize: number): number {
    return fontSize;
  }
}

// 方法1：二分查找
function maxFont(text: string, w: number, h: number, fonts: number[], fontInfo: FontInfo): number {
  const n = fonts.length;
  let left = 0;
  let right = n - 1;
  let result = -1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const fontSize = fonts[mid];
    // 检查高度
    if (fontInfo.getHeight(fontSize) > h) {
      right = mid - 1;
      continue;
    }
    // 检查宽度
    let width = 0;
    for (const ch of text) {
      width += fontInfo.getWidth(fontSize, ch);
      if (width > w) break;
    }
    if (width <= w) {
      result = fontSize;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return result;
}

// 方法2：线性扫描
function maxFontLinear(
  text: string,
  w: number,
  h: number,
  fonts: number[],
  fontInfo: FontInfo,
): number {
  const result = -1;
  for (let i = fonts.length - 1; i >= 0; i--) {
    const fontSize = fonts[i];
    if (fontInfo.getHeight(fontSize) > h) continue;
    let width = 0;
    for (const ch of text) {
      width += fontInfo.getWidth(fontSize, ch);
      if (width > w) break;
    }
    if (width <= w) {
      return fontSize;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 127. 找出适应屏幕的最大字号 =====");
const fontInfo = new MockFontInfo();
console.log(
  "二分 'hello',50,10,[1,2,3,4,5,6,7,8]:",
  maxFont("hello", 50, 10, [1, 2, 3, 4, 5, 6, 7, 8], fontInfo),
); // 5 (hello = 5*5 = 25, 6*5=30 > 50? no... 实际取决于接口)
console.log(
  "线性 'hello',50,10,[1,2,3,4,5,6,7,8]:",
  maxFontLinear("hello", 50, 10, [1, 2, 3, 4, 5, 6, 7, 8], fontInfo),
);

export {};
