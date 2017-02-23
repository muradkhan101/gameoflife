var timerId;

class Board extends React.Component {
  constructor() {
    super();
    this.state = {paused: false, speed: 50, size: 50, genCount:0};
    createNewBoard({target:{id: "random"}});
    window.setInterval(updateSquares, this.state.speed);
    this.onClick =         this.onClick.bind(this);
    this.createNewBoard =  this.createNewBoard.bind(this);
    this.changeBoardSize = this.changeBoardSize.bind(this);
    this.changeSpeed =     this.changeSpeed.bind(this);
  }

  function createNewBoard(event) {
    var newBoard = [];
    for (var i=0; i<this.state.size; i++)
    {
      var tempRow = [];
      for (var j=0; j<this.state.size-20; j++)
      {
        if (event.target.id == "clear")
          tempRow.push(0);
        else {
          tempRow.push(Math.round(Math.random()));
        }
      }
      newBoard.push(tempRow);
    }
    this.setState({board: newBoard, paused: true, genCount: 0});
  }

  function updateSquares() {
    var tempArray = [];
    for (var i = 0; i<this.state.size; i++)
      tempArray.push(this.state.board[i].slize(0));
    for (var i=0; i<this.state.board.size; i++)
    {
      for (var j=0; j<this.state.board.size-20; j++)
      {
        var squareCount = 0;
        for (var ii=-1; ii<2; ii++)
        {
          for (var jj=-1; jj<2; jj++)
          {
            if (ii===0 && jj===0) continue;
            else if (this.state.board[i+ii][j+jj] !== 0) squareCount++;
          }
        }
        if (this.state.board[i][j]===0 && squareCount ===3) tempArray[i][j] = 1;
        else if (this.state.board[i][j] >= 1 && squareCount>=2) tempArray[i][j]=2;
        else tempArray[i][j] = 0;
      }
    }
    this.setState({board: tempArray, genCount: (genCount+1)});
  }
//Implement this function
  function changeSpeed(event) {
    window.clearInterval(timerId);
    var newTime = Number(event.target.id.slice(6));
    window.setInterval(newTime,)
  }

  function changeBoardSize(event) {
    var newSize = Number(event.target.id.slice(5));
    if (newSize === this.state.size)
      return 0;
    else (
      this.setState({size: newSize});
      createNewBoard({target: {id: "clear"}});
    )
  }

  function clickSquare(event) {
    var id = event.target.id;
    var rowNum = id.slice(0, id.length/2);
    var colNum = id.slice(id.length/2);
    this.state.board[rowNum][colNum] = !this.state.board[rowNum][colNum];
  }

  render() {
    var renderSquares=[];
    for (var i=0; i<this.state.size; i++)
    {
      for (var j=0; j<this.state.size-20; j++)
      {
        renderSquares.push(<Squares number={String(i)+j} onClick={this.clickSquare}
           size={this.state.size} life={this.state.board[i][j]}/>)
      }
    }
    <div className={"container" + this.state.size}>
      <SizeButtons/>
      {renderSquares}
    </div>
  }
}

class Squares extends React.Component {
  constructor(props) {
    super(props);
    this.state = {life: this.props.life};
  }
  render() {
    return (
    <div onClick={this.props.onClick} id={this.props.number}
      className={"square"+this.props.size +" life" +this.state.life}/>
  )}
}
}
