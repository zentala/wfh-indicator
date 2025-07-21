# Electron TypeScript Setup - Problems & Solutions

## 🔍 Initial Problems

### 1. Missing `index.js` file

**Problem**: Vite wasn't generating the main process `index.js` file
**Error**: `Cannot find module './index.js'`
**Solution**: Fixed Vite main config to properly build TypeScript files

### 2. Native modules not compiled for Electron

**Problem**: `serialport` and other native modules missing Electron builds
**Error**: `No native build was found for platform=win32 arch=x64 runtime=electron abi=136`
**Solution**: Added `@electron-forge/plugin-auto-unpack-natives` plugin

### 3. TypeScript compilation errors

**Problems**:

- Unused parameter warnings
- Missing type declarations for `electron-updater`
- Import/export issues with `esModuleInterop`

**Solutions**:

- Prefixed unused parameters with `_`
- Created custom type declarations for `electron-updater`
- Fixed `tsconfig.json` with proper module settings

### 4. Electron Forge configuration issues

**Problem**: Electron Forge not properly handling TypeScript
**Solution**: Used Vite plugin for TypeScript compilation instead of direct `ts-node`

## 🛠 Solutions Implemented

### 1. Package.json Scripts

```json
{
  "scripts": {
    "dev": "electron-forge start",
    "start": "electron-forge start",
    "build": "electron-forge make"
  }
}
```

### 2. Forge Configuration

```typescript
// forge.config.ts
export default {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-vite",
      config: {
        build: [
          {
            entry: "src/main/index.ts",
            config: "vite.main.config.ts",
          },
          {
            entry: "src/main/preload.ts",
            config: "vite.preload.config.ts",
          },
        ],
        renderer: [
          {
            name: "main_window",
            config: "vite.renderer.config.ts",
          },
        ],
      },
    },
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
};
```

### 3. Vite Main Config

```typescript
// vite.main.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: ".vite/build",
    rollupOptions: {
      external: [
        "electron",
        "electron-log",
        "electron-updater",
        "@serialport/stream",
        "@serialport/bindings-cpp",
        "serialport",
      ],
    },
  },
});
```

### 4. TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": ".vite/build",
    "rootDir": "src/main"
  },
  "include": ["src/main/**/*"],
  "exclude": ["src/renderer/**/*", "tests/**/*"]
}
```

### 5. Custom Type Declarations

```typescript
// src/types/electron-updater.d.ts
declare module "electron-updater" {
  import { AppUpdater } from "electron-updater";

  export { AppUpdater };
  export function autoUpdater(): AppUpdater;
}
```

## 🔧 Native Modules Handling

### Problem with `serialport`

- Native modules need to be rebuilt for Electron's Node.js version
- `@electron-forge/plugin-auto-unpack-natives` handles this automatically
- Manual rebuild commands:
  ```bash
  npx electron-rebuild
  # or
  pnpm rebuild serialport
  ```

### pnpm Build Scripts Approval

- pnpm requires approval for build scripts
- Native modules need to run build scripts during installation
- Solution: Approve build scripts when prompted

## 🚀 Development Workflow

### Current Setup

1. **Dev script**: `pnpm dev` → `electron-forge start`
2. **Build script**: `pnpm build` → `electron-forge make`
3. **TypeScript**: Compiled by Vite plugin
4. **Native modules**: Handled by auto-unpack-natives plugin

### Key Benefits

- Hot reload for renderer process
- TypeScript compilation on the fly
- Native modules automatically rebuilt
- Proper Electron packaging

## 🐛 Common Issues & Fixes

### 1. "Cannot find module" errors

- Check if Vite is building to correct output directory
- Verify external modules are properly excluded

### 2. Native module errors

- Ensure `@electron-forge/plugin-auto-unpack-natives` is configured
- Rebuild native modules: `npx electron-rebuild`

### 3. TypeScript compilation errors

- Check `tsconfig.json` includes/excludes
- Verify module resolution settings
- Add missing type declarations

### 4. Electron Forge configuration

- Use Vite plugin for TypeScript support
- Configure proper entry points
- Set up makers for different platforms

## 📝 Lessons Learned

1. **Electron Forge + Vite**: Better than direct TypeScript compilation
2. **Native modules**: Always use auto-unpack-natives plugin
3. **TypeScript config**: Separate configs for main/renderer processes
4. **Build process**: Let Electron Forge handle the complexity
5. **Development**: Use `electron-forge start` for proper dev environment

## 🔮 Future Improvements

- Consider using `electron-builder` for simpler native module handling
- Implement proper error handling for native module failures
- Add development vs production configurations
- Consider Webpack for more complex bundling needs
