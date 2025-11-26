import { Platform } from './types';
import { Smartphone, Image as ImageIcon, MonitorPlay, Tv } from 'lucide-react';

export const PLATFORM_CONFIGS = [
  {
    id: Platform.DOUYIN,
    name: '抖音',
    ratioLabel: '9:16',
    ratioValue: '9:16',
    icon: Smartphone,
    description: '全面屏竖屏，适合短视频'
  },
  {
    id: Platform.XIAOHONGSHU,
    name: '小红书',
    ratioLabel: '3:4',
    ratioValue: '3:4',
    icon: ImageIcon,
    description: '经典竖屏，图文笔记首选'
  },
  {
    id: Platform.BILIBILI,
    name: 'B站',
    ratioLabel: '4:3',
    ratioValue: '4:3',
    icon: Tv,
    description: '传统视频封面比例'
  },
  {
    id: Platform.YOUTUBE,
    name: 'YouTube',
    ratioLabel: '16:9',
    ratioValue: '16:9',
    icon: MonitorPlay,
    description: '横屏宽视频标准'
  },
];

export const STYLE_TAGS = [
  '强冲突', '高饱和', '极简主义', '大字报', 
  '清新干货', '电影感', '搞钱风', '赛博朋克', 
  '情绪大片', '日系胶片', '3D立体', '手绘插画'
];

export const STORAGE_KEY_API = 'gemini_cover_workshop_key';