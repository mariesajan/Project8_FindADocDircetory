$(document).ready(function() {
    console.log('in docuymen ready fn');
    $(".removeDoc").click(function(e) {
        console.log('in dlete id');
        deleteId = $(this).data('id');
        console.log('The delete id is....');
        console.log(deleteId);
        $.ajax({
            url: '/doctors/delete/' + deleteId,
            type: 'DELETE',
            success: function() {}
        });
        window.location = '/';
    });
});
