const url = window.location.href
const quizBox = document.getElementById('quiz-box')
const timerBox = document.getElementById('timer-box')

const activateTimer = (time) => {
    var countDownDate = new Date().getTime()+(time*60*1000);

    var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
          
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
        timerBox.innerHTML = minutes + "m " + seconds + "s ";
          
        if (distance < 0) {
          clearInterval(x);
          timerBox.innerHTML = "EXPIRED";
          sendData()
          timerBox.classList.add('not-visible')
        }
      }, 1000);
}




$.ajax({
    type:'GET',
    url: `${url}data`,
    success: function(response){
        const data = response.data
        data.forEach(e => {
            for (const [question, answer]  of Object.entries(e) ){
                quizBox.innerHTML+=`
                <hr>
                <div class="mb-2">
                    <b>${question}</b>
                </div>
                `
                answer.forEach(a =>{
                    quizBox.innerHTML+=`
                    <div>
                        <input type="radio" class="ans" id="${question}-${a}" name="${question}" value="${a}">
                        <label for="${question}">${a}</label>

                    </div>
                    `
                })
            }
        });
        activateTimer(response.time)
    },
    error: function(error){
        console.log(error)
    }
})

const quizForm = document.getElementById('quiz-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const sendData = () => {
    timerBox.classList.add('not-visible')
    const elements = [...document.getElementsByClassName('ans')]
    const data = {}
    data['csrfmiddlewaretoken'] = csrf[0].value,
    elements.forEach(el  =>{
        if(el.checked){
            data[el.name] = el.value
        }else{
            if(!data[el.name]){
                data[el.name] = null
            }
        }
    })

    $.ajax({
        type: 'POST',
        url: `${url}save/`,
        data: data,
        success: function(response){
            const results = response.test
            const cls = ['container', 'p-3', 'text-light', 'h6']
            quizForm.classList.add('not-visible')

            const scorediv = document.createElement('div')
            scorediv.classList.add(...cls)
            scorediv.classList.remove('text-light')
            if(response.pass == true){
                pass_test = "Congratulations, You Passed ..."
            }else{
                pass_test = "Oops, You Failed ..."
            }
            scorediv.innerHTML +=`
                ${pass_test}<br>
                Score : ${response.score.toFixed(2)}%
                `
            const body = document.getElementsByTagName('BODY')[0]
            body.append(scorediv)

            results.forEach(res=>{
                const resDiv = document.createElement('div')
                
                for ( const [question, resp] of Object.entries(res) ){
                    resDiv.innerHTML += question
                    resDiv.classList.add(...cls)

                    if (resp['selected'] == resp['correct']){
                        resDiv.classList.add('bg-success')
                        resDiv.innerHTML += ` ==> ${resp['selected']}`

                    }else{
                        resDiv.classList.add('bg-danger')
                        resDiv.innerHTML += ` ==>  Correct : ${resp['correct']} | Selected : ${resp['selected']}`

                    }
                }
                
                body.append(resDiv)
            })

        },
        error: function(error){
            console.log(error)
        }
    })
}

quizForm.addEventListener('submit', e => {
    e.preventDefault()

    sendData()
})