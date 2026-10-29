import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5180,
    watch: {
      // Avoid EBUSY crashes on Windows when antivirus locks public image assets
      usePolling: true,
      interval: 1000,
      ignored: ["**/public/images/**"],
    },
  },
});
