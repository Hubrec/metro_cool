<script>
import {Network} from 'vis-network';
import {DataSet} from 'vis-data';
import {extractLinks, extractNodes} from "@/service/http/fetchAPI.js";
import {checkAndMakeConnectivity} from "@/service/algorithms/connectivity.js";
import {bellmanFord} from "@/service/algorithms/shortestPath.js";
import {prim} from "@/service/algorithms/coveringTree.js";
import {ref} from "vue";

export default {
  data() {
    return {
      nodes: null,
      edges: null,
      network: null,
      stationsVisibility: true,
      selectedNodes: [],
      itineraryInProgress: false,
      coveringTreeInProgress: false,
      snackBarText: '',
      activeClass: ref('button-active'),

    };
  },
  async mounted() {

    const container = document.getElementById('mynetwork');

    const nodesData = await extractNodes();
    this.nodes = new DataSet(nodesData);
    const linksData = await extractLinks();
    this.edges = new DataSet(linksData);

    // We check connectivity of the input graph data
    if (checkAndMakeConnectivity(this.nodes, this.edges)) {
      this.useSnackBar('Graph is connected', 'green');
    }
    else {
      this.useSnackBar('Graph is not connected', 'red');
    }

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

    this.network.on('selectNode', (params) => {
      this.selectedNodes = params.nodes;
    });

    this.network.on('deselectNode', (params) => {
      this.selectedNodes = params.nodes;

    });

  },
  methods: {
    onHoverNode(nodeId) {
      if (!this.stationsVisibility) {
        const node = this.nodes.get(nodeId);
        this.nodes.update({id: nodeId, label: node.name});
      }
    },
    offHoverNode(nodeId) {
      if (!this.stationsVisibility) {
        this.nodes.update({id: nodeId, label: ''});
      }
    },
    calcItinerary() {
      if (this.selectedNodes.length < 2) {
        this.useSnackBar('At least two nodes must be selected', 'red');
        return;
      }
      if (this.selectedNodes.length > 2) {
        this.useSnackBar('Only two nodes can be selected', 'red');
        return;
      }

      this.itineraryInProgress = true;
      this.nodes.forEach((node) => {
        this.nodes.update({ id: node.id, hidden: true });
      });

      const result = bellmanFord(this.nodes, this.edges, this.selectedNodes);

      result.path.forEach((nodeId) => {
        this.nodes.update({ id: nodeId, hidden: false });
      });

      this.useSnackBar(`Travel Time: ${result.totalTime} min`, 'cornflowerblue', 6000);
    },
    displayAllNodesAndEdges() {
      if (this.itineraryInProgress) {
        this.nodes.forEach((node) => {
          this.nodes.update({ id: node.id, hidden: false });
        });
        this.itineraryInProgress = false;
      }
      if (this.coveringTreeInProgress) {
        this.edges.forEach((edge) => {
          this.edges.update({ id: edge.id, hidden: false });
        });
        this.coveringTreeInProgress = false;
      }

    },
    toggleStationsVisibility() {
      this.stationsVisibility = !this.stationsVisibility;
      if (!this.stationsVisibility) {
        this.nodes.forEach((node) => {
          this.nodes.update({id: node.id, label: ''});
        });
      } else {
        this.nodes.forEach((node) => {
          if (node.shouldBeLabeled) {
            this.nodes.update({id: node.id, label: node.name});
          }
        });
      }
    },
    coveringTree() {
      this.coveringTreeInProgress = true;
      this.edges.forEach((edge) => {
        this.edges.update({ id: edge.id, hidden: true });
      });
      const result = prim(this.nodes, this.edges);
      result.forEach((edge) => {
        this.edges.update({ id: edge.id, hidden: false });
      });
      this.useSnackBar('Covering Tree displayed', 'green');
    },
    useSnackBar(text, color, duration = 4000) {
      this.snackBarText = text;
      const snackbar = document.querySelector('.snackbar');
      snackbar.classList.add('snackbar-visible');
      snackbar.setAttribute('style', `background-color: ${color}`);
      setTimeout(() => {
        snackbar.classList.remove('snackbar-visible');
      }, duration);
    },
  }
}
</script>

<template>
  <div id="mynetwork"></div>

  <div class="param-buttons">
    <button v-if="itineraryInProgress || coveringTreeInProgress" class="buttons-actions cancel-button" @click="displayAllNodesAndEdges">Cancel</button>
    <button :class="[coveringTreeInProgress ? activeClass : '']" class="buttons-actions" @click="coveringTree">See covering Tree</button>
    <button :class="[itineraryInProgress ? activeClass : '']" class="buttons-actions" @click="calcItinerary">Calculate Itinerary</button>
    <button class="buttons-actions" @click="toggleStationsVisibility">Toggle Stations Visibility</button>
  </div>

  <div class="snackbar">
    <p>{{ snackBarText }}</p>
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

.buttons-actions {
  margin: 10px;
  padding: 5px 10px;
  border: 0;
  background-color: cornflowerblue;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  height: 30px;
  width: auto;
}

.button-active {
  background-color: #073c9a;
}

.cancel-button {
  background-color: palevioletred;
  border: 0;
  color: white;
}

.snackbar {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 3px 10px;
  background-color: #222222;
  color: #f2f2f2;
  border-radius: 2px;
  visibility: hidden;
}

.snackbar-visible {
  animation: slidein 0.5s;
  visibility: visible;
}

@keyframes slidein {
  from { transform: translateX(-150px); }
  to   { transform: translateX(0); }
}

</style>