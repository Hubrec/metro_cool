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
    };
  },
  async mounted() {

    const container = document.getElementById('mynetwork');

    const nodesData = await extractNodes();
    this.nodes = new DataSet(nodesData);
    const linksData = await extractLinks();
    this.edges = new DataSet(linksData);

    const data = {nodes: this.nodes, edges: this.edges};

    const basicOptions = {
      nodes: {
        shape: 'dot',
        size: 4,
        font: {
          size: 6,
          color: 'rgba(210,210,210,1)',
          strokeWidth: 0,
        },
        borderWidth: 2,
        shadow: false
      },
      edges: {
        width: 2,
        color: {
          color: '#848484',
          highlight: '#6c6c6c',
          hover: '#6c6c6c',
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
        enabled: false,
      },
      interaction: {
        dragNodes: false,
        dragView: true,
        zoomView: true,
        hover: true,
        multiselect: true,
      },
    };
    this.network = new Network(container, data, basicOptions);

    this.network.on('hoverNode', (params) => {
      this.onHoverNode(params.node);
    });

    this.network.on('blurNode', (params) => {
      this.offHoverNode(params.node);
    });
  },
  methods: {
    printValues() {
      console.log(this.nodes.get());
      console.log(this.edges.get());
    },
    onHoverNode(nodeId) {
      console.log(this.nodes.get().find( node => node.id === nodeId));
    },
    offHoverNode(nodeId) {
      console.log(this.nodes.get().find( node => node.id === nodeId));
    },
    calcItinerary() {
      const selectedNodes = this.network.get().getSelectedNodes();
      console.log(selectedNodes);
    }
  }
}
</script>

<template>
  <div id="mynetwork"></div>
  <div class="param-buttons">
    <button class="buttonsActions" @click="printValues">Print Values</button>
    <button class="buttonsActions" @click="calcItinerary">Calculate itinerary</button>
  </div>
</template>

<style>

#mynetwork {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: contrast(0.8);
  border: 1px solid lightgray;
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