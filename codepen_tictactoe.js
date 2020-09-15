function Square(props) {
  return (
    <button className="square" onClick={props.onClick} id={props.id}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        id={"button-"+i}
      />
    );
  }

  render() {
    let rows = [];
    for(var col = 0; col < 3; col++){
      let squares = [];
      for(var field = 0; field < 3; field++){
        squares.push(this.renderSquare(3*col+field));
      }
      rows.push(<div className="board-row" key={col + 'someId'}>{squares}</div>);
    }
    return (
      /* //Another option using map inside return
      <div>
      {[0,1,2].map(i => {
        return (
          <div className="board-row">
            {[0,1,2].map(j => {
              return this.renderSquare(3*i + j)
            })}
          </div>
        );
      })}
      </div>
      */
      <div> 
        {rows} 
      </div>
    );
  }
}
const coordinates_ar = ['(1,1)', '(2,1)', '(3,1)', '(1,2)', '(2,2)', '(3,2)', '(1,3)', '(2,3)', '(3,3)'];
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      history_positions: Array(9).fill(null),
      boldMove: "",
      reverse: false
    };
  }
  
  
  handleClick(i) {
    //When history sorted desc we will change history order at the beggining and ending of the methods to treat the history the same way as if it was sorted asc
    const history = this.state.reverse ? this.state.history.reverse().slice(0, this.state.stepNumber + 1) : this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const history_positions = this.state.history_positions;
    history_positions[this.state.stepNumber+1] = coordinates_ar[i];
    if (calculateWinner(squares) || squares[i]) {
      this.setState({
      history: this.state.reverse ? history.reverse() : history
    });
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    
    this.setState({
      history: this.state.reverse ? history.concat([{squares: squares}]).reverse() : history.concat([{squares: squares}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      history_positions: history_positions
    });
  }
  
  
  
  reverseMoves(){
    this.setState({
      reverse: this.state.reverse ? false : true,
      history: this.state.history.reverse()
    });
  }

  jumpTo(e,step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      boldMove: "normal"
    });
    e.target.style.fontWeight = "bold";
    
  }

  render() {
    var history = this.state.history;
    const is_reverse = this.state.reverse;
    const current = is_reverse ? history[history.length - 1 - this.state.stepNumber] : history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
const history_positions = this.state.history_positions;
    const moves = history.map((step, move) => {
      if (is_reverse) {
        move = history.length - 1 - move;
      }
      const desc = move ?
        'Go to move #' + move +' '+history_positions[move]:
        'Go to game start';
      return (
        <li key={move}>
          <button style={{fontWeight: this.state.boldMove}} onClick={(e) => this.jumpTo(e,move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      if (this.state.stepNumber == 9){
        status = "Empate";
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.reverseMoves()}>{this.state.reverse ? 'Sort asc':'Sort desc' }</button>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      document.getElementById('button-'+[a]).style.border = '2px solid black';
      document.getElementById('button-'+[b]).style.border = '2px solid black';
      document.getElementById('button-'+[c]).style.border = '2px solid black';
      return squares[a];
    }
  }
  return null;
}
