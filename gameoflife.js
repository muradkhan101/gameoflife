var timerId;
var ButtonToolbar  = ReactBootstrap.ButtonToolbar;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem       = ReactBootstrap.MenuItem;
var ButtonGroup    = ReactBootstrap.ButtonGroup;
var Button         = ReactBootstrap.Button;

class Board extends React.Component {
  constructor() {
    super();
    this.renderSquares = [];
    this.state = {paused: false, speed: 100, size: 70, genCount:0};
    timerId = window.setTimeout(this.updateSquares.bind(this), 2000);
    this.createNewBoard =  this.createNewBoard.bind(this);
    this.changeBoardSize = this.changeBoardSize.bind(this);
    this.changeSpeed =     this.changeSpeed.bind(this);
    this.updateSquares=    this.updateSquares.bind(this);
    this.clickSquare =     this.clickSquare.bind(this);
  }

  createNewBoard(event) {
    var newBoard = [];
    for (var i=0; i<this.state.size-20; i++)
    {
      var tempRow = [];
      for (var j=0; j<this.state.size; j++)
      {
        if (event.target.id == "clear")
          tempRow.push(0);
        else {
          tempRow.push(Math.round(Math.random()));
        }
      }
      newBoard.push(tempRow);
    }
    this.setState({board: newBoard, paused: false, genCount: 0});
  }

  updateSquares() {
    if (!this.state.board) {this.createNewBoard({target:{id: "random"}})}
    if(!this.state.paused)
    {
    var tempArray = [];
    for (var i = 0; i<this.state.size-20; i++)
      tempArray.push(this.state.board[i].slice(0));
    for (var i=0; i<this.state.size-20; i++)
    {
      for (var j=0; j<this.state.size; j++)
      {
        var squareCount = 0;
        for (var ii=-1; ii<2; ii++)
        {
          for (var jj=-1; jj<2; jj++)
          {
            if (ii===0 && jj===0) continue;
            else if (this.state.board[(i+ii+this.state.size-20)%(this.state.size-20)][(j+jj+this.state.size)%(this.state.size)] !== 0) squareCount++;
          }
        }
        if (this.state.board[i][j]===0 && squareCount ===3) tempArray[i][j] = 1;
        else if (this.state.board[i][j] >= 1 && (squareCount==2 || squareCount ==3)) tempArray[i][j]=2;
        else if (this.state.board[i][j] >= 1 && squareCount >3) tempArray[i][j] = 0;
        else tempArray[i][j] = 0;
      }
    }
      console.log(tempArray)
    this.setState({board: tempArray, genCount: (this.state.genCount+1)});
      timerId = window.setTimeout(this.updateSquares.bind(this), 2000);
    }
  }
    
  changeSpeed(event) {
    this.setState({speed: event});
    window.clearInterval(timerId);
    timerId = window.setTimeout(this.updateSquares.bind(this), this.state.speed);
  }

  changeBoardSize(event) {
    var newSize = event.target.value;
    console.log(event.target.value);
    if (newSize === this.state.size)
      return 0;
    else {
      this.setState({size: newSize});
      this.createNewBoard({target: {id: "clear"}});
      this.renderSquares = this.state.board;
    }
  }

  clickSquare(event) {
    console.log(event);
    var id = event.target.id;
    var rowNum = id.slice(0, id.length/2);
    var colNum = id.slice(id.length/2);
    this.state.board[rowNum][colNum] = !this.state.board[rowNum][colNum];
  }

  renderButtons() {
    return (
      <ButtonGroup>
        <Button value={50} onClick={this.changeBoardSize.bind(this)}>50x30</Button>
        <Button value={70}>70x50</Button>
        <Button value={100}>100x80</Button>
      </ButtonGroup>
    // <ButtonToolbar>
    //   <DropdownButton bsStyle="primary" title="Select Size" id="sizeButton"
    //     key={1} onSelect={function(key) {this.changeBoardSize(key)}}>
    //     <MenuItem eventKey={50}> 50x30 </MenuItem>
    //     <MenuItem eventKey={70}> 70x50 </MenuItem>
    //     <MenuItem eventKey={100}> 100x80 </MenuItem>
    //   </DropdownButton>
    //   <DropdownButton bsStyle="Info" title="Change Speed" id="speedButton"
    //     key={2} onSelect={function(key) {this.changeSpeed(key)}}>
    //       <MenuItem eventKey={100}> Fast </MenuItem>
    //       <MenuItem eventKey={250}> Medium </MenuItem>
    //       <MenuItem eventKey={500}> Slow </MenuItem>
    //     </DropdownButton>
    // </ButtonToolbar>
    )
  }

  render() {
    if (this.state.board) {
    for (var i=0; i<this.state.size-20; i++)
    {
      if (!this.renderSquares[i]) {this.renderSquares[i]=[]}
      for (var j=0; j<this.state.size; j++)
      {
        this.renderSquares[i][j] = <Square number={String(i)+String(j)} 
                                     onClick={this.clickSquare}
           size={this.state.size} life={this.state.board[i][j]}/>;
      }
    }}
    return (
    <div className={"container" + this.state.size}>
      {this.renderButtons()}
        <div id="squareHolder">{this.renderSquares}</div>
    </div>
  )}
}

function Square(props) {
    return (
    <div onClick={props.onClick} id={props.number}
      className={"square"+props.size +" life" +props.life}/>
  )}

ReactDOM.render(<Board/>, document.getElementById("container"));
