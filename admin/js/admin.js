/* global jQuery, upgsapAdmin */
(function($) {
    'use strict';

    // Initialisation
    $(document).ready(function() {
        initAnimationManager();
    });

    function initAnimationManager() {
        // Gestionnaire pour le formulaire d'ajout d'animation
        $('#upgsap-add-animation-form').on('submit', function(e) {
            e.preventDefault();
            saveAnimation($(this));
        });

        // Gestionnaire pour la suppression d'animation
        $('.upgsap-delete-animation').on('click', function(e) {
            e.preventDefault();
            deleteAnimation($(this));
        });

        // Gestionnaire pour l'édition d'animation
        $('.upgsap-edit-animation').on('click', function(e) {
            e.preventDefault();
            editAnimation($(this));
        });
    }

    function saveAnimation($form) {
        const data = {
            action: 'upgsap_save_animation',
            nonce: upgsapAdmin.nonce,
            animation: {
                name: $form.find('[name="animation_name"]').val(),
                type: $form.find('[name="animation_type"]').val(),
                duration: $form.find('[name="animation_duration"]').val(),
                ease: $form.find('[name="animation_ease"]').val(),
                trigger: {
                    type: $form.find('[name="trigger_type"]').val(),
                    start: $form.find('[name="trigger_start"]').val(),
                    scrubType: $form.find('[name="trigger_scrub"]').val()
                }
            }
        };

        $.post(upgsapAdmin.ajaxUrl, data, function(response) {
            if (response.success) {
                showNotice('success', response.data.message);
                // Recharger la liste des animations
                location.reload();
            } else {
                showNotice('error', response.data.message);
            }
        });
    }

    function deleteAnimation($button) {
        if (!confirm(upgsapAdmin.confirmDelete)) {
            return;
        }

        const data = {
            action: 'upgsap_delete_animation',
            nonce: upgsapAdmin.nonce,
            id: $button.data('id')
        };

        $.post(upgsapAdmin.ajaxUrl, data, function(response) {
            if (response.success) {
                showNotice('success', response.data.message);
                $button.closest('.upgsap-animation-item').fadeOut();
            } else {
                showNotice('error', response.data.message);
            }
        });
    }

    function editAnimation($button) {
        const animationId = $button.data('id');
        // Charger les données de l'animation et les afficher dans le formulaire
        const data = {
            action: 'upgsap_get_animation',
            nonce: upgsapAdmin.nonce,
            id: animationId
        };

        $.post(upgsapAdmin.ajaxUrl, data, function(response) {
            if (response.success) {
                populateForm(response.data.animation);
            } else {
                showNotice('error', response.data.message);
            }
        });
    }

    function populateForm(animation) {
        const $form = $('#upgsap-add-animation-form');
        $form.find('[name="animation_name"]').val(animation.name);
        $form.find('[name="animation_type"]').val(animation.type);
        $form.find('[name="animation_duration"]').val(animation.duration);
        $form.find('[name="animation_ease"]').val(animation.ease);
        $form.find('[name="trigger_type"]').val(animation.trigger.type);
        $form.find('[name="trigger_start"]').val(animation.trigger.start);
        $form.find('[name="trigger_scrub"]').val(animation.trigger.scrubType);
    }

    function showNotice(type, message) {
        const $notice = $('<div>')
            .addClass('upgsap-notice')
            .addClass('upgsap-notice-' + type)
            .text(message);

        $('.upgsap-admin-content').prepend($notice);

        setTimeout(function() {
            $notice.fadeOut(function() {
                $(this).remove();
            });
        }, 3000);
    }

})(jQuery);
