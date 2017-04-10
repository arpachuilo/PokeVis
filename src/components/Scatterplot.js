import React, { PropTypes } from 'react'
import * as d3 from 'd3'

import Tooltip from './Tooltip'

class Scatterplot extends React.Component {
  constructor (props) {
    super(props)

    this.createChart = this.createChart.bind(this)
    this.updateChart = this.updateChart.bind(this)
    this.removeChart = this.removeChart.bind(this)

    if (props.tooltip) {
      const tooltipFunction = (d) => {
        let tip = ''
        tip += d[props.idAccessor] + '</br>'
        tip += props.xAccessor + ': ' + d[props.xAccessor] + '</br>'
        tip += props.yAccessor + ': ' + d[props.yAccessor]
        return tip
      }

      this.tip = new Tooltip()
        .attr('className', 'tooltip')
        .offset([-8, 0])
        .html(tooltipFunction)
    }
  }

  createChart () {
    let root = d3.select(this.refs.root)

    // Get real chart width/height
    let width = this.props.width
    let height = this.props.height
    if (this.props.autoWidth) {
      width = root.node().offsetWidth
    }

    this.chartWidth = width - this.props.margin.left - this.props.margin.right
    this.chartHeight = height - this.props.margin.top - this.props.margin.bottom

    let svg = root.append('svg')
      .attr('width', this.chartWidth + this.props.margin.left + this.props.margin.right)
      .attr('height', this.chartHeight + this.props.margin.top + this.props.margin.bottom)
    this.chart = svg.append('g')
      .attr('transform', 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')')
    this.scatterContainer = this.chart.append('g')
      .attr('class', 'points')

    // Axes groups
    this.xAxis = this.chart.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + this.chartHeight + ')')
    this.yAxis = this.chart.append('g')
      .attr('class', 'axis y-axis')

    // Add labels
    this.yLabel = this.chart.append('text')
      .attr('class', 'axis label')
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('x', -(this.chartHeight / 2))
      .attr('y', -this.props.margin.left + 6)
      .attr('dy', '.35em')
      .text(this.props.yLabel)
    this.xLabel = this.chart.append('text')
      .attr('x', this.chartWidth / 2)
      .attr('y', this.chartHeight + this.props.margin.bottom)
      .attr('text-anchor', 'middle')
      .text(this.props.xLabel)
  }

  updateChart (props, state) {
    let xMax = d3.max(props.data, (d) => {
      return +d[props.xAccessor]
    })

    let yMax = d3.max(props.data, (d) => {
      return +d[props.yAccessor]
    })

    this.xScale = d3.scaleLinear()
      .domain([0, xMax])
      .range([0, this.chartWidth])

    this.yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([this.chartHeight, 0])

    let points = this.scatterContainer.selectAll('.point')
      .data(props.data, (d) => d[props.idAccessor])

    points.exit().remove()

    points.enter()
      .append('svg:image')
        .attr('class', 'point')
        .on('click', (d) => {
          this.props.onClick(d3.event, d)
        })
        .on('mouseenter', (d) => {
          this.props.onMouseEnter(d3.event, d)
          if (props.tooltip) {
            this.tip.show(d3.event, d)
          }
        })
        .on('mouseleave', (d) => {
          if (props.tooltip) {
            this.tip.hide(d3.event, d)
          }
        })
        // .attr('r', (d) => this.props.radius)
        .attr('transform', 'translate(-20,-20)') // take into account icon size
        .attr('x', (d) => this.xScale(d[props.xAccessor]))
        .attr('y', (d) => this.yScale(d[props.yAccessor]))
        .attr('xlink:href', (d) => require('../data/sprites/' + d['id'].split('.')[0] + 'MS.png'))
      .merge(points).transition().duration(400).ease(d3.easeLinear)
        .attr('x', (d) => this.xScale(d[props.xAccessor]))
        .attr('y', (d) => this.yScale(d[props.yAccessor]))
        // .attr('r', (d) => this.props.radius)

    // Update axes
    let xAxis = d3.axisBottom(this.xScale)
    if (this.props.xAxisTicks) {
      xAxis.ticks(props.xAxisTicks)
    }
    if (this.props.xAxisTickFunction) {
      xAxis.tickFormat((d, i) => {
        return props.xAxisTickFunction(d, i)
      })
    }
    this.xAxis.call(xAxis)
    this.yAxis.call(d3.axisLeft(this.yScale))

    // Update labels
    this.yLabel.text(props.yLabel)
    this.xLabel.text(props.xLabel)
  }

  removeChart () {
    let root = d3.select(this.refs.root)
    root.selectAll('*').remove()
  }

  componentDidMount () {
    this.createChart()
    this.updateChart(this.props, this.state)
  }

  componentWillUnmount () {
    this.removeChart()
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.data !== this.props.data ||
      nextProps.xAccessor !== this.props.xAccessor ||
      nextProps.yAccessor !== this.props.yAccessor) {
      this.updateChart(nextProps, nextState)
    }
    return false
  }

  render () {
    return (
      <div ref='root' />
    )
  }
}

Scatterplot.defaultProps = {
  data: [],
  margin: {
    top: 10,
    left: 55,
    bottom: 50,
    right: 45
  },
  autoWidth: false,
  width: 640,
  height: 360,
  onClick: () => {},
  onMouseEnter: () => {},
  radius: 5,
  xAxisTickFunction: null,
  xAxisTicks: null,
  xLabel: '',
  yLabel: '',
  idAccessor: 'id',
  xAccessor: 'key',
  yAccessor: 'value',
  tooltip: false
}

Scatterplot.propTypes = {
  data: PropTypes.array,
  margin: PropTypes.object,
  autoWidth: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  radius: PropTypes.number,
  xAxisTickFunction: PropTypes.func,
  xAxisTicks: PropTypes.any,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  idAccessor: PropTypes.string,
  xAccessor: PropTypes.string,
  yAccessor: PropTypes.string,
  tooltip: PropTypes.bool
}

export default Scatterplot