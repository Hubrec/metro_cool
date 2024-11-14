import {MinPriorityQueue} from "@datastructures-js/priority-queue";

export function prim(nodes, edges) {
  const result = [];
  const edgeList = edges.get();
  const nodeSet = new Set();
  const edgeQueue = new MinPriorityQueue(edge => edge.time); // Using a priority queue
  const visitedEdges = new Set();

  // Start with the first node
  const startNode = nodes.get()[0].id;
  nodeSet.add(startNode);

  edgeList.forEach(edge => {
    if (edge.from === startNode || edge.to === startNode) {
      edgeQueue.enqueue(edge);
      visitedEdges.add(edge);
    }
  });

  while (nodeSet.size < nodes.length && !edgeQueue.isEmpty()) {
    const nextEdge = edgeQueue.dequeue();

    // Check if adding this edge expands the set of visited nodes
    if (!nodeSet.has(nextEdge.from) || !nodeSet.has(nextEdge.to)) {
      result.push(nextEdge);

      // Add the new node to the set of visited nodes
      const newNode = nodeSet.has(nextEdge.from) ? nextEdge.to : nextEdge.from;
      nodeSet.add(newNode);

      // Add edges connected to the new node
      edgeList.forEach(edge => {
        if ((edge.from === newNode && !nodeSet.has(edge.to)) || (edge.to === newNode && !nodeSet.has(edge.from))) {
          if (!visitedEdges.has(edge)) {
            edgeQueue.enqueue(edge);
            visitedEdges.add(edge);
          }
        }
      });
    }
  }

  return result;
}