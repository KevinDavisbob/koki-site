import { ImageResponse } from "next/og";

export const alt = "Koki - Notes on tech, security, cars & physics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Next 16 破坏性变更：params 是 Promise，必须 await（本图内容与 locale 无关）
  await params;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090b", // 与 CSS --background (dark) 一致
          padding: "88px 96px",
        }}
      >
        {/* 左上：Koki. 字标 + 英文副标题 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              letterSpacing: "-0.02em",
              color: "#f4f4f5", // 与 CSS --foreground (dark) 一致
            }}
          >
            Koki
            <span style={{ color: "#6366f1" }}>.</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#a1a1aa" }}>
            Notes on tech, security, cars &amp; physics
          </div>
        </div>

        {/* 右下：与启动界面同款终端绿 */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              fontSize: 26,
              color: "#4ade80",
              letterSpacing: "0.12em",
            }}
          >
            &gt; koki.asia
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // 故意不传 fonts：内置 Geist 兜底，ASCII 可渲染、零网络请求、保持静态生成。
      // 注意：Geist 无 CJK/emoji 字形，本图内容必须保持纯 ASCII。
    },
  );
}
