window.EditFormField = (function () {

    var defaults = {
        tableFieldType: 0
    }
    var columnNames = new Array();

    var onInit = function (obj) {
        $.extend(defaults, obj);

        $('#FieldType').on('change', function () {
            if ($(this).val() == defaults.tableFieldType) {
                $("#tblFieldTypeSection").show();
            }
            else {
                $("#tblFieldTypeSection").hide();
                columnNames = new Array();
                $("#dvTable").hide();
            }
        });

        $('#btnAddTableColumn').on('click', function () {
            addTableColumn();
        });
    }
    var $table = $('<table class=\"tableType\">');
   // $table.append('<thead>').children('thead'); //.append('<caption>MyTable</caption>')
    var addTableColumn = function () {
       // alert('added');

        if ($('#TableColumn').val() != "") {
            //$('#dvTable').html('');
            $("#dvTable").show();
            $("#dvTable").find('table th').remove();
            $("#dvTable").find('table tr').remove();
            $("#dvTable").find('table tbody').remove();
            columnNames.push($('#TableColumn').val());

            //$('#mtable tr').append($("<td>"));
            //$('#mtable thead tr>td:last').html($('#col').val());
            //$('#mtable tbody tr').each(function () { $(this).children('td:last').append($('<input type="checkbox">')) });

            //$('#mtable tr').append($("<td>"));
            //$('#mtable thead tr>td:last').html($('#TableColumn').val());
            //$('#mtable tbody tr').each(function () { $(this).children('td:last').append($('<input type="checkbox">')) });
        } else { alert('Enter Text'); }

        if (columnNames.length > 0) {
            debugger;

           // $table.append('<tr>');
            $.each(columnNames, function (index, value) {
                debugger;
                $table.append('<th>' + value + '</th>');
            });
           // $table.append('</tr>');

            //tbody


            // add row
           //  $tbody.append('<tr />').children('tr:last')

            var tableRowCount = $("#TableRowCount").val();

            if (tableRowCount == 0) {
                tableRowCount = 4;
            }
            var tbodyString = ''
            debugger;
            for (var i = 0; i < tableRowCount; i++) {

              var $tbody = $table.append('<tr />').children('tr');
                debugger;
                $.each(columnNames, function (index, value) {
                    $tbody.append("<td style=\"height:20px;\"></td>")
                });
            }

            $tbody.append(tbodyString);


            // add another row
            //$tbody.append('<tr />').children('tr:last')
            //    .append("<td>val</td>")
            //    .append("<td>val</td>")
            //    .append("<td>val</td>")
            //    .append("<td>val</td>");

            // add table to dom
            //var dvTable = $("#dvTable");
            //dvTable.html("");
            //dvTable.append(table);
        }
    };
    $table.appendTo('#dvTable');

    return {
        onInit: onInit,
        addTableColumn: addTableColumn
    }
}());