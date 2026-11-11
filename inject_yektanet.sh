#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd ~/online-tools

echo "▶ Injecting Yektanet script into BaseLayout.astro"
node -e '
const fs = require("fs");
const path = "src/layouts/BaseLayout.astro";
let content = fs.readFileSync(path, "utf8");

const yektanetScript = `  <script is:inline>
    !function(e,t,n){
        e.yektanetAnalyticsObject=n,
        e[n]=e[n]||function(){e[n].q.push(arguments)},
        e[n].q=e[n].q||[];
        var a=t.getElementsByTagName("head")[0],
            r=new Date,
            c="https://cdn.yektanet.ir/superscript-v2/Cg1anVr4/native-49280/yn_pub.js?v="
                +r.getFullYear().toString()+"0"+r.getMonth()+"0"+r.getDate()+"0"+r.getHours(),
            s=t.createElement("link");
        s.rel="preload",
        s.as="script",
        s.href=c,
        a.appendChild(s);
        var l=t.createElement("script");
        l.async=!0,
        l.src=c,
        a.appendChild(l);
    }(window,document,"yektanet");
  </script>
`;

if (content.includes("yektanetAnalyticsObject")) {
    console.log("  ⚠ Yektanet script already exists. Skipping.");
} else {
    content = content.replace("</head>", yektanetScript + "</head>");
    fs.writeFileSync(path, content);
    console.log("  ✓ Script injected successfully");
}
'
