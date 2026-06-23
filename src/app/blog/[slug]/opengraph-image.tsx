import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";
import { site } from "@/lib/site";

export const alt = "Non Slop AI post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generates the social share card for each post at build time.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.frontmatter.title ?? site.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAFAF8",
          color: "#111318",
          padding: "80px",
          fontFamily: "sans-serif",
          borderTop: "12px solid #6D6AF8",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#6D6AF8",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: "90%",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 28, color: "#69707D" }}>{site.tagline}</div>
      </div>
    ),
    { ...size },
  );
}
