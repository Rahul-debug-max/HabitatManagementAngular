
declare var $: any;
export class AppConstant {

  /*API URL*/
  public static API_URL = "https://dynamicformapi.rsk-bsl.co.uk/api/api/";
  public static APP_PRE_JS_URLS = [
    //"lib/jquery/dist/jquery.min.js",
    "js/common.js",
    //"lib/bootstrap/dist/js/bootstrap.js",
    //"lib/bootstrap/dist/js/bootstrap.bundle.min.js",
    //"js/gridToolbarFlexisel.js", 
    //"lib/jqGrid-4.6.0/js/jquery.jqGrid.js",
    //"lib/jqGrid-4.6.0/js/i18n/grid.locale-en.js", 
    "js/site.js",
    //"lib/jquery/dist/jquery-ui-1.11.0.custom.js", 
    //"lib/moments/moment.min.js",
    //"lib/moments/moment-with-locales.js", 
    //"lib/bootstrapDateTimePicker/js/bootstrap-datetimepicker.min.js", 
    "js/setTimePicker.js",
    //"js/JSignature/jSignature.js", 
    ///"js/JSignature/jSignature.CompressorBase30.js", 
    //"js/JSignature/jSignature.UndoButton.js",
    "js/signature.js",
    "js/postForm.js"
  ];

}

export function removejscssfile(filename, filetype) {
  var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
  var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
  var allsuspects = document.getElementsByTagName(targetelement)
  for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
      allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
  }
}

export function addFromData() {
  var isFormFilled = false;
  var obj: any;
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
  $('.dvFormFeedbackData').find("div[data-field]").each((inx, ele) => {
    var field: any = 0;

    var fieldValue = '';

    var digitalSignatureImage64BitString = '';

    obj = $(ele);

    var field = obj.attr('data-field');

    var fieldType = obj.attr('field-Type');

    if (fieldType == FormFieldType.CheckList) {

      $(obj).find('.checkListTR').each((inx, ele) => {

        var checked: any = '';

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

      var checked: any = '';

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

      if (singnatureDv.length > 0 && $(singnatureDv).jSignature('isFilled')) {

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

        FieldValue: (fieldValue != null && fieldValue != undefined && !($.isNumeric(fieldValue))) ? fieldValue.trim() : fieldValue,

        DigitalSignatureImage64BitString: digitalSignatureImage64BitString,

        FieldType: fieldType == FormFieldType.Signature ? "Signature" : ''

      });

    }
  });

  // Validation

  if (data.length > 0) {
    $.each(data, function (index, value) {
      if (value.FieldValue != "" || value.DigitalSignatureImage64BitString != '') {
        isFormFilled = true;
        return false;
      }
    });
  }
  if (!isFormFilled && $(".formErrorMessage").length > 0) {
    $(".formErrorMessage").show();
    $('.modal').animate({ scrollTop: 0 }, 0);
  }
  else {
    $(".formErrorMessage").hide();
  }
  // Validation

  if (isFormFilled) {
    return data;
  } else {
    return false;
  }

  // var ajx = $.ajax({
  //   type: 'Post',
  //   url: 'https://dynamicformapi.rsk-bsl.co.uk/api/api/form/SaveFormData',
  //   cache: false,
  //   data: {
  //     data: JSON.stringify(data)
  //   },
  //   dataType: 'Json',
  //   traditional: true,
  //   success: function (result) {
  //     if (!result) {
  //       alert('Unable to save. Please contact administrator.');
  //       return;
  //     }
  //     else {
  //       //$('.formFeedbackSelector').val() = 0;
  //       alert('Data Saved Successfully');
  //       //window.location.reload();
  //     }
  //   },
  //   error: function (jqXHR, feedback, eToStringToStringrrorThrown) { },
  //   beforeSend: function () {
  //     $('#wait').show();
  //   },
  //   complete: function () {
  //     $('#wait').hide();
  //   }
  // });
  //return ajx;
}

export function setFromData() {
  var obj: any;
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
  $('.dvFormFeedbackData').find("div[data-field]").each((inx, ele) => {
    var field: any = 0;

    var fieldValue = '';

    var digitalSignatureImage64BitString = '';

    obj = $(ele);

    var field = obj.attr('data-field');

    var fieldType = obj.attr('field-Type');

    if (fieldType == FormFieldType.CheckList) {

      $(obj).find('.checkListTR').each((inx, ele) => {

        var checked: any = '';

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

      var checked: any = '';

      if ($(yesCheckBoxElement).is(":checked")) {

        checked = 1;

      } else if ($(noCheckBoxElement).is(":checked")) {

        checked = 0;

      }

      fieldValue = checked;

    } else if (fieldType == FormFieldType.Textbox) {

      fieldValue = $(obj).find('input[name^=' + field + ']').val('demo text');

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

      fieldValue = $(obj).find('textarea[name^=' + field + ']').val('demo data');

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
  return data;
}
