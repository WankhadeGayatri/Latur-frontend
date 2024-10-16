const fs = require("fs");
const path = require("path");

// Read the package.json file
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

// Function to check if a module is used
function isModuleUsed(moduleName) {
  try {
    require.resolve(moduleName, { paths: [process.cwd()] });
    return true;
  } catch (e) {
    return false;
  }
}

// Function to recursively search for import/require statements
function searchForImports(dir, searched = new Set()) {
  const files = fs.readdirSync(dir);
  const imports = new Set();

  for (const file of files) {
    const filePath = path.join(dir, file);
    if (searched.has(filePath)) continue;
    searched.add(filePath);

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      for (const imp of searchForImports(filePath, searched)) {
        imports.add(imp);
      }
    } else if (
      stat.isFile() &&
      (file.endsWith(".js") ||
        file.endsWith(".jsx") ||
        file.endsWith(".ts") ||
        file.endsWith(".tsx"))
    ) {
      const content = fs.readFileSync(filePath, "utf-8");
      const importRegex = /(?:import|require)\s*\(?['"](.+?)['"]\)?/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        imports.add(match[1]);
      }
    }
  }

  return imports;
}

// Get all imports in the project
const allImports = searchForImports(process.cwd());

// Check dependencies
const unusedDependencies = [];
for (const depType of ["dependencies", "devDependencies"]) {
  if (packageJson[depType]) {
    for (const dep of Object.keys(packageJson[depType])) {
      if (!isModuleUsed(dep) && !allImports.has(dep)) {
        unusedDependencies.push(dep);
      }
    }
  }
}

if (unusedDependencies.length > 0) {
  console.log("Potentially unused dependencies:");
  unusedDependencies.forEach((dep) => console.log(`- ${dep}`));
  console.log(
    "\nPlease review this list carefully before removing any dependencies."
  );
} else {
  console.log("No unused dependencies found.");
}
