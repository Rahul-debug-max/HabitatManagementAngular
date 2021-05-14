
function setDateTimePicker() {
    if (/Mobi/.test(navigator.userAgent)) {
        // if mobile device, use native pickers
        $(".date input").attr("type", "date");
        $(".time input").attr("type", "time");
    } else {
        // if desktop device, use DateTimePicker
        //  $("#datepicker, #datetimepicker").datetimepicker({
        $('div[name="datetimepicker"]').datetimepicker({
            useCurrent: false,
            format: "L",
            locale: "en-au",
            //showTodayButton: true,
            //showClear: true,
            //toolbarPlacement: 'bottom',
            //useCurrent: true,
            ignoreReadonly: true,
            icons: {
                next: "glyphicons glyphicons-chevron-right",
                previous: "glyphicons glyphicons-chevron-left",
                today: "todayText"
            }
        });
        $('div[name="datetimepicker"] input').attr('readonly', true);
        $('div[name="timepicker"]').datetimepicker({
            //$("#timepicker").datetimepicker({
            format: 'HH:mm',
            ignoreReadonly: true,
            icons: {
                up: "glyphicons glyphicons-chevron-up",
                down: "glyphicons glyphicons-chevron-down"
            }
        });
        $('div[name="timepicker"] input').attr('readonly', true);
    }
}
