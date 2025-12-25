const fs = require("fs");

const raw = fs.readFileSync("dist/eas-build.json", "utf8").trim();
if (!raw) {
    console.error("dist/eas-build.json is empty");
    process.exit(1);
}

let j;
try {
    j = JSON.parse(raw);
} catch (e) {
    console.error("Failed to parse dist/eas-build.json:", e);
    process.exit(1);
}

const b = Array.isArray(j) ? j[0] : j;
const id =
    b ? .id ||
    b ? .buildId ||
    b ? .build ? .id ||
    b ? .build ? .buildId;

if (!id) {
    console.error("No build id found in eas-build.json");
    console.error("JSON keys:", Object.keys(b || {}));
    process.exit(1);
}

fs.writeFileSync("dist/build-id.txt", String(id));
console.log("BUILD_ID=" + id);