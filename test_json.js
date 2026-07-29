const fs = require('fs');

function testHtml(filename) {
    const html = fs.readFileSync(filename, 'utf-8');
    const regex = /self\.__next_f\.push\((.*?)\)/g;
    let match;
    let success = 0;
    let fails = 0;
    
    console.log(`\nTesting ${filename}...`);
    while ((match = regex.exec(html)) !== null) {
        try {
            const data = match[1];
            // data is usually [1,"some string"]
            const parsed = JSON.parse(data);
            
            // if it's a string, try parsing it as JSON again if it starts with { or [
            if (typeof parsed[1] === 'string' && (parsed[1].startsWith('{') || parsed[1].startsWith('['))) {
                // Next.js RSC payload often contains nested JSON
                // Just checking if it's well formed
                // JSON.parse(parsed[1]);
            }
            success++;
        } catch (e) {
            console.error(`Failed to parse JSON in ${filename}:`);
            console.error(match[1].substring(0, 100) + '...');
            console.error(e.message);
            fails++;
        }
    }
    console.log(`Success: ${success}, Fails: ${fails}`);
}

testHtml('original.html');
testHtml('proxied.html');
