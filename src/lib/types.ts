import { AdminConfig } from './admin.types';

// 播放记录数据结构
export interface PlayRecord {
  title: string;
  source_name: string;
  cover: string;
  year: string;
  index: number; // 第几集
  total_episodes: number; // 总集数
  play_time: number; // 播放进度（秒）
  total_time: number; // 总进度（秒）
  save_time: number; // 记录保存时间（时间戳）
  search_title: string; // 搜索时使用的标题
}

// 收藏数据结构
export interface Favorite {
  source_name: string;
  total_episodes: number; // 总集数
  title: string;
  year: string;
  cover: string;
  save_time: number; // 记录保存时间（时间戳）
  search_title: string; // 搜索时使用的标题
  origin?: 'vod' | 'live';
  is_completed?: boolean; // 是否已完结
  vod_remarks?: string; // 视频备注信息
}

// 存储接口
export interface IStorage {
  // 播放记录相关
  getPlayRecord(userName: string, key: string): Promise<PlayRecord | null>;
  setPlayRecord(
    userName: string,
    key: string,
    record: PlayRecord
  ): Promise<void>;
  getAllPlayRecords(userName: string): Promise<{ [key: string]: PlayRecord }>;
  deletePlayRecord(userName: string, key: string): Promise<void>;
  // 清理超出限制的旧播放记录
  cleanupOldPlayRecords(userName: string): Promise<void>;
  // 迁移播放记录
  migratePlayRecords(userName: string): Promise<void>;

  // 收藏相关
  getFavorite(userName: string, key: string): Promise<Favorite | null>;
  setFavorite(userName: string, key: string, favorite: Favorite): Promise<void>;
  getAllFavorites(userName: string): Promise<{ [key: string]: Favorite }>;
  deleteFavorite(userName: string, key: string): Promise<void>;
  // 迁移收藏
  migrateFavorites(userName: string): Promise<void>;

  // 用户相关
  verifyUser(userName: string, password: string): Promise<boolean>;
  // 检查用户是否存在（无需密码）
  checkUserExist(userName: string): Promise<boolean>;
  // 修改用户密码
  changePassword(userName: string, newPassword: string): Promise<void>;
  // 删除用户（包括密码、搜索历史、播放记录、收藏夹）
  deleteUser(userName: string): Promise<void>;

  // 搜索历史相关
  getSearchHistory(userName: string): Promise<string[]>;
  addSearchHistory(userName: string, keyword: string): Promise<void>;
  deleteSearchHistory(userName: string, keyword?: string): Promise<void>;

  // 用户列表
  getAllUsers(): Promise<string[]>;

  // 管理员配置相关
  getAdminConfig(): Promise<AdminConfig | null>;
  setAdminConfig(config: AdminConfig): Promise<void>;

  // 跳过片头片尾配置相关
  getSkipConfig(
    userName: string,
    source: string,
    id: string
  ): Promise<SkipConfig | null>;
  setSkipConfig(
    userName: string,
    source: string,
    id: string,
    config: SkipConfig
  ): Promise<void>;
  deleteSkipConfig(userName: string, source: string, id: string): Promise<void>;
  getAllSkipConfigs(userName: string): Promise<{ [key: string]: SkipConfig }>;
  // 迁移跳过配置
  migrateSkipConfigs(userName: string): Promise<void>;

  // 弹幕过滤配置相关
  getDanmakuFilterConfig(userName: string): Promise<DanmakuFilterConfig | null>;
  setDanmakuFilterConfig(
    userName: string,
    config: DanmakuFilterConfig
  ): Promise<void>;
  deleteDanmakuFilterConfig(userName: string): Promise<void>;

  // 数据清理相关
  clearAllData(): Promise<void>;

  // 通用键值存储
  getGlobalValue(key: string): Promise<string | null>;
  setGlobalValue(key: string, value: string): Promise<void>;
  deleteGlobalValue(key: string): Promise<void>;

  // 通知相关
  getNotifications(userName: string): Promise<Notification[]>;
  addNotification(userName: string, notification: Notification): Promise<void>;
  markNotificationAsRead(userName: string, notificationId: string): Promise<void>;
  deleteNotification(userName: string, notificationId: string): Promise<void>;
  clearAllNotifications(userName: string): Promise<void>;
  getUnreadNotificationCount(userName: string): Promise<number>;

  // 收藏更新检查相关
  getLastFavoriteCheckTime(userName: string): Promise<number>;
  setLastFavoriteCheckTime(userName: string, timestamp: number): Promise<void>;
}

// 搜索结果数据结构
export interface SearchResult {
  id: string;
  title: string;
  poster: string;
  episodes: string[];
  episodes_titles: string[];
  source: string;
  source_name: string;
  class?: string;
  year: string;
  desc?: string;
  type_name?: string;
  douban_id?: number;
  vod_remarks?: string; // 视频备注信息（如"全80集"、"更新至25集"等）
  vod_total?: number; // 总集数
  proxyMode?: boolean; // 代理模式：启用后由服务器代理m3u8和ts分片
  subtitles?: Array<Array<{ label: string; url: string }>>; // 字幕列表（按集数索引）
  tmdb_id?: number; // TMDB ID
  rating?: number; // 评分
}

// 豆瓣数据结构
export interface DoubanItem {
  id: string;
  title: string;
  poster: string;
  rate: string;
  year: string;
}

export interface DoubanResult {
  code: number;
  message: string;
  list: DoubanItem[];
}

// 跳过片头片尾配置数据结构
export interface SkipConfig {
  enable: boolean; // 是否启用跳过片头片尾
  intro_time: number; // 片头时间（秒）
  outro_time: number; // 片尾时间（秒）
}

// 弹幕过滤规则数据结构
export interface DanmakuFilterRule {
  keyword: string; // 关键字
  type: 'normal' | 'regex'; // 普通模式或正则模式
  enabled: boolean; // 是否启用
  id?: string; // 规则ID（用于前端管理）
}

// 弹幕过滤配置数据结构
export interface DanmakuFilterConfig {
  rules: DanmakuFilterRule[]; // 过滤规则列表
}

// 集数过滤规则数据结构
export interface EpisodeFilterRule {
  keyword: string; // 关键字
  type: 'normal' | 'regex'; // 普通模式或正则模式
  enabled: boolean; // 是否启用
  id?: string; // 规则ID（用于前端管理）
}

// 集数过滤配置数据结构
export interface EpisodeFilterConfig {
  rules: EpisodeFilterRule[]; // 过滤规则列表
}

// 通知类型枚举
export type NotificationType =
  | 'favorite_update' // 收藏更新
  | 'system' // 系统通知
  | 'announcement'; // 公告

// 通知数据结构
export interface Notification {
  id: string; // 通知ID
  type: NotificationType; // 通知类型
  title: string; // 通知标题
  message: string; // 通知内容
  timestamp: number; // 通知时间戳
  read: boolean; // 是否已读
  metadata?: Record<string, any>; // 额外的元数据（如收藏更新的source、id等）
}

// 收藏更新检查结果
export interface FavoriteUpdateCheck {
  last_check_time: number; // 上次检查时间戳
  updates: Array<{
    source: string;
    id: string;
    title: string;
    old_episodes: number;
    new_episodes: number;
  }>;
}
