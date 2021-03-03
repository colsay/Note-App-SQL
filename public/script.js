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
    }).done(window.location.reload());
});

