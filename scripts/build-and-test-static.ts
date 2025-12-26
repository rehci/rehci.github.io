import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();

/**
 * Script to build and test the static version of the site
 * 
 * This script:
 * 1. Generates articles.json
 * 2. Builds the static site
 * 3. Validates the output directory and key files
 * 4. Optionally serves the site locally for testing
 */

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const tests: TestResult[] = [];

function addTest(name: string, passed: boolean, message: string) {
  tests.push({ name, passed, message });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}: ${message}`);
}

function runCommand(command: string, description: string) {
  try {
    console.log(`\n📦 ${description}...`);
    execSync(command, {
      cwd: projectRoot,
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' },
    });
    return true;
  } catch (error) {
    console.error(`\n❌ Error during ${description}:`, error);
    return false;
  }
}

function checkFileExists(filePath: string, description: string): boolean {
  const fullPath = path.join(projectRoot, filePath);
  const exists = fs.existsSync(fullPath);
  addTest(
    `File exists: ${description}`,
    exists,
    exists ? `Found ${filePath}` : `Missing ${filePath}`
  );
  return exists;
}

function checkDirectoryExists(dirPath: string, description: string): boolean {
  const fullPath = path.join(projectRoot, dirPath);
  const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
  addTest(
    `Directory exists: ${description}`,
    exists,
    exists ? `Found ${dirPath}` : `Missing ${dirPath}`
  );
  return exists;
}

function validateBuildOutput() {
  console.log('\n🔍 Validating build output...\n');
  
  const outDir = path.join(projectRoot, 'out');
  
  // Check if out directory exists
  if (!checkDirectoryExists('out', 'Output directory')) {
    return false;
  }

  // Check for key files
  const keyFiles = [
    { path: 'out/index.html', description: 'Homepage' },
    { path: 'out/robots.txt', description: 'Robots.txt' },
    { path: 'out/sitemap.xml', description: 'Sitemap' },
    { path: 'public/articles.json', description: 'Articles JSON' },
  ];

  let allFilesExist = true;
  for (const file of keyFiles) {
    if (!checkFileExists(file.path, file.description)) {
      allFilesExist = false;
    }
  }

  // Check for article pages
  const contentDir = path.join(projectRoot, 'content');
  if (fs.existsSync(contentDir)) {
    const articles = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    console.log(`\n📄 Checking ${articles.length} article pages...`);
    
    for (const article of articles) {
      const slug = article.replace('.md', '');
      const articlePath = path.join(outDir, 'article', slug, 'index.html');
      const exists = fs.existsSync(articlePath);
      addTest(
        `Article page: ${slug}`,
        exists,
        exists ? `Found article/${slug}/index.html` : `Missing article/${slug}/index.html`
      );
      if (!exists) allFilesExist = false;
    }
  }

  // Check for static assets
  const staticAssets = [
    'out/_next/static',
  ];
  
  for (const asset of staticAssets) {
    checkDirectoryExists(asset, `Static assets: ${asset}`);
  }

  return allFilesExist;
}

function getFileSize(filePath: string): number {
  try {
    const fullPath = path.join(projectRoot, filePath);
    if (fs.existsSync(fullPath)) {
      return fs.statSync(fullPath).size;
    }
  } catch (error) {
    // Ignore errors
  }
  return 0;
}

function printBuildSummary() {
  console.log('\n📊 Build Summary:\n');
  
  const outDir = path.join(projectRoot, 'out');
  if (fs.existsSync(outDir)) {
    const files = getAllFiles(outDir);
    const totalSize = files.reduce((sum, file) => {
      try {
        return sum + fs.statSync(file).size;
      } catch {
        return sum;
      }
    }, 0);
    
    console.log(`Total files: ${files.length}`);
    console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Check articles.json size
    const articlesJsonSize = getFileSize('public/articles.json');
    if (articlesJsonSize > 0) {
      console.log(`Articles JSON: ${(articlesJsonSize / 1024).toFixed(2)} KB`);
    }
  }
}

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

async function main() {
  console.log('🚀 Building and testing static site...\n');
  console.log('=' .repeat(60));

  // Step 1: Generate articles.json
  const generateSuccess = runCommand(
    'npm run generate-articles-json',
    'Generating articles.json'
  );
  if (!generateSuccess) {
    console.error('\n❌ Failed to generate articles.json');
    process.exit(1);
  }

  // Step 2: Build the static site
  const buildSuccess = runCommand(
    'npm run build',
    'Building static site'
  );
  if (!buildSuccess) {
    console.error('\n❌ Build failed');
    process.exit(1);
  }

  // Step 3: Validate build output
  const validationSuccess = validateBuildOutput();

  // Step 4: Print summary
  printBuildSummary();

  // Step 5: Print test results
  console.log('\n' + '='.repeat(60));
  console.log('\n📋 Test Results:\n');
  
  const passedTests = tests.filter(t => t.passed).length;
  const totalTests = tests.length;
  const allPassed = tests.every(t => t.passed);

  tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${test.name}`);
    if (!test.passed) {
      console.log(`   ${test.message}`);
    }
  });

  console.log(`\n${passedTests}/${totalTests} tests passed`);

  if (allPassed && validationSuccess) {
    console.log('\n✅ All tests passed! Static site is ready.');
    console.log('\n💡 To test the site locally, you can:');
    console.log('   - Use a static file server: npx serve out');
    console.log('   - Or use Python: cd out && python3 -m http.server 3000');
    console.log('   - Or use Node.js: npx http-server out -p 3000');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});

