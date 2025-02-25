$(function(e) {
    "use strict";
  // console.log("ammi g");
    //______Basic Data Table
    $('#basic-datatable').DataTable({
        language: {
            searchPlaceholder: 'Search...',
            sSearch: '',
        }
    });
     //______Basic Data Table
     $('#lineItemsTable').DataTable({
        language: {
            searchPlaceholder: 'Search...',
            scrollX: "100%",
            sSearch: '',
        },
        lengthMenu: [10, 25, 75, 200,500], // Customize the options in the dropdown
        bInfo: false,
        searching: false,
        ordering: false,
        columnDefs: [
            {
                targets: [0, 1],
                orderable: false,
            }
        ],
    });
     //______Basic Data Table
     $('#myTable').DataTable({
        language: {
            searchPlaceholder: 'Search...',
            scrollX: "100%",
            sSearch: '',
        },
        lengthMenu: [10, 25, 75, 200,500], // Customize the options in the dropdown
        bInfo: false,
        searching: false,
        ordering: false,
        columnDefs: [
            {
                targets: [0, 1],
                orderable: false,
            }
        ],
    });
    //______Basic Data Table
    $('#responsive-datatable').DataTable({
        language: {
            searchPlaceholder: 'Search...',
            scrollX: "100%",
            sSearch: '',
        },
        lengthMenu: [10, 25, 75, 200,500], // Customize the options in the dropdown
        bInfo: false,
        searching: false,
        ordering: false,
        columnDefs: [
            {
                targets: [0, 1],
                orderable: false,
            }
        ],
    });
    $('#responsive-datatable2').DataTable({
        language: {
            searchPlaceholder: 'Search...',
            scrollX: "100%",
            sSearch: '',
        },
        lengthMenu: [10, 25, 75, 200,500], // Customize the options in the dropdown
        bInfo: false,
        searching: false,
        ordering: false,
        columnDefs: [
            {
                targets: [0, 1],
                orderable: false,
            }
        ],
    });
    $('#responsive-datatable3').DataTable({
        language: {
            searchPlaceholder: 'Search...',
            scrollX: "100%",
            sSearch: '',
        },
        lengthMenu: [10, 25, 75, 200,500], // Customize the options in the dropdown
        bInfo: false,
        searching: false,
        ordering: false,
        columnDefs: [
            {
                targets: [0, 1],
                orderable: false,
            }
        ],
    });
    $('#responsive-datatable4').DataTable({
        language: {
            searchPlaceholder: 'Search...',
            scrollX: "100%",
            sSearch: '',
        },
        lengthMenu: [10, 25, 75, 200,500], // Customize the options in the dropdown
        bInfo: false,
        searching: false,
        ordering: false,
        columnDefs: [
            {
                targets: [0, 1],
                orderable: false,
            }
        ],
    });
    //______File-Export Data Table
    var table = $('#file-datatable').DataTable({
        buttons: ['copy', 'excel', 'pdf', 'colvis'],
        language: {
            searchPlaceholder: 'Search...',
            scrollX: "100%",
            sSearch: '',
        }
    });
    table.buttons().container()
        .appendTo('#file-datatable_wrapper .col-md-6:eq(0)');
    //______Delete Data Table
    var table = $('#delete-datatable').DataTable({
        language: {
            searchPlaceholder: 'Search...',
            sSearch: '',
        }
    });
    $('#delete-datatable tbody').on('click', 'tr', function() {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
    $('#button').on('click', function() {
        table.row('.selected').remove().draw(false);
    });
    $('#example3').DataTable( {
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal( {
                    header: function ( row ) {
                        var data = row.data();
                        return 'Details for '+data[0]+' '+data[1];
                    }
                } ),
                renderer: $.fn.dataTable.Responsive.renderer.tableAll( {
                    tableClass: 'table'
                } )
            }
        }
    } );
    $('#example2').DataTable({
		responsive: true,
		language: {
			searchPlaceholder: 'Search...',
			sSearch: '',
			lengthMenu: '_MENU_ items/page',
		}
	});
    //______Select2 
});