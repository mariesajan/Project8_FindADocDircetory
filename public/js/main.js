$(document).ready(function() {
    $(".removeDoc").click(function(e) {
        deleteId = $(this).data('id');
        $.ajax({
            url: '/doctors/delete/' + deleteId,
            type: 'DELETE',
            success: function() {}
        });
        window.location = '/';
    });
});
