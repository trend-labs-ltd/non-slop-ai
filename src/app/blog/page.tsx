import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Posts",
  description: "Everything published on Non Slop AI, newest first.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <Container size="prose" className="py-16">
      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
        Posts
      </h1>
      {posts.length === 0 ? (
        <p className="mt-6 text-muted">Nothing here yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-border">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
