var blackjackGame=
{
    'you':{'scoreSpan':'#your-result',
           'div':'#your-box','score':0},
     'dealer':{'scoreSpan':'#dealer-result',
             'div':'#dealer-box','score':0},
        'cards':['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
       'cardsMap':{ '2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'K':10,'Q':10,'A':[1,11]},
       'wins':0,
       'losses':0,
       'drews':0,
       'isStand':false,
       'turnsOver':false
    }
let YOU=blackjackGame.you;
let DEALER=blackjackGame.dealer;
document.querySelector('#blackjack-hit-btn').addEventListener('click',blackjackhit)

document.querySelector('#blackjack-deal-btn').addEventListener('click',blackjackDeal);

document.querySelector('#blackjack-stand-btn').addEventListener('click',dealerLogic);


let hitaudio= new Audio('sounds/swish.mp3')
let winsound=new Audio('sounds/aww.mp3')
let losssound=new Audio('sounds/cash.mp3')
function blackjackhit(){
    if(blackjackGame['isStand']===false){
     let cardrand=randomnum()
     showcard(cardrand,YOU)
     updateScore(cardrand,YOU)
     showscore(YOU)
    }
}
function showcard(cardrand,activeplayer){
    if(activeplayer['score']<=21){
    let img=document.createElement('img')
    
    img.src=`images/${cardrand}.png`
    document.querySelector(activeplayer['div']).appendChild(img)
    hitaudio.play()
    }
}



function updateScore(cardrand,activeplayer){
   // if adding 11 keeps me below 21,add 11. otherwise 1
   if(cardrand==='A'){
      if(activeplayer['score']+blackjackGame['cardsMap'][cardrand][1]<=21)
      {
          activeplayer['score']+=blackjackGame['cardsMap'][cardrand][1];
      }
      else{
          activeplayer['score']+=blackjackGame['cardsMap'][cardrand][0];
      }
   }
   else{
   activeplayer['score']+=blackjackGame['cardsMap'][cardrand];
   }
}




function blackjackDeal(){
   if(blackjackGame['turnsOver']===true){
       blackjackGame['isStand']=false;
    let yourimages=document.getElementById('your-box').querySelectorAll('img')
    let dealerimages=document.getElementById('dealer-box').querySelectorAll('img')
    for(i=0; i<yourimages.length; i++)
    {
        yourimages[i].remove();
    }
    for(i=0; i<dealerimages.length; i++)
    {
        dealerimages[i].remove();
    }
    YOU['score']=0;
    DEALER['score']=0;
    document.querySelector('#your-result').textContent=0;
    document.querySelector('#dealer-result').textContent=0;
    document.querySelector('#your-result').style.color='white';
    document.querySelector('#dealer-result').style.color='white';
    document.querySelector('#status').textContent="Let's Play";
    document.querySelector('#status').style.color='black'; 
    blackjackGame['turnsOver']=true;    
}
}
function randomnum()
{
    let randomindex=Math.floor(Math.random()*13);
    return blackjackGame['cards'][randomindex];
}


function showscore(activeplayer)
{     
    if(activeplayer['score']<=21)
    {
      document.querySelector(activeplayer['scoreSpan']).textContent=activeplayer['score'];
    }
    else
    {
        document.querySelector(activeplayer['scoreSpan']).textContent='BUST!';
        document.querySelector(activeplayer['scoreSpan']).style.color='red';
    }
}
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function dealerLogic()
{
    blackjackGame['isStand']=true;
    while(DEALER['score']<16 && blackjackGame['isStand']===true){
    let cardrand=randomnum();
    showcard(cardrand,DEALER);
    updateScore(cardrand,DEALER);
    showscore(DEALER);
    await sleep(1000);
    }
    
    blackjackGame['turnsOver']=true;
    let winner=computeWinner();
    showresult(winner);
}
//update wins,losses,draws
function computeWinner(){
    let winner;
    if(YOU['score']<=21)
    {
        if(YOU['score']>DEALER['score'] || (DEALER['score']>21))
        {
            
            winner=YOU;
            blackjackGame['wins']++;

        }
        else if(YOU['score']<DEALER['score'])
        {
            blackjackGame['losses']++;
            winner=DEALER;
        }
        else if(YOU['score']===DEALER['score'])
        {
            blackjackGame['drews']++;
            console.log('You Drew!')

        }
    }
    else if(YOU['score']>21 && DEALER['score']<=21){
             console.log('You Lost!')
             winner=DEALER;
             blackjackGame['losses']++;
    }
    else if(YOU['score']>21 && DEALER['score']>21)
    {
        console.log('You Drew!')
        blackjackGame['drews']++;
    }
    console.log(winner)
    return winner;

}
function showresult(winner)
{
    let message,msg_color;
    if(blackjackGame['turnsOver']===true){
    if(winner===YOU)
    {
            document.querySelector('#wins').textContent=blackjackGame['wins'];

            winsound.play()
            message='You Won!';
            msg_color='green';
        }
        else if(winner===DEALER)
        {
            document.querySelector('#losses').textContent=blackjackGame['losses'];

            losssound.play();
            message='You Lost!';
            msg_color='red';
        }
        else{
            document.querySelector('#drews').textContent=blackjackGame['drews'];

            message='You Drew!';
            msg_color='black';
        }
        document.querySelector('#status').textContent=message;
        document.querySelector('#status').style.color=msg_color;
    } 
}