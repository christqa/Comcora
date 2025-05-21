// @ts-check

import fs from "fs";
import path from "path";
import pa11y from "pa11y";

/**
 * @param {string} directory
 * @returns {Promise<number>} Total number of errors found
 */
async function checkDirectory(directory) {
  let totalErrors = 0;

  const files = fs.readdirSync(directory);

  if (files.length === 0) {
    console.log(`No files found in directory: ${directory}`);
    return 0;
  }

  for (const file of files) {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      totalErrors += await checkDirectory(filePath);
    } else if (file.endsWith(".html")) {
      const absoluteFilePath = path.resolve(filePath);

      try {
        const result = await pa11y(`file://${absoluteFilePath}`, {
          standard: "WCAG2AA",
          ignore: [
            "WCAG2AAA.Principle1.Guideline1_4_6.G18.Fail",
            "WCAG2AAA.Principle1.Guideline1_4_6.G17.Fail",
            "WCAG2AA.Principle1.Guideline1_4_3.G18.Fail",
            "WCAG2AA.Principle1.Guideline1_4_3.G145",
            "WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail",
          ],
        });

        if (result.issues.length > 0) {
          console.log(
            `Found ${result.issues.length} issues in ${absoluteFilePath}`
          );
          totalErrors += result.issues.length;

          console.log(result);
        }
      } catch (error) {
        console.error(`Error checking ${absoluteFilePath}:`, error);
      }
    }
  }

  return totalErrors;
}

checkDirectory(".next/standalone")
  .then((totalErrors) => {
    console.log(`Total accessibility errors found: ${totalErrors}`);
  })
  .catch((e) => {
    console.error(e);
    throw e;
  });
