$(document).ready(function(){
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });
        });


        /// Get message value that user sends
        function getvalue(){
  
            var a = document.getElementById('123').value;
            document.getElementById('result').innerHTML = a;
            
          }
          
          ///Display message value that user had sent
          window.onload = function () {
             var a = document.getElementById('123').value;
            document.getElementById('result').innerHTML = a;
          }
          