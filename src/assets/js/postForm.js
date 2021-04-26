$("#SaveFormFeedabck").click(function () {
    var data = [];
    var FormFieldType = {
        Textbox: 1,
        Checkbox: 2,
        Date: 5,
        DateAndTime: 6,
        Signature: 7,
        TextArea: 8,
        CheckList: 9,
        Table: 10,
        Label: 13
    };
    $('.dvFormFeedbackData').find("div[data-field]").each(function (inx, ele) {
        var field = 0;

        var fieldValue = '';

        var digitalSignatureImage64BitString = '';

        obj = $(ele);

        var field = obj.attr('data-field');

        var fieldType = obj.attr('field-Type');

        if (fieldType == FormFieldType.CheckList) {

            $(obj).find('.checkListTR').each(function (inx, ele) {

                var checked = '';

                var yesCheckBox = $(ele).find('input')[0];

                var noCheckBox = $(ele).find('input')[1];

                field = $(yesCheckBox).attr('name');



                if ($(yesCheckBox).is(":checked")) {

                    checked = 1;

                } else if ($(noCheckBox).is(":checked")) {

                    checked = 0;

                }

                data.push({

                    FormID: $('.formFeedbackSelector').val(),

                    Field: field,

                    FieldValue: checked,

                    DigitalSignatureImage64BitString: "",

                    FieldType: ""

                });

            });

        } else if (fieldType == FormFieldType.Checkbox) {

            var yesCheckBoxElement = $(obj).find('.formFieldTypeCheckbox').find('input[type=checkbox]')[0];

            var noCheckBoxElement = $(obj).find('.formFieldTypeCheckbox').find('input[type=checkbox]')[1];

            var checked = '';

            if ($(yesCheckBoxElement).is(":checked")) {

                checked = 1;

            } else if ($(noCheckBoxElement).is(":checked")) {

                checked = 0;

            }

            fieldValue = checked;

        } else if (fieldType == FormFieldType.Textbox) {

            fieldValue = $(obj).find('input[name^=' + field + ']').val();

        } else if (fieldType == FormFieldType.Date) {

            fieldValue = $(obj).find('input[name^=' + field + ']').val();

        } else if (fieldType == FormFieldType.DateAndTime) {

            var date = $(obj).find('input[name^=' + field + ']').val();

            var time = $(obj).find('.time').find('input').val()

            fieldValue = date + " " + time;

        } else if (fieldType == FormFieldType.Signature) {

            var singnatureDv = $(obj).find('div[id^="digitalSignature_"]');

            if (singnatureDv.length > 0) {

                digitalSignatureImage64BitString = $(singnatureDv).jSignature('getData');

            }

            fieldValue = $(obj).find('#SignatureId').val();

        } else if (fieldType == FormFieldType.TextArea) {

            fieldValue = $(obj).find('textarea[name^=' + field + ']').val();

        }

        if (fieldType != FormFieldType.CheckList) {

            data.push({

                FormID: $('.formFeedbackSelector').val(),

                Field: field,

                FieldValue: fieldValue,

                DigitalSignatureImage64BitString: digitalSignatureImage64BitString,

                FieldType: fieldType == FormFieldType.Signature ? "Signature" : ''

            });

        }
    });
    debugger;
    var ajx = $.ajax({
        type: 'Post',
        url: 'https://dynamicformapi.rsk-bsl.co.uk/api/api/form/SaveFormData',
        cache: false,
        data: {
            data: JSON.stringify(data)
        },
        dataType: 'Json',
        traditional: true,
        success: function (result) {
            if (!result) {
                alert('Unable to save. Please contact administrator.');
                return;
            }
            else {
                //$('.formFeedbackSelector').val() = 0;
                alert('Data Saved Successfully');
                //window.location.reload();
            }
        },
        error: function (jqXHR, feedback, eToStringToStringrrorThrown) { },
        beforeSend: function () {
            $('#wait').show();
        },
        complete: function () {
            $('#wait').hide();
        }
    });
    return ajx;
});