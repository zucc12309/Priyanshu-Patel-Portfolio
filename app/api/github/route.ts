import { NextResponse } from "next/server";

const repos = [
  "https://github.com/zucc12309/memory-router",
  "https://github.com/zucc12309/CRM-workflow-automation",
];

function parseRepo(url: string) {
  const [, owner, repo] = url.match(/github\.com\/([^/]+)\/([^/]+)/) ?? [];
  return { owner, repo };
}

export async function GET() {
  const data = await Promise.all(
    repos.map(async (url) => {
      const { owner, repo } = parseRepo(url);
      if (!owner || !repo) {
        return null;
      }

      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : undefined,
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        return {
          name: repo,
          stars: 0,
          forks: 0,
          language: "Unavailable",
          updatedAt: "",
          url,
        };
      }

      const json = await response.json();
      return {
        name: json.name,
        stars: json.stargazers_count,
        forks: json.forks_count,
        language: json.language ?? "Mixed",
        updatedAt: json.updated_at,
        url: json.html_url,
      };
    }),
  );

  return NextResponse.json(data.filter(Boolean));
}
