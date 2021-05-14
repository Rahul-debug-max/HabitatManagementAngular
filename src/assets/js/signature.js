var hasStopTimer = false;

$(document).ready(function () {

    // if ('@Model.RenderForDragnDrop' == 'True') {

    //   FormTemplateFields.onInit({

    //     formId: JSON.parse('@Model.FormID'),

    //     saveDataURL: '@Url.Action("PermitFormScreenDesignTemplateDetailFields", "Home")'

    //   });

    // }



    $('.dvSignatureDataType').each(function (i, ele) {

        var singnatureDv = $(ele).find('div[id^="digitalSignature_"]');

        if ($(singnatureDv).find('canvas').length == 0) {

            var $digSigdiv = singnatureDv.jSignature({ 'UndoButton': false, 'cssclass': 'digitalcanvas' });

            var image64BitString = $(ele).find('#SignatureResponse');

            if ($.trim($(image64BitString).val()) != "") {

                $(singnatureDv).jSignature("importData", $(image64BitString).val());

            }

            $digSigdiv.jSignature("disable");

        }

    });



    $(window).trigger('resize');

    $(window).resize(function () {

        hasStopTimer = false;

        setTimeout(function () {

            if (!hasStopTimer) {

                getDigitalSignature();

            }

        }, 1000);

    });



    setTimeout(function () {
        if (!hasStopTimer) {

            getDigitalSignature();
        }

    }, 1000);



    setDateTimePicker();

    $('.dvCheckList').find('input[type="checkbox"]').on('change', function () {
        var isChecked = $(this).is(":checked");

        $(this).closest("tr").find('input:checkbox').prop('checked', false);

        $(this).prop("checked", isChecked);
    });


    $('.formFieldTypeCheckbox').find('input[type="checkbox"]').on('change', function () {
        var isChecked = $(this).is(":checked");
        $(this).closest("div").siblings().find('input:checkbox').prop('checked', false);
        $(this).prop("checked", isChecked);
    });

});



function getDigitalSignature() {

    hasStopTimer = true;

    var signatureId = '';

    var digitalSignature = '';

    var digitalSignatureImage64BitString = '';

    $('.dvSignatureDataType').each(function (i, ele) {

        digitalSignature = $(ele).find('div[id^="digitalSignature_"]');

        digitalSignatureImage64BitString = $(ele).find('#SignatureResponse');

        signatureId = $(ele).find('#SignatureId');

        const sValue = $(signatureId).val() != "" && $(signatureId).val() != null ? $(signatureId).val() : 0

        const urlSign = 'https://dynamicformapi.rsk-bsl.co.uk/api/api/form/GetDigitalSignature/' + parseInt(sValue);
        $.ajax({
            type: 'GET',
            cache: false,
            async: false,
            //data: { signatureId: $(signatureId).val() != "" && $(signatureId).val() != null ? $(signatureId).val() : 0 },
            dateType: 'json',
            url: urlSign,
            success: function (result) {
                if (result) {
                    $(digitalSignature).jSignature("importData", result);
                    $(digitalSignatureImage64BitString).val(result);
                }
            }, error: function () { },
            beforeSend: function () { $("#wait").css("display", "block"); },
            complete: function () {
                $("#wait").css("display", "none");
            }
        });

    });

}



function editDigitalSignature(obj) {

    var singnatureDv = $(obj).closest('.dvSignatureDataType').find('div[id^="digitalSignature_"]');

    if (singnatureDv.length > 0) {

        $(singnatureDv).jSignature("clear");

        $(singnatureDv).jSignature("enable");

        var image64BitString = $(obj).closest('.dvSignatureDataType').find('#SignatureResponse');

        $(image64BitString).val('');

    }

}



function resetDigitalSignature(obj) {
    var singnatureDv = $(obj).closest('.dvSignatureDataType').find('div[id^="digitalSignature_"]');

    if (singnatureDv.length > 0) {

        $(singnatureDv).jSignature("clear");

        $(singnatureDv).jSignature("disable");

        var image64BitString = $(obj).closest('.dvSignatureDataType').find('#SignatureResponse');

        if ($.trim($(image64BitString).val()) != "") {

            $(singnatureDv).jSignature("importData", $(image64BitString).val());

        }
        getDigitalSignature();

    }

}