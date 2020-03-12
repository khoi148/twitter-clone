
const textArea = document.getElementById('contentsBox');
const textCount = document.getElementById('textCount');
const limitReachText = document.getElementById('limitReachText');
const tweetArea = document.getElementById('tweetArea');
const TWEET_LIMIT = 10;

let listOfTweets = [];
let idCounter = 1;
//Tweet Object
// let tweet = {
//     id: 1,
//     content: 'lorem ipsum',
//     hashtags: [
//         "#yolo", "#coachella", "#covid-19"
//     ],
//     liked: false
// }

let countLettersRemaining = () => {
    return count = TWEET_LIMIT - textArea.value.length;
}
let displayLetterCount = (count) => {
    textCount.innerHTML = `${count} chars`;

    if(count < 0) {
        limitReachText.innerHTML = 'Char Limit exceeded!';
        textCount.style = `color:red`;
    } else {
        limitReachText.innerHTML = '';
        textCount.style = `color:black`;
    }
}
let updateCountDisplay = () => {
    displayLetterCount(countLettersRemaining());
}
textArea.addEventListener('input', updateCountDisplay); 



function tweet() {
    if(countLettersRemaining() < 0) {
        limitReachText.innerHTML = 'Char Limit exceeded!';
    } else {
        let newTweet = {
            id: idCounter,
            content: textArea.value,
            hashtags: [],
            liked: false
        }
        idCounter++;
        listOfTweets.push(newTweet);
        render();

        //clear tweet
        limitReachText.innerHTML = '';
        textArea.value = ``;
        updateCountDisplay();
    }
}


function render() {
    console.log(listOfTweets);
    let result = listOfTweets.map( (item,index) => {
        // console.log('obj: ',item);
        // console.log('index: ', index);
        let isLikedVar; item.liked===true ? isLikedVar = 'isLiked' : isLikedVar= '';

        return `<div id="tweet" class="d-flex">
        <div class="bg-success p-3">
            <img src="img/pic2.jpg" height="50" class="rounded">
        </div>
        <div class="flex-grow-1 bg-secondary">
            <div>${item.content}</div>
            <div class="d-flex tweetButtonsSection">
                <button class="btn ${isLikedVar} tweetBtn mx-2" onClick="tweetLiked(this.id)" id="${item.id}"><i class="fa fa-heart"></i></button>
                <button class="btn tweetBtn mx-2"><i class="fa fa-bars"></i></button>
                <button class="btn tweetBtn mx-2" onClick="tweetDelete(this.value)" value=${item.id}><i class="fa fa-trash"></i></button>
                <button class="btn tweetBtn mx-2"><i class="fa fa-close"></i></button>
            </div>
        </div>
        </div>`;        
    }).join('');
    tweetArea.innerHTML = result;
}

function tweetLiked(id) {
    let indexOfTweet;
    listOfTweets.map( (item, index) => {
        if(item.id == id) {
            indexOfTweet = index;
        }
    });
    listOfTweets[indexOfTweet].liked = !listOfTweets[indexOfTweet].liked;
    let element = document.getElementById(id+'');//id of button
    element.classList.toggle('isLiked');
    console.log(listOfTweets);
}
function tweetDelete(id) {
    let indexOfTweet;
    for(let i = 0; i<listOfTweets.length;i++) {
        if(listOfTweets[i].id == id) 
            indexOfTweet=i;
    }
    listOfTweets.splice(indexOfTweet, 1);
    console.log(listOfTweets);
    render();
}