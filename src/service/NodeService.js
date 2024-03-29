export class NodeService {
    getFiles() {
        return fetch('/demo/data/files.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getLazyFiles() {
        return fetch('/demo/data/files-lazy.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getFilesystem() {
        return fetch('/demo/data/filesystem.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getLazyFilesystem() {
        return fetch('/demo/data/filesystem-lazy.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getTreeTableNodes() {
        return fetch('/demo/data/treetablenodes.json')
            .then((res) => res.json())
            .then((d) => d.root);
    }

    getTreeNodes() {
        return fetch('/demo/data/treenodes.json')
            .then((res) => res.json())
            .then((d) => d.root);
    }
}
