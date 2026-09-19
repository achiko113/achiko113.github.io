var effects = {

    pulsate: function(effect_element) {
        $(effect_element)
            .clearQueue()
            .hide()
            .fadeTo(250, 1)
            .fadeTo(250, 0)
            .fadeTo(250, 1)
            .fadeTo(250, 0)
            .fadeTo(250, 1)
            .fadeTo(250, 0)
            .fadeTo(250, 1)
        ;
    }

}

window.galleries = window.galleries || {};
window.galleries.effects = effects;
export default effects;