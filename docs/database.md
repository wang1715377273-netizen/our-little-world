# Database Design

## 核心模型

应用围绕一个私密情侣空间组织：

- `profiles`：每个 Supabase Auth 用户对应一条资料
- `couples`：两个人共享的情侣空间
- `couple_members`：将用户连接到情侣空间
- `moments`、`photos`、`letters`、`cycle_records`、`songs`、`anniversaries`、`game_records`、`emotion_notes`：属于情侣空间的私密数据

所有私密数据表都必须包含 `couple_id`。

## RLS 原则

用户只能访问：

- 自己的 `profiles` 记录
- 自己作为 `couple_members` 成员所属的情侣空间数据
- 面向已登录用户开放的全局元数据，例如游戏定义和情绪定义

`cycle_records`、`letters`、`photos`、`emotion_notes` 等敏感表必须使用成员级访问策略。

## Migration

初始 schema 和 RLS 策略位于：

`supabase/migrations/202609270001_initial_schema.sql`
