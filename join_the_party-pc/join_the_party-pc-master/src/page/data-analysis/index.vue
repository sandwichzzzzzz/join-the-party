<template>
  <div id="Content-page">
    <Paging :pagData="[{ name: '数据分析', router: '/analysis' }]" />

    <BorderBox7
      :color="['rgb(160, 244, 244)']"
      class="box1"
      backgroundColor="#e9ebf2"
    >
      <BorderBox8 :reverse="true" class="column">
        <BorderBox11 :color="['#7265f1']" class="chart" title="答题称号占比"
          ><div class="box2" id="gender2D"></div
        ></BorderBox11>
        <BorderBox11 class="chart" title="各学院党员人数"
          ><div class="box2" id="gender"></div
        ></BorderBox11>
      </BorderBox8>
      <BorderBox8 :reverse="true" class="column">
        <BorderBox12 style="height: 20vh">
          <div class="top-data-container">
            <BorderBox2
              :color="['#6786e3', '#7c92d6']"
              class="top-data"
              v-for="(item, index) in topData"
              :key="index"
            >
              <p>{{ item.quantity }}</p>
              <p>{{ item.type }}</p>
            </BorderBox2>
          </div>
        </BorderBox12>
        <div>
          <Decoration7
            :color="['#83d6ad', '#6e93f0']"
            style="width: 40vw; color: #7266f1; font-size: 1.5vw"
            >动态喜爱度排名前8的党支部</Decoration7
          >
          <div class="popularity" id="popularity"></div>
          <Decoration5 style="width: 40vw" />
        </div>
      </BorderBox8>
      <BorderBox8 :reverse="true" class="column">
        <BorderBox11 class="chart" title="词云图">
          <div style="padding: 12% 3% 0% 3%" class="box2" id="wordcloud"></div
        ></BorderBox11>
        <BorderBox11 class="chart" title="活动积极前六学院">
          <div class="box2" id="posCollege"></div
        ></BorderBox11>
      </BorderBox8>
    </BorderBox7>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted, reactive } from "vue";
import Paging from "@/page/component/Paging-component.vue";
import { Column, WordCloud, Pie, Bar, Histogram } from "@antv/g2plot";
import request from "@/api/request.js";
import {
  BorderBox2,
  BorderBox7,
  BorderBox8,
  BorderBox11,
  BorderBox12,
  Decoration5,
  Decoration7,
} from "@newpanjing/datav-vue3";

const topData = ref([]);
const COLUMNPLOT = ref(null);
let barPlotGender2, piePlot, popularity, wordCloud;

onMounted(async () => {
  const partyData = await request.get("/get-party-data");
  const { activeCount, developCount, preMemberCount, formalCount } =
    partyData.data;
  topData.value = [
    { type: "学校累计党员总数", quantity: activeCount },
    { type: "预备党员总数", quantity: developCount },
    { type: "发展对象总数", quantity: preMemberCount },
    { type: "入党积极分子总数", quantity: formalCount },
  ];

  const gender2Data = await request.get("/getQuestionRatio");
  console.log("gender2Data", gender2Data);
  barPlotGender2 = new Bar("gender2D", {
    data: [
      { college: "初出茅庐", count: gender2Data.data.percentage0to100 },
      { college: "再接再厉", count: gender2Data.data.percentage100to500 },
      { college: "才气过人", count: gender2Data.data.percentage500to1000 },
      { college: "远见卓识", count: gender2Data.data.percentage1000to1500 },
      { college: "出类拔萃", count: gender2Data.data.percentageAbove1500 },
    ],
    color: ({ college }) => {
      switch (college) {
        case "初出茅庐":
          return "#FAAD14";
        case "再接再厉":
          return "#5B8FF9";
        case "才气过人":
          return "#36CFC9";
        case "远见卓识":
          return "#9254DE";
        case "出类拔萃":
          return "#FF7A45";
        default:
          return "#333"; // 默认颜色
      }
    },
    xField: "count",
    yField: "college",
    maxColumnWidth: 20,
  });
  barPlotGender2.render();

  // 获取动态喜爱度排名前8的党支部数据
  const popularityResponse = await request.get("/positiveForum");
  const popularityData = popularityResponse.data.map((item) => ({
    name: item.branch,
    value: item.count,
  }));

  // 初始化 popularity 图表
  const popularityPlot = new Column("popularity", {
    data: popularityData,
    xField: "name",
    yField: "value",
    seriesField: "name", // 如果你想根据不同的系列（如果有的话）显示不同颜色
    label: {
      position: "middle", // 标签的位置，显示在条中央
      content: (data) => `${data.value}`, // 显示具体数值
    },
    minColumnWidth: 10,
    maxColumnWidth: 50,
  });
  // 渲染 popularity 图表
  popularityPlot.render();

  const collegeData = await request.get("/getPartyRatio");
  piePlot = new Pie("gender", {
    appendPadding: 10,
    data: collegeData.data,
    angleField: "percentage",
    colorField: "college",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: { fontSize: 10, textAlign: "center" },
    },
    label: {
      position: "middle",
      content: ({ count }) => count,
      style: { fontSize: 16 },
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
  });
  piePlot.render();

  //词云图
  const wordCloudData = await request.get("/forumWordCloud");
  wordCloud = new WordCloud("wordcloud", {
    data: wordCloudData.data,
    colorField: "tag",
    spiral: "rectangular",
    wordField: "tag",
    weightField: "count",
    wordStyle: {
      fontFamily: 'Verdana, "Segoe Script"',
      color: ["#3366CC", "#109618", "#990099"],
      rotation: [-30, 30],
      fontSize: [20, 60],
    },
    spiral: "rectangular",
    random: Math.random,
  });
  wordCloud.render();

  //活动积极前六学院学院
  const Ab = await request.get("/positiveCollege");
  const columnPlot = new Column("posCollege", {
    data: Ab.data.map((item) => ({
      college: item.college[0],
      count: item.count,
    })),
    xField: "college",
    yField: "count",
    padding: 40,
    maxColumnWidth: 20,
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      college: {
        alias: "学院",
      },
      count: {
        alias: "活动总数",
      },
    },
  });
  columnPlot.render();
  COLUMNPLOT.value = columnPlot;
});

onUnmounted(() => {
  if (barPlotGender2) {
    barPlotGender2.destroy();
  }
  if (wordCloud) {
    wordCloud.destroy();
  }
});
</script>

<style scoped>
.top-data-container {
  display: flex;
  height: 15vh;
}

.top-data {
  position: relative;
  border-radius: 5px;
  padding: 3vh 2vw 1vh 2vw;
  margin-right: 0vw;
  color: #5582d4;
}

.top-data p:nth-child(1) {
  font-size: 2vw;
  font-weight: bold;
  padding-top: 0px;
  color: #6f22db;
}

.box1 {
  position: relative;
  height: 100vh; /* 使用 vh 单位 */
  padding: 0px;
  width: 100vw;
}

.column {
  position: absolute;
  top: 0;
  padding: 0px;
  width: 30vw; /* 使用 vw 单位 */
}

.column:nth-child(2) {
  left: 30vw; /* 使用 vw 单位 */
  width: 40vw;
}

.column:nth-child(3) {
  left: 70vw; /* 使用 vw 单位 */
}

.chart {
  height: 50vh; /* 使用 vh 单位 */
  width: 30vw; /* 使用 vw 单位 */
}
.box2 {
  padding: 13% 1% 13% 1%; /* 使用百分比 */
  margin: 0 3%; /* 使用百分比 */
  height: 85%;
}
.popularity {
  padding: 0vh 1vw 0vh 1vw;
  height: 70vh;
}
</style>
