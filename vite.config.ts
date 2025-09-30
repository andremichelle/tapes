import {readFileSync} from "fs"
import {resolve} from "path"
import {defineConfig} from "vite"
import viteCompression from "vite-plugin-compression"

export default defineConfig(({}) => {
    return {
        resolve: {
            alias: {
                "@": resolve(__dirname, "./src")
            }
        },
        build: {
            target: "esnext",
            minify: true,
            sourcemap: true
        },
        esbuild: {
            target: "esnext"
        },
        clearScreen: false,
        server: {
            port: 8081,
            host: "localhost"
        },
        plugins: [
            viteCompression({
                algorithm: "brotliCompress"
            }),
            {
                name: "spa",
                configureServer(server) {
                    server.middlewares.use((req, res, next) => {
                        const url: string | undefined = req.url
                        if (url !== undefined && url.indexOf(".") === -1 && !url.startsWith("/@vite/")) {
                            const indexPath = resolve(__dirname, "index.html")
                            res.end(readFileSync(indexPath))
                        } else {
                            next()
                        }
                    })
                }
            }
        ]
    }
})