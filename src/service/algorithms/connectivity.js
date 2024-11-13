export function checkAndMakeConnectivity(nodes, edges) {
    const adjacencyList = new Map();

    // Initialize adjacency list
    nodes.forEach(node => {
        adjacencyList.set(node.id, []);
    });

    // Populate adjacency list
    edges.forEach(edge => {
        adjacencyList.get(edge.from).push(edge.to);
        adjacencyList.get(edge.to).push(edge.from);
    });

    // Function to perform DFS ( Depth First Search )
    function dfs(node, visited) {
        visited.add(node);
        adjacencyList.get(node).forEach(neighbor => {
            if (!visited.has(neighbor)) {
                dfs(neighbor, visited);
            }
        });
    }

    // Check connectivity
    const visited = new Set();
    dfs(nodes.get(0).id, visited);

    if (visited.size === nodes.length) {
        return true; // Graph is connected
    }

    // If not connected, create new links to make it connected
    const unvisitedNodes = nodes.filter(node => !visited.has(node.id));
    const n = nodes.get(0).id;
    unvisitedNodes.forEach(node => {
        edges.push({ from: n, to: node.id });
        adjacencyList.get(n).push(node.id);
        adjacencyList.get(n).push(n);
    });

    return [false, edges]; // Graph was not connected, but now it is
}