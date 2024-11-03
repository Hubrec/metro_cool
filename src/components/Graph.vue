<script>
import {Network} from 'vis-network';
import {DataSet} from 'vis-data';
import {extractLinks, extractNodes} from "@/service/http/fetchAPI.js";
import Zoomist from "zoomist";

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

    // Zoomist initialisation
    const zoomist = new Zoomist("#zoomist", {
      slider: true,
      zoomer: true,
    });

    const nodesData = await extractNodes();
    this.nodes = new DataSet(nodesData);
    const linksData = await extractLinks();
    this.edges = new DataSet(linksData);

    const data = {nodes: this.nodes, edges: this.edges};

    const basicOptions = {
      nodes: {
        shape: 'dot',
        size: 4,
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
          size: 6,
          color: 'rgba(0,0,0,0)'
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
        enabled: false,
      },
      interaction: {
        dragNodes: false,
        dragView: false,
        zoomView: false,
        hover: true,
        multiselect: true,
      },
    };
    this.network = new Network(container, data, basicOptions);
  },
  methods: {
    printValues() {
      console.log(this.nodes.get());
      console.log(this.edges.get());
    }
  }
}
</script>

<template>
  <div class="zoomist-container">
    <div id="zoomist" class="zoomist-wrapper">
      <div class="zoomist-image">
        <div id="mynetwork"></div>
      </div>
    </div>
  </div>
  <div class="param-buttons">
    <button class="buttonsActions" @click="printValues">Print Values</button>
  </div>
</template>

<style>

.zoomist-wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.zoomist-container {
  height: 100%;
  background-image: url("../assets/metrof_r.png");
  background-size: cover;
  opacity: 0.95;
}

.zoomist-image {
  width: 100%;
  aspect-ratio: 1;
}

.zoomist-image div {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
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