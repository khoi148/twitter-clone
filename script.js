let textArea = document.getElementById('contentsBox');



let countLetter = () => {
    let count = 10 - textArea.value.length;
    document.getElementById('textCount').innerHTML = `${count} chars left`;

    if(count < 0)
        document.getElementById('textCount').style = `color:red`;
}

textArea.addEventListener('input', countLetter); 