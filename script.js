const textArea = document.getElementById('contentsBox');

const textCount = document.getElementById('textCount');

const limitReachText = document.getElementById('limitReachText');

const tweetArea = document.getElementById('tweetArea');

const tweets_amt = document.querySelector('.tweets_amount');

const TWEET_LIMIT = 140;

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

let countLettersRemaining = () => count = TWEET_LIMIT - textArea.value.length;

let displayLetterCount = count => {
    textCount.innerHTML = `${count} chars`;

    if (count < 0) {
        limitReachText.innerHTML = 'Char Limit exceeded!';

        textCount.style = `color:red`;
    } else {
        limitReachText.innerHTML = '';

        textCount.style = `color:black`;
    }
};

let updateCountDisplay = () => displayLetterCount(countLettersRemaining());

textArea.addEventListener('input', updateCountDisplay);

function render(list) {
    console.log(list);
    let result = list.map((item, index) => {
        // console.log('obj: ',item);

        // console.log('index: ', index);

        let isLikedVar; item.liked === true ? isLikedVar = 'isLiked' : isLikedVar = '';

        //replace @ and # strings with <a> and <span> tags

        let content = item.content.replace(/#(\w+)/g, (match) => `<a href="#" class="hashtags" onclick="filterHashtags('${match}')">${match}</a>`);

        content = content.replace(/@(\w+)/g, '<span class="mentions">@$1</span>');

        //handle checking the tweet for img links. Add in img if it exists
        let imgLink;
        let arrayOfURLs = returnURL(item.content);
        if (arrayOfURLs !== null) {//returns ['string']. Array of matches, of URLs
            arrayOfURLs.find((match) => {
                if (match.match(/\.(jpeg|jpg|gif|png)/) !== null) {
                    let post = match.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+\.(png|jpg|jpeg|gif)/g)[0];
                    imgLink = `<img class="img-fluid" src="${post}">`;
                    return true;
                }
            });
        }
        arrayOfURLs !== null ? imageSection = `<div class="">${imgLink}</div>` : imageSection = '';

        return `<div id="tweet" class="d-flex">
                    <div class="bg-success p-3">
                        <img src="img/pic2.jpg" height="50" class="rounded">
                    </div>
                    <div class="flex-grow-1 bg-secondary" style="width: 300px;">
                        <div class="wrapword bg-success">${content}</div>
                        ${imageSection}
                        <div class="d-flex tweetButtonsSection">
                            <button class="btn ${isLikedVar} tweetBtn mx-2" onClick="tweetLiked(this.id)" id="${item.id}"><i class="fa fa-heart"></i></button>
                            <button class="btn tweetBtn mx-2" onClick="retweet(this.value)" value="${item.id}"><i class="fa fa-bars"></i></button>
                            <button class="btn tweetBtn mx-2" onClick="tweetDelete(${item.id})"><i class="fa fa-trash"></i></button>
                            <button class="btn tweetBtn mx-2"><i class="fa fa-close"></i></button>
                        </div>
                    </div>
                </div>`;
    }).join('');

    tweetArea.innerHTML = result;
    
    tweets_amt.innerHTML = `<h4>TWEETS: ${listOfTweets.length}</h4>`;
}

function tweet() {
    if (countLettersRemaining() < 0) {
        limitReachText.innerHTML = 'Char Limit exceeded!';
    } else {

        let newTweet = {
            id: idCounter,
            content: textArea.value,
            hashtags: [],
            originTweetId: null,
            liked: false
        }
        //Add the tags to the element obj's hashtag Array. Don't include repeats
        textArea.value.replace(/#(\w+)/g, (match) => {
            if (!newTweet.hashtags.includes(match))
                newTweet.hashtags.push(match)
        });

        idCounter++;

        listOfTweets.push(newTweet);

        render(listOfTweets);

        //clear tweet
        limitReachText.innerHTML = '';

        textArea.value = ``;

        updateCountDisplay();
    }
}

function tweetLiked(id) {
    let indexOfTweet;

    listOfTweets.map((item, index) => {
        if (item.id == id) {
            indexOfTweet = index;
        }
    });

    listOfTweets[indexOfTweet].liked = !listOfTweets[indexOfTweet].liked;

    let element = document.getElementById(id + '');   //id of button

    element.classList.toggle('isLiked');

    console.log(listOfTweets);
};

function tweetDelete(id) {
    listOfTweets = listOfTweets.filter(item => item.id != id & item.originTweetId != id);

    console.log(listOfTweets);

    render(listOfTweets);
};

function retweet(id) {
    //find tweet
    let originTweet = listOfTweets.find(item => item.id == id);     //reference to actual object in array

    let originIndex = listOfTweets.indexOf(originTweet);

    console.log(originTweet);

    //make new tweet with same contents, also add a ref to the retweets array of the original tweet
    let newRetweet = {
        id: idCounter,
        content: originTweet.content,
        hashtags: originTweet.hashtags,
        originTweetId: originTweet.id,
        liked: false
    }

    idCounter++;

    //push tweet to listOfTweets array, inserting new tweet below original tweet
    listOfTweets.splice(originIndex + 1, 0, newRetweet);

    render(listOfTweets);
}

// if (t.match(regex)) {
//   console.log("Successful match ", t);
// } else {
//   console.log("No match");
// }
function returnURL(string) {
    //match returns an array of strings, or null
    return string.match(/(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/ig);
}

function filterHashtags(tag) {
    console.log(tag);
    //get only tweets with the same hashtag
    let array = listOfTweets.filter(item => {
        for (x in item.hashtags) {
            console.log(item.hashtags[x]);
            if (item.hashtags[x] == tag)
                return true;
        }
    });
    render(array);
}