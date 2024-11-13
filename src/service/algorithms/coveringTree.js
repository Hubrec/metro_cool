import { DataSet } from 'vis-data';

export function prim(nodes, edges) {
  const result = [];
  const edgeList = edges.get();
  const nodeSet = new Set();
  const edgeQueue = [];

  // Start with the first node
  nodeSet.add(nodes.get()[0].id);

  while (nodeSet.size < nodes.length) {
    edgeList.forEach((edge) => {
      if (nodeSet.has(edge.from) && !nodeSet.has(edge.to)) {
        edgeQueue.push(edge);
      } else if (nodeSet.has(edge.to) && !nodeSet.has(edge.from)) {
        edgeQueue.push(edge);
      }
    });

    edgeQueue.sort((a, b) => a.value - b.value);

    const nextEdge = edgeQueue.shift();
    if (!nodeSet.has(nextEdge.from)) {
      nodeSet.add(nextEdge.from);
    }
    if (!nodeSet.has(nextEdge.to)) {
      nodeSet.add(nextEdge.to);
    }

    result.push(nextEdge);
  }

  return new DataSet(result);
}