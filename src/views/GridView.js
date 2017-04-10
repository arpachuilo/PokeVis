import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import PokeTypes from '../data/types.json'

import redis from '../redis'
import Scatterplot from '../components/Scatterplot'
import Starplot from '../components/Starplot'
import BarChart from '../components/BarChart'

import { toggleFilter, updateFilter, clearFilter } from '../redux/actions'

class GridView extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      xAxisValue: 'Attack',
      yAxisValue: 'Defense',
      selectedPokemon: null
    }

    this.divMouseEnter = this.divMouseEnter.bind(this)

    this.xAxisChange = this.xAxisChange.bind(this)
    this.yAxisChange = this.yAxisChange.bind(this)
    this.xAxisMouseEnter = this.xAxisMouseEnter.bind(this)
    this.yAxisMouseEnter = this.yAxisMouseEnter.bind(this)

    this.setPokemon = this.setPokemon.bind(this)
    this.scatterMouseEnter = this.scatterMouseEnter.bind(this)

    this.starplotMouseEnter = this.starplotMouseEnter.bind(this)

    this.addTypeFilter = this.addTypeFilter.bind(this)
    this.typeMouseEnter = this.typeMouseEnter.bind(this)

    this.addGenerationFilter = this.addGenerationFilter.bind(this)
    this.generationMouseEnter = this.generationMouseEnter.bind(this)
  }

  divMouseEnter (e) {
    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: e.currentTarget.id,
      target: 'null',
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters
    })
  }

  xAxisMouseEnter (e) {
    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'xAxisSelection',
      target: 'xAxis-null',
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters
    })
  }

  yAxisMouseEnter (e) {
    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'yAxisSelection',
      target: 'yAxis-null',
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters
    })
  }

  xAxisChange (e) {
    let value = e.target.value
    this.setState({ xAxisValue: value }, () => {
      redis.add('xAxisChanged', {
        date: +(new Date()),
        x: e.pageX,
        y: e.pageY,
        yAxis: this.state.yAxisValue,
        xAxis: this.state.xAxisValue,
        aoi: 'xAxisSelection',
        target: 'yAxis-' + value,
        selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
        filters: this.props.filters
      })
    })
  }

  yAxisChange (e) {
    let value = e.target.value
    this.setState({ yAxisValue: value }, () => {
      redis.add('yAxisChanged', {
        date: +(new Date()),
        x: e.pageX,
        y: e.pageY,
        yAxis: this.state.yAxisValue,
        xAxis: this.state.xAxisValue,
        aoi: 'yAxisSelection',
        target: 'yAxis-' + value,
        selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
        filters: this.props.filters
      })
    })
  }

  scatterMouseEnter (e, datum) {
    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'Scatterplot',
      target: datum.id,
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters
    })
  }

  setPokemon (e, datum) {
    this.setState({
      selectedPokemon: datum
    }, () => {
      redis.add('PokemonSelected', {
        date: +(new Date()),
        x: e.pageX,
        y: e.pageY,
        yAxis: this.state.yAxisValue,
        xAxis: this.state.xAxisValue,
        aoi: 'Scatterplot',
        target: datum.id,
        selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
        filters: this.props.filters
      })
    })
  }

  starplotMouseEnter (e, datum) {
    console.log('star')
    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'Starplot',
      target: datum.id,
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters
    })
  }

  addTypeFilter (e) {
    var filterObj = {
      Types: [e.target.value]
    }

    redis.add('AddedTypeFilter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'TypeFilters',
      target: e.target.value,
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters
    })

    this.props.toggleFilter(filterObj)
  }

  typeMouseEnter (e) {
    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'TypeFilters',
      target: e.target.value,
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters
    })
  }

  addGenerationFilter (e, d, i) {
    var filterObj = {
      Generation: [i + 1 + '']
    }

    redis.add('AddedGenerationFilter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'BarChart',
      target: (i + 1),
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters
    })

    this.props.toggleFilter(filterObj)
  }

  generationMouseEnter (e, d, i) {
    redis.add('MouseEnter', {
      date: +(new Date()),
      x: e.pageX,
      y: e.pageY,
      yAxis: this.state.yAxisValue,
      xAxis: this.state.xAxisValue,
      aoi: 'BarChart',
      target: (i + 1),
      selectedPokemon: this.state.selectedPokemon !== null ? this.state.selectedPokemon.id : null,
      filters: this.props.filters
    })
  }

  render () {
    return (
      <div>
        <div className='row'>
          <div className='four columns'>
            <div className='row'>
              <div id='BarChart' onMouseEnter={this.divMouseEnter}>
                <BarChart
                  data={this.props.pokemon}
                  selected={this.props.filters.Generation}
                  onClick={this.addGenerationFilter}
                  onMouseEnter={this.generationMouseEnter}
                  xAccessor={'Generation'}
                  yLabel='# of Pokemon'
                  xLabel='Generation' />
              </div>
            </div>
            <div className='row'>
              <div id='Starplot' onMouseEnter={this.divMouseEnter}>
                <Starplot autoWidth
                  onMouseEnter={this.starplotMouseEnter}
                  datum={this.state.selectedPokemon}
                  labels={Object.keys(this.props.scales)}
                  accessors={Object.keys(this.props.scales).map((k) => this.props.scales[k])} />
              </div>
            </div>
          </div>
          <div className='eight columns'>
            <div id='Scatterplot' className='row' onMouseEnter={this.divMouseEnter}>
              <Scatterplot autoWidth tooltip
                onClick={this.setPokemon}
                onMouseEnter={this.scatterMouseEnter}
                data={this.props.filteredPokemon}
                idAccessor='Name'
                xAccessor={this.state.xAxisValue}
                xLabel={this.state.xAxisValue}
                yAccessor={this.state.yAxisValue}
                yLabel={this.state.yAxisValue} />
            </div>
            <div className='row'>
              <div id='AxisSelection'>
                <div id='X_Axis_Selection' className='six columns' onMouseEnter={this.xAxisMouseEnter}>
                  <span>X Axis: </span>
                  <select id='xAxis_Selection' onChange={this.xAxisChange} value={this.state.xAxisValue}>
                    <option value='HP'>HP</option>
                    <option value='Attack'>Attack</option>
                    <option value='Defense'>Defense</option>
                    <option value='Special_Attack'>Special Attack</option>
                    <option value='Special_Defense'>Special Defense</option>
                    <option value='Speed'>Speed</option>
                  </select>
                </div>
                <div id='Y_Axis_Selection' className='six columns' onMouseEnter={this.yAxisMouseEnter}>
                  <span>Y Axis: </span>
                  <select id='yAxis_Selection' onChange={this.yAxisChange} value={this.state.yAxisValue}>
                    <option value='HP'>HP</option>
                    <option value='Attack'>Attack</option>
                    <option value='Defense'>Defense</option>
                    <option value='Special_Attack'>Special Attack</option>
                    <option value='Special_Defense'>Special Defense</option>
                    <option value='Speed'>Speed</option>
                  </select>
                </div>
              </div>
              <div id='TypeFilters' onMouseEnter={this.divMouseEnter}>
                {PokeTypes.map((type, i) => {
                  var toggled = 'off'
                  if (typeof this.props.filters['Types'] !== 'undefined') {
                    if (this.props.filters['Types'].includes(type)) {
                      toggled = 'on'
                    }
                  }
                  return <button key={i}
                    className={'button ' + type + ' ' + toggled}
                    onClick={this.addTypeFilter}
                    onMouseEnter={this.typeMouseEnter}
                    value={type}>{type}</button>
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

GridView.defaultProps = {
  toggleFilter: () => {},
  updateFilter: () => {},
  clearFilter: () => {},
  pokemon: [],
  filteredPokemon: [],
  scales: []
}

GridView.propTypes = {
  toggleFilter: PropTypes.func,
  updateFilter: PropTypes.func,
  clearFilter: PropTypes.func,
  pokemon: PropTypes.array,
  filteredPokemon: PropTypes.array,
  scales: PropTypes.any,
  filters: PropTypes.any
}

const mapStateToProps = (state) => {
  return {
    pokemon: state.list.pokemon,
    filteredPokemon: state.list.filteredPokemon,
    scales: state.list.scales,
    filters: state.list.filters
  }
}

const mapDispatchToProps = {
  toggleFilter,
  updateFilter,
  clearFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(GridView)
