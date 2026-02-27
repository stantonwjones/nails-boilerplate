import showdown from 'showdown';
import { readFileSync, writeFileSync } from 'fs';

const converter = new showdown.Converter();

const readmeMd = readFileSync('README.md', 'utf8');
const readmeHtml = converter.makeHtml(readmeMd);
writeFileSync('templates/public/README.xml', readmeHtml);