import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

function pagesJsonPlugin() {
    return {
        name: "pages-json",
        configureServer(server) {
            server.middlewares.use("/__pages.json", (req, res) => {
                const pagesDir = path.resolve(server.config.root, "pages");

                let files = [];
                try {
                    files = fs
                        .readdirSync(pagesDir)
                        .filter(f => f.endsWith(".html") && f !== "index.html")
                        .sort((a, b) => a.localeCompare(b, "uk"));
                } catch (e) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: String(e) }));
                    return;
                }

                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.end(JSON.stringify(files));
            });
        },
    };
}

export default defineConfig({
    root: "src",
    plugins: [pagesJsonPlugin()],
});
