const fs = require('fs');
const path = require('path');

const files = {
  "src/components/common/Badge.jsx": `import React from 'react';\nimport clsx from 'clsx';\nexport default function Badge({ children, variant = 'default' }) {\n  const base = 'px-2 py-1 text-xs font-semibold rounded-full';\n  const variants = { default: 'bg-gray-100 text-gray-800', HIGH: 'bg-red-100 text-red-800', MODERATE: 'bg-yellow-100 text-yellow-800', LOW: 'bg-green-100 text-green-800' };\n  return <span className={clsx(base, variants[variant] || variants.default)}>{children}</span>;\n}`,
  "src/pages/public/LandingPage.jsx": `import React from 'react';\nimport { Link } from 'react-router-dom';\nexport default function LandingPage() {\n  return <div className="p-10 text-center"><h1>Identify Vulnerability. Discover Support. Enable Education.</h1><Link to="/login" className="mt-4 inline-block bg-teal-600 text-white px-4 py-2 rounded">Login</Link></div>;\n}`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});
console.log("Files generated");
