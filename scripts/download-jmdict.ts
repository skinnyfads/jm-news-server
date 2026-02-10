import { writeFileSync, createWriteStream, mkdirSync, existsSync } from 'fs';
import { get } from 'https';
import { join } from 'path';
import { execSync } from 'child_process';

const DATA_DIR = join(process.cwd(), 'data');
const FILE_NAME = 'jmdict-eng.json';
const ZIP_NAME = `${FILE_NAME}.zip`;

async function fetchLatestReleaseUrl(): Promise<string> {
    return new Promise((resolve, reject) => {
        get(
            'https://api.github.com/repos/scriptin/jmdict-simplified/releases/latest',
            { headers: { 'User-Agent': 'Node.js' } },
            (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        const asset = json.assets.find((a: any) =>
                            a.name.startsWith('jmdict-eng-') && a.name.endsWith('.json.zip')
                        );
                        if (!asset) reject(new Error('No matching asset found'));
                        resolve(asset.browser_download_url);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        ).on('error', reject);
    });
}

async function downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = createWriteStream(dest);
        get(url, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                downloadFile(res.headers.location!, dest).then(resolve).catch(reject);
                return;
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            console.error('Download error:', err); // Log the error
            reject(err);
        });
    });
}

async function main() {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR);

    console.log('Finding latest JMDict release...');
    try {
        const url = await fetchLatestReleaseUrl();
        console.log(`Downloading from ${url}...`);

        const zipPath = join(DATA_DIR, ZIP_NAME);
        await downloadFile(url, zipPath);

        console.log('Extracting...');
        execSync(`unzip -o ${zipPath} -d ${DATA_DIR}`);

        // The zip usually contains a file like jmdict-eng-3.6.1.json. We need to rename it to jmdict-eng.json
        // Or just find the json file and rename it
        const list = execSync(`ls ${DATA_DIR}`).toString().split('\n');
        const jsonFile = list.find(f => f.startsWith('jmdict-eng-') && f.endsWith('.json'));

        if (jsonFile && jsonFile !== FILE_NAME) {
            execSync(`mv ${join(DATA_DIR, jsonFile)} ${join(DATA_DIR, FILE_NAME)}`);
        }

        // Clean up zip
        execSync(`rm ${zipPath}`);

        console.log('Done!');
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

main();
