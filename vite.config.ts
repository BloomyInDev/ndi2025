import { defineConfig } from "vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    appType: "mpa",
    root: resolve(__dirname, "src"),
    publicDir: resolve(__dirname, "public"),
    build: {
        outDir: resolve(__dirname, "dist"),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src/index.html"),
                biblioteque: resolve(__dirname, "src/biblioteque.html"),
                centre_technique: resolve(
                    __dirname,
                    "src/centre_technique.html"
                ),
                communication: resolve(__dirname, "src/communication.html"),
                ecole: resolve(__dirname, "src/ecole.html"),
                mairie: resolve(__dirname, "src/mairie.html"),
                maison: resolve(__dirname, "src/maison.html"),
                snake: resolve(__dirname, "src/snake.html"),
            },
        },
    },
    server: {
        port: 5173,
    },
});
