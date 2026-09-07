export type Friend = {
  name: string;
  url: string;
  description: string;
  /** 头像用 emoji，避免依赖外部图片（国内加载不稳定） */
  emoji: string;
};

/** 友链列表：想加朋友就直接往数组里加一条 */
const FRIENDS: Friend[] = [
  // 示例（取消注释并按格式填写）：
  // {
  //   name: "示例小站",
  //   url: "https://example.com",
  //   description: "一句话介绍对方的站点。",
  //   emoji: "🌱",
  // },
];

export function getFriends(): Friend[] {
  return FRIENDS;
}
