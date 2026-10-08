import snapshot from "@/data/github-snapshot.json";

export interface GithubDay {
  date: string;
  count: number;
  level: number; // 0..4
}

export interface GithubWeek {
  days: GithubDay[];
}

export interface GithubRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  url: string;
}

export interface GithubLanguage {
  name: string;
  percentage: number;
  color: string;
}

export interface GithubData {
  user: {
    login: string;
    name: string;
    public_repos: number;
    followers: number;
    following: number;
    totalStars: number;
    totalCommits: number;
  };
  languages: GithubLanguage[];
  repos: GithubRepo[];
  contributionWeeks: GithubWeek[];
}

export async function getGithubData(): Promise<GithubData> {
  let token = process.env.GITHUB_TOKEN;

  // Fallback: If dev server was started before .env was modified, read directly from .env file
  if (!token && typeof window === "undefined") {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf8");
        const match = content.match(/GITHUB_TOKEN=([^\r\n]+)/);
        if (match) token = match[1].trim();
      }
    } catch {
      // Ignore fs errors in edge environments
    }
  }

  if (!token) {
    return snapshot as GithubData;
  }

  try {
    const query = `query {
      viewer {
        login
        name
        followers { totalCount }
        following { totalCount }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: UPDATED_AT, direction: DESC}) {
          totalCount
          nodes {
            name
            stargazerCount
            forkCount
            isFork
            updatedAt
            url
            description
            primaryLanguage { name color }
            languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node { name color }
              }
            }
          }
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }`;

    const revalidateSeconds = process.env.NODE_ENV === "development" ? 15 : 86400; // 24 hours (86,400s)

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "solarquack-portfolio",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: revalidateSeconds },
    });

    if (!res.ok) {
      return snapshot as GithubData;
    }

    const json = await res.json();
    const v = json.data?.viewer;
    if (!v) {
      return snapshot as GithubData;
    }

    let totalStars = 0;
    const langBytes: Record<string, number> = {};
    let totalLangBytes = 0;

    type RepoNode = {
      name: string;
      stargazerCount: number;
      forkCount: number;
      isFork: boolean;
      updatedAt: string;
      url: string;
      description: string | null;
      primaryLanguage: { name: string; color: string } | null;
      languages?: { edges: { size: number; node: { name: string; color: string } }[] };
    };

    const nodes: RepoNode[] = v.repositories?.nodes || [];

    nodes.forEach((repo: RepoNode) => {
      totalStars += repo.stargazerCount || 0;
      (repo.languages?.edges || []).forEach((e) => {
        const name = e.node.name;
        const size = e.size;
        langBytes[name] = (langBytes[name] || 0) + size;
        totalLangBytes += size;
      });
    });

    const langPalette: Record<string, string> = {
      TypeScript: "#E9E3D2",
      JavaScript: "#DDD6C3",
      Python: "#C9A24B",
      "Jupyter Notebook": "#8C8778",
      Kotlin: "#6A6557",
      "C++": "#5A564A",
      Java: "#4A463B",
    };

    const topLanguages = Object.entries(langBytes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, size]) => ({
        name,
        percentage: Number(((size / (totalLangBytes || 1)) * 100).toFixed(1)),
        color: langPalette[name] || "#8C8778",
      }));

    const repos: GithubRepo[] = nodes
      .filter((r) => !r.isFork)
      .slice(0, 4)
      .map((r) => ({
        name: r.name,
        description: r.description || "Open source software repository.",
        language: r.primaryLanguage?.name || "TypeScript",
        stars: r.stargazerCount || 0,
        forks: r.forkCount || 0,
        updatedAt: r.updatedAt ? r.updatedAt.split("T")[0] : "2026-10-08",
        url: r.url,
      }));

    const levelMap: Record<string, number> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };

    type RawDay = { date: string; contributionCount: number; contributionLevel: string };
    type RawWeek = { contributionDays: RawDay[] };

    const rawWeeks: RawWeek[] = v.contributionsCollection?.contributionCalendar?.weeks || [];
    const contributionWeeks: GithubWeek[] = rawWeeks.slice(-52).map((w) => ({
      days: w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: levelMap[d.contributionLevel] ?? (d.contributionCount > 0 ? 1 : 0),
      })),
    }));

    return {
      user: {
        login: v.login || "jeelnadaa",
        name: v.name || "Jeel Nada",
        public_repos: v.repositories?.totalCount ?? snapshot.user.public_repos,
        followers: v.followers?.totalCount ?? snapshot.user.followers,
        following: v.following?.totalCount ?? snapshot.user.following,
        totalStars,
        totalCommits: v.contributionsCollection?.contributionCalendar?.totalContributions ?? snapshot.user.totalCommits,
      },
      languages: topLanguages.length > 0 ? topLanguages : snapshot.languages,
      repos: repos.length > 0 ? repos : snapshot.repos,
      contributionWeeks: contributionWeeks.length > 0 ? contributionWeeks : snapshot.contributionWeeks,
    };
  } catch {
    return snapshot as GithubData;
  }
}
