export default class NodeService {

    getTreeTableNodes() {
        return fetch('data/treetablenodes.json').then(res => res.json()).then(d => d.root);
    }

    getTreeNodes() {
        return fetch('data/treenodes.json').then(res => res.json()).then(d => d.root);
    }
    
}
