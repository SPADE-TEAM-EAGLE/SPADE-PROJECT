$(function(e) {
    "use strict";
    $('.select2').select2({
        minimumResultsForSearch: Infinity,
        width: '100%'
    });
    $('.select2-show-search').select2({
        minimumResultsForSearch: '',
        width: '100%'
    });
    $('.select2').on('click', () => {
        let selectField = document.querySelectorAll('.select2-search__field')
        selectField.forEach((element, index) => {
            element.focus();
        })
    });
});