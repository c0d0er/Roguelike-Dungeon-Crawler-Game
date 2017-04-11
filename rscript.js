var x,y, dungeonArr;
//var toggleFlag=false;
const dungeonWeapon={
  0: 'stick',
  1: 'knife',
  2: 'club',
  3: 'sword',
  4: 'spear'
};
const dungeonHealth={// each potion adds health; total dungeonHealth: 18600 in 5 dungeons; 10 potions each dungeon;
  0: 60,
  1: 120,
  2: 180,
  3: 240,
  4: 300
};
const dungeonMonster={//each monster reduces health; equals xp if kill monster; 
  //total dungeonMonster value: 15500 in 5 dungeons; 25 monsters each dungeon;
  0: 20,
  1: 40,
  2: 60,
  3: 80,
  4: 100
};

const arrInd=()=>{
  x=Math.round(Math.random()*47)+1;//row, avoid in the wall;
  y=Math.round(Math.random()*77)+1;//column, avoid in the wall;
};

const playerInd=()=>{
  x=Math.round(Math.random()*2)+22;//row, avoid in the wall;
  y=Math.round(Math.random()*2)+37;//column, avoid in the wall;
};

const isBlack=(playerX, playerY, tileX, tileY)=>{
  const xDistance=Math.pow(playerX-tileX, 2);
  const yDistance=Math.pow(playerY-tileY, 2);
  return Math.sqrt(xDistance+yDistance)>4.2;//5 is maximum distance which is shown non-black;
}

/*
But yoir input to the x position of the tile is the variable j which is the index od the tile in the smaller, splitted map, and not from the original map in the state
So you give a wrong X position for the tile to isBlack
The right position would be j + <how much you removed from the dungeonmap>
*/

const Td = (props) => { 
  let td1 = props.data.map((v,j)=>{
    let col = j + props.offset;//----------->new added, keypoint;
    let cName=v[1];
    if(props.showDark){//if(!toggleFlag)      
      cName=cName+(isBlack(props.playerPos.x, props.playerPos.y, props.ind, col)? ' black':'');//---------->replace j with col;
    }
    
    return (<td id={props.ind+'-'+col} className={cName}></td>)//---------->replace j with col, keypoint;
  });
  return (<div>{td1}</div>)
};

class Dungeon extends React.Component {

  constructor(props){
    super(props);
    this.state={
      dungeonMap: [],//dungeonArr(50, 80),
      health: 100,//1 potion 100 health;
      weapon: 'fist',
      attack: 50,//1 weapon adds 50 attack;
      xp: 0,//1 monster 20xp;
      level: 0,//1 level 100xp;
      dungeon: 0,
      showDark: true,
      playerPos: { 
        x: x,//x is row -, y is column |;
        y: y }
    }
  };

