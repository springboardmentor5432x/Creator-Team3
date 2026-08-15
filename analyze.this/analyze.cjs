const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\mukes\\OneDrive\\Desktop\\creatorIQ\\analyze.this';

function analyzeProject(dir) {
    const srcPath = path.join(dir, 'src');
    if (!fs.existsSync(srcPath)) {
        return { name: path.basename(dir), hasSrc: false };
    }

    const pages = getFiles(path.join(srcPath, 'pages'));
    const components = getDirectories(path.join(srcPath, 'components'));
    const otherDirsInSrc = getDirectories(srcPath).filter(d => d !== 'pages' && d !== 'components');

    return {
        name: path.basename(dir),
        pages,
        components,
        otherSrcDirs: otherDirsInSrc
    };
}

function getFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile());
}

function getDirectories(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
}

const projects = fs.readdirSync(rootDir)
    .map(p => path.join(rootDir, p))
    .filter(p => fs.statSync(p).isDirectory())
    .map(analyzeProject);

console.log(JSON.stringify(projects, null, 2));
