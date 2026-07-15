import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const summary = JSON.parse(
  readFileSync(new URL("../history/summary.json", import.meta.url), "utf8"),
);

function parseHistory(slug) {
  const source = readFileSync(
    new URL(`../history/${slug}.yml`, import.meta.url),
    "utf8",
  );

  return Object.fromEntries(
    source
      .split("\n")
      .map((line) => {
        const separator = line.indexOf(":");
        if (separator < 0) return null;

        const key = line.slice(0, separator).trim();
        const value = line
          .slice(separator + 1)
          .trim()
          .replace(/^['\"]|['\"]$/g, "");
        return key ? [key, value] : null;
      })
      .filter(Boolean),
  );
}

const services = summary.map((service) => {
  const history = parseHistory(service.slug);

  return {
    name: service.name,
    url: service.url,
    status: history.status || service.status || "unknown",
    code: Number(history.code || 0),
    responseTime: Number(history.responseTime || service.time || 0),
    lastChangedAt: history.lastUpdated || null,
    uptimeDay: service.uptimeDay || service.uptime || "—",
    uptimeMonth: service.uptimeMonth || service.uptime || "—",
    uptimeYear: service.uptimeYear || service.uptime || "—",
  };
});

writeFileSync(
  `${repositoryRoot}static-status/status.json`,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), services }, null, 2)}\n`,
);
