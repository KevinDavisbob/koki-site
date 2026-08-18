/**
 * 留言板存储：通过 GitHub Contents API 读写仓库里的 data/guestbook.json。
 * 服务端代理方式——国内访客只连 koki.asia，Vercel 到 GitHub 的链路不受影响。
 * 需要环境变量 GITHUB_GUESTBOOK_TOKEN（gh 令牌，repo 权限）。
 */

const REPO = "KevinDavisbob/koki-site";
const PATH = "data/guestbook.json";
const MAX_ENTRIES = 500;
/** 同一 ipHash 两次留言的最小间隔 */
const RATE_LIMIT_MS = 60_000;

export type GuestbookEntry = {
  id: string;
  nickname: string;
  message: string;
  website?: string;
  createdAt: string;
  ipHash?: string;
};

type GuestbookData = { entries: GuestbookEntry[] };

export class GuestbookRateLimitedError extends Error {
  constructor() {
    super("rate limited");
  }
}

function githubFetch(init?: RequestInit) {
  const token = process.env.GITHUB_GUESTBOOK_TOKEN;
  if (!token) throw new Error("GITHUB_GUESTBOOK_TOKEN is not set");
  return fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    cache: "no-store",
  });
}

/** 读取留言（404 = 文件还不存在，视为空）。读失败不抛错，保证页面可用。 */
export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  try {
    const res = await githubFetch();
    if (res.status === 404) return [];
    if (!res.ok) return [];
    const file = (await res.json()) as { content?: string };
    const data = JSON.parse(
      Buffer.from(file.content ?? "", "base64").toString("utf8"),
    ) as GuestbookData;
    return (data.entries ?? []).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch {
    return [];
  }
}

/** 追加一条留言。写入冲突（409）时重读最新 sha 重试，最多 3 次。 */
export async function addGuestbookEntry(
  entry: GuestbookEntry,
): Promise<GuestbookEntry> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await githubFetch();
    let data: GuestbookData = { entries: [] };
    let sha: string | undefined;
    if (res.status === 404) {
      // 文件不存在：直接创建
    } else if (res.ok) {
      const file = (await res.json()) as { sha: string; content?: string };
      sha = file.sha;
      data = JSON.parse(
        Buffer.from(file.content ?? "", "base64").toString("utf8"),
      ) as GuestbookData;
    } else {
      throw new Error(`GitHub GET failed: ${res.status}`);
    }

    // 基础限流：同一 ipHash 在 RATE_LIMIT_MS 内只允许一条
    if (entry.ipHash) {
      const tooFast = data.entries.some(
        (e) =>
          e.ipHash === entry.ipHash &&
          Date.now() - new Date(e.createdAt).getTime() < RATE_LIMIT_MS,
      );
      if (tooFast) throw new GuestbookRateLimitedError();
    }

    data.entries.push(entry);
    if (data.entries.length > MAX_ENTRIES) {
      data.entries = data.entries.slice(-MAX_ENTRIES);
    }

    const content = Buffer.from(JSON.stringify(data, null, 2)).toString(
      "base64",
    );
    const put = await githubFetch({
      method: "PUT",
      body: JSON.stringify({
        message: `guestbook: ${entry.nickname}`,
        content,
        ...(sha ? { sha } : {}),
      }),
    });

    if (put.status === 409) continue; // 并发写入冲突：重试
    if (!put.ok) throw new Error(`GitHub PUT failed: ${put.status}`);
    return entry;
  }
  throw new Error("guestbook write conflict after retries");
}
