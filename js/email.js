/**
 * Created by i68066 on 11/6/15.
 */
$.ajax({
    type: "POST",
    url: "https://mandrillapp.com/api/1.0/messages/send.json",
    'key': 'waoAPlcr5OP6LugiM9Jc8A',
    'message': {
        'from_email': 'mkteagle@gmail.com',
        'to': [
            {
                'email': usr1,
                'name': usrname1,
                'type': to
            },
            {
                'email': usr2,
                'name': usrname2,
                'type': to
            },
            {
                'email': usr3,
                'name': usrname3,
                'type': to
            },
            {
                'email': usr4,
                'name': usrname4,
                'type': to
            }
        ],
        'autotext': 'true',
        'subject': 'Score!!!',
        'html': 'YOUR EMAIL CONTENT GOES HERE'
    }
}).done(function(response){
    console.log(response);
});