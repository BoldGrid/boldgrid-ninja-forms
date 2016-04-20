define(
	[
		'controllers/formData',
		'controllers/fieldError',
		'controllers/changeField',
		'controllers/changeEmail',
		'controllers/fieldCheckbox',
		'controllers/fieldCheckboxList',
		'controllers/fieldRadio',
		'controllers/fieldNumber',
		'controllers/mirrorField',
		'controllers/confirmField',
		'controllers/updateFieldModel',
		'controllers/submitInit',
		'controllers/getFormErrors',
		'controllers/selectFile',
		'controllers/validateRequired',
		'controllers/submitError',
		'controllers/actionRedirect',
		'controllers/actionSuccess',
		'controllers/fieldSelect',
		'controllers/coreSubmitResponse',
		'controllers/fieldProduct',
		'controllers/fieldTotal',
		'controllers/fieldQuantity',
		'controllers/calculations',
		'controllers/fieldDate',
		'controllers/fieldRecaptcha',
		'controllers/helpText',
		'controllers/fieldTextareaRTE',
		'controllers/fieldStarRating'
	],
	function(
		FormData,
		FieldError,
		ChangeField,
		ChangeEmail,
		FieldCheckbox,
		FieldCheckboxList,
		FieldRadio,
		FieldNumber,
		MirrorField,
		ConfirmField,
		UpdateFieldModel,
		SubmitInit,
		GetFormErrors,
		SelectFile,
		ValidateRequired,
		SubmitError,
		ActionRedirect,
		ActionSuccess,
		FieldSelect,
		CoreSubmitResponse,
		FieldProduct,
		FieldTotal,
		FieldQuantity,
		Calculations,
		FieldDate,
		FieldRecaptcha,
		HelpText,
		FieldTextareaRTE,
		FieldStarRating
	) {
		var controller = Marionette.Object.extend( {
			initialize: function() {
				/**
				 * Field type controllers
				 */
				new FieldCheckbox();
				new FieldCheckboxList();
				new FieldRadio();
				new FieldNumber();
				new FieldSelect();
				new FieldProduct();
				new FieldTotal();
				new FieldQuantity();
				new FieldRecaptcha();
				new HelpText();
				new FieldTextareaRTE();
				new FieldStarRating();
				/**
				 * Misc controllers
				 */
				new FieldError();
				new ChangeField();
				new ChangeEmail();
				
				new MirrorField();
				new ConfirmField();
				new UpdateFieldModel();
				new SubmitInit();
				new GetFormErrors();
				new SelectFile();
				new ValidateRequired();
				new SubmitError();
				new ActionRedirect();
				new ActionSuccess();
				
				new CoreSubmitResponse();
				new Calculations();

				/**
				 * Data controllers
				 */
				new FieldDate();
				new FormData();
				
			}
		});

		return controller;
} );
