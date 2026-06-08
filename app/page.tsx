import { HomePage } from "@/components/home-page";

async function getStats() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/github`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch {
    return [];
  }
}

export default async function Page() {
  const stats = await getStats();
  return <HomePage stats={stats} />;
}
