import 'dart:math';

import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

void main() {
  runApp(MaterialApp(
    home: ChartPage(),
  ));
}

class ChartPage extends StatefulWidget {
  @override
  _ChartPageState createState() => _ChartPageState();
}

List<ChartData> chartData;

class _ChartPageState extends State<ChartPage> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    chartData = getData();
    return Scaffold(
        appBar: AppBar(),
        body: Container(
          child: SfCartesianChart(
            primaryXAxis: DateTimeAxis(
                intervalType: DateTimeIntervalType.days,
                visibleMinimum: chartData[chartData.length-29].x,
                visibleMaximum: chartData[chartData.length-1].x
            ),
            zoomPanBehavior: ZoomPanBehavior(
              enablePanning: true,
            ),
            series: <CartesianSeries<ChartData,DateTime>>[
              SplineSeries(
                dataSource: chartData,
                xValueMapper: (ChartData data, _) => data.x,
                yValueMapper: (ChartData data, _) => data.y,
              )
            ],
          ),
        )
    );
  }
}
dynamic getData(){
  List<ChartData> data = [];
  for (int i =1; i < 50; i++){
    data.add(ChartData(DateTime(2018,1,i),getRandomInt(10, 100)));
  }
  return data;
}

num getRandomInt(num min, num max) {
  final Random random = Random();
  return min + random.nextInt(max - min);
}
class ChartData {
  ChartData(this.x, this.y);
  final DateTime x;
  final int y;
}