  componentDidMount () {

    dungeonArr = (row, column) => {// row is -, column is |
      let arr=JSON.parse(JSON.stringify([]));
  for(let i=0; i<row; i++){
  arr[i]=[];
  for(let j=0; j<column; j++){
            let status='walls';
      arrInd();
      if(x<=45){x=0;status='roads';}
      else if(x>45){x=1; status='walls'}
      arr[i][j]=[x, status]; 
  }
}
for(let i=0; i<25; i++){
  arrInd();
  arr[x][y][0]=20*(this.state.dungeon+1);
  arr[x][y][1]='monsters'
}

for(let i=0; i<10; i++){
  arrInd();
  arr[x][y][0]=5;
  arr[x][y][1]='potions'
}

for(let i=0; i<1; i++){
  arrInd();
  arr[x][y][0]=4;
  arr[x][y][1]='weapons';

  if(Number(this.state.dungeon)===0){// set up player in dungeon 0;
    playerInd();
  arr[x][y][0]=7;
  arr[x][y][1]='player';
  this.setState({playerPos: {x:x, y:y}});
  }

    if(this.state.dungeon>0&&this.state.dungeon<=4){//random player from dungeon 1-4;
    arrInd();
  arr[x][y][0]=7;
  arr[x][y][1]='player';
  this.setState({playerPos: {x:x, y:y}});
}
  if(this.state.dungeon<4){// door stops at dungeon 4;
      arrInd();
  arr[x][y][0]=9;
  arr[x][y][1]='doors';
  }

  if(Number(this.state.dungeon)===4){//boss comes at dungeon 4;
    arrInd();
  arr[x][y][0]=2000;//2000
  arr[x][y][1]='boss';
  }
}

for(let i=0; i<column; i++){
  arr[0][i][1]='walls';
  arr[row-1][i][1]='walls';  
}

for(let j=0; j<row; j++){
  arr[j][0][1]='walls';
  arr[j][column-1][1]='walls';  
}

return arr;
}

this.setState({dungeonMap: dungeonArr(50, 80)})

          $(document).keydown(function(e){  
          let playerChange=(a,b)=>{// player works;
            //const playerArr=$('.player').attr('id').split('-');
            const playerArr=this.state.playerPos;
              let mapArr= JSON.parse(JSON.stringify(this.state.dungeonMap));              
              //mapArr[playerArr[0]][playerArr[1]][1]='roads'; 
              mapArr[playerArr.x][playerArr.y][1]='roads';
              mapArr[a][b][1]='player';
              this.setState({dungeonMap: mapArr});
              this.setState({playerPos : {x: a, y: b}});
          };

          let playerStart=()=>{// part of game start over;
            //const playerArr=$('.player').attr('id').split('-');
            const playerArr=this.state.playerPos;
              let mapArr= JSON.parse(JSON.stringify(this.state.dungeonMap));              
              //mapArr[playerArr[0]][playerArr[1]][1]='roads'; 
              mapArr[playerArr.x][playerArr.y][1]='roads';
              this.setState({showDark: true});
              this.setState({dungeonMap: mapArr});
              this.setState({dungeonMap: dungeonArr(50, 80)});
            };          

            //let playerId=$('.player').attr('id').split('-');
            let playerRow=this.state.playerPos.x;//Number(playerId[0]);//    //
            let playerCol=this.state.playerPos.y;//Number(playerId[1]);// //
            let lastRow=this.state.dungeonMap.length-2;
            let lastCol=this.state.dungeonMap[0].length-2;            
            let prevRow=playerRow-1<1?1:playerRow-1;
            let nextRow=playerRow+1>lastRow?lastRow:playerRow+1;
            let prevCol=playerCol-1<1?1:playerCol-1;
            let nextCol=playerCol+1>lastCol?lastCol:playerCol+1;
            let leftClass=$('#'+playerRow+'-'+prevCol).attr('class');
            let topClass=$('#'+prevRow+'-'+playerCol).attr('class');
            let rightClass=$('#'+playerRow+'-'+nextCol).attr('class');
            let bottomClass=$('#'+nextRow+'-'+playerCol).attr('class'); 

            let walkRoads=(row, col)=>{
              playerChange(row, col);
            };

            let start=()=>{// game starts over;
              this.setState({
                    dungeon: 0,
                    health: 100,
                    weapon: 'fist',
                    attack: 50,
                    xp: 0,
                    level: 0                    
            });
              playerStart();
              $('#myModal1').css('display', 'block');
            };

            let meetMonsters=(row, col)=>{
              if(this.state.health-dungeonMonster[this.state.dungeon]<0){
                  start();
                  $('.won').css('display', 'none');
                  }
                  else{
                    let monsterHealth=this.state.dungeonMap[row][col][0];
                  this.setState({health: this.state.health-dungeonMonster[this.state.dungeon]/2,
                    xp: this.state.xp+dungeonMonster[this.state.dungeon]/2                    
                  });   
                  this.setState({level: Math.trunc(this.state.xp/100)});                                     
                    monsterHealth=monsterHealth-dungeonMonster[this.state.dungeon]/2;
                    this.state.dungeonMap[row][col][0]=monsterHealth;
                    if(monsterHealth<=0){
                  playerChange(row, col);
                    }                    
                  }
            };

            let meetBoss=(row, col)=>{
              if(this.state.level<150||this.state.health<2000){//should be level 150 and health 2000;
                    start();
                    $('.won').css('display', 'none');
                  }
                  else{
                    let bossHealth=this.state.dungeonMap[row][col][0];//should be 2000;
                    this.setState({health: this.state.health-1000,//should be 1000;
                    xp: this.state.xp+1000    //should be 1000;                
                    });
                    this.setState({level: Math.trunc(this.state.xp/100)}); 
                    bossHealth=bossHealth-1000;//should be 1000;
                    this.state.dungeonMap[row][col][0]=bossHealth;
                    if(bossHealth<=0){
                       start()
                      $('.lost').css('display', 'none');
                      
                    }
                  }
            };

            let opendoor=()=>{//enter into lower dungeon;
              this.setState({dungeon: this.state.dungeon+1}); 
              playerStart();
                                   
            };

            let takePotions=(row, col)=>{
                  playerChange(row, col);
              this.setState({health: this.state.health+dungeonHealth[this.state.dungeon]});
            };

            let takeWeapons=(row, col)=>{
              playerChange(row, col);
                  this.setState({
                    weapon: dungeonWeapon[this.state.dungeon],
                    attack: this.state.attack+50
                  });                  
            };

            let newRow = playerRow;
            let newCol = playerCol;

            switch(e.which){
                            case 37: newCol = prevCol; break;
                            case 38: newRow = prevRow; break;
                            case 39: newCol = nextCol; break;
                            case 40: newRow = nextRow; break;
                          }

            let tileClass = $('#'+newRow+'-'+newCol).attr('class'); 

            switch(tileClass) {
                                case 'roads': walkRoads(newRow, newCol); break;
                                case 'potions': takePotions(newRow, newCol); break;
                                case 'weapons': takeWeapons(newRow, newCol); break;
                                case 'monsters': meetMonsters(newRow, newCol); break;
                                case 'doors': opendoor(); break;
                                case 'boss': meetBoss(newRow, newCol); break;
                              }                       
           /* switch(e.which){
              case 37:
               if(leftClass==='roads'){              
                  walkRoads(playerRow, prevCol);
                }
                else if(leftClass==='potions'){                  
                  takePotions(playerRow, prevCol);                  
                }
                else if(leftClass==='weapons'){
                  takeWeapons(playerRow,prevCol);
                }
                else if(leftClass==='monsters'){
                  meetMonsters(playerRow,prevCol);               
                }
                else if(leftClass==='doors'){
                  opendoor();
                }
                else if(leftClass==='boss'){
                  meetBoss(playerRow,prevCol);
                }
                break;

              case 38:
                if(topClass==='roads'){
                  walkRoads(prevRow, playerCol);
                }
                else if(topClass==='potions'){                  
                  takePotions(prevRow, playerCol);                   
                }
                else if(topClass==='weapons'){
                  takeWeapons(prevRow,playerCol);
                }
                else if(topClass==='monsters'){
                  meetMonsters(prevRow,playerCol);               
                }
                else if(topClass==='doors'){
                  opendoor();
                }
                else if(topClass==='boss'){
                  meetBoss(prevRow,playerCol);
                }
                break;

              case 39:
                if(rightClass==='roads'){
                  walkRoads(playerRow, nextCol);
                }
                else if(rightClass==='potions'){                  
                  takePotions(playerRow, nextCol); 
                }
                else if(rightClass==='weapons'){
                  takeWeapons(playerRow,nextCol);
                }
                else if(rightClass==='monsters'){
                  meetMonsters(playerRow, nextCol);               
                }
                else if(rightClass==='doors'){
                  opendoor();
                }
                else if(rightClass==='boss'){
                  meetBoss(playerRow,nextCol);
                }
                break;

              case 40:
                if(bottomClass==='roads'){
                  walkRoads(nextRow, playerCol);
                }
                else if(bottomClass==='potions'){                  
                  takePotions(nextRow, playerCol); 
                }
                else if(bottomClass==='weapons'){
                  takeWeapons(nextRow,playerCol);
                }
                else if(bottomClass==='monsters'){
                  meetMonsters(nextRow,playerCol);               
                }
                else if(bottomClass==='doors'){
                  opendoor();
                }
                else if(bottomClass==='boss'){
                  meetBoss(nextRow,playerCol);
                }
                break;                
            }*/
          }.bind(this))    
  };

