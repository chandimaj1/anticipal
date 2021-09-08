const React = require('react');

const GridOption = require('./GridOption');

class GridOptions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="view-actions">
      {
        this.props.gridTypes.map((gridType) => {
          return (
            <GridOption key={gridType}
                        type={gridType}
                        active={this.props.activeGrid === gridType}
                        onClick={() => {this.props.onGridOptionClick(gridType);}}
            />
          );
        })  
      }
      </div>
    );
  }
}

module.exports = GridOptions;