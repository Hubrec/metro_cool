<script>
import {Network} from 'vis-network';
import {DataSet} from 'vis-data';
import {extractLinks, extractNodes} from "@/service/http/fetchAPI.js";

export default {
  data() {
    return {
      nodes: null,
      edges: null,
      network: null,
      nodeIdCounter: 400
    };
  },
  async mounted() {

    const container = document.getElementById('mynetwork');

    const nodesData = await extractNodes()
        .then((data) => {
          return data;
        })
    this.nodes = new DataSet(nodesData);

    const linksData = await extractLinks()
        .then((data) => {
          return data;
        })
    this.edges = new DataSet(linksData);

    const data = {nodes: this.nodes, edges: this.edges};

    const basicOptions = {
      nodes: {
        shape: 'dot',
        size: 16,
        color: {
          border: '#2B7CE9',
          background: '#97C2FC',
          highlight: {
            border: '#2B7CE9',
            background: '#D2E5FF'
          },
          hover: {
            border: '#2B7CE9',
            background: '#D2E5FF'
          }
        },
        font: {
          size: 16,
          color: '#dcdcdc'
        },
        borderWidth: 2,
        shadow: false
      },
      edges: {
        width: 2,
        color: {
          color: '#848484',
          highlight: '#848484',
          hover: '#848484',
          inherit: 'from',
          opacity: 0.8
        },
        smooth: {
          type: 'continuous',
          roundness: 1,
        },
        shadow: false,
      },
      physics: {
        enabled: true,
      },
      interaction: {
        dragNodes: true,
        dragView: true,
        zoomView: true,
        hover: true,
        multiselect: true,
      },
      layout: {
        randomSeed: 42,
      }
    };
    // fancy settings
    const options = {
      nodes: {
        shape: 'dot',
        size: 16,
        color: {
          border: '#2B7CE9',
          background: '#97C2FC',
          highlight: {
            border: '#2B7CE9',
            background: '#D2E5FF'
          },
          hover: {
            border: '#2B7CE9',
            background: '#D2E5FF'
          }
        },
        font: {
          size: 16,
          color: '#dcdcdc'
        },
        borderWidth: 2,
        shadow: false
      },
      edges: {
        width: 2,
        color: {
          color: '#848484',
          highlight: '#848484',
          hover: '#848484',
          inherit: 'from',
          opacity: 0.8
        },
        smooth: {
          type: 'dynamic', // Change to 'dynamic' or 'straight' for better performance
        },
        shadow: false
      },
      physics: {
        enabled: true, // Disable physics for better performance
        barnesHut: {
          gravitationalConstant: -8000,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.1
        },
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 25,
        }
      },
      interaction: {
        dragNodes: true,
        dragView: true,
        zoomView: true,
        hover: true,
        multiselect: true,
      },
      layout: {
        improvedLayout: true,
        hierarchical: {
          enabled: false,
          levelSeparation: 150,
          nodeSpacing: 100,
          treeSpacing: 200,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          direction: 'UD',
          sortMethod: 'hubsize'
        }
      }
    };
    this.network = new Network(container, data, basicOptions);
    console.log(this.network)
  },
  methods: {
    addNode() {
      const newNode = { id: this.nodeIdCounter, label: `Node ${this.nodeIdCounter}`, x: Math.random() * 1000, y: Math.random() * 1000 };
      this.nodes.add(newNode);
      const randomNodeId = Math.floor(Math.random() * (this.nodes.get().length - 1)) + 1;
      this.edges.add({ from: randomNodeId, to: this.nodeIdCounter });
      this.nodeIdCounter++;
    },

    deleteSelectedNodes() {
      this.network.getSelectedNodes().forEach((nodeId) => {
        this.nodes.remove(nodeId);
      });
    }
  }
}
</script>

<template>
    <div id="mynetwork"></div>
    <div class="param-buttons">
      <button class="buttonsActions" @click="addNode">Add node</button>
      <button class="buttonsActions" @click="deleteSelectedNodes">Delete selected nodes</button>
    </div>
</template>

<style>
#mynetwork {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  backdrop-filter: contrast(0.8);
  overflow: hidden;
}

.param-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 10px;
}

.buttonsActions {
  margin: 10px;
  padding: 5px 10px;
  border: 1px solid lightgray;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  height: 30px;
  width: auto;
}
</style>