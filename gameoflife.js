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
    this.createNewBoard =  this.createNewBoard.bind(this);
    this.changeBoardSize = this.changeBoardSize.bind(this);
    this.changeSpeed =     this.changeSpeed.bind(this);
    this.updateSquares=    this.updateSquares.bind(this);
    this.clickSquare =     this.clickSquare.bind(this);
    this.pauseResume =     this.pauseResume.bind(this);
  }

  createNewBoard(event) {
    var newBoard = [];
    for (var i=0; i<this.state.size-20; i++)
    {
      var tempRow = [];
      for (var j=0; j<this.state.size; j++)
      {
        if (event == "clear")
          tempRow.push(0);
        else {
          tempRow.push(Math.round(Math.random()));
        }
      }
      newBoard.push(tempRow);
    }
    console.log(newBoard);
    this.renderSquares = newBoard;
    this.state.paused=false; this.state.genCount=0;
    this.state.board = newBoard;
  }

  updateSquares() {
    if (!this.state.board) {this.createNewBoard("random")}
    if (!this.state.paused)
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
    this.setState({board: tempArray, genCount: (this.state.genCount+1)});
      timerId = window.setTimeout(this.updateSquares.bind(this), this.state.speed);
    }
  }
    
  changeSpeed(event) {
    var newSpeed = event.target.value
    this.state.speed = newSpeed;
    // window.clearInterval(timerId[0]);
    // timerId[0] = window.setTimeout(this.updateSquares.bind(this), this.state.speed);
  }

  changeBoardSize(event) {
    var newSize = Number(event.target.value);
    if (newSize === this.state.size)
      return 0;
    else {
      window.clearInterval(timerId);
      this.state.paused = false;
      this.state.size = newSize;
      this.createNewBoard("clear");
      this.renderSquares = [];
      this.setState({paused: true})
    }
  }

  clickSquare(event) {
    var id = event.target.id.split(",");
    var rowNum = id[0];
    var colNum = id[1];
    console.log(id, rowNum, colNum)
    this.state.board[rowNum][colNum] = this.state.board[rowNum][colNum] > 0 ?
      0: 1;
    this.setState({speed: this.state.speed})
  }

  pauseResume() {
    console.log(this);
    if (!this.state.paused) {window.clearTimeout(timerId[0])}       
    else {window.setTimeout(this.updateSquares.bind(this), this.state.speed)}
    this.state.paused= !this.state.paused;
  }
  
  renderButtons() {
    var buttonSize = this.state.size === 50 ? "x-small": "small";
    return (
      <div className="text-center">
        
        <div className="text-center">
      <div className="text-center"> Board Size <br/>
      <ButtonGroup bsSize={buttonSize}>
        <Button className="btn btn-primary" value={50} onClick={this.changeBoardSize.bind(this)}>50x30</Button>
        <Button className="btn btn-primary" value={70} onClick={this.changeBoardSize.bind(this)}>70x50</Button>
        <Button className="btn btn-primary" value={100} onClick={this.changeBoardSize.bind(this)}>100x80</Button>
      </ButtonGroup>
      </div>
          
        <div className="text-center"> Options <br/>
      <ButtonGroup bsSize={buttonSize}>
        <Button className="btn btn-info" 
          onClick={this.pauseResume.bind(this)}>Pause</Button>
        <Button className="btn btn-info" value={"random"} onClick={this.createNewBoard.bind(this)}>New Board</Button>
      </ButtonGroup>
          </div>
          
        <div className="text-center"> Update Speed <br/>
      <ButtonGroup bsSize={buttonSize}>
        <Button className="btn btn-primary" value={150} onClick={this.changeSpeed.bind(this)}>Slow</Button>
        <Button className="btn btn-primary" value={75} onClick={this.changeSpeed.bind(this)}>Medium</Button>
        <Button className="btn btn-primary" value={25} onClick={this.changeSpeed.bind(this)}>Fast</Button>
      </ButtonGroup>
          </div>
      </div>
      </div>
    )
  }

  render() {
    if (this.state.board) {
    for (var i=0; i<this.state.size-20; i++)
    {
      if (!this.renderSquares[i]) {this.renderSquares[i]=[]}
      for (var j=0; j<this.state.size; j++)
      {
        this.renderSquares[i][j] = <Square number={String(i)+","+String(j)} 
                                     onClick={this.clickSquare.bind(this)}
           size={this.state.size} life={this.state.board[i][j]}/>;
      }
    }}
    if (!timerId) {timerId =
      window.setTimeout(this.updateSquares.bind(this), this.state.speed)}
    return (
    <div className={"container" + this.state.size}>
        <h2 className="text-center"> Conway's Game of Life </h2> 
        <h4 className="text-center"> Generation Count: {this.state.genCount}</h4>
      
        <div className="spacer"/>
        <div id="squareHolder">{this.renderSquares}</div>
        {this.renderButtons()}
    </div>
  )}
}

function Square(props) {
    return (
    <div onClick={props.onClick} id={props.number}
      className={"square"+props.size +" life" +props.life}/>
  )}

ReactDOM.render(<Board/>, document.getElementById("container"));