  /*tableMaker = () => {
    return this.state.dungeonMap.map((val, i)=>{
        return (       
          <tr id={'i-'+i}>          
            <Td data={val} ind={i} playerPos={this.state.playerPos} showDark={this.state.showDark}/>            
          </tr>        
      )               
    })
  };*/

  tableMaker = () => {
 let range = 20;
    let x = this.state.playerPos.x;
    let start = x - range/2;
    let end = x + range/2;
    start = start < 0 ? 0 : start;
    if(x>40){start=30;}
    end = end >= this.state.dungeonMap.length ?
          this.state.dungeonMap.length : end;
    if(x<10){end=20;}
    let map = this.state.dungeonMap.slice(start, end);




    let y= this.state.playerPos.y;
    let startY = y - 20;
    let endY = y + 20;

    startY = startY < 0 ? 0 : startY;
    if(y>60){startY=40;}
    endY = endY >= 80 ? 80 : endY;
    if(y<20){endY=40;}
    //let map1=map.map((row)=> {
    //  return row.slice(startY, endY);});

    let map1=[];
    for(let i=0; i<map.length; i++){
      map1.push(map[i].slice(startY,endY))
    }

    return map1.map((val, i)=>{
        let idx = i + start;
        return (       
          <tr id={'i-'+idx}>          
            <Td data={val} ind={idx} playerPos={this.state.playerPos}//--->add offsetX;
             offset={startY} showDark={this.state.showDark}/>            
          </tr>        
      )               
    })
  };

