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
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return snapshot as GithubData;
  }

  try {
    const userRes = await fetch("https://api.github.com/users/jeelnadaa", {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "solarquack-portfolio",
      },
      next: { revalidate: 3600 },
    });

    if (!userRes.ok) {
      return snapshot as GithubData;
    }

    const userData = await userRes.json();

    const reposRes = await fetch(
      "https://api.github.com/users/jeelnadaa/repos?sort=updated&per_page=6&type=owner",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "solarquack-portfolio",
        },
        next: { revalidate: 3600 },
      }
    );

    let repos = snapshot.repos;
    if (reposRes.ok) {
      const reposJson = await reposRes.json();
      if (Array.isArray(reposJson)) {
        repos = reposJson
          .filter((r: { fork?: boolean }) => !r.fork)
          .slice(0, 4)
          .map((r: { name: string; description: string; language: string; stargazers_count: number; forks_count: number; updated_at: string; html_url: string }) => ({
            name: r.name,
            description: r.description || "Open source project repository.",
            language: r.language || "TypeScript",
            stars: r.stargazers_count,
            forks: r.forks_count || 0,
            updatedAt: r.updated_at.split("T")[0],
            url: r.html_url,
          }));
      }
    }

    return {
      user: {
        login: userData.login || "jeelnadaa",
        name: userData.name || "Jeel Nada",
        public_repos: userData.public_repos || snapshot.user.public_repos,
        followers: userData.followers || snapshot.user.followers,
        following: userData.following || snapshot.user.following,
        totalStars: snapshot.user.totalStars,
        totalCommits: snapshot.user.totalCommits,
      },
      languages: snapshot.languages,
      repos,
      contributionWeeks: snapshot.contributionWeeks,
    };
  } catch {
    return snapshot as GithubData;
  }
}
