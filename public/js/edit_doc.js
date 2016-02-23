$(document).ready(function(){
  $('#editSubmit').on('click',function(){
      var docId = $('#docId').val();
      var category = $('#category').val();
      var state = $('#state').val();
      var fullName = $('#fullName').val();
      var city = $('#city').val();
      var newPatients =  $('#newPatients').val();
      var practiceName =$('#practiceName').val();
      var graduationYear = $('#graduationYear').val();
      var streetAddress = $('#streetAddress').val();
      var zipCode = $('#zipCode').val();
      if(newPatients == '' || practiceName == '' || graduationYear == '' || streetAddress == ''
        || zipCode == ''){
          $('#errorMsg').html('Please enter all the fields.');
          return false;
      }else{
        $.ajax({
          method :'POST',
          url : '/doctors/edit_doctor_details',
          data : {
            docId : docId,
            category : category,
            state : state,
            fullName: fullName,
            city : city,
            newPatients : newPatients,
            practiceName : practiceName,
            graduationYear : graduationYear,
            streetAddress : streetAddress,
            zipCode : zipCode,
          },
        }).done(function(data){
          if(data == 'Success'){
            window.location.href='/';
          }else{
            console.log('error');
            console.log(data);
          }
        });
      }
  });
});
