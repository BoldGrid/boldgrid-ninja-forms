<?php
if ( ! defined( 'WPINC' ) ) {
	die();
}

$configs = $this->get_configs();
?>
<div class="attachments-browser static-attchment">
	<?php foreach($configs['route-tabs'] as $tab_name => $tab): ?>
		<ul data-tabname='<?php echo $tab_name; ?>'
		class="attachments ui-sortable ui-sortable-disabled hidden">
			<?php foreach ($tab['content'] as $count => $content): 	?>
			<li role="checkbox" aria-checked="false"
			data-id="<?php echo $count; ?>"
			data-form-id-boldgrid="<?php echo $content['id']; ?>"
			class="attachment save-ready">
			<div
				class="attachment-preview js--select-attachment type-image subtype-jpeg landscape">
				<div class="thumbnail">
					<div class="centered">
						<div class="centered-content-boldgrid"><?php echo $content['html']; ?></div>
					</div>
				</div>
			</div> <a title="Deselect" href="#" class="check">
				<div class="media-modal-icon"></div>
		</a>
		</li>
		<?php endforeach; ?>
	</ul>
	<?php endforeach; ?>
</div>
