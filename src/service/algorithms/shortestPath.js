export function bellmanFord(nodes, edges, selectedNodes) {
    const distances = new Map();
    const predecessors = new Map();

    if (selectedNodes.length < 2) {
        throw new Error("At least two nodes must be selected");
    }
    if (selectedNodes.length > 2) {
        throw new Error("Only two nodes can be selected");
    }

    // Initialize distances and predecessors
    nodes.forEach(node => {
        distances.set(node.id, Infinity);
        predecessors.set(node.id, null);
    });

    // Set the distance to the source node to 0
    const source = selectedNodes[0];
    distances.set(source, 0);

    // Relax edges repeatedly
    for (let i = 0; i < nodes.length - 1; i++) {
        edges.forEach(edge => {
            const { from, to, time } = edge;
            if (distances.get(from) + time < distances.get(to)) {
                distances.set(to, distances.get(from) + time);
                predecessors.set(to, from);
            }
            if (distances.get(to) + time < distances.get(from)) {
                distances.set(from, distances.get(to) + time);
                predecessors.set(from, to);
            }
        });
    }

    // Check for negative-weight cycles
    edges.forEach(edge => {
        const { from, to, time } = edge;
        if (distances.get(from) + time < distances.get(to)) {
            throw new Error("Graph contains a negative-weight cycle");
        }
    });

    // Reconstruct the path
    const path = []
    let currentNode = selectedNodes[selectedNodes.length - 1];
    while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = predecessors.get(currentNode);
    }

    // Ensure the path goes through all selected nodes
    for (let i = 1; i < selectedNodes.length - 1; i++) {
        if (!path.includes(selectedNodes[i])) {
            throw new Error("No valid path through all selected nodes");
        }
    }

    // Calculate the total time
    let totalTime = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        let currentEdge = null;
        edges.forEach(edge => {
            if ((edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)) {
                currentEdge = edge;
            }
        });
        if (currentEdge) {
            totalTime += currentEdge.time;
        }
    }

    totalTime = Math.round(totalTime / 60);

    return { path, totalTime };
}