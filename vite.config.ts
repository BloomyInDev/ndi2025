import { defineConfig } from "vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
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
            },
        },
    },
    server: {
        port: 5173,
    },
});