  handleToggle =()=>{
    this.setState({showDark: !this.state.showDark})
    /*if(!toggleFlag){
    toggleFlag=true;
    let playerArr=$('.player').attr('id').split('-');
    this.setState({playerPos : {x: playerArr[0], y: playerArr[1]}});
    }
    else{   toggleFlag=false;
     let playerArr=$('.player').attr('id').split('-');
this.setState({playerPos : {x: playerArr[0], y: playerArr[1]}});}*/
  };

  handleModal =()=>{
      $('#myModal1').css('display', 'none');
  };

  render () {
    return (
       <div>
       <h2 className='rogue'>Roguelike Dungeon Crawler Game</h2> 
       <h3 className='d4'>kill the boss in dungeon 4</h3>     
       <div className='display'>        
        <table>
      <tbody>
      {this.tableMaker()}
      </tbody>
      </table>        
        <div className='text'>
      <h5 className='title level'>level: {this.state.level};</h5>
       <h5 className='title health'>health: {this.state.health};</h5>
       <h5 className='title xp'>xp: {this.state.xp};</h5>
       <h5 className='title weapon'>weapon: {this.state.weapon};</h5>
       <h5 className='title attack'>attack: {this.state.attack};</h5>
       <h5 className='title dungeon' onClick={this.handleModal}>dungeon: {this.state.dungeon};</h5>
       <h5 className='title toggle' onClick={this.handleToggle}>toggle darkness</h5>   
       </div>
    <div className='editarea modal1' id="myModal1">
    <div className="modal-content1">
    <div className="modal-body1">
    <h1 className='won'>YOU WON!</h1>
    <h1 className='lost'>YOU LOST!</h1>
    <h2 className='close-modal replay' onClick={this.handleModal}>REPLAY?</h2>
    </div>
    </div>
    </div>
    </div>
    </div>
    )   
  }
}

ReactDOM.render(<Dungeon />,
  document.getElementById('app'));

