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
		'controllers/submitButton',
		'controllers/submitDebug',
		'controllers/getFormErrors',
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
		'controllers/fieldStarRating',
		'controllers/fieldTerms',
		'controllers/formContentFilters',
		'controllers/loadViews',
		'controllers/formErrors',
		'controllers/submit',
		'controllers/defaultFilters'
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
		SubmitButton,
		SubmitDebug,
		GetFormErrors,
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
		FieldStarRating,
		FieldTerms,
		FormContentFilters,
		LoadViews,
		FormErrors,
		Submit,
		DefaultFilters
	) {
		var controller = Marionette.Object.extend( {
			initialize: function() {

				/**
				 * App Controllers
				 */
				new LoadViews();
				new FormErrors();
				new Submit();
				
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
				new FieldTerms();
				new FormContentFilters();
				/**
				 * Misc controllers
				 */
				new FieldError();
				new ChangeField();
				new ChangeEmail();
				
				new MirrorField();
				new ConfirmField();
				new UpdateFieldModel();
				new SubmitButton();
				new SubmitDebug();
				new GetFormErrors();
				new ValidateRequired();
				new SubmitError();
				new ActionRedirect();
				new ActionSuccess();
				
				new CoreSubmitResponse();
				new Calculations();

				new DefaultFilters();

				/**
				 * Data controllers
				 */
				new FieldDate();
				new FormData();
				
			}
		});

		return controller;
} );
