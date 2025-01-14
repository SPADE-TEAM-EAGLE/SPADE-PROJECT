$(function(e) {
    'use strict'
    $('.toggle').toggles({
        on: true,
        height: 26
    });
    $('#dateMask').mask('99/99/9999');
    $('#phoneMask').mask('(999) 999-9999');
    $('#ssnMask').mask('999-99-9999');
    $('#tpBasic').timepicker();
    $('#tp2').timepicker({
        'scrollDefault': 'now'
    });
    $('#tp3').timepicker();
    $(document).on('click', '#setTimeButton', function() {
        $('#tp3').timepicker('setTime', new Date());
    });
    $('#colorpicker').spectrum({
        color: '#0061da'
    });
    $('#showAlpha').spectrum({
        color: 'rgba(0, 97, 218, 0.5)',
        showAlpha: true
    });
    $('#showPaletteOnly').spectrum({
        showPaletteOnly: true,
        showPalette: true,
        color: '#DC3545',
        palette: [
            ['#1D2939', '#fff', '#0866C6', '#23BF08', '#F49917'],
            ['#DC3545', '#17A2B8', '#6610F2', '#fa1e81', '#72e7a6']
        ]
    });
    $('#reservation').daterangepicker();
    $('.fc-datepicker').datepicker({
        showOtherMonths: true,
        selectOtherMonths: true
    });
    $('#datepickerNoOfMonths').datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        numberOfMonths: 2
    });
    $('#datepicker-date').bootstrapdatepicker({
        format: "dd",
        viewMode: "date",
        multidate: true,
        multidateSeparator: "-",
    })
    $('#datepicker-month').bootstrapdatepicker({
        format: "MM",
        viewMode: "months",
        minViewMode: "months",
        multidate: true,
        multidateSeparator: "-",
    })
    $('#datepicker-year').bootstrapdatepicker({
        format: "yyyy",
        viewMode: "year",
        minViewMode: "years",
        multidate: true,
        multidateSeparator: "-",
    })
});