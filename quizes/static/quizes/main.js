const modalBtn = [...document.getElementsByClassName('modal-button')]
const modalBody = document.getElementById('modal-body-confirm')
const modalTitle = document.getElementById('exampleModalLabel')
const startButton = document.getElementById('start-button')

modalBtn.forEach(modalBtn=>modalBtn.addEventListener('click', ()=>{
    const pk = modalBtn.getAttribute('data-pk')
    const questions = modalBtn.getAttribute('data-questions')
    const time = modalBtn.getAttribute('data-time')
    const difficulty = modalBtn.getAttribute('data-difficulty')
    const pass = modalBtn.getAttribute('data-pass')
    const name = modalBtn.getAttribute('data-name')
    modalTitle.innerHTML = `${name}`
    modalBody.innerHTML=`
                        <div class="text-muted">
                            <ul>
                                <li>Difficulty : <b>${difficulty}</b></li>
                                <li>Questions : <b>${questions}</b></li>
                                <li>Time : <b>${time} mins</b></li>
                                <li>Passing : <b>${pass}%</b></li>
                            </ul>                    
                        </div>
                        `
                        startButton.addEventListener('click', ()=>{
                            window.location.href = window.location.href + pk
                        })
                        
}))

const boxUsername = document.getElementById('username')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

boxUsername.addEventListener('blur', ()=>{
    // $.post('/update_session/',
    // {
    //     'username': boxUsername.value,
    //     'csrfmiddlewaretoken': csrf[0].value,
    // },
    // function(data) {
    //     alert(data);
    // });
    $.post("/update_session/",
    {
      name: boxUsername.value,
      csrfmiddlewaretoken: csrf[0].value,
    },
    function(){
    });
})