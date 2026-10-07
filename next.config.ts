import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 开发模式下允许通过局域网地址访问 dev server（手机真机调试）。
  // Next 16 dev 的 HMR websocket / 内部资源有源白名单（默认仅 localhost），
  // 手机经局域网 IP 访问时若不在白名单，HMR 连接会被 403 拒绝，
  // hydration 永远不会执行，整页无任何交互且不报错。
  // 192.168.*.* 覆盖家用路由器 DHCP 可能分配的地址段。
  allowedDevOrigins: ["192.168.1.7", "192.168.*.*"],
};

export default nextConfig;
