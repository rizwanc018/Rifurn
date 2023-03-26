window.addEventListener('DOMContentLoaded', event => {

    const datatablesSimple = document.getElementById('datatables');
    if (datatablesSimple) {
        new simpleDatatables.DataTable(datatablesSimple);
    }


    // Toggle the side navigation
    // (function(){
    //     $('#msbo').on('click', function(){
    //       $('body').toggleClass('msb-x');
    //     });
    //   }());
});
