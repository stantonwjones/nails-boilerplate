import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

describe('nails init integration tests', () => {
    const templates = ['default', 'mcp', 'mobile'];
    const NAILS_MODULE_DIR = process.cwd();

    templates.forEach(template => {
        it(`should initialize and test a new project with the ${template} template`, { timeout: 120000 }, () => {
            const dateString = Date.now();
            const testDir = path.join(os.tmpdir(), `test_project_${template}_${dateString}`);
            
            // 1. Create a temporary directory
            if (!fs.existsSync(testDir)) {
                fs.mkdirSync(testDir, { recursive: true });
            }

            try {
                // 2. Initialize project using the local version of init.js
                console.log(`Running init for ${template}...`);
                execSync(`node bin/lib/init.js ${testDir} --template ${template}`, { stdio: 'inherit' });

                // 3. Verify directory and configuration files based on the template style
                expect(fs.existsSync(testDir)).toBe(true);
                expect(fs.existsSync(path.join(testDir, 'NAILS'))).toBe(true);
                expect(fs.existsSync(path.join(testDir, 'package.json'))).toBe(true);

                // Verify folder structure based on the template
                if (template === 'default') {
                    expect(fs.existsSync(path.join(testDir, 'server'))).toBe(true);
                    expect(fs.existsSync(path.join(testDir, 'src'))).toBe(true);
                    expect(fs.existsSync(path.join(testDir, 'public'))).toBe(true);
                    expect(fs.existsSync(path.join(testDir, 'vite.config.ts'))).toBe(true);
                    expect(fs.existsSync(path.join(testDir, 'vite-mobile.config.ts'))).toBe(false);
                } else if (template === 'mcp') {
                    expect(fs.existsSync(path.join(testDir, 'server'))).toBe(true);
                    expect(fs.existsSync(path.join(testDir, 'src'))).toBe(false);
                    expect(fs.existsSync(path.join(testDir, 'public'))).toBe(false);
                    expect(fs.existsSync(path.join(testDir, 'vite.config.ts'))).toBe(true);
                } else if (template === 'mobile') {
                    expect(fs.existsSync(path.join(testDir, 'server'))).toBe(false);
                    expect(fs.existsSync(path.join(testDir, 'src'))).toBe(true);
                    expect(fs.existsSync(path.join(testDir, 'vite-mobile.config.ts'))).toBe(true);
                    expect(fs.existsSync(path.join(testDir, 'capacitor.config.ts'))).toBe(true);
                }

                // 4. Change directory to the test project
                process.chdir(testDir);

                // 5. Install dependencies including local nails path
                console.log(`Installing dependencies for ${template}...`);
                execSync(`npm install ${NAILS_MODULE_DIR} --legacy-peer-deps`, { stdio: 'inherit' });

                // 6. Run tests in the new test project
                console.log(`Running tests inside the ${template} project...`);
                // Use --pool=forks to isolate process/module cache between test files and prevent Sequelize database errors
                // Use --passWithNoTests since mobile template doesn't have any tests by default
                execSync('npm test -- --pool=forks --passWithNoTests', { stdio: 'inherit' });

            } finally {
                // Return to original directory and clean up
                process.chdir(NAILS_MODULE_DIR);
                console.log(`Cleaning up test directory ${testDir}...`);
                fs.rmSync(testDir, { recursive: true, force: true });
            }
        });
    });
});