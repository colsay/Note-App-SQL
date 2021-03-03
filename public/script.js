$(".register").click((e) => {
    e.preventDefault();
    let username = $('#username').val()
    let password = $('#password').val()
    console.log(username)
    console.log(password)

    $.ajax({
        type: "POST",
        url: `http://localhost:3000/login`,
        data: { username: username, password: password },
        success: function () {
            console.log("success");
        },
    }).done(function () {
        window.location.reload();
    }).fail(function () {
        console.log('failed')
    })
});

$('.trash').click((e) => {
    e.preventDefault();
    console.log(e.target.dataset.deletebutton)
    $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/users/${e.target.dataset.deletebutton}`,
        success: function () {
            console.log("success");
        },
    }).done(function () {
        window.location.reload();
    }).fail(function () {
        console.log('failed')
    })
})

